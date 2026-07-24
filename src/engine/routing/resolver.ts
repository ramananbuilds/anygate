import type { LocalProvider, LocalProviderModel } from '../../types/index.js';
import { parseModelSlug } from '../selection/launch-target.js';

export interface ResolvedModelRef {
  providerId?: string;
  modelId: string;
}

export function resolveModelRef(modelRef: string): ResolvedModelRef {
  return parseModelSlug(modelRef);
}

export function resolveProviderAndModel(
  providers: LocalProvider[],
  modelRef: string,
  preferredProviderId?: string,
): { provider: LocalProvider; model: LocalProviderModel } | null {
  const { providerId, modelId } = resolveModelRef(modelRef);
  const targetProviderId = providerId ?? preferredProviderId;

  if (targetProviderId) {
    const provider = providers.find(p => p.id === targetProviderId);
    if (provider) {
      const model = provider.models.find((m: LocalProviderModel) => m.id === modelId);
      if (model) return { provider, model };
    }
  }

  for (const provider of providers) {
    const model = provider.models.find((m: LocalProviderModel) => m.id === modelId);
    if (model) return { provider, model };
  }

  return null;
}
