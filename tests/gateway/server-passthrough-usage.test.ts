// C4: the gateway's anthropic-passthrough branch previously returned without
// recording usage, so native Anthropic traffic never appeared in analytics.
// These tests assert recordUsage is called for BOTH the non-streaming path
// (usage parsed from the upstream JSON body) and the streaming path (usage
// tee-scanned from message_start / message_delta SSE events).
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createGatewayModelCatalog } from '../../src/gateway/server/models.js'
import { startServer, type ServerHandle } from '../../src/gateway/server/router.js'

process.env.ANYGATE_HOME = process.env.ANYGATE_HOME ?? '/tmp/anygate-c4-test-home'

vi.mock('../../src/storage/analytics.js', async importOriginal => {
  const actual = await importOriginal<typeof import('../../src/storage/analytics.js')>()
  return { ...actual, recordUsage: vi.fn() }
})

import { recordUsage } from '../../src/storage/analytics.js'

const recordUsageMock = vi.mocked(recordUsage)

interface UpstreamRequest {
  url: string
  body: any
}

/** Streaming upstream that speaks Anthropic SSE with usage events. */
function startSseUpstream(): Promise<{
  baseUrl: string
  requests: UpstreamRequest[]
  written: string[]
  close: () => Promise<void>
}> {
  const requests: UpstreamRequest[] = []
  const written: string[] = []
  const server = createServer((req, res) => {
    void (async () => {
      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(Buffer.from(chunk))
      requests.push({
        url: req.url ?? '',
        body: JSON.parse(Buffer.concat(chunks).toString() || '{}'),
      })
      res.writeHead(200, { 'Content-Type': 'text/event-stream' })
      const events = [
        `event: message_start\ndata: ${JSON.stringify({
          type: 'message_start',
          message: { id: 'msg_1', usage: { input_tokens: 11, output_tokens: 1 } },
        })}\n\n`,
        `event: content_block_delta\ndata: ${JSON.stringify({
          type: 'content_block_delta',
          delta: { type: 'text_delta', text: 'hello' },
        })}\n\n`,
        `event: message_delta\ndata: ${JSON.stringify({
          type: 'message_delta',
          delta: { stop_reason: 'end_turn' },
          usage: { output_tokens: 23 },
        })}\n\n`,
        'event: message_stop\ndata: {"type":"message_stop"}\n\n',
      ]
      for (const ev of events) {
        written.push(ev)
        res.write(ev)
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      res.end()
    })()
  })
  return listen(server, { requests, written })
}

/** Non-streaming upstream returning an Anthropic JSON message with usage. */
function startJsonUpstream(body: any): Promise<{
  baseUrl: string
  requests: UpstreamRequest[]
  close: () => Promise<void>
}> {
  const requests: UpstreamRequest[] = []
  const server = createServer((req, res) => {
    void (async () => {
      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(Buffer.from(chunk))
      requests.push({
        url: req.url ?? '',
        body: JSON.parse(Buffer.concat(chunks).toString() || '{}'),
      })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(body))
    })()
  })
  return listen(server, requests)
}

async function listen<T extends Record<string, unknown>>(
  server: ReturnType<typeof createServer>,
  ...extra: unknown[]
): Promise<{ baseUrl: string; close: () => Promise<void> } & T> {
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('missing address')
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    ...extra[0],
    close: () =>
      new Promise<void>((resolve, reject) => server.close(err => (err ? reject(err) : resolve()))),
  } as any
}

const handles: Array<{ close: () => Promise<void> }> = []

afterEach(async () => {
  recordUsageMock.mockClear()
  while (handles.length > 0) {
    const handle = handles.pop()
    if (handle) await handle.close()
  }
})

async function startTestServer(backends: { zen: string; go: string }): Promise<ServerHandle> {
  const handle = await startServer({
    host: '127.0.0.1',
    port: 0,
    apiKey: 'real-opencode-key',
    serverPassword: null,
    catalog: createGatewayModelCatalog([
      {
        id: 'claude-native',
        name: 'claude-native',
        isFree: false,
        brand: 'Other',
        sourceBackend: 'zen',
        modelFormat: 'anthropic',
      },
    ] as any),
    backends: { zen: { baseUrl: backends.zen }, go: { baseUrl: backends.go } },
  })
  handles.push(handle)
  return handle
}

describe('C4: anthropic passthrough records usage', () => {
  it('records usage parsed from the non-streaming JSON response', async () => {
    const upstream = await startJsonUpstream({
      id: 'msg_json',
      type: 'message',
      role: 'assistant',
      content: [{ type: 'text', text: 'native ok' }],
      model: 'claude-upstream-id',
      stop_reason: 'end_turn',
      usage: { input_tokens: 42, output_tokens: 17 },
    })
    handles.push(upstream)
    const server = await startTestServer({ zen: upstream.baseUrl, go: upstream.baseUrl })

    const response = await fetch(`${server.url}/anthropic/v1/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-native', messages: [{ role: 'user', content: 'hi' }] }),
    })

    expect(response.status).toBe(200)
    // The forwarded body must be untouched by usage parsing.
    expect(await response.json()).toMatchObject({ id: 'msg_json', usage: { input_tokens: 42 } })
    await vi.waitFor(() => {
      expect(recordUsageMock).toHaveBeenCalledTimes(1)
    })
    expect(recordUsageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        modelId: 'claude-native',
        npm: undefined,
        app: 'gateway',
        inputTokens: 42,
        outputTokens: 17,
      })
    )
  })

  it('records usage tee-scanned from streaming SSE without altering forwarded bytes', async () => {
    const upstream = await startSseUpstream()
    handles.push(upstream)
    const server = await startTestServer({ zen: upstream.baseUrl, go: upstream.baseUrl })

    const response = await fetch(`${server.url}/anthropic/v1/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-native',
        messages: [{ role: 'user', content: 'hi' }],
        stream: true,
      }),
    })

    expect(response.status).toBe(200)
    const text = await response.text()
    // Every forwarded event must arrive byte-identical — the scan is read-only.
    for (const expected of upstream.written) {
      expect(text).toContain(expected)
    }
    expect(text).toContain('"input_tokens":11')
    expect(text).toContain('"output_tokens":23')

    await vi.waitFor(() => {
      expect(recordUsageMock).toHaveBeenCalledTimes(1)
    })
    // input_tokens comes from message_start; output_tokens from message_delta.
    expect(recordUsageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        modelId: 'claude-native',
        inputTokens: 11,
        outputTokens: 23,
      })
    )
  })
})
