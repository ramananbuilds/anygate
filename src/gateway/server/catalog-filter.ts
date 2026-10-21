import type { FavoriteModel } from '../../types/index.js'
import { isFreeStatus } from '../../apps/shared/free-models.js'
import type { ServerModelInfo } from './models.js'

export function filterServerModelsByProviders(
  models: ServerModelInfo[],
  providerIds: string[] | null | undefined
): ServerModelInfo[] {
  if (!providerIds || providerIds.length === 0) return models
  const allowed = new Set(providerIds)
  return models.filter(model => model.providerId && allowed.has(model.providerId))
}

/**
 * Restrict the catalog to an explicit model selection.
 *
 * Keys are `providerId:modelId` — the same shape favorites use, so one
 * selection can be expressed as either a list of favorites or a list of
 * hand-picked models.
 */
export function filterServerModelsBySelection(
  models: ServerModelInfo[],
  selection: string[] | null | undefined
): ServerModelInfo[] {
  if (!selection || selection.length === 0) return models
  const allowed = new Set(selection)
  return models.filter(model => model.providerId && allowed.has(`${model.providerId}:${model.id}`))
}

export function filterServerModelsByFavorites(
  models: ServerModelInfo[],
  favorites: FavoriteModel[]
): ServerModelInfo[] {
  if (favorites.length === 0) return []
  const allowed = new Set(favorites.map(fav => `${fav.providerId}:${fav.modelId}`))
  return models.filter(model => model.providerId && allowed.has(`${model.providerId}:${model.id}`))
}

export function filterServerModelsByFreeStatus(models: ServerModelInfo[]): ServerModelInfo[] {
  return models.filter(model => model.isFree || isFreeStatus(model.freeStatus))
}

export function summarizeServerProviders(models: ServerModelInfo[]): string {
  const counts = new Map<string, number>()
  for (const model of models) {
    const key = model.providerLabel ?? model.providerId ?? 'unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => `${name} (${count})`)
    .join(', ')
}
