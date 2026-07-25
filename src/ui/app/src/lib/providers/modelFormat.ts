// Client-side derivation of model format / reasoning / supported params,
// mirroring classifyModelFormat / getReasoningCapabilities when the server
// omits the enriched fields. Uses server fields when present.
import type { UiProviderModel } from '../api/types';

export type ModelFormat = 'anthropic' | 'openai' | 'unsupported';

/**
 * Providers whose API surface is OpenAI-compatible and work fine through
 * anygate's SDK adapter. Model IDs from these providers may contain "openai"
 * (e.g. NVIDIA's `openai/gpt-oss-120b`) — they must NOT be marked unsupported.
 */
const OPENAI_COMPATIBLE_PROVIDERS = new Set([
  'nvidia',
  'groq',
  'togetherai',
  'cerebras',
  'deepinfra',
  'mistral',
  'perplexity',
  'xai',
  'cohere',
  'fireworks',
  'sambanova',
  'scaleway',
  'ovh',
  'venice',
  'openrouter',
  'kilo',
  'ollama',
  'lmstudio',
  'requesty',
  'bytedance',
  'stepfun',
  'z.ai',
  'minimaxai',
  'microsoft',
  'qwen',
  'meta',
  'upstage',
  'sarvamai',
  'abacusai',
]);

/**
 * Providers that are the *actual* OpenAI provider (not OpenAI-compatible).
 * The cloud OpenCode wizard rejects these — they must be marked unsupported
 * when the model ID looks like a native OpenAI model.
 */
const RESTRICTED_OPENAI_PROVIDERS = new Set([
  'openai',
  'openai-oauth',
]);

/**
 * Google/Vertex provider IDs whose native model IDs (gemini-*) are not
 * directly testable from the UI.
 */
const RESTRICTED_GOOGLE_PROVIDERS = new Set([
  'google',
  'vertex',
]);

/**
 * Infer the model format from the model ID and (optionally) the provider ID.
 *
 * Priority:
 * 1. Anthropic native: `claude-*` → 'anthropic'
 * 2. If providerId is known:
 *    - RESTRICTED_OPENAI_PROVIDERS + `gpt-*`/`o1*`/`o3*`/`o4*` → 'unsupported'
 *    - OPENAI_COMPATIBLE_PROVIDERS → 'openai'
 *    - RESTRICTED_GOOGLE_PROVIDERS + `gemini-*` → 'unsupported'
 * 3. Fallback: 'openai' (conservative — don't assume unsupported)
 */
export function inferModelFormat(modelId: string, providerId?: string): ModelFormat {
  const id = modelId.toLowerCase();

  // 1. Anthropic native models are always 'anthropic' regardless of provider.
  if (id.startsWith('claude') || id.includes('anthropic')) return 'anthropic';

  // 2. Provider-aware detection.
  if (providerId) {
    const pid = providerId.toLowerCase();

    // Restricted OpenAI provider: native OpenAI model IDs are unsupported.
    if (RESTRICTED_OPENAI_PROVIDERS.has(pid)) {
      if (id.startsWith('gpt') || id.startsWith('o1') || id.startsWith('o3') || id.startsWith('o4')) {
        return 'unsupported';
      }
      return 'openai';
    }

    // OpenAI-compatible providers: always 'openai' (even if ID contains "openai").
    if (OPENAI_COMPATIBLE_PROVIDERS.has(pid)) return 'openai';

    // Restricted Google providers: gemini-* IDs are unsupported from the UI.
    if (RESTRICTED_GOOGLE_PROVIDERS.has(pid)) {
      if (id.startsWith('gemini')) return 'unsupported';
      return 'openai';
    }
  }

  // 3. Fallback: be conservative — assume 'openai' rather than 'unsupported'.
  //    The server-side modelFormat field (if present) is the source of truth.
  return 'openai';
}

/** True when the model is supported from the UI (not 'unsupported'). */
export function isModelSupported(modelId: string, providerId?: string): boolean {
  return inferModelFormat(modelId, providerId) !== 'unsupported';
}

/** Human-readable label for a model format. */
export function getFormatLabel(format: ModelFormat): string {
  switch (format) {
    case 'anthropic': return 'Anthropic';
    case 'openai': return 'OpenAI Compatible';
    case 'unsupported': return 'Unsupported';
  }
}

export function deriveFormat(model: UiProviderModel): ModelFormat {
  // Server-side enriched field takes priority.
  if (model.format) return model.format;
  // Provider-aware client-side inference.
  return inferModelFormat(model.id, model.providerId);
}

export function deriveReasoning(model: UiProviderModel): boolean {
  if (typeof model.reasoning === 'boolean') return model.reasoning;
  const id = model.id.toLowerCase();
  // Heuristic: reasoning-capable families.
  return /(opus|sonnet|o1|o3|o4|gpt-5|deepseek-r(1|2)|qwen3?-(plus|max|pro)|claude-(3-7|4))/.test(id);
}

export function deriveSupportedParameters(model: UiProviderModel): string[] {
  if (Array.isArray(model.supportedParameters)) return model.supportedParameters;
  const params = ['tools', 'system'];
  if (deriveReasoning(model)) params.push('reasoning_effort');
  if (!model.isFree) params.push('streaming');
  return params;
}

export interface EnrichedModel extends UiProviderModel {
  format: ModelFormat;
  reasoning: boolean;
  supportedParameters: string[];
}

export function enrichModel(model: UiProviderModel): EnrichedModel {
  return {
    ...model,
    format: deriveFormat(model),
    reasoning: deriveReasoning(model),
    supportedParameters: deriveSupportedParameters(model),
  };
}
