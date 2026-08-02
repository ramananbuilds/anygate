// src/registry/validation/config.ts — configuration for self-healing model validation

/** Configuration for the model validation system. */
export const VALIDATION_CONFIG = {
  /** Cache time-to-live: 24 hours in milliseconds. */
  TTL_MS: 24 * 60 * 60 * 1000,

  /** Maximum concurrent validation requests. */
  CONCURRENCY: 5,

  /** Per-request timeout in milliseconds. */
  TIMEOUT_MS: 8000,

  /** HTTP status codes that are retryable (will be marked 'unverified'). */
  RETRYABLE_CODES: [429, 500, 502, 503, 504] as const,

  /** HTTP status codes that indicate a model is deprecated. */
  DEPRECATED_CODES: [404, 410] as const,

  /** HTTP status codes that indicate an auth issue (marked 'error'). */
  AUTH_CODES: [401, 403] as const,

  /** Schema version for the cache file format. */
  CACHE_SCHEMA_VERSION: 1,

  /** Path to the validation cache file (relative to app home). */
  CACHE_FILENAME: 'model-validation-cache.json',
} as const

/** Validation status for a model. */
export type ValidationStatus = 'available' | 'deprecated' | 'error' | 'unverified'

/** Result of validating a single model. */
export interface ValidationResult {
  /** The model ID that was validated. */
  modelId: string
  /** The provider ID that owns this model. */
  providerId: string
  /** Current validation status. */
  status: ValidationStatus
  /** ISO timestamp of when this validation was performed. */
  checkedAt: string
  /** Error message if status is 'error' or 'unverified'. */
  error?: string
  /** HTTP status code from the validation request. */
  httpStatus?: number
  /** Latency of the validation request in milliseconds. */
  latencyMs?: number
}

/** Cache entry key format: "providerId|modelId". */
export type CacheKey = string

/** Validation cache structure persisted to disk. */
export interface ValidationCache {
  schema_version: number
  results: Record<CacheKey, ValidationResult>
}

/** Parameters for validating a single model. */
export interface ValidateModelParams {
  /** The model ID to validate. */
  modelId: string
  /** The provider ID that owns this model. */
  providerId: string
  /** The base URL for the provider's API (e.g. https://api.groq.com/openai/v1). */
  baseUrl: string
  /** The API key for authentication. */
  apiKey: string
  /** The model format: 'openai' or 'anthropic'. */
  modelFormat: 'openai' | 'anthropic'
  /** Optional provider-specific headers to include. */
  headers?: Record<string, string>
  /** Optional override for the cache TTL. */
  ttlMs?: number
}

/** Options for batch validation. */
export interface ValidateModelsOptions {
  /** Maximum concurrent validations (default: VALIDATION_CONFIG.CONCURRENCY). */
  concurrency?: number
  /** Skip models that have a fresh cache entry. */
  skipFresh?: boolean
  /** Optional override for the cache TTL. */
  ttlMs?: number
}
