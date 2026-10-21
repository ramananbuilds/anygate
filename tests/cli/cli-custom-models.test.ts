// tests/cli/cli-custom-models.test.ts — comma-separated --model lists + launch-target plumbing
import { describe, it, expect } from 'vitest'
import { parseArgs } from '../../src/cli.js'
import {
  findProvidersAndModels,
  hasCompleteExplicitLaunch,
  isModelListValue,
  parseModelListValue,
  planLaunchWizard,
  resolveLaunchTarget,
} from '../../src/apps/shared/launch-target.js'
import type { LocalProvider } from '../../src/types/index.js'

const PROVIDERS: LocalProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    apiKey: 'k',
    models: ['llama-3.3-70b', 'mixtral-8x7b'].map(id => ({
      id,
      name: id,
      family: '',
      brand: 'Other',
      modelFormat: 'openai' as const,
      upstreamModelId: id,
      completionsUrl: 'https://api.groq.com/openai/v1/chat/completions',
    })),
  },
]

const PREFS = {}

describe('parseModelListValue', () => {
  it('splits on commas, trims, drops empties', () => {
    expect(parseModelListValue('a,b , c,,')).toEqual(['a', 'b', 'c'])
    expect(parseModelListValue('single')).toEqual(['single'])
    expect(parseModelListValue(' , ')).toEqual([])
  })

  it('isModelListValue only fires for real multi-id lists', () => {
    expect(isModelListValue('a,b')).toBe(true)
    expect(isModelListValue('single')).toBe(false)
    expect(isModelListValue('All')).toBe(false)
    expect(isModelListValue(undefined)).toBe(false)
  })
})

describe('parseArgs --model lists', () => {
  it('stores comma lists as launchModelIds', () => {
    expect(parseArgs(['claude', '--provider', 'groq', '--model', 'a,b'])).toMatchObject({
      launchModel: 'a,b',
      launchModelIds: ['a', 'b'],
    })
  })

  it('supports --model= form', () => {
    expect(parseArgs(['codex', '--provider=groq', '--model=a, b'])).toMatchObject({
      launchModelIds: ['a', 'b'],
    })
  })

  it('leaves single ids and All alone', () => {
    expect(parseArgs(['claude', '--provider', 'groq', '--model', 'llama'])).toMatchObject({
      launchModel: 'llama',
      launchModelIds: undefined,
    })
    expect(parseArgs(['claude', '--provider', 'groq', '--model', 'All'])).toMatchObject({
      launchModel: 'All',
      launchModelIds: undefined,
    })
  })
})

describe('launch-target modelIds', () => {
  it('resolves provider + list targets', () => {
    const target = resolveLaunchTarget(
      { providerId: 'groq', modelIds: ['llama-3.3-70b', 'mixtral-8x7b'] },
      PREFS,
      'claude'
    )
    expect(target).toEqual({ providerId: 'groq', modelIds: ['llama-3.3-70b', 'mixtral-8x7b'] })
  })

  it('findProvidersAndModels resolves, dedupes, and reports missing ids', () => {
    const resolved = findProvidersAndModels(PROVIDERS, {
      providerId: 'groq',
      modelIds: ['llama-3.3-70b', 'llama-3.3-70b', 'nope'],
    })
    expect(resolved?.models.map(m => m.id)).toEqual(['llama-3.3-70b'])
    expect(resolved?.missingIds).toEqual(['nope'])
  })

  it('findProvidersAndModels accepts matching slugs, rejects cross-provider ones', () => {
    const ok = findProvidersAndModels(PROVIDERS, {
      providerId: 'groq',
      modelIds: ['groq__mixtral-8x7b'],
    })
    expect(ok?.models.map(m => m.id)).toEqual(['mixtral-8x7b'])
    expect(ok?.missingIds).toEqual([])

    const bad = findProvidersAndModels(PROVIDERS, {
      providerId: 'groq',
      modelIds: ['zen__something'],
    })
    expect(bad?.models).toEqual([])
    expect(bad?.missingIds).toEqual(['zen__something'])
  })

  it('returns null without provider or ids', () => {
    expect(findProvidersAndModels(PROVIDERS, { modelIds: ['a'] })).toBeNull()
    expect(findProvidersAndModels(PROVIDERS, { providerId: 'nope', modelIds: ['a'] })).toBeNull()
    expect(findProvidersAndModels(PROVIDERS, { providerId: 'groq' })).toBeNull()
  })

  it('hasCompleteExplicitLaunch accepts provider + non-empty list', () => {
    expect(hasCompleteExplicitLaunch({ providerId: 'groq', modelIds: ['a', 'b'] })).toBe(true)
    expect(hasCompleteExplicitLaunch({ modelIds: ['a'] })).toBe(false)
    expect(hasCompleteExplicitLaunch({ providerId: 'groq', modelIds: [] })).toBe(false)
  })

  it('planLaunchWizard rejects --all-models mixed with a list', () => {
    const plan = planLaunchWizard({
      explicit: { providerId: 'groq', allModels: true, modelIds: ['a', 'b'] },
      childArgs: [],
      agent: 'claude',
      prefs: PREFS as never,
    })
    expect(plan.skip).toBe(false)
    expect(plan.error).toMatch(/not both/)
  })

  it('planLaunchWizard requires --provider for a bare list', () => {
    const plan = planLaunchWizard({
      explicit: { modelIds: ['a', 'b'] },
      childArgs: [],
      agent: 'claude',
      prefs: PREFS as never,
    })
    expect(plan.skip).toBe(false)
    expect(plan.error).toMatch(/--provider.*--model id1,id2/)
  })

  it('planLaunchWizard skips with provider + list', () => {
    const plan = planLaunchWizard({
      explicit: { providerId: 'groq', modelIds: ['a', 'b'] },
      childArgs: [],
      agent: 'claude',
      prefs: PREFS as never,
    })
    expect(plan.skip).toBe(true)
    expect(plan.target).toEqual({ providerId: 'groq', modelIds: ['a', 'b'] })
  })
})
