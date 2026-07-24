import type { LocalProvider, LocalProviderModel } from '../types/index.js';
import { isTargetCompatibleModel, type GatewayLaunchTarget } from './target-compatibility.js';

export interface RouteRequest {
  providerId: string;
  modelId: string;
  target: GatewayLaunchTarget;
}

export interface RouteMatch {
  provider: LocalProvider;
  model: LocalProviderModel;
  target: GatewayLaunchTarget;
}

export function routeRequest(providers: LocalProvider[], request: RouteRequest): RouteMatch | null {
  const provider = providers.find(p => p.id === request.providerId);
  if (!provider) return null;
  const model = provider.models.find(m => m.id === request.modelId);
  if (!model) return null;

  const check = isTargetCompatibleModel({
    target: request.target,
    providerId: provider.id,
    authType: provider.authType,
    model,
  });

  if (!check.compatible) return null;
  return { provider, model, target: request.target };
}
