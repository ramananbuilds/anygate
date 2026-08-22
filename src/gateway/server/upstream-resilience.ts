// H4: bounded upstream retry + provider health gating.
//
// Non-streaming SDK requests may be retried up to MAX_UPSTREAM_RETRIES times
// on transient failures (429/5xx) before any bytes are written to the client.
// Repeated failures mark the provider unhealthy for UNHEALTHY_WINDOW_MS, and
// requests to an unhealthy provider fail fast with a clear 502 instead of
// hanging or burning more quota.

import { updateProviderHealth, type ProviderHealthStatus } from '../../services/provider-health.js'

export const MAX_UPSTREAM_RETRIES = 2
/** How long a provider stays marked unhealthy after repeated failures. */
export const UNHEALTHY_WINDOW_MS = 60_000

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504])

/**
 * True only for errors with a KNOWN retryable status (429/5xx). Deliberately
 * does NOT reuse shared/errors.ts::upstreamHttpStatus — that helper defaults
 * unclassified errors to 500, which would make auth failures and network
 * hiccups look retryable.
 */
export function isRetryableUpstreamError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const rec = err as { statusCode?: unknown; httpStatus?: unknown }
  for (const candidate of [rec.statusCode, rec.httpStatus]) {
    if (typeof candidate === 'number' && RETRYABLE_STATUS.has(candidate)) return true
  }
  return false
}

/** Parse a Retry-After header value (seconds) into milliseconds; null if absent/invalid. */
export function parseRetryAfterMs(value: string | null | undefined): number | null {
  if (!value) return null
  const seconds = Number(value.trim())
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 30_000)
  const asDate = Date.parse(value)
  if (Number.isFinite(asDate)) return Math.max(0, Math.min(asDate - Date.now(), 30_000))
  return null
}

/** Backoff schedule: attempt n (0-based) waits 500ms * 2^n unless Retry-After overrides. */
export function backoffDelayMs(attempt: number, retryAfterMs?: number | null): number {
  if (retryAfterMs != null) return retryAfterMs
  return 500 * 2 ** attempt
}

/**
 * Run `fn` with up to MAX_UPSTREAM_RETRIES retries on retryable errors.
 * `onRetry` receives (attempt, delayMs, statusMessage). The last error is
 * rethrown when retries are exhausted.
 */
export async function withUpstreamRetry<T>(
  fn: () => Promise<T>,
  onRetry?: (attempt: number, delayMs: number, err: unknown) => Promise<void> | void,
  sleep: (ms: number) => Promise<void> = defaultSleep
): Promise<T> {
  let lastErr: unknown
  for (let attempt = 0; attempt <= MAX_UPSTREAM_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt === MAX_UPSTREAM_RETRIES || !isRetryableUpstreamError(err)) throw err
      const delay = backoffDelayMs(attempt)
      await onRetry?.(attempt + 1, delay, err)
      await sleep(delay)
    }
  }
  throw lastErr
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ── health gating ────────────────────────────────────────────────────────────

const unhealthyUntil = new Map<string, number>()

/** Record an upstream failure for a provider; flips unhealthy after `threshold` consecutive. */
export function recordProviderFailure(providerId: string, now = Date.now()): void {
  // A single 429/5xx is noted but only sustained failure trips the breaker:
  // two failures within the window mark unhealthy for UNHEALTHY_WINDOW_MS.
  const existing = failCounts.get(providerId) ?? { count: 0, firstAt: now }
  const count = now - existing.firstAt > UNHEALTHY_WINDOW_MS ? 1 : existing.count + 1
  failCounts.set(providerId, { count, firstAt: count === 1 ? now : existing.firstAt })
  if (count >= 2) {
    unhealthyUntil.set(providerId, now + UNHEALTHY_WINDOW_MS)
    updateProviderHealthSafe(providerId, false, now)
  }
}

/** Record a successful request — clears any unhealthy state immediately. */
export function recordProviderSuccess(providerId: string, now = Date.now()): void {
  failCounts.delete(providerId)
  unhealthyUntil.delete(providerId)
  updateProviderHealthSafe(providerId, true, now)
}

/** True when the provider tripped the breaker and hasn't recovered yet. */
export function isProviderUnavailable(providerId: string, now = Date.now()): boolean {
  const until = unhealthyUntil.get(providerId)
  if (until === undefined) return false
  if (now >= until) {
    // Window elapsed — allow traffic again; next failure re-trips quickly.
    unhealthyUntil.delete(providerId)
    failCounts.delete(providerId)
    updateProviderHealthSafe(providerId, true, now)
    return false
  }
  return true
}

/** Test hook: reset all breaker state. */
export function resetProviderBreakers(): void {
  unhealthyUntil.clear()
  failCounts.clear()
}

const failCounts = new Map<string, { count: number; firstAt: number }>()

function updateProviderHealthSafe(providerId: string, healthy: boolean, now: number): void {
  try {
    updateProviderHealth({
      providerId,
      healthy,
      lastChecked: now,
      ...(healthy ? {} : { error: 'repeated upstream failures' }),
    })
  } catch {
    // Health bookkeeping must never break request handling.
  }
}

/** Convenience wrapper matching services/provider-health's shape (kept for dashboards). */
export function currentHealthSnapshot(): Array<ProviderHealthStatus & { until?: number }> {
  return [...unhealthyUntil.entries()].map(([providerId, until]) => ({
    providerId,
    healthy: false,
    lastChecked: until - UNHEALTHY_WINDOW_MS,
    error: 'repeated upstream failures',
    until,
  }))
}
