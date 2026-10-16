// Regression test: the Model Tester UI route (/api/models/test) used to issue
// a raw fetch to upstream endpoints, so free OpenCode Zen models were rejected
// with 403 FreeTierError ("Upstream responded 403 Forbidden"). The route must
// send its probe through the shared gate fetch so identity headers, forced
// streaming, and the bash/read gate tools are applied.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMockRequest, createMockResponse } from '../helpers/ui-api-test-utils.js'
import {
  SESSION_ID_PATTERN,
  ZEN_BASE,
  installZenUpstream,
  sessionAgeMs,
  zenToolNames,
} from '../helpers/zen-gate-upstream.js'

const state = vi.hoisted(() => ({
  catalog: [] as Array<Record<string, any>>,
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

vi.mock('../../src/apps/shared/native-launcher.js', () => ({
  getSupportedApps: () => [],
  getSupportedApp: () => undefined,
  detectApp: () => ({ installed: false, path: null }),
  getGatewayLaunchCommand: () => 'anygate',
}))

async function postTestModel(body: unknown): Promise<{ code: number; body: any }> {
  const { handleUiApiRequest } = await import('../../src/ui/api.js')
  const req = createMockRequest('POST', '/api/models/test', JSON.stringify(body))
  const mockRes = createMockResponse()
  handleUiApiRequest(req, mockRes.res, {})
  await vi.waitFor(() => {
    expect(mockRes.result.ended).toBe(true)
  })
  return { code: mockRes.result.code, body: JSON.parse(mockRes.result.data) }
}

describe('Model Tester gates OpenCode Zen requests', () => {
  let tempHome: string
  let previous: string | undefined

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-ui-tester-gate-'))
    previous = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = join(tempHome, 'home')
    state.catalog = [
      {
        id: 'zen',
        name: 'OpenCode Zen',
        apiKey: 'sk-zen-test-key',
        models: [
          {
            id: 'big-pickle',
            name: 'big-pickle',
            modelFormat: 'openai',
            completionsUrl: `${ZEN_BASE}/v1/chat/completions`,
            upstreamModelId: 'big-pickle',
          },
          {
            id: 'claude-sonnet-4-5',
            name: 'claude-sonnet-4-5',
            modelFormat: 'anthropic',
            baseUrl: ZEN_BASE,
            upstreamModelId: 'claude-sonnet-4-5',
          },
        ],
      },
    ]
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    rmSync(tempHome, { recursive: true, force: true })
    if (previous === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previous
  })

  it('negotiates 200 OK for the free model big-pickle instead of 403 FreeTierError', async () => {
    const upstream = installZenUpstream('Bearer sk-zen-test-key', { chatChunks: ['pon', 'g'] })

    const { code, body } = await postTestModel({ providerId: 'zen', modelId: 'big-pickle' })

    expect(code).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.error).toBeUndefined()
    expect(body.format).toBe('openai')
    expect(body.sample).toBe('pong')
    expect(body.tokens).toBeGreaterThan(0)

    // The probe the upstream saw must carry the full gate contract.
    expect(upstream.calls).toHaveLength(1)
    const call = upstream.calls[0]
    expect(call.url).toBe('https://opencode.ai/zen/v1/chat/completions')
    expect(call.headers.get('user-agent')).toBe('opencode/1.18.34')
    expect(call.headers.get('x-opencode-client')).toBe('cli')
    const session = call.headers.get('x-opencode-session') ?? ''
    expect(session).toMatch(SESSION_ID_PATTERN)
    expect(sessionAgeMs(session)).toBeLessThan(60_000)
    expect(call.headers.get('authorization')).toBe('Bearer sk-zen-test-key')
    expect(call.body.stream).toBe(true)
    expect(zenToolNames(call.body)).toEqual(expect.arrayContaining(['bash', 'read']))
  })

  it('gates the Zen anthropic /v1/messages passthrough for Claude models too', async () => {
    const upstream = installZenUpstream('Bearer sk-zen-test-key')

    const { code, body } = await postTestModel({ providerId: 'zen', modelId: 'claude-sonnet-4-5' })

    expect(code).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.error).toBeUndefined()
    expect(body.sample).toBe('pong')

    expect(upstream.calls).toHaveLength(1)
    const call = upstream.calls[0]
    expect(call.url).toBe('https://opencode.ai/zen/v1/messages')
    expect(call.headers.get('user-agent')).toBe('opencode/1.18.34')
    expect(call.headers.get('x-opencode-client')).toBe('cli')
    expect(call.headers.get('x-opencode-session')).toMatch(SESSION_ID_PATTERN)
    expect(call.headers.get('authorization')).toBe('Bearer sk-zen-test-key')
  })
})
