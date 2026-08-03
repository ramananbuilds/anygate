// Regression tests for the Ollama provider configuration bugs.
//
// Ollama (and LM Studio) are self-hosted: the user picks the host/port, the
// server needs no API key, and the server — not the model — decides the context
// window. Four separate defects each broke one of those assumptions:
//
//   1. `urlPrompt` was declared in ollama.json but dropped by toProviderTemplate(),
//      so neither add flow ever asked where the server lives — every install was
//      pinned to the hardcoded default port.
//   2. materializeOne() dropped any provider with a blank credential unless it was
//      `anonymousFreeModels`, so a keyless Ollama vanished from every launcher.
//   3. resolveContextWindow() was called without a providerId, so ID heuristics
//      advertised a model's trained maximum (deepseek-r1:14b → 1M) instead of what
//      Ollama actually serves (num_ctx, 4096 by default) — silent truncation.
//   4. ollamaProviderMeta named an uninstalled npm package and a /v1-less URL.

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { emptyRegistry, materializeRegistry } from '../../src/registry/index.js'
import { getTemplateById } from '../../src/registry/templates/provider-templates.js'
import { ollamaProviderMeta } from '../../src/registry/providers/ollama/index.js'
import {
  lookupContextWindow,
  serverConfiguredContextWindow,
  OLLAMA_DEFAULT_CONTEXT_LENGTH,
} from '../../src/apps/shared/context-window.js'
import type { RegistryProvider } from '../../src/registry/types.js'

/** A registry entry shaped like one the Ollama add flow persists. */
function ollamaRegistryProvider(overrides: Partial<RegistryProvider> = {}): RegistryProvider {
  return {
    id: 'ollama',
    templateId: 'ollama',
    name: 'Ollama',
    enabled: true,
    authRef: 'keyring:provider:ollama',
    authType: 'api',
    api: { npm: '@ai-sdk/openai-compatible', url: 'http://127.0.0.1:11434/v1' },
    addedAt: '2026-08-03T00:00:00.000Z',
    modelsCache: {
      fetchedAt: '2026-08-03T00:00:00.000Z',
      models: [
        {
          id: 'llama3.1:8b',
          name: 'llama3.1:8b',
          upstreamModelId: 'llama3.1:8b',
          family: 'llama3.1',
          npm: '@ai-sdk/openai-compatible',
          apiUrl: 'http://127.0.0.1:11434/v1',
          modelFormat: 'openai',
        },
      ],
    },
    ...overrides,
  } as RegistryProvider
}

describe('ollama template', () => {
  it('carries urlPrompt through to the add flows', () => {
    // The whole bug: ollama.json declared this, toProviderTemplate() dropped it,
    // so the CLI never prompted and the UI never rendered a base-URL field.
    const template = getTemplateById('ollama')
    expect(template?.urlPrompt).toBe('Ollama API Base URL:')
  })

  it('carries urlPrompt for LM Studio too', () => {
    expect(getTemplateById('lmstudio')?.urlPrompt).toBe('LM Studio API Base URL:')
  })

  it('is an OpenAI-compatible, key-optional local provider on the /v1 path', () => {
    expect(getTemplateById('ollama')).toMatchObject({
      name: 'Ollama',
      npm: '@ai-sdk/openai-compatible',
      defaultBaseUrl: 'http://127.0.0.1:11434/v1',
      modelsPath: '/models',
      apiKeyOptional: true,
      modelSource: 'api-list',
      supported: true,
    })
  })

  it('keeps ollamaProviderMeta consistent with the template', () => {
    // The meta previously named `ollama-ai-provider` — a package this repo does
    // not depend on — and a base URL missing the /v1 suffix the SDK requires.
    const template = getTemplateById('ollama')
    expect(ollamaProviderMeta.npm).toBe('@ai-sdk/openai-compatible')
    expect(ollamaProviderMeta.npm).toBe(template?.npm)
    expect(ollamaProviderMeta.defaultBaseUrl).toBe(template?.defaultBaseUrl)
  })
})

describe('ollama materialization', () => {
  it('materializes with no stored credential', () => {
    // Ollama serves without auth. Before the fix the blank-key guard dropped it
    // and the provider silently disappeared from every launcher.
    const registry = emptyRegistry()
    registry.providers.push(ollamaRegistryProvider())

    const materialized = materializeRegistry(registry, () => null)

    expect(materialized.map(p => p.id)).toContain('ollama')
    expect(materialized[0].models).toHaveLength(1)
  })

  it('still materializes when a key is supplied', () => {
    const registry = emptyRegistry()
    registry.providers.push(ollamaRegistryProvider())

    const materialized = materializeRegistry(registry, () => 'a-real-key')

    expect(materialized.map(p => p.id)).toContain('ollama')
    expect(materialized[0].apiKey).toBe('a-real-key')
  })

  it('still drops a keyless provider that does require a key', () => {
    // Guard against over-correcting: only apiKeyOptional/none providers may
    // materialize without a credential.
    const registry = emptyRegistry()
    registry.providers.push(
      ollamaRegistryProvider({
        id: 'groq',
        templateId: 'groq',
        name: 'Groq',
        api: { npm: '@ai-sdk/openai-compatible', url: 'https://api.groq.com/openai/v1' },
      })
    )

    expect(materializeRegistry(registry, () => null)).toHaveLength(0)
  })
})

