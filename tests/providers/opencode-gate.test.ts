import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  OPENCODE_GATE_CLIENT,
  OPENCODE_GATE_SESSION_TTL_MS,
  OPENCODE_GATE_USER_AGENT,
  aggregateOpenCodeSseStream,
  applyOpenCodeZenHeaders,
  bufferOpenCodeSseResponse,
  createOpenCodeSessionId,
  ensureOpenCodeGateTools,
  getOpenCodeSessionId,
  isChatCompletionsUrl,
  isValidOpenCodeSessionId,
  isOpenCodeZenUrl,
  makeOpenCodeZenFetch,
  resetOpenCodeSessionCache,
  shapeOpenCodeZenChatBody,
} from '../../src/providers/opencode-gate.js'

const SESSION_ID_PATTERN = /^ses_[0-9a-f]{12}[0-9A-Za-z]{14}$/
const SESSION_MASK = 0xffffffffffffn

function decodeSessionHex(id: string): bigint {
  return ~BigInt(`0x${id.slice(4, 16)}`) & SESSION_MASK
}

function sseResponse(chunks: string[], contentType = 'text/event-stream'): Response {
  return new Response(chunks.join('\n'), {
    status: 200,
    headers: { 'content-type': contentType },
  })
}

const CONTENT_SSE = [
  'data: {"id":"chatcmpl-1","created":1700000000,"model":"glm-5.2","choices":[{"index":0,"delta":{"role":"assistant","content":"Hel"}}]}',
  'data: {"id":"chatcmpl-1","created":1700000000,"model":"glm-5.2","choices":[{"index":0,"delta":{"content":"lo"},"finish_reason":"stop"}]}',
  'data: {"id":"chatcmpl-1","created":1700000000,"model":"glm-5.2","choices":[],"usage":{"prompt_tokens":3,"completion_tokens":2,"total_tokens":5}}',
  'data: [DONE]',
  '',
].join('\n')

const TOOL_SSE = [
  'data: {"id":"chatcmpl-2","created":1700000001,"model":"glm-5.2","choices":[{"index":0,"delta":{"role":"assistant","reasoning_content":"Need a tool."}}]}',
  'data: {"id":"chatcmpl-2","created":1700000001,"model":"glm-5.2","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"id":"call_abc","type":"function","function":{"name":"bash","arguments":"{\\"cm"}}]}}]}',
  'data: {"id":"chatcmpl-2","created":1700000001,"model":"glm-5.2","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"d\\":\\"ls\\"}"}}]},"finish_reason":"tool_calls"}]}',
  'data: [DONE]',
  '',
].join('\n')

beforeEach(() => {
  resetOpenCodeSessionCache()
})

describe('createOpenCodeSessionId', () => {
  it('produces a 30-char ses_ id with a 12-hex timestamp and 14-char suffix', () => {
    const id = createOpenCodeSessionId()
    expect(id).toMatch(SESSION_ID_PATTERN)
    expect(id).toHaveLength(30)
    expect(isValidOpenCodeSessionId(id)).toBe(true)
  })

  it('encodes the inverted descending timestamp as spec requires', () => {
    const nowMs = 1750000000000
    const counter = 0xabc
    const id = createOpenCodeSessionId(nowMs, counter)

    // raw = (nowMs * 0x1000 + counter) & mask; hex = ~raw & mask
    const raw = (BigInt(nowMs) * 0x1000n + BigInt(counter)) & SESSION_MASK
    const expectedHex = (~raw & SESSION_MASK).toString(16).padStart(12, '0')
    expect(id.slice(4, 16)).toBe(expectedHex)

    // Decoding via bitwise NOT must recover (timestampMs * 0x1000 + counter)
    // truncated to the 48-bit space (a realistic ms timestamp overflows it, so
    // the recoverable timestamp is the input modulo 2^36).
    expect(decodeSessionHex(id)).toBe(raw)
    expect(decodeSessionHex(id) >> 12n).toBe(BigInt(nowMs) % (1n << 36n))
    expect(decodeSessionHex(id) & 0xfffn).toBe(BigInt(counter))
  })

  it('round-trips timestamp and counter exactly when the product fits 48 bits', () => {
    const nowMs = 1_700_000_000
    const counter = 0xabc
    const id = createOpenCodeSessionId(nowMs, counter)
    expect(BigInt(nowMs) * 0x1000n + BigInt(counter)).toBeLessThan(1n << 48n)

    const decoded = decodeSessionHex(id)
    expect(decoded).toBe(BigInt(nowMs) * 0x1000n + BigInt(counter))
    expect(decoded >> 12n).toBe(BigInt(nowMs))
    expect(decoded & 0xfffn).toBe(BigInt(counter))
  })

  it('advances the internal counter for back-to-back ids without an explicit counter', () => {
    const nowMs = 1750000000000
    const first = createOpenCodeSessionId(nowMs)
    const second = createOpenCodeSessionId(nowMs)
    const firstRaw = ~BigInt(`0x${first.slice(4, 16)}`) & SESSION_MASK
    const secondRaw = ~BigInt(`0x${second.slice(4, 16)}`) & SESSION_MASK
    expect(secondRaw).toBe(firstRaw + 1n)
  })

  it('orders later timestamps as smaller hex fields (descending ids)', () => {
    const earlier = createOpenCodeSessionId(1_700_000_000, 0)
    const later = createOpenCodeSessionId(1_700_000_100, 0)
    // Same-length lowercase hex fields: string order equals numeric order.
    expect(later.slice(4, 16) < earlier.slice(4, 16)).toBe(true)
    // The ENCODED field descends; decoding via bitwise NOT recovers the
    // ascending raw `(nowMs * 0x1000 + counter)` value.
    expect(decodeSessionHex(later)).toBeGreaterThan(decodeSessionHex(earlier))
    expect(decodeSessionHex(earlier) >> 12n).toBe(1_700_000_000n)
    expect(decodeSessionHex(later) >> 12n).toBe(1_700_000_100n)
  })
})

