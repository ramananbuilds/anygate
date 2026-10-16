// opencode-gate.ts — OpenCode Zen upstream compatibility shaper.
//
// OpenCode Zen (https://opencode.ai/zen and /zen/go) rejects requests that don't
// look like they came from the OpenCode CLI itself:
//
//   403 FreeTierError: OpenCode's free tier can only be used from within OpenCode
//
// The gate validates client identity on every request:
//   1. `User-Agent: opencode/<semver>` (a clean release string — no Node/undici/
//      AI-SDK suffixes).
//   2. `x-opencode-session: ses_...` — a 30-char id built with OpenCode's
//      Identifier.descending("session") algorithm (48-bit inverted timestamp +
//      random Base62 suffix). Stale timestamps are rejected, so the id is cached
//      for 10 minutes (upstream tolerates ~15) and rotated after that.
//   3. `x-opencode-client: cli`.
//   4. For free-tier inference: `body.tools` must contain the agent gate tools
//      `bash` and `read`, and the request must stream (`stream: true`).
//
// This module implements the full request/response shaping contract so every
// outbound Zen request from anygate passes the gate:
//   - applyOpenCodeZenHeaders()   — identity/auth headers (+ `Bearer public`
//                                   fallback when no key is configured).
//   - shapeOpenCodeZenChatBody()  — gate tools + forced upstream streaming.
//   - bufferOpenCodeSseResponse() — reassembles the forced SSE stream into a
//                                   non-streaming `chat.completion` JSON body
//                                   for downstream clients that asked for JSON.
//   - makeOpenCodeZenFetch()      — drop-in fetch wrapper applying all of the
//                                   above; a no-op for non-Zen URLs.

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const SESSION_ID_MASK = 0xffffffffffffn // 48 bits
const SESSION_COUNTER_MASK = 0xfffn // low 12 bits of the descending value
const SESSION_RANDOM_CHARS = 14
const SESSION_HEX_CHARS = 12
const SESSION_PREFIX = 'ses_'
const SESSION_ID_PATTERN = /^ses_[0-9a-f]{12}[0-9A-Za-z]{14}$/

/** Clean OpenCode release string the Zen gate accepts (no Node/undici suffix). */
export const OPENCODE_GATE_USER_AGENT = 'opencode/1.18.34'
/** Client marker the Zen gate requires. */
export const OPENCODE_GATE_CLIENT = 'cli'
/** Session ids are reused for 10 minutes; upstream rejects timestamps older than ~15. */
export const OPENCODE_GATE_SESSION_TTL_MS = 10 * 60 * 1000
/** Gate tool names free-tier Zen inference requires in `body.tools`. */
export const OPENCODE_GATE_TOOL_NAMES = ['bash', 'read'] as const

let sessionCounter = 0
let cachedSession: { id: string; createdAt: number } | null = null

/**
 * Create one `ses_...` id following OpenCode's Identifier.descending("session")
 * algorithm:
 *   - `ses_` prefix;
 *   - 12 lowercase hex chars: 48-bit bitwise NOT of `(nowMs * 0x1000 + counter)`;
 *   - 14 random Base62 chars (session affinity suffix).
 * Total length: 30 chars.
 *
 * `nowMs`/`counter` are injectable for deterministic tests only.
 */
export function createOpenCodeSessionId(nowMs: number = Date.now(), counter?: number): string {
  const n = (counter ?? ++sessionCounter) & Number(SESSION_COUNTER_MASK)
  const raw = (BigInt(Math.floor(nowMs)) * 0x1000n + BigInt(n)) & SESSION_ID_MASK
  const inverted = ~raw & SESSION_ID_MASK
  const hex = inverted.toString(16).padStart(SESSION_HEX_CHARS, '0')
  let suffix = ''
  for (let i = 0; i < SESSION_RANDOM_CHARS; i++) {
    suffix += BASE62[Math.floor(Math.random() * BASE62.length)]
  }
  return `${SESSION_PREFIX}${hex}${suffix}`
}

/** Cached active session id: reused for 10 minutes, rotated after that. */
export function getOpenCodeSessionId(nowMs: number = Date.now()): string {
  if (!cachedSession || nowMs - cachedSession.createdAt >= OPENCODE_GATE_SESSION_TTL_MS) {
    cachedSession = { id: createOpenCodeSessionId(nowMs), createdAt: nowMs }
  }
  return cachedSession.id
}

