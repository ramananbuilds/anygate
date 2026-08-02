// src/registry/validation/model-validator.ts — self-healing model validation
//
// Automatically checks model availability by calling provider APIs, replacing
// manual deprecation lists. Validates models by sending a minimal chat
// completion request and interpreting the HTTP status code.
//
// Never throws — all errors are caught and returned as ValidationResult with
// status 'error' or 'unverified'.

import {
  existsSync,
  readFileSync,
  mkdirSync,
  openSync,
  writeSync,
  closeSync,
  chmodSync,
} from 'node:fs'
import { dirname } from 'node:path'
import { getAppHome } from '../../config/paths.ts'
import {
  VALIDATION_CONFIG,
  type ValidationResult,
  type ValidationCache,
  type ValidateModelParams,
  type ValidateModelsOptions,
} from './config.js'

// ── Cache management ────────────────────────────────────────────────────────

const CACHE_PATH = `${getAppHome()}/${VALIDATION_CONFIG.CACHE_FILENAME}`

/** Generate a cache key from provider and model IDs. */
export function getCacheKey(providerId: string, modelId: string): string {
  return `${providerId}|${modelId}`
}

/** Load the validation cache from disk. Returns empty cache if file doesn't exist or is corrupt. */
export function loadCache(): ValidationCache {
  try {
    if (!existsSync(CACHE_PATH)) {
      return { schema_version: VALIDATION_CONFIG.CACHE_SCHEMA_VERSION, results: {} }
    }
    const raw = readFileSync(CACHE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<ValidationCache>
    if (parsed.schema_version !== VALIDATION_CONFIG.CACHE_SCHEMA_VERSION) {
      return { schema_version: VALIDATION_CONFIG.CACHE_SCHEMA_VERSION, results: {} }
    }
    return {
      schema_version: VALIDATION_CONFIG.CACHE_SCHEMA_VERSION,
      results: (parsed.results ?? {}) as Record<string, ValidationResult>,
    }
  } catch {
    return { schema_version: VALIDATION_CONFIG.CACHE_SCHEMA_VERSION, results: {} }
  }
}

/** Save the validation cache to disk with secure permissions. */
export function saveCache(cache: ValidationCache): void {
  try {
    const home = getAppHome()
    mkdirSync(home, { recursive: true, mode: 0o700 })
    const payload = `${JSON.stringify(cache, null, 2)}\n`
    const fd = openSync(CACHE_PATH, 'w', 0o600)
    try {
      writeSync(fd, payload)
    } finally {
      closeSync(fd)
    }
    try {
      chmodSync(CACHE_PATH, 0o600)
    } catch {
      // best-effort
    }
  } catch {
    // Never throw — cache persistence is best-effort
  }
}

/** Check if a cache entry is still fresh (within TTL). */
export function isCacheFresh(
  result: ValidationResult,
  ttlMs: number = VALIDATION_CONFIG.TTL_MS
): boolean {
  try {
    const checkedAt = new Date(result.checkedAt).getTime()
    if (isNaN(checkedAt)) return false
    return Date.now() - checkedAt < ttlMs
  } catch {
    return false
  }
}

/** Get a cached validation result for a provider/model pair, or null if not found or stale. */
export function getValidationStatus(
  providerId: string,
  modelId: string,
  ttlMs?: number
): ValidationResult | null {
  const cache = loadCache()
  const key = getCacheKey(providerId, modelId)
  const result = cache.results[key]
  if (!result) return null
  if (ttlMs !== undefined && !isCacheFresh(result, ttlMs)) return null
  return result
}

/** Remove cache entries older than maxAgeMs. Returns the number of entries pruned. */
export function pruneValidationCache(maxAgeMs: number = VALIDATION_CONFIG.TTL_MS): number {
  const cache = loadCache()
  const cutoff = Date.now() - maxAgeMs
  let pruned = 0
  for (const [key, result] of Object.entries(cache.results)) {
    try {
      const checkedAt = new Date(result.checkedAt).getTime()
      if (isNaN(checkedAt) || checkedAt < cutoff) {
        delete cache.results[key]
        pruned++
      }
    } catch {
      delete cache.results[key]
      pruned++
    }
  }
  if (pruned > 0) {
    saveCache(cache)
  }
  return pruned
}

// ── HTTP validation ─────────────────────────────────────────────────────────

/** Build the request body for a minimal validation request. */
function buildRequestBody(modelId: string): string {
  return JSON.stringify({
    model: modelId,
    messages: [{ role: 'user', content: 'ping' }],
    max_tokens: 1,
    stream: false,
  })
}

/** Build headers for the validation request. */
function buildHeaders(params: ValidateModelParams): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Auth header depends on model format
  if (params.modelFormat === 'anthropic') {
    headers['x-api-key'] = params.apiKey
  } else {
    headers['Authorization'] = `Bearer ${params.apiKey}`
  }

  // Provider-specific headers (never override auth)
  if (params.headers) {
    for (const [key, value] of Object.entries(params.headers)) {
      if (!(key.toLowerCase() in headers)) {
        headers[key] = value
      }
    }
  }

  return headers
}