describe('getOpenCodeSessionId', () => {
  it('reuses the cached id for 10 minutes and rotates after the TTL', () => {
    const first = getOpenCodeSessionId(1_000_000)
    expect(getOpenCodeSessionId(1_000_000 + OPENCODE_GATE_SESSION_TTL_MS - 1)).toBe(first)

    const rotated = getOpenCodeSessionId(1_000_000 + OPENCODE_GATE_SESSION_TTL_MS + 60_000)
    expect(rotated).not.toBe(first)
    expect(rotated).toMatch(SESSION_ID_PATTERN)

    expect(getOpenCodeSessionId(1_000_000 + OPENCODE_GATE_SESSION_TTL_MS + 60_001)).toBe(rotated)
  })
})

describe('isValidOpenCodeSessionId', () => {
  it('rejects malformed ids', () => {
    expect(isValidOpenCodeSessionId('ses_short')).toBe(false)
    expect(isValidOpenCodeSessionId('ses_ABCDEF123456' + 'a'.repeat(14))).toBe(false)
    expect(isValidOpenCodeSessionId('' as string)).toBe(false)
    expect(isValidOpenCodeSessionId(null)).toBe(false)
    expect(isValidOpenCodeSessionId(undefined)).toBe(false)
    expect(isValidOpenCodeSessionId('ses_0123456789ab!' + 'a'.repeat(14))).toBe(false)
  })
})

describe('isOpenCodeZenUrl', () => {
  it('matches every opencode.ai host used by Zen, Go, and the inference proxy', () => {
    expect(isOpenCodeZenUrl('https://opencode.ai/zen/v1')).toBe(true)
    expect(isOpenCodeZenUrl('https://opencode.ai/zen/v1/chat/completions')).toBe(true)
    expect(isOpenCodeZenUrl('https://opencode.ai/zen/go/v1')).toBe(true)
    expect(isOpenCodeZenUrl('https://opencode.ai/inference/google/v1beta')).toBe(true)
  })

  it('rejects other hosts, lookalikes, and invalid URLs', () => {
    expect(isOpenCodeZenUrl('https://api.openai.com/v1')).toBe(false)
    expect(isOpenCodeZenUrl('https://notopencode.ai/zen/v1')).toBe(false)
    expect(isOpenCodeZenUrl('https://opencode.ai.evil.example/zen/v1')).toBe(false)
    expect(isOpenCodeZenUrl('not a url')).toBe(false)
  })
})

describe('isChatCompletionsUrl', () => {
  it('detects chat-completions endpoints with or without trailing slashes', () => {
    expect(isChatCompletionsUrl('https://opencode.ai/zen/v1/chat/completions')).toBe(true)
    expect(isChatCompletionsUrl('https://opencode.ai/zen/go/v1/chat/completions/')).toBe(true)
    expect(isChatCompletionsUrl('https://opencode.ai/zen/v1/messages')).toBe(false)
    expect(isChatCompletionsUrl('https://opencode.ai/zen/v1/chat')).toBe(false)
  })
})

