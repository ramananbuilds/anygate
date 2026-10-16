// Router-level smoke test for the OpenCode Zen gate: an inbound
// /openai/v1/chat/completions request for a free Zen model (big-pickle) must be
// shaped before it reaches opencode.ai. The mock upstream behind
// https://opencode.ai/zen enforces the same contract as the real free tier
// (403 FreeTierError for un-gated traffic), so a 200 proves the gate works
// end-to-end — identity headers, forced streaming, gate tools, and SSE→JSON
// buffering for non-streaming clients.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createGatewayModelCatalog } from '../../src/gateway/server/models.js'
import { startServer, type ServerHandle } from '../../src/gateway/server/router.js'
import {
  OPENCODE_GATE_CLIENT,
  OPENCODE_GATE_USER_AGENT,
} from '../../src/providers/opencode-gate.js'
import {
  SESSION_ID_PATTERN,
  ZEN_BASE,
  installZenUpstream,
  sessionAgeMs,
  zenToolNames,
} from '../helpers/zen-gate-upstream.js'

process.env.ANYGATE_HOME = process.env.ANYGATE_HOME ?? '/tmp/anygate-zen-gate-test-home'

vi.mock('../../src/storage/analytics.js', async importOriginal => {
  const actual = await importOriginal<typeof import('../../src/storage/analytics.js')>()
  return { ...actual, recordUsage: vi.fn() }
})

const realFetch = globalThis.fetch

const handles: Array<{ close: () => Promise<void> }> = []

afterEach(async () => {
  vi.unstubAllGlobals()
  while (handles.length > 0) {
    const handle = handles.pop()
    if (handle) await handle.close()
  }
})

async function startGateway(apiKey = 'sk-zen-test-key'): Promise<ServerHandle> {
  const handle = await startServer({
    host: '127.0.0.1',
    port: 0,
    apiKey,
    serverPassword: null,
    catalog: createGatewayModelCatalog([
      {
        id: 'big-pickle',
        name: 'big-pickle',
        isFree: true,
        brand: 'OpenCode',
        sourceBackend: 'zen',
        modelFormat: 'openai',
        npm: '@ai-sdk/openai-compatible',
      },
    ] as any),
    backends: {
      zen: { baseUrl: ZEN_BASE },
      go: { baseUrl: `${ZEN_BASE}/go` },
    },
  })
  handles.push(handle)
  return handle
}

describe('OpenCode Zen gate — router smoke test (free model big-pickle)', () => {
  it('gates the outbound request and returns buffered JSON 200 for a non-streaming client', async () => {
    const upstream = installZenUpstream('Bearer sk-zen-test-key')
    const server = await startGateway()

    const response = await realFetch(`${server.url}/openai/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'big-pickle',
        messages: [{ role: 'user', content: 'hi' }],
        stream: false,
      }),
    })

    // 200 OK, not 403: the gate shaped the request and the SSE reply was
    // buffered back into JSON because the client did not ask to stream.
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/json')
    const completion = (await response.json()) as Record<string, any>
    expect(completion.object).toBe('chat.completion')
    expect(completion.model).toBe('big-pickle')
    expect(completion.choices[0].message.content).toBe('pickle')
    expect(completion.usage).toEqual({ prompt_tokens: 7, completion_tokens: 2, total_tokens: 9 })

    // The outbound request the upstream saw must carry the full gate contract.
    expect(upstream.calls).toHaveLength(1)
    const call = upstream.calls[0]
    expect(call.url).toBe('https://opencode.ai/zen/v1/chat/completions')
    expect(call.headers.get('user-agent')).toBe(OPENCODE_GATE_USER_AGENT)
    expect(call.headers.get('x-opencode-client')).toBe(OPENCODE_GATE_CLIENT)
    const session = call.headers.get('x-opencode-session') ?? ''
    expect(session).toMatch(SESSION_ID_PATTERN)
    expect(sessionAgeMs(session)).toBeLessThan(60_000)
    expect(call.headers.get('authorization')).toBe('Bearer sk-zen-test-key')
    // Zen rejects stream:false — streaming was forced upstream.
    expect(call.body.stream).toBe(true)
    expect(zenToolNames(call.body)).toEqual(expect.arrayContaining(['bash', 'read']))
  })

  it('streams SSE through untouched for a streaming client while still gating the request', async () => {
    const upstream = installZenUpstream('Bearer sk-zen-test-key')
    const server = await startGateway()

    const response = await realFetch(`${server.url}/openai/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'big-pickle',
        messages: [{ role: 'user', content: 'hi' }],
        stream: true,
      }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/event-stream')
    const text = await response.text()
    expect(text).toContain('"content":"pick"')
    expect(text).toContain('data: [DONE]')

    expect(upstream.calls).toHaveLength(1)
    expect(upstream.calls[0].body.stream).toBe(true)
    expect(upstream.calls[0].headers.get('x-opencode-client')).toBe(OPENCODE_GATE_CLIENT)
  })

  it('shows the mock upstream rejects un-gated traffic with 403 (control: the gate is what earns 200)', async () => {
    installZenUpstream('Bearer sk-zen-test-key')

    // A naive client that does not emulate the OpenCode CLI — exactly the
    // original bug shape — hits the same upstream contract and gets rejected.
    const probe = await fetch('https://opencode.ai/zen/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer sk-zen-test-key' },
      body: JSON.stringify({
        model: 'big-pickle',
        messages: [{ role: 'user', content: 'hi' }],
        stream: false,
      }),
    })

    expect(probe.status).toBe(403)
    const error = (await probe.json()) as Record<string, any>
    expect(error.error.type).toBe('FreeTierError')
  })
})
