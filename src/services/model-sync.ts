import type { LocalProvider } from '../types/index.js'

export interface ModelSyncResult {
  syncedProviders: number
  totalModels: number
  lastSyncedAt: number
}

export function syncModels(providers: LocalProvider[]): ModelSyncResult {
  const totalModels = providers.reduce((acc, p) => acc + p.models.length, 0)
  return {
    syncedProviders: providers.length,
    totalModels,
    lastSyncedAt: Date.now(),
  }
}
