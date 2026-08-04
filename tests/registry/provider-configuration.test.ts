// Regression tests for provider template configuration and the Add-provider list.
//
// Two classes of defect:
//
//   1. `GET /api/providers/templates` fed the Add-provider dropdown from
//      listSupportedTemplates() — the entire catalog — while only the OAuth half
//      was filtered by what the user already had. A provider configured with a
//      working API key still showed up as something to "add".
//
//   2. Individual templates were mis-declared: sambanova.json used camelCase keys
//      (`defaultBaseUrl`/`modelsPath`) that ProviderTemplateData does not read, so
//      its base URL vanished and `authType: "api"` degraded to `"none"`; fireworks
//      and sambanova pointed at SDK packages that are not installed (and in
//      SambaNova's case do not exist on npm), which made addProviderFromTemplate
//      reject them outright.

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import {
  PROVIDER_TEMPLATES,
  getTemplateById,
  listAddableTemplates,
  listSupportedTemplates,
} from '../../src/registry/templates/provider-templates.js'
import { isSdkUpgradedNpm } from '../../src/gateway/providers/provider-factory.js'
import { emptyRegistry, saveRegistry } from '../../src/registry/index.js'
import { createMockRequest, createMockResponse } from '../helpers/ui-api-test-utils.js'
import type { RegistryProvider } from '../../src/registry/types.js'

const require = createRequire(import.meta.url)

