// Context window resolution for proxy /v1/models and Claude Code child env.
//
// Priority:
//   1. OpenCode models.json cache (limit.context) — `opencode` / `opencode-go` file keys first
//   2. models.dev cache (limit.context) — authoritative per-model values from the bundled/user cache
//   3. ID-pattern heuristics for models not in either cache
//   4. Provider-level default (from PROVIDER_DEFAULTS, keyed by providerId)
//   5. 200K default (Claude Code's own fallback for unknown models)
import { readFileSync } from 'node:fs'
import { OPENCODE_CACHE_PATH } from '../../../src/config/constants.js'
import { loadModelsDevCache } from '../../registry/models-dev.js'

export const DEFAULT_CONTEXT_WINDOW = 200_000

/** OpenCode cache file provider keys for Zen/Go (not anygate registry ids). */
const CACHE_PROVIDER_PRIORITY = new Set(['opencode', 'opencode-go'])

export interface OpencodeCacheModel {
  id?: string
  name?: string
  family?: string
  status?: string
  provider?: { npm?: string }
  cost?: { input: number; output: number }
  limit?: { context?: number; output?: number }
  reasoning?: boolean
  interleaved?: { field?: string }
}

export type OpencodeCacheFile = Record<string, { models?: Record<string, OpencodeCacheModel> }>

// Ordered by specificity — first match wins.
export const HEURISTIC_RULES: Array<[RegExp, number]> = [
  [/gemini-2\.5-pro|gemini-1\.5-pro|gemini-3-pro/i, 2_000_000],
  [/gemini/i, 1_000_000],
  [/claude-opus-4-[678]|claude-sonnet-4-[678]/i, 1_000_000],
  [/claude-haiku-4-[567]/i, 200_000],
  [/claude.*\[1m\]/i, 1_000_000],
  [/claude-opus-4-[56]|claude-sonnet-4-[45]|claude-3/i, 200_000],
  [/claude/i, 200_000],
  [/deepseek-v4|deepseek-r1|deepseek-reasoner/i, 1_000_000],
  [/deepseek/i, 64_000],
  [/gpt-5|gpt-4\.1|o3-|o4-/i, 1_000_000],
  [/gpt-4o|gpt-4-turbo|gpt-4/i, 128_000],
  [/gpt-oss/i, 131_072],
  [/qwen3|qwen-3|qwen2\.5-72b|qwen2\.5-32b|qwen-coder/i, 262_144],
  [/qwen/i, 131_072],
  [/kimi-k2|kimi-k2\.5|moonshot/i, 262_144],
  [/minimax-m2/i, 204_800],
  [/minimax/i, 128_000],
  [/mistral-large|ministral|mistral/i, 262_144],
  [/llama-3\.[23]|llama3/i, 131_072],
  [/grok-4\.20/i, 1_000_000],
  [/grok-4\.5/i, 500_000],
  [/grok-3|grok-4/i, 131_072],
  [/nemotron/i, 131_072],
  [/glm-4/i, 128_000],
  [/solar-pro3/i, 131_072],
  [/solar-pro2/i, 65_536],
  [/solar/i, 32_768],
]

/**
 * Provider-level default context windows.
 *
 * Used when no model-specific rule (heuristic or cache) matches and the
 * caller supplies a `providerId`. Values are derived from the typical
 * context window advertised by each provider's API (see models.dev and
 * provider docs). These are conservative — the 85% safety margin in
 * context-fit.ts provides additional headroom.
 */
export const PROVIDER_DEFAULTS: Record<string, number> = {
  poolside: 262_112,
  google: 1_000_000,
  openai: 128_000,
  anthropic: 200_000,
  nvidia: 131_072,
  groq: 131_072,
  mistral: 262_144,
  deepseek: 1_000_000,
  togetherai: 131_072,
  cerebras: 131_072,
  deepinfra: 131_072,
  xai: 131_072,
  perplexity: 131_072,
  cohere: 128_000,
  alibaba: 131_072,
  openrouter: 131_072,
  venice: 131_072,
  bedrock: 200_000,
  azure: 128_000,
  vertex: 1_000_000,
  ollama: 4_096,
  lmstudio: 4_096,
  'opencode-cloud': 200_000,
  zen: 200_000,
  go: 200_000,
  antigravity: 200_000,
  sambanova: 131_072,
  fireworks: 131_072,
  ovh: 131_072,
  scaleway: 131_072,
  moonshot: 262_144,
  'moonshot-global': 262_144,
  zhipu: 128_000,
  'kimi-code': 262_144,
  kilo: 131_072,
  'github-copilot': 200_000,
  'xai-oauth': 131_072,
  'openai-oauth': 128_000,
}

