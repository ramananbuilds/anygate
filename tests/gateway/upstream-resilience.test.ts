// H4: upstream resilience — retry schedule, retryable classification, and
// the provider health breaker (fail-fast after repeated failures).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  MAX_UPSTREAM_RETRIES,
  backoffDelayMs,
  isProviderUnavailable,
  isRetryableUpstreamError,
  parseRetryAfterMs,
  recordProviderFailure,
  recordProviderSuccess,
  resetProviderBreakers,
  withUpstreamRetry,
} from '../../src/gateway/server/upstream-resilience.js'

beforeEach(() => {
  resetProviderBreakers()
})

afterEach(() => {
  vi.useRealTimers()
})

function httpError(status: number): Error {
  // AI-SDK upstream errors carry `statusCode`; that's what
  // shared/errors.ts::upstreamHttpStatus reads (defaulting to 500 otherwise).
  const err = new Error(`upstream ${status}`) as Error & { statusCode?: number }
  err.statusCode = status
  return err
}

describe('isRetryableUpstreamError', () => {
  it('classifies 429 and 5xx as retryable, others not', () => {
    expect(isRetryableUpstreamError(httpError(429))).toBe(true)
    expect(isRetryableUpstreamError(httpError(500))).toBe(true)
    expect(isRetryableUpstreamError(httpError(503))).toBe(true)
    expect(isRetryableUpstreamError(httpError(401))).toBe(false)
    expect(isRetryableUpstreamError(httpError(400))).toBe(false)
    expect(isRetryableUpstreamError(new Error('network boom'))).toBe(false)
  })
})

describe('withUpstreamRetry', () => {
  it('returns immediately on success', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    await expect(withUpstreamRetry(fn, undefined, () => Promise.resolve())).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('does not retry non-retryable errors', async () => {
    const fn = vi.fn().mockRejectedValue(httpError(401))
    await expect(withUpstreamRetry(fn, undefined, () => Promise.resolve())).rejects.toThrow(
      'upstream 401'
    )
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries up to MAX_UPSTREAM_RETRIES then throws the last error', async () => {
    const fn = vi.fn().mockRejectedValue(httpError(503))
    await expect(withUpstreamRetry(fn, undefined, () => Promise.resolve())).rejects.toThrow(
      'upstream 503'
    )
    expect(fn).toHaveBeenCalledTimes(MAX_UPSTREAM_RETRIES + 1)
  })

  it('recovers when a later attempt succeeds', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(httpError(429))
      .mockRejectedValueOnce(httpError(500))
      .mockResolvedValue('recovered')
    await expect(withUpstreamRetry(fn, undefined, () => Promise.resolve())).resolves.toBe(
      'recovered'
    )
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('notifies onRetry with attempt number before sleeping', async () => {
    const fn = vi.fn().mockRejectedValueOnce(httpError(429)).mockResolvedValue('done')
    const onRetry = vi.fn()
    await withUpstreamRetry(fn, onRetry, () => Promise.resolve())
    expect(onRetry).toHaveBeenCalledWith(1, expect.any(Number), expect.anything())
  })

  it('uses exponential backoff delays', () => {
    expect(backoffDelayMs(0)).toBe(500)
    expect(backoffDelayMs(1)).toBe(1000)
    expect(backoffDelayMs(2)).toBe(2000)
  })
})

describe('parseRetryAfterMs', () => {
  it('parses seconds form', () => {
    expect(parseRetryAfterMs('2')).toBe(2000)
  })

  it('caps large values at 30s', () => {
    expect(parseRetryAfterMs('600')).toBe(30_000)
  })

  it('returns null for junk/absent values', () => {
    expect(parseRetryAfterMs(null)).toBeNull()
    expect(parseRetryAfterMs('soon-ish')).toBeNull()
  })
})

describe('provider breaker', () => {
  it('stays available until repeated failures occur', () => {
    recordProviderFailure('groq')
    expect(isProviderUnavailable('groq')).toBe(false) // single failure ≠ outage
    recordProviderFailure('groq')
    expect(isProviderUnavailable('groq')).toBe(true) // two consecutive → trip
  })

  it('success clears the failure state', () => {
    recordProviderFailure('mistral')
    recordProviderFailure('mistral')
    expect(isProviderUnavailable('mistral')).toBe(true)
    recordProviderSuccess('mistral')
    expect(isProviderUnavailable('mistral')).toBe(false)
  })

  it('recovers automatically once the unhealthy window elapses', () => {
    vi.useFakeTimers()
    const now = Date.now()
    vi.setSystemTime(now)
    recordProviderFailure('deepinfra')
    recordProviderFailure('deepinfra')
    expect(isProviderUnavailable('deepinfra')).toBe(true)

    vi.setSystemTime(now + 61_000) // past the 60s window
    expect(isProviderUnavailable('deepinfra')).toBe(false)
  })

  it('tracks providers independently', () => {
    recordProviderFailure('a')
    recordProviderFailure('a')
    recordProviderFailure('b')
    expect(isProviderUnavailable('a')).toBe(true)
    expect(isProviderUnavailable('b')).toBe(false)
    expect(isProviderUnavailable('never-seen')).toBe(false)
  })
})