describe('applyOpenCodeZenHeaders', () => {
  it('pins identity headers and defaults anonymous auth to Bearer public', () => {
    const headers = new Headers({ 'user-agent': 'undici/6.0', authorization: 'Bearer ' })
    applyOpenCodeZenHeaders(headers)

    expect(headers.get('user-agent')).toBe(OPENCODE_GATE_USER_AGENT)
    expect(headers.get('x-opencode-client')).toBe(OPENCODE_GATE_CLIENT)
    expect(headers.get('x-opencode-session')).toMatch(SESSION_ID_PATTERN)
    expect(headers.get('authorization')).toBe('Bearer public')
  })

  it('uses the configured API key when present', () => {
    const headers = new Headers()
    applyOpenCodeZenHeaders(headers, { apiKey: 'sk-zen-123' })
    expect(headers.get('authorization')).toBe('Bearer sk-zen-123')
  })

  it('keeps an existing non-empty authorization when no key is configured', () => {
    const headers = new Headers({ authorization: 'Bearer sk-existing' })
    applyOpenCodeZenHeaders(headers)
    expect(headers.get('authorization')).toBe('Bearer sk-existing')
  })

  it('preserves valid inbound session ids and replaces malformed ones', () => {
    const valid = createOpenCodeSessionId(1750000000000, 1)
    const headers = new Headers({ 'x-opencode-session': valid })
    applyOpenCodeZenHeaders(headers)
    expect(headers.get('x-opencode-session')).toBe(valid)

    const invalid = new Headers({ 'x-opencode-session': 'ses_bogus' })
    applyOpenCodeZenHeaders(invalid)
    const replaced = invalid.get('x-opencode-session')
    expect(replaced).not.toBe('ses_bogus')
    expect(replaced).toMatch(SESSION_ID_PATTERN)

    const record: Record<string, string> = { 'X-Opencode-Session': valid }
    applyOpenCodeZenHeaders(record, { sessionId: valid })
    expect(record['x-opencode-session']).toBe(valid)
  })

  it('works on plain header records and removes case-variant duplicates', () => {
    const record: Record<string, string> = {
      'User-Agent': 'node',
      'X-Opencode-Client': 'stale',
    }
    applyOpenCodeZenHeaders(record, { apiKey: 'sk-1' })
    expect(record['User-Agent']).toBeUndefined()
    expect(record['X-Opencode-Client']).toBeUndefined()
    expect(record['user-agent']).toBe(OPENCODE_GATE_USER_AGENT)
    expect(record['x-opencode-client']).toBe(OPENCODE_GATE_CLIENT)
    expect(record['authorization']).toBe('Bearer sk-1')
  })
})

describe('ensureOpenCodeGateTools', () => {
  it('drops _noop dummies and appends missing gate tools', () => {
    const tools = ensureOpenCodeGateTools([
      { type: 'function', function: { name: '_noop' } },
      { type: 'function', function: { name: 'grep' } },
    ])
    const names = tools.map(t => (t as { function: { name: string } }).function.name)
    expect(names).toEqual(['grep', 'bash', 'read'])
  })

  it('does not duplicate existing bash/read tools', () => {
    const tools = ensureOpenCodeGateTools([
      { type: 'function', function: { name: 'bash' } },
      { type: 'function', function: { name: 'read' } },
    ])
    expect(tools).toHaveLength(2)
  })

  it('creates the gate tools when tools is absent or malformed', () => {
    for (const input of [undefined, null, 'nope', 42, {}]) {
      const tools = ensureOpenCodeGateTools(input)
      const names = tools.map(t => (t as { function: { name: string } }).function.name)
      expect(names).toEqual(['bash', 'read'])
    }
  })
})