/** Build the full URL for the validation request. */
function buildUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '')
  if (trimmed.endsWith('/v1')) return `${trimmed}/chat/completions`
  if (trimmed.endsWith('/v1/')) return `${trimmed}chat/completions`
  return `${trimmed}/v1/chat/completions`
}

/** Interpret an HTTP status code into a validation status. */
function interpretStatus(httpStatus: number): {
  status: ValidationResult['status']
  error?: string
} {
  if (httpStatus >= 200 && httpStatus < 300) {
    return { status: 'available' }
  }

  if (VALIDATION_CONFIG.DEPRECATED_CODES.includes(httpStatus as 404 | 410)) {
    return { status: 'deprecated', error: `HTTP ${httpStatus} — model not found` }
  }

  if (VALIDATION_CONFIG.AUTH_CODES.includes(httpStatus as 401 | 403)) {
    return { status: 'error', error: `HTTP ${httpStatus} — authentication failed` }
  }

  if (VALIDATION_CONFIG.RETRYABLE_CODES.includes(httpStatus as 429 | 500 | 502 | 503 | 504)) {
    return { status: 'unverified', error: `HTTP ${httpStatus} — retryable server error` }
  }

  // Any other non-2xx status: treat as unverified
  return { status: 'unverified', error: `HTTP ${httpStatus}` }
}

/**
 * Validate a single model by sending a minimal chat completion request.
 * Never throws — all errors are caught and returned as ValidationResult.
 */
export async function validateModel(params: ValidateModelParams): Promise<ValidationResult> {
  const { modelId, providerId, ttlMs } = params
  const cacheKey = getCacheKey(providerId, modelId)

  // 1. Check cache first
  const cached = getValidationStatus(providerId, modelId, ttlMs)
  if (cached) return cached

  // 2. Make HTTP request
  const url = buildUrl(params.baseUrl)
  const headers = buildHeaders(params)
  const body = buildRequestBody(modelId)
  const timeoutMs = VALIDATION_CONFIG.TIMEOUT_MS

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  const now = new Date().toISOString()
  let httpStatus: number | undefined
  let latencyMs: number | undefined

  try {
    const t0 = Date.now()
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    })
    latencyMs = Date.now() - t0
    httpStatus = response.status

    const { status, error } = interpretStatus(httpStatus)
    const result: ValidationResult = {
      modelId,
      providerId,
      status,
      checkedAt: now,
      httpStatus,
      latencyMs,
      ...(error ? { error } : {}),
    }

    // Cache the result
    const cache = loadCache()
    cache.results[cacheKey] = result
    saveCache(cache)

    return result
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    const error = isTimeout
      ? `Request timed out after ${timeoutMs}ms`
      : err instanceof Error
        ? err.message
        : String(err)

    const result: ValidationResult = {
      modelId,
      providerId,
      status: 'unverified',
      checkedAt: now,
      error,
      latencyMs,
    }

    // Cache the error result too (so we don't retry immediately)
    const cache = loadCache()
    cache.results[cacheKey] = result
    saveCache(cache)

    return result
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Validate multiple models with bounded concurrency.
 * Returns results in the same order as the input array.
 */
export async function validateModels(
  models: ValidateModelParams[],
  options: ValidateModelsOptions = {}
): Promise<ValidationResult[]> {
  const concurrency = options.concurrency ?? VALIDATION_CONFIG.CONCURRENCY
  const ttlMs = options.ttlMs
  const results: ValidationResult[] = new Array(models.length)

  // Process in chunks of `concurrency`
  for (let i = 0; i < models.length; i += concurrency) {
    const chunk = models.slice(i, i + concurrency)
    const chunkResults = await Promise.all(
      chunk.map(async (params, idx) => {
        const modelParams = { ...params, ttlMs: ttlMs ?? params.ttlMs }
        return validateModel(modelParams)
      })
    )
    for (let j = 0; j < chunkResults.length; j++) {
      results[i + j] = chunkResults[j]!
    }
  }

  return results
}

/**
 * Quick validation check for launch-time blocking.
 * Returns true if the model is available or unverified (safe to launch).
 * Returns false only if the model is confirmed deprecated.
 * Uses cache only — does not make HTTP requests.
 */
export async function quickValidateModel(providerId: string, modelId: string): Promise<boolean> {
  const cached = getValidationStatus(providerId, modelId)
  if (!cached) return true // Unverified — safe to launch
  return cached.status !== 'deprecated'
}

/**
 * Fire-and-forget background validation for a batch of models.
 * Does not await — starts validation in the background and returns immediately.
 */
export function backgroundValidateModels(
  models: ValidateModelParams[],
  options: ValidateModelsOptions = {}
): void {
  // Don't await — fire and forget
  validateModels(models, options).catch(() => {
    /* never throw from background validation */
  })
}