describe('provider template configuration', () => {
  it('every supported template names an SDK package the factory can construct', () => {
    for (const t of listSupportedTemplates()) {
      expect(t.npm, `${t.id} has no npm package`).toBeTruthy()
      expect(
        isSdkUpgradedNpm(t.npm) || t.npm === '@ai-sdk/anthropic',
        `${t.id} npm is not SDK-constructible: ${t.npm}`
      ).toBe(true)
    }
  })

  it('every referenced SDK package is a declared dependency', () => {
    // A transitively-hoisted package resolves until a dependency bump drops it,
    // and the failure then looks like a provider bug rather than a missing dep.
    const pkg = require('../../package.json') as { dependencies?: Record<string, string> }
    const declared = new Set(Object.keys(pkg.dependencies ?? {}))
    for (const t of PROVIDER_TEMPLATES) {
      if (!t.npm) continue
      // Vertex's Anthropic entry point is a subpath of @ai-sdk/google-vertex.
      const root = t.npm.startsWith('@ai-sdk/google-vertex') ? '@ai-sdk/google-vertex' : t.npm
      expect(declared.has(root), `${t.id} needs ${root} in package.json dependencies`).toBe(true)
    }
  })

  it('every api-list template resolves a base URL or asks the user for one', () => {
    for (const t of PROVIDER_TEMPLATES) {
      if (t.modelSource !== 'api-list') continue
      expect(
        Boolean(t.defaultBaseUrl) || Boolean(t.urlPrompt),
        `${t.id} is api-list with neither defaultBaseUrl nor urlPrompt`
      ).toBe(true)
    }
  })

  it('every template declares a valid auth type', () => {
    // sambanova.json wrote authType "api" where the loader expects "apiKey",
    // and the ternary in toProviderTemplate silently mapped it to "none".
    for (const t of PROVIDER_TEMPLATES) {
      expect(['api', 'oauth', 'none'], `${t.id} authType`).toContain(t.authType)
    }
  })

  it('templates that advertise an API key are not typed as anonymous', () => {
    for (const t of listSupportedTemplates()) {
      if (!t.signupUrl) continue
      expect(t.authType, `${t.id} has a signup URL but authType none`).not.toBe('none')
    }
  })

  it('configures SambaNova against its OpenAI-compatible endpoint', () => {
    expect(getTemplateById('sambanova')).toMatchObject({
      name: 'SambaNova',
      authType: 'api',
      npm: '@ai-sdk/openai-compatible',
      defaultBaseUrl: 'https://api.sambanova.ai/v1',
      modelsPath: '/models',
      supported: true,
    })
  })

  it('configures Fireworks against an installed SDK package', () => {
    expect(getTemplateById('fireworks')).toMatchObject({
      name: 'Fireworks AI',
      authType: 'api',
      npm: '@ai-sdk/openai-compatible',
      defaultBaseUrl: 'https://api.fireworks.ai/inference/v1',
      supported: true,
    })
  })

  it("declares Cohere's npm package explicitly rather than via fallback", () => {
    expect(getTemplateById('cohere')).toMatchObject({
      npm: '@ai-sdk/cohere',
      authType: 'api',
      defaultBaseUrl: 'https://api.cohere.com/v1',
    })
  })

  it('keeps http:// base URLs restricted to key-optional local servers', () => {
    for (const t of PROVIDER_TEMPLATES) {
      if (!t.defaultBaseUrl?.startsWith('http://')) continue
      const host = new URL(t.defaultBaseUrl).hostname
      expect(
        /^(localhost|127\.|0\.0\.0\.0|\[?::1)/.test(host),
        `${t.id} uses plaintext http:// against a non-local host`
      ).toBe(true)
      expect(t.apiKeyOptional, `${t.id} is a local server but requires a key`).toBe(true)
      expect(t.urlPrompt, `${t.id} is self-hosted but cannot be pointed elsewhere`).toBeTruthy()
    }
  })
})

describe('add-provider list excludes configured providers', () => {
  let tempHome: string
  let previous: string | undefined

  /** Registry entry for an already-configured provider holding a real key. */
  function configured(id: string): RegistryProvider {
    return {
      id,
      templateId: id,
      name: id,
      enabled: true,
      authRef: `keyring:provider:${id}`,
      authType: 'api',
      api: { npm: '@ai-sdk/openai-compatible' },
      addedAt: '2026-08-03T00:00:00.000Z',
      modelsCache: { fetchedAt: '2026-08-03T00:00:00.000Z', models: [] },
    } as RegistryProvider
  }

  async function getTemplates(): Promise<{ code: number; body: any }> {
    const { handleUiApiRequest } = await import('../../src/ui/api.js')
    const req = createMockRequest('GET', '/api/providers/templates')
    const mockRes = createMockResponse()
    handleUiApiRequest(req, mockRes.res, {})
    await new Promise(resolve => setTimeout(resolve, 50))
    return { code: mockRes.result.code, body: JSON.parse(mockRes.result.data) }
  }

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-add-list-'))
    previous = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = join(tempHome, 'home')
  })

  afterEach(() => {
    if (previous === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previous
    rmSync(tempHome, { recursive: true, force: true })
  })

  it('omits providers already in the registry', async () => {
    const registry = emptyRegistry()
    registry.providers.push(configured('groq'), configured('mistral'))
    saveRegistry(registry)

    const { code, body } = await getTemplates()

    expect(code).toBe(200)
    const ids = body.templates.map((t: { id: string }) => t.id)
    expect(ids).not.toContain('groq')
    expect(ids).not.toContain('mistral')
  })

  it('still offers providers that are not configured', async () => {
    const registry = emptyRegistry()
    registry.providers.push(configured('groq'))
    saveRegistry(registry)

    const ids = (await getTemplates()).body.templates.map((t: { id: string }) => t.id)

    expect(ids).toContain('mistral')
    expect(ids).toContain('cerebras')
  })

  it('keeps the custom-endpoint entries available regardless of registry state', async () => {
    const registry = emptyRegistry()
    registry.providers.push(configured('groq'))
    saveRegistry(registry)

    const ids = (await getTemplates()).body.templates.map((t: { id: string }) => t.id)

    expect(ids).toContain('__custom_openai__')
    expect(ids).toContain('__custom_anthropic__')
  })

  it('offers the full catalog when nothing is configured', async () => {
    saveRegistry(emptyRegistry())

    const ids = (await getTemplates()).body.templates.map((t: { id: string }) => t.id)

    for (const t of listAddableTemplates([])) {
      expect(ids).toContain(t.id)
    }
  })

  it("matches the CLI's addable list for the same registry state", async () => {
    // The CLI's pickTemplateFromCatalog already filtered correctly; the UI must
    // not diverge from it.
    const registry = emptyRegistry()
    registry.providers.push(configured('groq'), configured('ollama'))
    saveRegistry(registry)

    const uiIds = (await getTemplates()).body.templates
      .filter((t: { authType: string; custom: boolean }) => t.authType === 'api' && !t.custom)
      .map((t: { id: string }) => t.id)
      .sort()
    const cliIds = listAddableTemplates(['groq', 'ollama'])
      .map(t => t.id)
      .sort()

    expect(uiIds).toEqual(cliIds)
  })
})
