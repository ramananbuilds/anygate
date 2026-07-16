// Providers + models store. Loads GET /api/models, enriches each model
// client-side (format/reasoning/params), and exposes refresh + per-provider ops.
import * as api from '../api/endpoints';
import { enrichModel, type EnrichedModel } from '../providers/modelFormat';
export type { EnrichedModel };
import type { UiProvider, UiProviderModel } from '../api/types';
import { toast } from './ui.svelte';

export interface EnrichedProvider extends UiProvider {
  enrichedModels: EnrichedModel[];
}

function enrich(p: UiProvider): EnrichedProvider {
  return { ...p, enrichedModels: p.models.map(enrichModel) };
}

export const providers = $state<{
  list: EnrichedProvider[];
  loading: boolean;
  error: string | null;
}>({ list: [], loading: false, error: null });

export async function loadProviders(signal?: AbortSignal): Promise<void> {
  providers.loading = true;
  providers.error = null;
  try {
    const res = await api.getModels();
    providers.list = res.providers.map(enrich);
  } catch (err) {
    providers.error = err instanceof Error ? err.message : String(err);
  } finally {
    providers.loading = false;
  }
}

export function getProvider(id: string): EnrichedProvider | undefined {
  return providers.list.find(p => p.id === id);
}

export async function refreshProviderModels(id: string): Promise<void> {
  try {
    const res = await api.refreshProvider(id);
    if (!res.ok) {
      toast(res.error ? String(res.error) : 'Refresh failed', 'error');
      return;
    }
    await loadProviders();
    toast(`Refreshed ${id} (${res.count ?? 0} models)`, 'success');
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error');
  }
}

export async function refreshAll(): Promise<void> {
  try {
    const res = await api.refreshAllProviders();
    await loadProviders();
    toast(`Refreshed all · ${res.total} models`, 'success');
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error');
  }
}

export function findModel(providerId: string, modelId: string): EnrichedModel | undefined {
  return getProvider(providerId)?.enrichedModels.find(m => m.id === modelId);
}
