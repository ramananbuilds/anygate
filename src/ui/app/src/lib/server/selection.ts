// Pure derivation of the server's exposed-model selection.
//
// The ticked state lives in the Server panel, but the rules that turn it into
// a request payload — and the counts shown next to it — are plain functions,
// so they can be unit tested without a browser.
import type { FavoriteModel, UiServerProviderModel, UiServerProviderOption } from '../api/types'

/**
 * providerId -> ticked model ids.
 *
 * A provider with no entry means "all of its models"; an entry with an empty
 * array means "none of them".
 */
export type ModelPicks = Record<string, string[]>

/** The models ticked for a provider, falling back to every model it has. */
export function pickedModelIds(provider: UiServerProviderOption, picks: ModelPicks): string[] {
  const explicit = picks[provider.id]
  if (explicit !== undefined) return explicit
  return provider.models.map(m => m.id)
}

/** True when a model is served without payment (mirrors the server's free filter). */
export function isFreeServerModel(model: UiServerProviderModel): boolean {
  return (
    model.isFree || model.freeStatus === 'verified_free' || model.freeStatus === 'free_provider'
  )
}

/**
 * True when the model is one of the user's favorites.
 *
 * Favorites are keyed by `providerId` + `modelId` — the same pair the server
 * selection uses, so a favorite can be ticked in the picker directly.
 */
export function isFavoriteModel(
  favorites: FavoriteModel[],
  providerId: string,
  modelId: string
): boolean {
  return favorites.some(f => f.providerId === providerId && f.modelId === modelId)
}

/**
 * The `providerId:modelId` keys the gateway should serve.
 *
 * `null` means "every model of the exposed providers" — returned when every
 * exposed provider is fully ticked, so the saved config stays small and a
 * provider added later defaults to all of its models.
 */
export function buildExposedModelKeys(
  providers: UiServerProviderOption[],
  picks: ModelPicks
): string[] | null {
  const keys: string[] = []
  let partial = false
  for (const provider of providers) {
    const picked = new Set(pickedModelIds(provider, picks))
    if (!provider.models.every(m => picked.has(m.id))) partial = true
    for (const m of provider.models) if (picked.has(m.id)) keys.push(`${provider.id}:${m.id}`)
  }
  return partial ? keys : null
}

export interface ServeFilters {
  /** Only serve models that are free to use. */
  freeOnly?: boolean
  /** Only serve favorited models. An empty list matches nothing. */
  favorites?: FavoriteModel[]
}

/**
 * How many models the gateway will actually serve: the ticked models of the
 * exposed providers, minus whatever the free/favorites filters drop.
 */
export function countServedModels(
  providers: UiServerProviderOption[],
  picks: ModelPicks,
  filters: ServeFilters = {}
): number {
  const favorites = filters.favorites
    ? new Set(filters.favorites.map(f => `${f.providerId}:${f.modelId}`))
    : null
  let count = 0
  for (const provider of providers) {
    const picked = new Set(pickedModelIds(provider, picks))
    for (const m of provider.models) {
      if (!picked.has(m.id)) continue
      if (filters.freeOnly && !isFreeServerModel(m)) continue
      if (favorites && !favorites.has(`${provider.id}:${m.id}`)) continue
      count++
    }
  }
  return count
}
