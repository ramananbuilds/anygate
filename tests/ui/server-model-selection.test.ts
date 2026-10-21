import { describe, expect, it } from 'vitest'
import {
  buildExposedModelKeys,
  countServedModels,
  isFavoriteModel,
  isFreeServerModel,
  pickedModelIds,
} from '../../src/ui/app/src/lib/server/selection'
import type {
  UiServerProviderModel,
  UiServerProviderOption,
} from '../../src/ui/app/src/lib/api/types'

function model(id: string, extra: Partial<UiServerProviderModel> = {}): UiServerProviderModel {
  return { id, name: id, isFree: false, ...extra }
}

function provider(id: string, models: UiServerProviderModel[]): UiServerProviderOption {
  return { id, name: id, modelCount: models.length, models }
}

const anthropic = provider('anthropic', [model('claude-sonnet-4-5'), model('claude-opus-4-1')])
const zen = provider('zen', [
  model('big-pickle', { isFree: true, freeStatus: 'verified_free' }),
  model('small-pickle'),
])

describe('pickedModelIds', () => {
  it('falls back to every model when the provider has no entry', () => {
    expect(pickedModelIds(anthropic, {})).toEqual(['claude-sonnet-4-5', 'claude-opus-4-1'])
  })

  it('returns the ticked models when the provider has an entry', () => {
    expect(pickedModelIds(anthropic, { anthropic: ['claude-opus-4-1'] })).toEqual([
      'claude-opus-4-1',
    ])
  })

  it('keeps an empty entry empty (the provider was cleared)', () => {
    expect(pickedModelIds(anthropic, { anthropic: [] })).toEqual([])
  })
})

describe('buildExposedModelKeys', () => {
  it('returns null when every provider is fully ticked', () => {
    expect(buildExposedModelKeys([anthropic, zen], {})).toBeNull()
  })

  it('returns the ticked keys when a provider is only partly ticked', () => {
    const keys = buildExposedModelKeys([anthropic, zen], { anthropic: ['claude-opus-4-1'] })
    expect(keys).toEqual(['anthropic:claude-opus-4-1', 'zen:big-pickle', 'zen:small-pickle'])
  })

  it('returns an empty list when every provider is cleared', () => {
    expect(buildExposedModelKeys([anthropic, zen], { anthropic: [], zen: [] })).toEqual([])
  })

  it('only covers the providers it is given', () => {
    const keys = buildExposedModelKeys([anthropic], { anthropic: ['claude-opus-4-1'] })
    expect(keys).toEqual(['anthropic:claude-opus-4-1'])
  })
})

describe('countServedModels', () => {
  it('counts the ticked models of the exposed providers', () => {
    expect(countServedModels([anthropic, zen], {})).toBe(4)
    expect(countServedModels([anthropic, zen], { anthropic: ['claude-opus-4-1'] })).toBe(3)
  })

  it('drops paid models when only free models are served', () => {
    expect(countServedModels([anthropic, zen], {}, { freeOnly: true })).toBe(1)
  })

  it('keeps only favorited models', () => {
    const favorites = [
      { providerId: 'zen', providerName: 'zen', model: 'big-pickle', modelId: 'big-pickle' },
    ]
    expect(countServedModels([anthropic, zen], {}, { favorites })).toBe(1)
  })

  it('serves nothing when favorites are required but none are set', () => {
    expect(countServedModels([anthropic, zen], {}, { favorites: [] })).toBe(0)
  })
})

describe('isFreeServerModel', () => {
  it('treats free-flagged and free-status models as free', () => {
    expect(isFreeServerModel(model('a', { isFree: true }))).toBe(true)
    expect(isFreeServerModel(model('b', { freeStatus: 'verified_free' }))).toBe(true)
    expect(isFreeServerModel(model('c', { freeStatus: 'free_provider' }))).toBe(true)
  })

  it('treats paid and unknown models as paid', () => {
    expect(isFreeServerModel(model('d', { freeStatus: 'paid' }))).toBe(false)
    expect(isFreeServerModel(model('e', { freeStatus: 'unknown' }))).toBe(false)
    expect(isFreeServerModel(model('f'))).toBe(false)
  })
})

describe('isFavoriteModel', () => {
  const favorites = [
    { providerId: 'zen', providerName: 'zen', model: 'big-pickle', modelId: 'big-pickle' },
  ]

  it('matches a favorite by provider and model id', () => {
    expect(isFavoriteModel(favorites, 'zen', 'big-pickle')).toBe(true)
  })

  it('does not match the same model id under another provider', () => {
    expect(isFavoriteModel(favorites, 'anthropic', 'big-pickle')).toBe(false)
  })

  it('does not match a model that is not favorited', () => {
    expect(isFavoriteModel(favorites, 'zen', 'small-pickle')).toBe(false)
  })

  it('matches nothing when there are no favorites', () => {
    expect(isFavoriteModel([], 'zen', 'big-pickle')).toBe(false)
  })
})
