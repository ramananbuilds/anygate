// Client-side derivation of model format / reasoning / supported params,
// mirroring classifyModelFormat / getReasoningCapabilities when the server
// omits the enriched fields. Uses server fields when present.
import type { UiProviderModel } from '../api/types';

export type ModelFormat = 'anthropic' | 'openai' | 'unsupported';

export function deriveFormat(model: UiProviderModel): ModelFormat {
  if (model.format) return model.format;
  const id = model.id.toLowerCase();
  if (id.startsWith('claude') || id.includes('anthropic')) return 'anthropic';
  if (id.startsWith('gpt') || id.includes('openai')) return 'unsupported'; // cloud OpenCode wizard rejects OpenAI
  if (id.startsWith('gemini')) return 'unsupported';
  return 'openai';
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