describe('ollama context window', () => {
  const prev = process.env.OLLAMA_CONTEXT_LENGTH

  beforeEach(() => {
    delete process.env.OLLAMA_CONTEXT_LENGTH
  })

  afterEach(() => {
    if (prev === undefined) delete process.env.OLLAMA_CONTEXT_LENGTH
    else process.env.OLLAMA_CONTEXT_LENGTH = prev
  })

  it("reports what the server serves, not the model's trained maximum", () => {
    // These IDs all match generous heuristic rules (131K, 1M). Ollama serves
    // 4096 by default and silently truncates the rest, so the heuristic value
    // is actively harmful here.
    expect(lookupContextWindow('llama3.1:8b', 'ollama')).toBe(OLLAMA_DEFAULT_CONTEXT_LENGTH)
    expect(lookupContextWindow('qwen2.5-coder:7b', 'ollama')).toBe(OLLAMA_DEFAULT_CONTEXT_LENGTH)
    expect(lookupContextWindow('deepseek-r1:14b', 'ollama')).toBe(OLLAMA_DEFAULT_CONTEXT_LENGTH)
  })

  it('applies the same rule to LM Studio', () => {
    expect(lookupContextWindow('llama3.1:8b', 'lmstudio')).toBe(4_096)
  })

  it('honours OLLAMA_CONTEXT_LENGTH when the user raised their server default', () => {
    process.env.OLLAMA_CONTEXT_LENGTH = '32768'
    expect(lookupContextWindow('llama3.1:8b', 'ollama')).toBe(32_768)
    expect(serverConfiguredContextWindow('ollama')).toBe(32_768)
  })

  it('ignores a malformed OLLAMA_CONTEXT_LENGTH', () => {
    process.env.OLLAMA_CONTEXT_LENGTH = 'not-a-number'
    expect(lookupContextWindow('llama3.1:8b', 'ollama')).toBe(OLLAMA_DEFAULT_CONTEXT_LENGTH)
    process.env.OLLAMA_CONTEXT_LENGTH = '-1'
    expect(lookupContextWindow('llama3.1:8b', 'ollama')).toBe(OLLAMA_DEFAULT_CONTEXT_LENGTH)
  })

  it('does not clamp hosted providers that genuinely serve large windows', () => {
    // The server-configured rule must apply ONLY to self-hosted servers. Hosted
    // providers keep resolving from the models.dev cache / heuristics as before.
    expect(serverConfiguredContextWindow('groq')).toBeUndefined()
    expect(serverConfiguredContextWindow('openai')).toBeUndefined()
    expect(lookupContextWindow('llama-3.3-70b', 'groq')).toBeGreaterThanOrEqual(128_000)
    expect(lookupContextWindow('deepseek-r1', 'deepseek')).toBeGreaterThanOrEqual(128_000)
  })

  it('clamps the same model id when it is served by Ollama rather than a host', () => {
    // Same model, different server: the local one is capped, the hosted one is not.
    expect(lookupContextWindow('deepseek-r1', 'ollama')).toBe(OLLAMA_DEFAULT_CONTEXT_LENGTH)
    expect(lookupContextWindow('deepseek-r1', 'deepseek')).toBeGreaterThan(
      OLLAMA_DEFAULT_CONTEXT_LENGTH
    )
  })

  it('materializes Ollama models with the server-configured window', () => {
    const registry = emptyRegistry()
    registry.providers.push(ollamaRegistryProvider())

    const [provider] = materializeRegistry(registry, () => null)

    expect(provider.models[0].contextWindow).toBe(OLLAMA_DEFAULT_CONTEXT_LENGTH)
  })

  it('prefers an explicit cached contextWindow over the provider default', () => {
    // A server that reports its real num_ctx should win over our fallback.
    const registry = emptyRegistry()
    const entry = ollamaRegistryProvider()
    entry.modelsCache!.models[0].contextWindow = 16_384
    registry.providers.push(entry)

    const [provider] = materializeRegistry(registry, () => null)

    expect(provider.models[0].contextWindow).toBe(16_384)
  })
})
