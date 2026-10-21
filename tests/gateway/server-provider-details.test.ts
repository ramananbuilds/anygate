import { describe, expect, it } from 'vitest'
import { providerDetailsFromCatalog } from '../../src/gateway/server/server.js'
import type { LocalProvider, LocalProviderModel } from '../../src/types/index.js'

function model(
  partial: Partial<LocalProviderModel> & Pick<LocalProviderModel, 'id' | 'name'>
): LocalProviderModel {
  return {
    family: 'test',
    brand: 'Test',
    modelFormat: 'anthropic',
    upstreamModelId: partial.id,
    ...partial,
  }
}

function provider(id: string, name: string, models: LocalProviderModel[]): LocalProvider {
  return { id, name, apiKey: 'key', models }
}

describe('providerDetailsFromCatalog', () => {
  it('lists every routable model of each provider', () => {
    const details = providerDetailsFromCatalog([
      provider('anthropic', 'Anthropic', [
        model({ id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5' }),
        model({ id: 'claude-opus-4-1', name: 'Claude Opus 4.1' }),
      ]),
    ])

    expect(details).toHaveLength(1)
    expect(details[0]).toMatchObject({ id: 'anthropic', name: 'Anthropic', modelCount: 2 })
    expect(details[0]?.models.map(m => m.id)).toEqual(['claude-opus-4-1', 'claude-sonnet-4-5'])
  })

  it('de-duplicates models that repeat an id', () => {
    const details = providerDetailsFromCatalog([
      provider('anthropic', 'Anthropic', [
        model({ id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5' }),
        model({ id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5 (copy)' }),
      ]),
    ])

    expect(details[0]?.modelCount).toBe(1)
    expect(details[0]?.models.map(m => m.id)).toEqual(['claude-sonnet-4-5'])
  })

  it('drops models the server target cannot route', () => {
    const details = providerDetailsFromCatalog([
      provider('antigravity', 'Antigravity', [
        model({ id: 'gemini-3', name: 'Gemini 3', modelFormat: 'cloud-code' }),
      ]),
    ])

    expect(details).toEqual([])
  })

  it('carries the free flags the price filter needs', () => {
    const details = providerDetailsFromCatalog([
      provider('nvidia', 'NVIDIA', [
        model({ id: 'nemotron', name: 'Nemotron', isFree: true, freeStatus: 'free_provider' }),
        model({ id: 'paid', name: 'Paid', isFree: false, freeStatus: 'paid' }),
      ]),
    ])

    expect(details[0]?.models).toEqual([
      { id: 'nemotron', name: 'Nemotron', isFree: true, freeStatus: 'free_provider' },
      { id: 'paid', name: 'Paid', isFree: false, freeStatus: 'paid' },
    ])
  })
})
