import type { CachedModel } from '../../types.js';
import { resolveContextWindow } from '../../../apps/shared/context-window.js';
import { deriveBrand } from '../../../apps/shared/model-compatibility.js';

interface OAuthModelSeed {
  id: string;
  name: string;
  reasoning?: boolean;
  useResponsesLite?: boolean;
  preferWebSockets?: boolean;
}

export const CHATGPT_CODEX_UNSUPPORTED_MODELS = new Set<string>([
  'gpt-5.5-fast',
]);

const OPENAI_OAUTH_MODEL_SEEDS: OAuthModelSeed[] = [
  { id: 'gpt-5.6-sol',          name: 'GPT-5.6 Sol',       reasoning: true },
  { id: 'gpt-5.6-terra',        name: 'GPT-5.6 Terra',     reasoning: true },
  { id: 'gpt-5.6-luna',         name: 'GPT-5.6 Luna',      reasoning: true, useResponsesLite: true, preferWebSockets: true },
  { id: 'gpt-5.5',              name: 'GPT-5.5',           reasoning: true },
  { id: 'gpt-5.4',              name: 'GPT-5.4' },
  { id: 'gpt-5.4-mini',         name: 'GPT-5.4 Mini' },
  { id: 'gpt-5',                name: 'GPT-5',             reasoning: true },
  { id: 'o4-mini',              name: 'o4 Mini',           reasoning: true },
  { id: 'o3',                   name: 'o3',                reasoning: true },
  { id: 'o3-mini',              name: 'o3 Mini',           reasoning: true },
  { id: 'o1',                   name: 'o1',                reasoning: true },
  { id: 'o1-mini',              name: 'o1 Mini',           reasoning: true },
];

export function buildOpenAiOAuthModels(): CachedModel[] {
  return OPENAI_OAUTH_MODEL_SEEDS.map((seed) => {
    const contextWindow = resolveContextWindow(seed.id);
    const brand = deriveBrand('gpt');
    return {
      id: seed.id,
      name: seed.name,
      family: 'gpt',
      brand,
      modelFormat: 'openai',
      upstreamModelId: seed.id,
      npm: '@ai-sdk/openai',
      apiBaseUrl: 'https://chatgpt.com/backend-api/codex',
      contextWindow,
      reasoning: seed.reasoning,
      useResponsesLite: seed.useResponsesLite,
      preferWebSockets: seed.preferWebSockets,
    };
  });
}
