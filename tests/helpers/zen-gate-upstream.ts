// Strict mock of the OpenCode Zen free-tier upstream gate, shared by the
// gateway router smoke test and the UI Model Tester regression test. Traffic
// that doesn't carry CLI identity headers — and, on chat completions, the gate
// tools plus forced streaming — is rejected with 403 FreeTierError, so a 200
// from this mock is evidence that the gate shaping actually happened.
import { vi } from 'vitest'
import {
  OPENCODE_GATE_CLIENT,
  OPENCODE_GATE_USER_AGENT,
  isChatCompletionsUrl,
} from '../../src/providers/opencode-gate.js'

export const ZEN_BASE = 'https://opencode.ai/zen'
export const SESSION_ID_PATTERN = /^ses_[0-9a-f]{12}[0-9A-Za-z]{14}$/
const SESSION_MASK = 0xffffffffffffn
const MOD_2_36 = 2 ** 36
/** Upstream tolerates ~15 minutes of session-id staleness before rejecting. */
const STALE_SESSION_MS = 15 * 60 * 1000

export interface ZenUpstreamCall {
  url: string
  method: string
  headers: Headers
  body: Record<string, any>
}

export interface ZenUpstream {
  calls: ZenUpstreamCall[]
  stub: ReturnType<typeof vi.fn>
}

/** Same decode as the unit suite: the 48-bit space holds `nowMs mod 2^36`. */
export function decodeSessionTimestampMs(id: string): number {
  const raw = ~BigInt(`0x${id.slice(4, 16)}`) & SESSION_MASK
  return Number(raw >> 12n)
}

/** Freshness of a session id in ms — how far its timestamp is from now. */
export function sessionAgeMs(id: string): number {
  return Math.abs(decodeSessionTimestampMs(id) - (Date.now() % MOD_2_36))
}

export function zenToolNames(body: Record<string, any>): string[] {
  return Array.isArray(body.tools)
    ? body.tools.map((tool: any) => tool?.function?.name ?? tool?.name).filter(Boolean)
    : []
}

export function freeTierError(): Response {
  return new Response(
    JSON.stringify({
      error: {
        type: 'FreeTierError',
        message: "OpenCode's free tier can only be used from within OpenCode",
      },
    }),
    { status: 403, headers: { 'content-type': 'application/json' } }
  )
}

/** OpenAI-style SSE chat-completions reply. */
export function zenSseResponse(model = 'big-pickle', chunks: string[] = ['pick', 'le']): Response {
  const events = [
    `data: ${JSON.stringify({ id: 'chatcmpl-zen-1', created: 1700000000, model, choices: [{ index: 0, delta: { role: 'assistant', content: chunks[0] } }] })}`,
    `data: ${JSON.stringify({ id: 'chatcmpl-zen-1', created: 1700000000, model, choices: [{ index: 0, delta: { content: chunks.slice(1).join('') }, finish_reason: 'stop' }] })}`,
    'data: {"id":"chatcmpl-zen-1","created":1700000000,"choices":[],"usage":{"prompt_tokens":7,"completion_tokens":2,"total_tokens":9}}',
    'data: [DONE]',
    '',
  ].join('\n')
  return new Response(events, { status: 200, headers: { 'content-type': 'text/event-stream' } })
}

/** Anthropic-style SSE reply for the /v1/messages passthrough. */
export function anthropicSseResponse(text = 'pong'): Response {
  const events = [
    `data: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text } })}`,
    'data: {"type":"message_stop"}',
    '',
  ].join('\n')
  return new Response(events, { status: 200, headers: { 'content-type': 'text/event-stream' } })
}

export interface ZenReplyOptions {
  /** Chat-completions SSE deltas (joined to form the reply text). */
  chatChunks?: string[]
  /** /v1/messages SSE text delta. */
  messagesText?: string
}

/** Mirrors the real free-tier gate: anything not shaped like OpenCode CLI traffic gets a 403. */
export function evaluateZenCall(
  call: ZenUpstreamCall,
  expectedAuth: string,
  reply: ZenReplyOptions = {}
): Response {
  const { url, headers, body } = call
  if (headers.get('user-agent') !== OPENCODE_GATE_USER_AGENT) return freeTierError()
  if (headers.get('x-opencode-client') !== OPENCODE_GATE_CLIENT) return freeTierError()
  const session = headers.get('x-opencode-session') ?? ''
  if (!SESSION_ID_PATTERN.test(session)) return freeTierError()
  if (sessionAgeMs(session) > STALE_SESSION_MS) return freeTierError()
  if (headers.get('authorization') !== expectedAuth) return freeTierError()
  if (isChatCompletionsUrl(url)) {
    if (body.stream !== true) return freeTierError()
    const names = zenToolNames(body)
    if (!names.includes('bash') || !names.includes('read')) return freeTierError()
    const model = typeof body.model === 'string' ? body.model : 'big-pickle'
    return zenSseResponse(model, reply.chatChunks ?? ['pick', 'le'])
  }
  // /v1/messages: identity headers are the gate; the body passes through untouched.
  return anthropicSseResponse(reply.messagesText ?? 'pong')
}

/**
 * Stub global fetch: opencode.ai traffic hits the strict mock; everything else
 * (e.g. a test client talking to a local gateway server) passes through to the
 * real fetch captured at install time.
 */
export function installZenUpstream(expectedAuth: string, reply: ZenReplyOptions = {}): ZenUpstream {
  const calls: ZenUpstreamCall[] = []
  const realFetch = globalThis.fetch
  const stub = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (!url.startsWith('https://opencode.ai/')) return realFetch(input, init)
    const headers = new Headers(init?.headers)
    const body =
      typeof init?.body === 'string'
        ? (JSON.parse(init.body) as Record<string, any>)
        : ({} as Record<string, any>)
    const call: ZenUpstreamCall = {
      url,
      method: (init?.method ?? 'GET').toUpperCase(),
      headers,
      body,
    }
    calls.push(call)
    return evaluateZenCall(call, expectedAuth, reply)
  })
  vi.stubGlobal('fetch', stub)
  return { calls, stub }
}