/** Drop the cached session id (tests, diagnostics). */
export function resetOpenCodeSessionCache(): void {
  cachedSession = null
}

/** True when `value` is a well-formed 30-char `ses_...` descending session id. */
export function isValidOpenCodeSessionId(value: string | null | undefined): value is string {
  return typeof value === 'string' && SESSION_ID_PATTERN.test(value)
}

/** True for any outbound URL pointed at opencode.ai (zen, zen/go, inference proxy). */
export function isOpenCodeZenUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return hostname === 'opencode.ai' || hostname.endsWith('.opencode.ai')
  } catch {
    return false
  }
}

/** True when the URL targets an OpenAI-style `/chat/completions` endpoint. */
export function isChatCompletionsUrl(url: string): boolean {
  try {
    return new URL(url).pathname.replace(/\/+$/, '').endsWith('/chat/completions')
  } catch {
    return false
  }
}

export interface OpenCodeGateHeaderOptions {
  /** Configured API key. Missing/empty falls back to the anonymous `public` key. */
  apiKey?: string | null
  /** Inbound session id (kept when it is already a valid `ses_...` value). */
  sessionId?: string | null
}

function readHeader(headers: Headers | Record<string, string>, name: string): string | null {
  if (headers instanceof Headers) return headers.get(name)
  const lower = name.toLowerCase()
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lower) return value
  }
  return null
}

function setHeader(headers: Headers | Record<string, string>, name: string, value: string): void {
  if (headers instanceof Headers) {
    headers.set(name, value)
    return
  }
  const lower = name.toLowerCase()
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === lower) delete headers[key]
  }
  headers[name] = value
}

/**
 * Apply the mandatory OpenCode Zen identity headers on an outbound request:
 * clean `User-Agent`, `x-opencode-session`, `x-opencode-client: cli`, and
 * `Authorization: Bearer <apiKey || "public">`. Any default Node/undici/AI-SDK
 * user-agent is overwritten. A valid inbound session id is preserved.
 */
export function applyOpenCodeZenHeaders(
  headers: Headers | Record<string, string>,
  opts: OpenCodeGateHeaderOptions = {}
): void {
  setHeader(headers, 'user-agent', OPENCODE_GATE_USER_AGENT)
  setHeader(headers, 'x-opencode-client', OPENCODE_GATE_CLIENT)

  const inboundSession = opts.sessionId ?? readHeader(headers, 'x-opencode-session')
  setHeader(
    headers,
    'x-opencode-session',
    isValidOpenCodeSessionId(inboundSession) ? inboundSession : getOpenCodeSessionId()
  )

  const key = opts.apiKey?.trim()
  if (key) {
    setHeader(headers, 'authorization', `Bearer ${key}`)
    return
  }
  // No configured key: keep an inbound credential, otherwise use the anonymous
  // `public` key. A bare/empty `Bearer` (sanitized empty keys) counts as missing.
  const existing = readHeader(headers, 'authorization')?.trim()
  const token = existing?.replace(/^bearer\b\s*/i, '').trim()
  setHeader(headers, 'authorization', `Bearer ${token || 'public'}`)
}

const GATE_TOOL_BASH = {
  type: 'function',
  function: {
    name: 'bash',
    description: 'Run a shell command in the workspace.',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The command to run.' },
      },
      required: ['command'],
    },
  },
} as const

const GATE_TOOL_READ = {
  type: 'function',
  function: {
    name: 'read',
    description: 'Read a file from the filesystem.',
    parameters: {
      type: 'object',
      properties: {
        file_path: { type: 'string', description: 'Path of the file to read.' },
      },
      required: ['file_path'],
    },
  },
} as const

function toolName(tool: unknown): string | undefined {
  if (!tool || typeof tool !== 'object') return undefined
  const t = tool as Record<string, any>
  const name = t.function?.name ?? t.name
  return typeof name === 'string' ? name : undefined
}

/**
 * Ensure `tools` is a non-empty array containing gate tools named `bash` and
 * `read` (lowercase). Existing client tools are preserved; `_noop` dummy tools
 * are dropped; missing gate tools are appended with minimal schemas.
 */
export function ensureOpenCodeGateTools(tools: unknown): unknown[] {
  const list = (Array.isArray(tools) ? [...tools] : []).filter(tool => {
    const name = toolName(tool)
    return name !== '_noop'
  })
  const names = new Set(list.map(toolName).filter((name): name is string => !!name))
  if (!names.has('bash')) list.push(GATE_TOOL_BASH)
  if (!names.has('read')) list.push(GATE_TOOL_READ)
  return list
}

