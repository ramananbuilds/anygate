import type { LocalProvider, LocalProviderModel } from '../types/index.js';
import { routableModelsForTarget, type GatewayLaunchTarget } from './target-compatibility.js';

export interface SelectionCriteria {
  target: GatewayLaunchTarget;
  family?: string;
  maxCost?: number;
  preferFree?: boolean;
}

export function selectBestModel(
  providers: LocalProvider[],
  criteria: SelectionCriteria,
): { provider: LocalProvider; model: LocalProviderModel } | null {
  for (const provider of providers) {
    const candidateModels = routableModelsForTarget(provider, criteria.target);
    for (const model of candidateModels) {
      if (criteria.family && model.family !== criteria.family) continue;
      if (criteria.preferFree && provider.authType !== 'none' && !model.id.includes('free')) continue;
      return { provider, model };
    }
  }
  return null;
}
