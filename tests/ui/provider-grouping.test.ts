import { describe, expect, it } from 'vitest'
import {
  groupProviders,
  isConnected,
  type EnrichedProvider,
} from '../../src/ui/app/src/lib/providers/grouping.js'

function mk(
  overrides: Partial<EnrichedProvider> & { id?: string; name?: string }
): EnrichedProvider {
  return {
    id: 'p',
    name: 'Provider',
    favoriteName: 'provider',
    hasKey: false,
    freeAccess: false,
    authType: 'api',
    modelCount: 0,
    models: [],
    enrichedModels: [],
    ...overrides,
  } as EnrichedProvider
}

describe('groupProviders', () => {
  it('routes freeTier provider to free bucket', () => {
    const nvidia = mk({ id: 'nvidia', name: 'NVIDIA', freeTier: true })
    const groups = groupProviders([nvidia])
    expect(groups.free).toHaveLength(1)
    expect(groups.free[0].id).toBe('nvidia')
    expect(groups.apikey).toHaveLength(0)
    expect(groups.oauth).toHaveLength(0)
    expect(groups.custom).toHaveLength(0)
  })

  it('routes oauth provider to oauth bucket', () => {
    const cc = mk({ id: 'claude-code', name: 'Claude Code', authType: 'oauth', hasKey: true })
    const groups = groupProviders([cc])
    expect(groups.oauth).toHaveLength(1)
    expect(groups.oauth[0].id).toBe('claude-code')
    expect(groups.free).toHaveLength(0)
    expect(groups.apikey).toHaveLength(0)
  })

  it('isCustom wins over freeTier and oauth', () => {
    const custom = mk({
      id: 'custom-1',
      name: 'My Endpoint',
      isCustom: true,
      freeTier: true,
      authType: 'oauth',
      hasKey: true,
    })
    const groups = groupProviders([custom])
    expect(groups.custom).toHaveLength(1)
    expect(groups.custom[0].id).toBe('custom-1')
    expect(groups.free).toHaveLength(0)
    expect(groups.oauth).toHaveLength(0)
    expect(groups.apikey).toHaveLength(0)
  })

  it('routes plain api-key provider to apikey bucket', () => {
    const groq = mk({ id: 'groq', name: 'Groq', hasKey: true })
    const groups = groupProviders([groq])
    expect(groups.apikey).toHaveLength(1)
    expect(groups.apikey[0].id).toBe('groq')
    expect(groups.free).toHaveLength(0)
  })

  it('sorts alphabetically by name within each bucket', () => {
    const list = [
      mk({ id: 'zeta', name: 'Zeta AI' }),
      mk({ id: 'alpha', name: 'Alpha Corp' }),
      mk({ id: 'mid', name: 'Midway' }),
      mk({ id: 'nfree', name: 'Zed Free', freeTier: true }),
      mk({ id: 'afree', name: 'Aurora Free', freeTier: true }),
      mk({ id: 'c9', name: 'Custom Z', isCustom: true }),
      mk({ id: 'c1', name: 'Custom A', isCustom: true }),
      mk({ id: 'o2', name: 'OAuth Zeta', authType: 'oauth' }),
      mk({ id: 'o1', name: 'OAuth Alpha', authType: 'oauth' }),
    ]
    const groups = groupProviders(list)
    expect(groups.apikey.map(p => p.name)).toEqual(['Alpha Corp', 'Midway', 'Zeta AI'])
    expect(groups.free.map(p => p.name)).toEqual(['Aurora Free', 'Zed Free'])
    expect(groups.custom.map(p => p.name)).toEqual(['Custom A', 'Custom Z'])
    expect(groups.oauth.map(p => p.name)).toEqual(['OAuth Alpha', 'OAuth Zeta'])
  })

  it('does not mutate the input list order', () => {
    const list = [mk({ id: 'b', name: 'B' }), mk({ id: 'a', name: 'A' })]
    const snapshot = [...list]
    groupProviders(list)
    expect(list.map(p => p.id)).toEqual(snapshot.map(p => p.id))
  })

  it('returns empty arrays for all buckets on empty input', () => {
    const groups = groupProviders([])
    expect(groups.custom).toEqual([])
    expect(groups.oauth).toEqual([])
    expect(groups.free).toEqual([])
    expect(groups.apikey).toEqual([])
  })

  it('oauth provider without key still lands in oauth bucket (not apikey)', () => {
    const pending = mk({ id: 'claude-code', name: 'Claude Code', authType: 'oauth', hasKey: false })
    const groups = groupProviders([pending])
    expect(groups.oauth).toHaveLength(1)
    expect(groups.apikey).toHaveLength(0)
  })

  it('non-oauth freeAccess provider goes to free when freeTier flag set', () => {
    const p = mk({ id: 'nvidia', name: 'NVIDIA', freeTier: true, freeAccess: true, hasKey: false })
    const groups = groupProviders([p])
    expect(groups.free).toHaveLength(1)
  })
})

describe('isConnected', () => {
  it('true when hasKey only', () => {
    expect(isConnected({ hasKey: true, freeAccess: false, authType: 'api' })).toBe(true)
    expect(isConnected({ hasKey: true, freeAccess: false, authType: 'oauth' })).toBe(true)
  })

  it('true when freeAccess only', () => {
    expect(isConnected({ hasKey: false, freeAccess: true, authType: 'api' })).toBe(true)
  })

  it('false for bare oauth without key', () => {
    expect(isConnected({ hasKey: false, freeAccess: false, authType: 'oauth' })).toBe(false)
  })

  it('false for plain api provider with nothing configured', () => {
    expect(isConnected({ hasKey: false, freeAccess: false, authType: 'api' })).toBe(false)
  })

  it('true when both hasKey and freeAccess', () => {
    expect(isConnected({ hasKey: true, freeAccess: true, authType: 'api' })).toBe(true)
  })
})