export interface ShapedOpenCodeZenBody<T extends Record<string, unknown>> {
  body: T
  /** True when the caller asked for a non-streamed response (or omitted `stream`). */
  buffered: boolean
}

/**
 * Shape a chat-completions body for Zen: inject the gate tools and force
 * `stream: true` upstream (Zen rejects `stream: false` with a 403 FreeTierError).
 * `buffered` reports whether the caller originally wanted a non-streaming
 * response, so the SSE reply can be reassembled into JSON for them.
 */
export function shapeOpenCodeZenChatBody<T extends Record<string, unknown>>(
  body: T
): ShapedOpenCodeZenBody<T> {
  const buffered = (body as Record<string, unknown>).stream !== true
  const shaped: Record<string, unknown> = {
    ...body,
    stream: true,
    tools: ensureOpenCodeGateTools(body.tools),
  }
  return { body: shaped as T, buffered }
}

// ── SSE → chat.completion buffering ─────────────────────────────────────────

interface ToolCallAccumulator {
  id: string
  type: string
  name: string
  arguments: string
}

interface ChoiceAccumulator {
  role: string
  content: string
  reasoning: string
  toolCalls: Map<number, ToolCallAccumulator>
  finishReason: string | null
}

function parseSseDataLine(line: string): any | null {
  const trimmed = line.trimStart()
  if (!trimmed.startsWith('data:')) return null
  const payload = trimmed.slice(5).trim()
  if (!payload || payload === '[DONE]' || payload === 'null') return null
  try {
    return JSON.parse(payload)
  } catch {
    return null
  }
}

function appendToolCallDelta(
  acc: ChoiceAccumulator,
  delta: any,
  toolCallIds: Map<number, string>
): void {
  const deltas: any[] = Array.isArray(delta.tool_calls) ? delta.tool_calls : []
  for (const tc of deltas) {
    if (!tc || typeof tc !== 'object') continue
    const index = typeof tc.index === 'number' ? tc.index : acc.toolCalls.size
    let entry = acc.toolCalls.get(index)
    if (!entry) {
      entry = { id: '', type: 'function', name: '', arguments: '' }
      acc.toolCalls.set(index, entry)
    }
    if (typeof tc.id === 'string' && tc.id) entry.id = tc.id
    if (!entry.id) {
      let stable = toolCallIds.get(index)
      if (!stable) {
        stable = `call_${index}_${Math.random().toString(36).slice(2, 10)}`
        toolCallIds.set(index, stable)
      }
      entry.id = stable
    }
    if (typeof tc.type === 'string' && tc.type) entry.type = tc.type
    if (typeof tc.function?.name === 'string' && tc.function.name) entry.name = tc.function.name
    if (typeof tc.function?.arguments === 'string') entry.arguments += tc.function.arguments
  }
}

/**
 * Aggregate an OpenAI-style `text/event-stream` chat-completions stream into one
 * non-streaming `chat.completion` object (content, reasoning_content, tool_calls,
 * finish_reason, usage).
 */
