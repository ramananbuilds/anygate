// src/registry/models-dev.ts — models.dev capability cache (bundled + optional user refresh)

import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import bundledCache from '../data/models-dev-cache.json' with { type: 'json' };
import { getAppHome } from '../core/paths.ts';
import { normalizeModelIdCandidates } from './pricing.js';

export const MODELS_DEV_API_URL = 'https://models.dev/api.json';
const FETCH_TIMEOUT_MS = 15_000;
const FILE_MODE = 0o600;

export interface ModelsDevModalities {
  input?: string[];
  output?: string[];
}

export interface ModelsDevModel {
  id?: string;
  name?: string;
  tool_call?: boolean;
  chat?: boolean;
  interactions?: boolean;
  reasoning?: boolean;
  interleaved?: { field?: string };
  modalities?: ModelsDevModalities;
}

export interface ModelsDevProvider {
  id?: string;
  name?: string;
  models?: Record<string, ModelsDevModel>;
}

export type ModelsDevCacheFile = Record<string, ModelsDevProvider>;

export interface ModelsDevCacheMeta {
  schema_version?: string;
  fetched_at?: string;
  source?: string;
  provider_count?: number;
}

const META_KEY = '_gateway_meta';

let memoryCache: ModelsDevCacheFile | null = null;
let memoryCachePath: string | null = null;
let memoryCacheMtime = 0;

/** Registry / OpenCode provider id → models.dev top-level key */
export const REGISTRY_TO_MODELS_DEV: Record<string, string> = {
  google: 'google',
  openai: 'openai',
  groq: 'groq',
  mistral: 'mistral',
  togetherai: 'together',
  cerebras: 'cerebras',
  deepinfra: 'deepinfra',
  xai: 'xai',
  'xai-oauth': 'xai',
  perplexity: 'perplexity',
  cohere: 'cohere',
  alibaba: 'alibaba',
  openrouter: 'openrouter',
  anthropic: 'anthropic',
  nvidia: 'nvidia',
  venice: 'openrouter',
};

export function readModelsDevCacheMeta(
  cache: ModelsDevCacheFile,
): ModelsDevCacheMeta | null {
  const raw = cache[META_KEY] as unknown as ModelsDevCacheMeta | undefined;
  if (!raw || typeof raw !== 'object') return null;
  return raw;
}

export function stripModelsDevCacheMeta(cache: ModelsDevCacheFile): ModelsDevCacheFile {
  const { [META_KEY]: _meta, ...providers } = cache;
  return providers;
}

export function loadBundledModelsDevCache(): ModelsDevCacheFile {
  return bundledCache as unknown as ModelsDevCacheFile;
}

export function invalidateModelsDevCache(): void {
  memoryCache = null;
  memoryCachePath = null;
  memoryCacheMtime = 0;
}

function readModelsDevFile(path: string): ModelsDevCacheFile | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as ModelsDevCacheFile;
  } catch {
    return null;
  }
}

function mkdirSafe(dir: string): void {
  try {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  } catch {
    // ignore
  }
}

function attachModelsDevCacheMeta(
  providers: Record<string, ModelsDevProvider>,
): ModelsDevCacheFile {
  const providerCount = Object.keys(providers).filter(k => !k.startsWith('_')).length;
  return {
    [META_KEY]: {
      schema_version: '1',
      fetched_at: new Date().toISOString(),
      source: MODELS_DEV_API_URL,
      provider_count: providerCount,
    },
    ...providers,
  } as ModelsDevCacheFile;
}

function writeModelsDevCache(path: string, data: ModelsDevCacheFile): void {
  mkdirSafe(dirname(path));
  writeFileSync(path, `${JSON.stringify(data)}\n`, { mode: FILE_MODE });
  try {
    chmodSync(path, FILE_MODE);
  } catch {
    // best-effort
  }
  invalidateModelsDevCache();
}

export function getUserModelsDevCachePath(): string {
  return join(getAppHome(), 'models-dev-cache.json');
}

function rememberModelsDevCache(path: string, data: ModelsDevCacheFile): ModelsDevCacheFile {
  memoryCache = data;
  memoryCachePath = path;
  try {
    memoryCacheMtime = statSync(path).mtimeMs;
  } catch {
    memoryCacheMtime = 0;
  }
  return data;
}

export function loadModelsDevCache(): ModelsDevCacheFile {
  const userPath = getUserModelsDevCachePath();
  if (existsSync(userPath)) {
    try {
      const mtime = statSync(userPath).mtimeMs;
      if (memoryCache && memoryCachePath === userPath && memoryCacheMtime === mtime) {
        return memoryCache;
      }
      const data = readModelsDevFile(userPath);
      if (data) return rememberModelsDevCache(userPath, data);
    } catch {
      // fall through to bundled
    }
  }

  if (memoryCache && memoryCachePath === 'bundled') return memoryCache;
  return rememberModelsDevCache('bundled', loadBundledModelsDevCache());
}