describe('shapeOpenCodeZenChatBody', () => {
  it('forces stream:true and reports buffering when the caller wanted JSON', () => {
    const { body, buffered } = shapeOpenCodeZenChatBody({
      model: 'glm-5.2',
      messages: [{ role: 'user', content: 'hi' }],
      stream: false,
    })
    expect(buffered).toBe(true)
    expect(body.stream).toBe(true)
    const names = (body.tools as Array<{ function: { name: string } }>).map(t => t.function.name)
    expect(names).toEqual(['bash', 'read'])
  })

  it('treats a missing stream flag as buffered JSON', () => {
    const { body, buffered } = shapeOpenCodeZenChatBody({ model: 'm' })
    expect(buffered).toBe(true)
    expect(body.stream).toBe(true)
  })

  it('keeps streaming untouched when the caller already streams and preserves client tools', () => {
    const clientTool = { type: 'function', function: { name: 'str_replace_editor' } }
    const { body, buffered } = shapeOpenCodeZenChatBody({
      model: 'm',
      stream: true,
      tools: [clientTool, { type: 'function', function: { name: '_noop' } }],
    })
    expect(buffered).toBe(false)
    expect(body.stream).toBe(true)
    const names = (body.tools as Array<{ function: { name: string } }>).map(t => t.function.name)
    expect(names).toEqual(['str_replace_editor', 'bash', 'read'])
  })

  it('does not mutate the caller-owned body object', () => {
    const original = { model: 'm', stream: false, tools: [] as unknown[] }
    shapeOpenCodeZenChatBody(original)
    expect(original.stream).toBe(false)
    expect(original.tools).toEqual([])
  })
})

describe('aggregateOpenCodeSseStream', () => {
  it('reassembles content deltas, finish reason, and usage into one completion', () => {
    const completion = aggregateOpenCodeSseStream(CONTENT_SSE)
    expect(completion.object).toBe('chat.completion')
    expect(completion.id).toBe('chatcmpl-1')
    expect(completion.model).toBe('glm-5.2')
    expect(completion.usage).toEqual({ prompt_tokens: 3, completion_tokens: 2, total_tokens: 5 })
    const choices = completion.choices as Array<Record<string, unknown>>
    expect(choices).toHaveLength(1)
    expect(choices[0].finish_reason).toBe('stop')
    expect((choices[0].message as Record<string, unknown>).content).toBe('Hello')
    expect((choices[0].message as Record<string, unknown>).role).toBe('assistant')
  })

  it('aggregates reasoning_content and streamed tool-call arguments', () => {
    const completion = aggregateOpenCodeSseStream(TOOL_SSE, 'glm-5.2-fallback')
    const choice = (completion.choices as Array<Record<string, unknown>>)[0]
    const message = choice.message as Record<string, unknown>
    expect(message.reasoning_content).toBe('Need a tool.')
    expect(choice.finish_reason).toBe('tool_calls')
    const toolCalls = message.tool_calls as Array<Record<string, unknown>>
    expect(toolCalls).toHaveLength(1)
    expect(toolCalls[0].id).toBe('call_abc')
    const fn = toolCalls[0].function as Record<string, unknown>
    expect(fn.name).toBe('bash')
    expect(fn.arguments).toBe('{"cmd":"ls"}')
  })

  it('ignores DONE/null keepalives and falls back gracefully on empty streams', () => {
    const completion = aggregateOpenCodeSseStream('data: [DONE]\ndata: null\n\n', 'fallback-model')
    expect(completion.object).toBe('chat.completion')
    expect(completion.model).toBe('fallback-model')
    const choices = completion.choices as Array<Record<string, unknown>>
    expect(choices).toHaveLength(1)
    expect(choices[0].finish_reason).toBe('stop')
  })
})