export function aggregateOpenCodeSseStream(
  sseText: string,
  fallbackModel?: string
): Record<string, unknown> {
  const choices = new Map<number, ChoiceAccumulator>()
  const toolCallIds = new Map<number, string>()
  let id: string | undefined
  let created: number | undefined
  let model: string | undefined
  let usage: Record<string, unknown> | undefined

  for (const line of sseText.split('\n')) {
    const chunk = parseSseDataLine(line)
    if (!chunk || typeof chunk !== 'object') continue

    if (typeof chunk.id === 'string' && !id) id = chunk.id
    if (typeof chunk.created === 'number' && created === undefined) created = chunk.created
    if (typeof chunk.model === 'string' && !model) model = chunk.model
    if (chunk.usage && typeof chunk.usage === 'object') usage = chunk.usage

    const chunkChoices: any[] = Array.isArray(chunk.choices) ? chunk.choices : []
    for (const choice of chunkChoices) {
      if (!choice || typeof choice !== 'object') continue
      const index = typeof choice.index === 'number' ? choice.index : 0
      let acc = choices.get(index)
      if (!acc) {
        acc = {
          role: 'assistant',
          content: '',
          reasoning: '',
          toolCalls: new Map(),
          finishReason: null,
        }
        choices.set(index, acc)
      }
      const delta = choice.delta ?? choice.message
      if (delta && typeof delta === 'object') {
        if (typeof delta.role === 'string' && delta.role) acc.role = delta.role
        if (typeof delta.content === 'string') acc.content += delta.content
        if (typeof delta.reasoning_content === 'string') acc.reasoning += delta.reasoning_content
        appendToolCallDelta(acc, delta, toolCallIds)
      }
      if (typeof choice.finish_reason === 'string' && choice.finish_reason) {
        acc.finishReason = choice.finish_reason
      }
    }
  }

  const aggregatedChoices = [...choices.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([index, acc]) => {
      const toolCalls = [...acc.toolCalls.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([tcIndex, tc]) => ({
          index: tcIndex,
          id: tc.id,
          type: tc.type || 'function',
          function: { name: tc.name, arguments: tc.arguments },
        }))
      return {
        index,
        message: {
          role: acc.role,
          content: acc.content.length > 0 ? acc.content : null,
          ...(acc.reasoning ? { reasoning_content: acc.reasoning } : {}),
          ...(toolCalls.length > 0 ? { tool_calls: toolCalls } : {}),
        },
        finish_reason: acc.finishReason ?? 'stop',
      }
    })

  return {
    id: id ?? `chatcmpl-${Math.random().toString(36).slice(2, 12)}`,
    object: 'chat.completion',
    created: created ?? Math.floor(Date.now() / 1000),
    model: model ?? fallbackModel ?? '',
    choices:
      aggregatedChoices.length > 0
        ? aggregatedChoices
        : [
            {
              index: 0,
              message: { role: 'assistant', content: null },
              finish_reason: 'stop',
            },
          ],
    usage: usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  }
}

/**
 * Convert a forced-streaming SSE reply back into a plain JSON response for a
 * downstream client that requested `stream: false`. Non-SSE responses pass
 * through untouched (errors and already-aggregated JSON bodies).
 */
export async function bufferOpenCodeSseResponse(
  resp: Response,
  fallbackModel?: string
): Promise<Response> {
  const contentType = resp.headers.get('content-type') ?? ''
  if (!resp.body || !contentType.includes('text/event-stream')) return resp
  const text = await resp.text()
  const completion = aggregateOpenCodeSseStream(text, fallbackModel)
  return new Response(JSON.stringify(completion), {
    status: resp.status,
    statusText: resp.statusText,
    headers: { 'content-type': 'application/json' },
  })
}

// ── Fetch wrapper ───────────────────────────────────────────────────────────

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return (input as Request).url
}

/**
 * Wrap an upstream fetch so every request to opencode.ai is gated: identity
 * headers are pinned, chat-completions bodies are shaped (tools + `stream:
 * true`), and forced SSE replies are buffered back into JSON when the caller
 * originally asked for a non-streaming response. A no-op for other hosts.
 */
export function makeOpenCodeZenFetch(upstream: typeof fetch = fetch): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = requestUrl(input)
    if (!isOpenCodeZenUrl(url)) return upstream(input, init)

    const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
    const headers = new Headers(input instanceof Request ? input.headers : undefined)
    if (init?.headers) {
      new Headers(init.headers as HeadersInit).forEach((value, key) => headers.set(key, value))
    }
    applyOpenCodeZenHeaders(headers)

    let body = init?.body
    let buffered = false
    if (method === 'POST' && isChatCompletionsUrl(url)) {
      let bodyText: string | undefined
      if (typeof body === 'string') {
        bodyText = body
      } else if (body === undefined && input instanceof Request && input.body) {
        bodyText = await input.clone().text()
      }
      if (bodyText !== undefined) {
        try {
          const parsed = JSON.parse(bodyText)
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            const shaped = shapeOpenCodeZenChatBody(parsed)
            buffered = shaped.buffered
            body = JSON.stringify(shaped.body)
          }
        } catch {
          // Unparseable body — forward untouched; the gate will reject it cleanly.
        }
      }
    }

    // A Request input that still carries its own body can't be combined with an
    // explicit `init.body` (the Request constructor throws a TypeError), so the
    // outbound call targets the URL and carries over the Request's own signal.
    const target: RequestInfo | URL = input instanceof Request ? input.url : input
    const signal = init?.signal ?? (input instanceof Request ? input.signal : undefined)
    const response = await upstream(target, { ...init, method, headers, body, signal })
    if (buffered) return bufferOpenCodeSseResponse(response)
    return response
  }) as typeof fetch
}
