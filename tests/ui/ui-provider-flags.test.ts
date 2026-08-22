import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMockRequest, createMockResponse } from '../helpers/ui-api-test-utils.js'

// --- W1a: freeTier + isCustom flags surfaced by GET /api/providers/templates ---
//
// freeTier rule (computed server-side in the /api/models mapping):
//   template JSON has "freeTier": true
//   OR the template serves anonymousFreeModels
//   OR the provider id is a known always-free provider (see FREE_PROVIDER_IDS).
// isCustom rule: provider id starts with 'custom-' (customProviderId() prefix).

const state = vi.hoisted(() => ({
  catalog: [] as Array<{
    id: string
    name: string
    authType?: string
    apiKey?: string
    models: Array<{ id: string; name: string; isFree?: boolean }>
  }>,
  updateInfo: { current: '0.1.0', latest: '0.4.4', updateAvailable: false } as any,
}))

vi.mock('../../src/registry/provider-catalog.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/registry/provider-catalog.js')>(
    '../../src/registry/provider-catalog.js'
  )
  return {
    ...actual,
    fetchProviderCatalog: vi.fn(async () => state.catalog),
  }
})

vi.mock('../../src/apps/shared/update-check.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/apps/shared/update-check.js')>(
    '../../src/apps/shared/update-check.js'
  )
  return {
    ...actual,
    checkForUpdates: vi.fn(async () => state.updateInfo),
  }
})

vi.mock('../../src/apps/shared/native-launcher.js', () => ({
  getSupportedApps: () => [],
  getSupportedApp: () => undefined,
  detectApp: () => ({ installed: false, path: null }),
  getGatewayLaunchCommand: () => 'anygate',
}))

async function call(method: string, url: string, body?: unknown) {
  const { handleUiApiRequest } = await import('../../src/ui/api.js')
  const req = createMockRequest(method, url, body !== undefined ? JSON.stringify(body) : undefined)
  const mockRes = createMockResponse()
  handleUiApiRequest(req, mockRes.res, {})
  await new Promise(resolve => setTimeout(resolve, 50))
  return { code: mockRes.result.code, body: JSON.parse(mockRes.result.data) }
}

describe('ui/api.ts provider flags (W1a)', () => {
  let tempHome: string
  let previous: string | undefined

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-ui-provider-flags-'))
    previous = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = join(tempHome, 'home')
    state.catalog = [
      {
        id: 'nvidia',
        name: 'NVIDIA NIM',
        authType: 'api',
        models: [{ id: 'llama3', name: 'Llama 3' }],
      },
      {
        id: 'kilo',
        name: 'Kilo Code',
        authType: 'api',
        models: [{ id: 'claude', name: 'Claude' }],
      },
      {
        id: 'groq',
        name: 'Groq',
        authType: 'api',
        models: [{ id: 'llama-3.1-8b', name: 'Llama 3.1 8B' }],
      },
      {
        id: 'custom-my-endpoint',
        name: 'My Endpoint',
        authType: 'api',
        models: [{ id: 'local', name: 'Local Model' }],
      },
    ]
    state.updateInfo = { current: '0.1.0', latest: '0.4.4', updateAvailable: false }
  })

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true })
    if (previous === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previous
  })

  it('GET /api/models marks known free providers with freeTier:true', async () => {
    const { code, body } = await call('GET', '/api/models')
    expect(code).toBe(200)
    const nvidia = body.providers.find((p: any) => p.id === 'nvidia')
    expect(nvidia).toBeDefined()
    expect(nvidia.freeTier).toBe(true)
  })

  it('GET /api/models marks anonymousFreeModels templates (kilo) with freeTier:true', async () => {
    const { code, body } = await call('GET', '/api/models')
    expect(code).toBe(200)
    const kilo = body.providers.find((p: any) => p.id === 'kilo')
    expect(kilo).toBeDefined()
    expect(kilo.freeTier).toBe(true)
  })

  it('GET /api/models marks custom-* provider ids with isCustom:true', async () => {
    const { code, body } = await call('GET', '/api/models')
    expect(code).toBe(200)
    const custom = body.providers.find((p: any) => p.id === 'custom-my-endpoint')
    expect(custom).toBeDefined()
    expect(custom.isCustom).toBe(true)
    expect(custom.freeTier).toBe(false)
  })

  it('GET /api/models leaves untagged providers (groq) without either flag', async () => {
    const { code, body } = await call('GET', '/api/models')
    expect(code).toBe(200)
    const groq = body.providers.find((p: any) => p.id === 'groq')
    expect(groq).toBeDefined()
    expect(groq.freeTier).toBe(false)
    expect(groq.isCustom).toBe(false)
  })

  it('GET /api/models keeps existing frozen fields intact alongside the new flags', async () => {
    const { code, body } = await call('GET', '/api/models')
    expect(code).toBe(200)
    const groq = body.providers.find((p: any) => p.id === 'groq')
    expect(groq).toMatchObject({
      hasKey: expect.any(Boolean),
      freeAccess: expect.any(Boolean),
      authType: 'api',
      modelCount: expect.any(Number),
      models: expect.any(Array),
    })
  })

  it('GET /api/providers/templates surfaces a boolean freeTier on every template', async () => {
    const { code, body } = await call('GET', '/api/providers/templates')
    expect(code).toBe(200)
    expect(Array.isArray(body.templates)).toBe(true)
    expect(body.templates.length).toBeGreaterThan(0)
    for (const t of body.templates) {
      expect(typeof t.freeTier).toBe('boolean')
    }
    const kilo = body.templates.find((t: any) => t.id === 'kilo')
    expect(kilo).toBeDefined()
    // kilo.json has no "freeTier" field — its freeness comes from
    // anonymousFreeModels, so the raw template flag stays false.
    expect(kilo.freeTier).toBe(false)
    expect(kilo.anonymousFreeModels).toBe(true)
  })
})
