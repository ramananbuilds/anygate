// Provider sectioning for the Providers page: buckets providers into
// custom / oauth / free / apikey groups with alphabetical sort inside each.
// Plain TypeScript (no Svelte runes) so vitest can import it directly.
import type { UiProvider } from '../api/types'
import type { EnrichedProvider } from '../stores/providers.svelte'

export type { EnrichedProvider }

export type ProviderSectionId = 'custom' | 'oauth' | 'free' | 'apikey'

export interface ProviderGroup {
  id: ProviderSectionId
  providers: EnrichedProvider[]
}

/** Connected = has a key or anonymous free access; oauth only counts via its hasKey. */
export function isConnected(p: Pick<UiProvider, 'hasKey' | 'freeAccess' | 'authType'>): boolean {
  return p.hasKey || p.freeAccess || (p.authType === 'oauth' && p.hasKey)
}

function byName(a: EnrichedProvider, b: EnrichedProvider): number {
  return a.name.localeCompare(b.name)
}

export function groupProviders(
  list: EnrichedProvider[]
): Record<ProviderSectionId, EnrichedProvider[]> {
  const groups: Record<ProviderSectionId, EnrichedProvider[]> = {
    custom: [],
    oauth: [],
    free: [],
    apikey: [],
  }
  for (const p of list) {
    if (p.isCustom === true) {
      groups.custom.push(p)
    } else if (!p.isCustom && p.authType === 'oauth') {
      groups.oauth.push(p)
    } else if (!p.isCustom && p.authType !== 'oauth' && p.freeTier === true) {
      groups.free.push(p)
    } else {
      groups.apikey.push(p)
    }
  }
  groups.custom.sort(byName)
  groups.oauth.sort(byName)
  groups.free.sort(byName)
  groups.apikey.sort(byName)
  return groups
}