let parsedCache: OpencodeCacheFile | null | undefined
let cacheIndex: Map<string, number> | undefined
const heuristicCache = new Map<string, number>()

/** Shared parse of ~/.cache/opencode/models.json — used by model list and context lookup. */
export function loadOpencodeCache(): OpencodeCacheFile | null {
  if (parsedCache === undefined) {
    try {
      parsedCache = JSON.parse(readFileSync(OPENCODE_CACHE_PATH, 'utf8')) as OpencodeCacheFile
    } catch {
      parsedCache = null
    }
  }
  return parsedCache
}

/** Build a model-id → context-window map from OpenCode cache data. Exported for tests. */
export function buildContextWindowIndex(cache: OpencodeCacheFile): Map<string, number> {
  const index = new Map<string, number>()
  const allLimits = new Map<string, number[]>()

  for (const [providerKey, providerData] of Object.entries(cache)) {
    const models = providerData?.models
    if (!models) continue
    for (const [modelId, entry] of Object.entries(models)) {
      const ctx = entry.limit?.context
      if (typeof ctx !== 'number' || ctx <= 0) continue

      const limits = allLimits.get(modelId) ?? []
      limits.push(ctx)
      allLimits.set(modelId, limits)

      if (CACHE_PROVIDER_PRIORITY.has(providerKey)) {
        index.set(modelId, ctx)
      }
    }
  }

  for (const [modelId, limits] of allLimits) {
    if (!index.has(modelId)) {
      index.set(modelId, Math.max(...limits))
    }
  }

  return index
}

function getCacheIndex(): Map<string, number> {
  if (cacheIndex === undefined) {
    const cache = loadOpencodeCache()
    cacheIndex = cache ? buildContextWindowIndex(cache) : new Map()
  }
  return cacheIndex
}

/** Build a model-id → context-window map from the models.dev cache. */
function buildModelsDevIndex(): Map<string, number> {
  const index = new Map<string, number>()
  try {
    const cache = loadModelsDevCache()
    for (const [providerSlug, providerData] of Object.entries(cache)) {
      const models = providerData?.models
      if (!models) continue
      for (const [modelId, entry] of Object.entries(models)) {
        const ctx = entry.limit?.context
        if (typeof ctx !== 'number' || ctx <= 0) continue
        // Prefer the first occurrence; if already present, keep the max.
        const existing = index.get(modelId)
        if (existing === undefined || ctx > existing) {
          index.set(modelId, ctx)
        }
      }
    }
  } catch {
    // fall through — return empty index
  }
  return index
}

let modelsDevCacheIndex: Map<string, number> | null = null
function getModelsDevIndex(): Map<string, number> {
  if (modelsDevCacheIndex === null) {
    modelsDevCacheIndex = buildModelsDevIndex()
  }
  return modelsDevCacheIndex
}

export function contextWindowFromHeuristics(modelId: string): number {
  const cached = heuristicCache.get(modelId)
  if (cached !== undefined) return cached
  for (const [pattern, size] of HEURISTIC_RULES) {
    if (pattern.test(modelId)) {
      heuristicCache.set(modelId, size)
      return size
    }
  }
  heuristicCache.set(modelId, DEFAULT_CONTEXT_WINDOW)
  return DEFAULT_CONTEXT_WINDOW
}

/**
 * Resolve a model's context window.
 *
 * Priority:
 *   1. OpenCode cache (limit.context)
 *   2. models.dev cache (limit.context)
 *   3. ID-pattern heuristics
 *   4. Provider-level default (if `providerId` is supplied)
 *   5. DEFAULT_CONTEXT_WINDOW (200K)
 */
export function lookupContextWindow(modelId: string, providerId?: string): number {
  // 1. OpenCode cache
  const fromCache = getCacheIndex().get(modelId)
  if (fromCache) return fromCache

  // 2. models.dev cache
  const fromModelsDev = getModelsDevIndex().get(modelId)
  if (fromModelsDev) return fromModelsDev

  // 3. Heuristics
  const fromHeuristics = contextWindowFromHeuristics(modelId)
  if (fromHeuristics !== DEFAULT_CONTEXT_WINDOW) return fromHeuristics

  // 4. Provider-level default
  if (providerId && PROVIDER_DEFAULTS[providerId]) {
    return PROVIDER_DEFAULTS[providerId]
  }

  // 5. Fall back to default
  return DEFAULT_CONTEXT_WINDOW
}

/** Prefer an explicit limit.context (or pre-resolved value), else resolve from cache/heuristics. */
export function resolveContextWindow(
  modelId: string,
  explicit?: number,
  providerId?: string
): number {
  if (typeof explicit === 'number' && explicit > 0) return explicit
  return lookupContextWindow(modelId, providerId)
}
