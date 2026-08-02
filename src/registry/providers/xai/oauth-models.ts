import type { CachedModel } from '../../types.js'
import { resolveContextWindow } from '../../../apps/shared/context-window.js'
import { deriveBrand } from '../../../apps/shared/model-compatibility.js'

interface OAuthModelSeed {
  id: string
  name: string
  reasoning?: boolean
}

const XAI_OAUTH_MODEL_SEEDS: OAuthModelSeed[] = [
  { id: 'grok-4', name: 'Grok 4', reasoning: true },
  { id: 'grok-4-fast', name: 'Grok 4 Fast', reasoning: true },
  { id: 'grok-3', name: 'Grok 3', reasoning: true },
  { id: 'grok-3-fast', name: 'Grok 3 Fast' },
  { id: 'grok-3-mini', name: 'Grok 3 Mini', reasoning: true },
  { id: 'grok-3-mini-fast', name: 'Grok 3 Mini Fast', reasoning: true },
]

export function buildXaiOAuthModels(): CachedModel[] {
  return XAI_OAUTH_MODEL_SEEDS.map(seed => {
    const prefix = seed.id.split('-')[0] ?? seed.id
    return {
      id: seed.id,
      name: seed.name,
      upstreamModelId: seed.id,
      family: prefix,
      brand: deriveBrand(prefix),
      contextWindow: resolveContextWindow(seed.id),
      modelFormat: 'openai' as const,
      npm: '@ai-sdk/xai',
      reasoning: seed.reasoning,
    }
  })
}