describe('bufferOpenCodeSseResponse', () => {
  it('converts an SSE response into a JSON chat.completion', async () => {
    const response = await bufferOpenCodeSseResponse(sseResponse(CONTENT_SSE.split('\n')), 'm')
    expect(response.headers.get('content-type')).toBe('application/json')
    expect(response.status).toBe(200)
    const body = (await response.json()) as Record<string, unknown>
    expect(body.object).toBe('chat.completion')
  })

  it('passes non-SSE responses through unchanged', async () => {
    const json = new Response('{"ok":true}', {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
    expect(await bufferOpenCodeSseResponse(json)).toBe(json)

    const err = new Response('nope', { status: 403, statusText: 'Forbidden' })
    expect(await bufferOpenCodeSseResponse(err)).toBe(err)
  })
})

describe('makeOpenCodeZenFetch', () => {
  interface FetchCall {
    input: RequestInfo | URL
    init?: RequestInit
  }

  function mockUpstream(response: () => Response): {
    fetch: typeof fetch
    calls: FetchCall[]
  } {
    const calls: FetchCall[] = []
    const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ input, init })
      return response()
    }) as typeof fetch
    return { fetch: fetchImpl, calls }
  }

  function sentBody(init?: RequestInit): string {
    return typeof init?.body === 'string' ? init.body : String(init?.body)
  }

  it('leaves non-Zen hosts untouched', async () => {
    const { fetch: upstream, calls } = mockUpstream(() => new Response('{}', { status: 200 }))
    const zenFetch = makeOpenCodeZenFetch(upstream)
    const init: RequestInit = { method: 'POST', headers: { 'user-agent': 'undici' }, body: '{}' }

    await zenFetch('https://api.openai.com/v1/chat/completions', init)
    expect(calls).toHaveLength(1)
    expect(calls[0].input).toBe('https://api.openai.com/v1/chat/completions')
    expect(new Headers(calls[0].init?.headers).get('user-agent')).toBe('undici')
    expect(calls[0].init?.body).toBe('{}')
  })

  it('shapes Zen chat-completions requests and buffers SSE replies for JSON callers', async () => {
    const { fetch: upstream, calls } = mockUpstream(() => sseResponse(CONTENT_SSE.split('\n')))
    const zenFetch = makeOpenCodeZenFetch(upstream)

    const response = await zenFetch('https://opencode.ai/zen/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'undici/6.0' },
      body: JSON.stringify({
        model: 'glm-5.2',
        stream: false,
        messages: [{ role: 'user', content: 'hi' }],
      }),
    })

    expect(calls[0].input).toBe('https://opencode.ai/zen/v1/chat/completions')
    const sentHeaders = new Headers(calls[0].init?.headers)
    expect(sentHeaders.get('user-agent')).toBe(OPENCODE_GATE_USER_AGENT)
    expect(sentHeaders.get('x-opencode-client')).toBe('cli')
    expect(sentHeaders.get('x-opencode-session')).toMatch(SESSION_ID_PATTERN)
    expect(sentHeaders.get('authorization')).toBe('Bearer public')

    const body = JSON.parse(sentBody(calls[0].init)) as Record<string, unknown>
    expect(body.stream).toBe(true)
    const toolNames = (body.tools as Array<{ function: { name: string } }>).map(
      t => t.function.name
    )
    expect(toolNames).toContain('bash')
    expect(toolNames).toContain('read')

    expect(response.headers.get('content-type')).toBe('application/json')
    const completion = (await response.json()) as Record<string, unknown>
    expect(completion.object).toBe('chat.completion')
    const choices = completion.choices as Array<Record<string, unknown>>
    expect((choices[0].message as Record<string, unknown>).content).toBe('Hello')
  })

  it('forwards the SSE stream untouched when the downstream client streams', async () => {
    const sse = sseResponse(CONTENT_SSE.split('\n'))
    const { fetch: upstream, calls } = mockUpstream(() => sse)
    const zenFetch = makeOpenCodeZenFetch(upstream)

    const response = await zenFetch('https://opencode.ai/zen/go/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer sk-zen' },
      body: JSON.stringify({ model: 'glm-5.2', stream: true, messages: [] }),
    })

    expect(response).toBe(sse)
    expect(response.headers.get('content-type')).toBe('text/event-stream')
    const body = JSON.parse(sentBody(calls[0].init)) as Record<string, unknown>
    expect(body.stream).toBe(true)
    expect(new Headers(calls[0].init?.headers).get('authorization')).toBe('Bearer sk-zen')
  })

  it('applies gate headers but no body shaping on Zen /v1/messages', async () => {
    const { fetch: upstream, calls } = mockUpstream(() => new Response('{}', { status: 200 }))
    const zenFetch = makeOpenCodeZenFetch(upstream)

    const body = JSON.stringify({ model: 'claude-sonnet-4-5', stream: false, messages: [] })
    await zenFetch('https://opencode.ai/zen/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    })

    const sentHeaders = new Headers(calls[0].init?.headers)
    expect(sentHeaders.get('user-agent')).toBe(OPENCODE_GATE_USER_AGENT)
    expect(sentHeaders.get('x-opencode-session')).toMatch(SESSION_ID_PATTERN)
    expect(calls[0].init?.body).toBe(body)
  })

  it('shapes Request-object inputs and leaves unparseable bodies untouched', async () => {
    const { fetch: upstream, calls } = mockUpstream(() => new Response('{}', { status: 200 }))
    const zenFetch = makeOpenCodeZenFetch(upstream)

    const request = new Request('https://opencode.ai/zen/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'm', stream: false }),
    })
    await zenFetch(request)
    const body = JSON.parse(sentBody(calls[0].init)) as Record<string, unknown>
    expect(body.stream).toBe(true)
    expect(body.tools).toBeDefined()

    await zenFetch('https://opencode.ai/zen/v1/chat/completions', {
      method: 'POST',
      body: '<not-json>',
    })
    expect(calls[1].init?.body).toBe('<not-json>')
  })
})
