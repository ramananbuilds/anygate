import { describe, expect, it } from 'vitest'
import type { LocalProviderModel } from '../../../src/types/model.js'
import { filterProviderModelsForPicker } from '../../../src/apps/shared/prompts.js'

function model(overrides: Partial<LocalProviderModel> & { id: string }): LocalProviderModel {
  return {
    name: overrides.id,
    family: '',
    brand: 'Other',
    modelFormat: 'openai',
    upstreamModelId: overrides.id,
    ...overrides,
  }
}

const MODELS = [
  model({ id: 'free-zero', cost: { input: 0, output: 0 } }),
  model({ id: 'free-flag', isFree: true, name: 'Free Flag Model' }),
  model({ id: 'free-status', freeStatus: 'verified_free' }),
  model({ id: 'paid-model', cost: { input: 1, output: 2 }, name: 'Paid Pro Model' }),
  model({ id: 'mystery-model', name: 'Mystery Model' }),
]

describe('filterProviderModelsForPicker', () => {
  it('returns everything under the all filter', () => {
    const visible = filterProviderModelsForPicker(MODELS, 'groq', { priceFilter: 'all', query: '' })
    expect(visible.map(m => m.id).sort()).toEqual(
      ['free-zero', 'free-flag', 'free-status', 'paid-model', 'mystery-model'].sort()
    )
  })

  it('free filter picks zero-cost, isFree, and verified freeStatus models', () => {
    const visible = filterProviderModelsForPicker(MODELS, 'groq', {
      priceFilter: 'free',
      query: '',
    })
    expect(visible.map(m => m.id).sort()).toEqual(['free-zero', 'free-flag', 'free-status'].sort())
  })

  it('paid filter excludes free and unknown-price models', () => {
    const visible = filterProviderModelsForPicker(MODELS, 'groq', {
      priceFilter: 'paid',
      query: '',
    })
    expect(visible.map(m => m.id)).toEqual(['paid-model'])
  })

  it('unknown-price models only appear under all', () => {
    for (const priceFilter of ['free', 'paid'] as const) {
      const visible = filterProviderModelsForPicker(MODELS, 'groq', { priceFilter, query: '' })
      expect(visible.map(m => m.id)).not.toContain('mystery-model')
    }
  })

  it('treats the whole nvidia provider as free', () => {
    const visible = filterProviderModelsForPicker(MODELS, 'nvidia', {
      priceFilter: 'free',
      query: '',
    })
    expect(visible.map(m => m.id)).toContain('mystery-model')
    expect(visible.map(m => m.id)).toContain('paid-model')
  })

  it('composes text search with the price filter', () => {
    const free = filterProviderModelsForPicker(MODELS, 'groq', {
      priceFilter: 'free',
      query: 'flag',
    })
    expect(free.map(m => m.id)).toEqual(['free-flag'])

    const all = filterProviderModelsForPicker(MODELS, 'groq', {
      priceFilter: 'all',
      query: 'model',
    })
    expect(all.map(m => m.id)).toContain('paid-model')
    expect(all.map(m => m.id)).toContain('mystery-model')
  })

  it('ignores blank queries', () => {
    const visible = filterProviderModelsForPicker(MODELS, 'groq', {
      priceFilter: 'all',
      query: '   ',
    })
    expect(visible).toHaveLength(MODELS.length)
  })
})