export async function fetchModelsDevCache(): Promise<ModelsDevCacheFile | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(MODELS_DEV_API_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as Record<string, ModelsDevProvider>;
    if (!data || typeof data !== 'object') return null;
    const withMeta = attachModelsDevCacheMeta(data);
    writeModelsDevCache(getUserModelsDevCachePath(), withMeta);
    return withMeta;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function resolveModelsDevSlug(providerId: string): string {
  return REGISTRY_TO_MODELS_DEV[providerId] ?? providerId;
}

/** Fetch latest models.dev catalog in the background; falls back to bundled snapshot offline. */
export function refreshModelsDevCacheAsync(onComplete?: (updated: boolean) => void): void {
  void (async () => {
    const updated = (await fetchModelsDevCache()) !== null;
    onComplete?.(updated);
  })();
}

export function findModelsDevModel(
  providerId: string,
  modelId: string,
  cache: ModelsDevCacheFile = loadModelsDevCache(),
): ModelsDevModel | null {
  const slug = resolveModelsDevSlug(providerId);
  const models = stripModelsDevCacheMeta(cache)[slug]?.models;
  if (!models) return null;

  for (const candidate of normalizeModelIdCandidates(modelId)) {
    const entry = models[candidate];
    if (entry) return entry;
  }
  return null;
}

/**
 * Families/providers where image input is the norm and models.dev is known to
 * under-report it (e.g. NVIDIA Nemotron 3 Ultra is listed text-only but supports images).
 * Used as a conservative override ONLY when models.dev has no explicit non-text modality
 * and the model clearly belongs to a multimodal family.
 */
const MULTIMODAL_FAMILIES: RegExp[] = [
  /nvidia.*nemotron/i,
  /^gpt-/i,
  /^o[0-9]/i,            // o1, o3, o4, o-series
  /gpt-5/i,
  /gemini/i,
  /claude/i,
  /sonnet/i,
  /opus/i,
  /haiku/i,
  /llama.*vision/i,
  /(vision|multimodal)/i,
  /qwen.*vl/i,
  /qwen2?-vl/i,
  /deepseek.*vl/i,
  /mistral.*(vision|pixtral)/i,
  /pixtral/i,
  /grok.*vision/i,
  /(command|cohere).*vision/i,
];

function familyMatchesMultimodal(family: string, modelId: string): boolean {
  const hay = `${family} ${modelId}`;
  return MULTIMODAL_FAMILIES.some(re => re.test(hay));
}

/**
 * Resolve the input types a model supports (e.g. ['text'] or ['text','image']).
 *
 * Strategy (A3):
 *  1. Try models.dev via findModelsDevModel (slug-mapped + id-normalized).
 *  2. If models.dev reports explicit input modalities, trust them — UNLESS the
 *     model clearly belongs to a known-multimodal family (override for wrongly
 *     text-only rows like NVIDIA Nemotron 3 Ultra).
 *  3. If models.dev is silent, fall back to family heuristics: multimodal
 *     families get ['text','image'], everything else stays ['text'].
 *
 * Never returns undefined/empty — agents need a concrete array.
 */
export function resolveInputTypes(
  family: string,
  providerId: string,
  modelId: string,
  cache: ModelsDevCacheFile = loadModelsDevCache(),
): string[] {
  const entry = findModelsDevModel(providerId, modelId, cache);
  const baseInput = entry?.modalities?.input && entry.modalities.input.length > 0
    ? [...entry.modalities.input]
    : null;

  // models.dev explicit text-only: respect it UNLESS a known multimodal family
  // overrides (the NVIDIA Nemotron 3 Ultra case).
  if (baseInput && baseInput.every(t => t === 'text') && !familyMatchesMultimodal(family, modelId)) {
    return ['text'];
  }

  const result = new Set<string>(baseInput ?? ['text']);
  if (familyMatchesMultimodal(family, modelId)) result.add('image');
  return [...result];
}

/** Conservative auto-hide rules — only when models.dev row exists and fields are explicit. */
export function shouldHideByModelsDevCapabilities(entry: ModelsDevModel): boolean {
  const output = entry.modalities?.output;
  if (output && output.length > 0 && !output.includes('text')) return true;
  if (entry.tool_call === false) return true;
  if (entry.interactions === true && entry.chat === false) return true;
  return false;
}
