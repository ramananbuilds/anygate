import { describe, expect, it } from 'vitest'
import { MAX_MODEL_CATALOG } from '../../../src/config/constants.js'
import { buildProviderCustomRoutes } from '../../../src/registry/provider-catalog.js'
import type { ProxyRoute } from '../../../src/gateway/proxy/anthropic-proxy.js'
import type { LocalProvider } from '../../../src/types/index.js'

function testProvider(ids: string[]): LocalProvider {
  return {
    id: 'groq',
    name: 'Groq',
    apiKey: 'k',
    models: ids.map(id => ({
      id,
      name: id,
      family: '',
      brand: 'Other',
      modelFormat: 'openai' as const,
      upstreamModelId: id,
      completionsUrl: 'https://api.groq.com/openai/v1/chat/completions',
    })),
  }
}

function routeFor(modelId: string): ProxyRoute {
  return {
    aliasId: `anthropic-groq__${modelId}[1m]`,
    realModelId: modelId,
    displayName: `${modelId} (Groq)`,
    upstreamUrl: 'https://api.groq.com/openai/v1/chat/completions',
    apiKey: 'k',
    modelFormat: 'openai',
  }
}

describe('buildProviderCustomRoutes', () => {
  it('preserves picker order with the starting route first', () => {
    const provider = testProvider(['a', 'b', 'c'])
    const starting = routeFor('b')
    const resolve = (_pid: string, mid: string) => routeFor(mid)
    const { routes, droppedModelIds } = buildProviderCustomRoutes(
      provider,
      ['b', 'a', 'c'],
      starting,
      resolve
    )
    expect(routes.map(r => r.realModelId)).toEqual(['b', 'a', 'c'])
    expect(droppedModelIds).toEqual([])
  })

  it('drops unresolvable ids and reports them', () => {
    const provider = testProvider(['a', 'gone'])
    const starting = routeFor('a')
    const resolve = (_pid: string, mid: string) => (mid === 'a' ? routeFor(mid) : undefined)
    const { routes, droppedModelIds } = buildProviderCustomRoutes(
      provider,
      ['a', 'gone'],
      starting,
      resolve
    )
    expect(routes.map(r => r.realModelId)).toEqual(['a'])
    expect(droppedModelIds).toEqual(['gone'])
  })

  it('dedupes repeated ids and caps at MAX_MODEL_CATALOG', () => {
    const ids = Array.from({ length: MAX_MODEL_CATALOG + 5 }, (_, i) => `m${i}`)
    const provider = testProvider(ids)
    const starting = routeFor('m0')
    const resolve = (_pid: string, mid: string) => routeFor(mid)
    const { routes } = buildProviderCustomRoutes(
      provider,
      ['m0', 'm1', 'm1', ...ids.slice(2)],
      starting,
      resolve
    )
    expect(routes).toHaveLength(MAX_MODEL_CATALOG)
    expect(routes[0]).toEqual(starting)
    expect(new Set(routes.map(r => r.aliasId)).size).toBe(routes.length)
  })
})
