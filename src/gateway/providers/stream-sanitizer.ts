// Normalizes non-OpenAI-spec-compliant upstream model streams at the `fetch`
// boundary — BEFORE the Vercel AI SDK parses them. The SDK validates every
// streamed SSE `chat.completion.chunk` frame against a strict Zod schema and
// throws on the first violation, aborting the entire response. That is why
// clients such as Claude Code / Kilo Code fail mid-stream.
//
// Two violations are common from reseller/multi-provider gateways (e.g. GLM-5.2
// served behind a Mistral-compatible endpoint):
//
//   1. `delta.content` is a structured array of `{type:"thinking"|"text",...}`
//      blocks instead of a plain string. The SDK throws
//      "Invalid input: expected string, received array".
//   2. `delta.tool_calls[]` omits the required `id` field (and sometimes
//      `function.arguments`). The SDK throws
//      "Invalid input: expected string, received undefined" for `id`.
//
// This module flattens `content` arrays into a string (text blocks) plus a
// sibling `reasoning_content` (thinking blocks, so they surface as reasoning),
// and injects a stable synthetic `id` into tool-call deltas that lack one.
// Normalization is permissive: well-formed chunks pass through unchanged.

/**
 * Removes non-compliant `data: null` SSE keepalive lines from an event stream.
 * Some OpenAI-compatible reseller gateways interleave `data: null` lines between
 * valid chunks; the AI SDK's strict chunk validation throws on them
 * (`Type validation failed: Value: null`), aborting the whole stream. This is
 * exported so the existing OpenAI-compatible wiring can keep using it.
 */
export function createNullChunkStripper(): TransformStream<Uint8Array, Uint8Array> {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''
  const isNullDataLine = (line: string): boolean => {
    const trimmed = line.trimStart()
    if (!trimmed.startsWith('data:')) return false
    return trimmed.slice(5).trim() === 'null'
  }
  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true })
      const newlineIdx = buffer.lastIndexOf('\n')
      if (newlineIdx === -1) return
      const complete = buffer.slice(0, newlineIdx + 1)
      buffer = buffer.slice(newlineIdx + 1)
      const kept = complete
        .split('\n')
        .filter(line => !isNullDataLine(line))
        .join('\n')
      if (kept) controller.enqueue(encoder.encode(kept))
    },
    flush(controller) {
      const tail = buffer + decoder.decode()
      if (tail && !isNullDataLine(tail)) controller.enqueue(encoder.encode(tail))
    },
  })
}

interface TextReasoning {
  text: string
  reasoning: string
}

/** Flattens an array (or singleton) of structured content blocks into plain text + reasoning. */
function flattenContent(content: unknown): TextReasoning {
  const text: string[] = []
  const reasoning: string[] = []
  const blocks = Array.isArray(content) ? content : [content]
  for (const block of blocks) {
    if (block == null) continue
    if (typeof block === 'string') {
      text.push(block)
      continue
    }
    if (typeof block !== 'object') {
      text.push(String(block))
      continue
    }
    const b = block as Record<string, any>
    const isReasoning = b.type === 'thinking' || b.type === 'reasoning' || b.thinking != null
    if (isReasoning) {
      const t = b.thinking
      if (Array.isArray(t)) {
        for (const item of t) {
          if (typeof item === 'string') reasoning.push(item)
          else if (item && typeof item.text === 'string') reasoning.push(item.text)
        }
      } else if (typeof t === 'string') {
        reasoning.push(t)
      }
      if (typeof b.text === 'string') reasoning.push(b.text)
    } else if (typeof b.text === 'string') {
      text.push(b.text)
    } else if (typeof b.content === 'string') {
      text.push(b.content)
    }
  }
  return { text: text.join(''), reasoning: reasoning.join('') }
}

/**
 * Normalizes a single `delta` or `message` part in place:
 *  - array `content` → string `content` (+ `reasoning_content` for thinking blocks)
 *  - `tool_calls[]` missing `id` → stable synthetic id (tracked via `idMap`)
 *  - `tool_calls[].function` missing `name`/`arguments` → empty-string defaults
 */
function normalizePart(part: Record<string, any> | null | undefined, idMap: Map<number, string>, preserveThinking = false): void {
  if (!part || typeof part !== 'object') return

  if (Array.isArray(part.content) && !preserveThinking) {
    const { text, reasoning } = flattenContent(part.content)
    part.content = text
    if (reasoning) {
      part.reasoning_content =
        (typeof part.reasoning_content === 'string' ? part.reasoning_content : '') + reasoning
    }
  }

  if (Array.isArray(part.tool_calls)) {
    part.tool_calls.forEach((tc: Record<string, any>, i: number) => {
      if (!tc || typeof tc !== 'object') return
      const tcIdx = typeof tc.index === 'number' ? tc.index : i
      if (typeof tc.id !== 'string' || tc.id === '') {
        let existing = idMap.get(tcIdx)
        if (!existing) {
          existing = `call_${tcIdx}_${Math.random().toString(36).slice(2, 10)}`
          idMap.set(tcIdx, existing)
        }
        tc.id = existing
      }
      if (!tc.function || typeof tc.function !== 'object') tc.function = {}
      if (typeof tc.function.name !== 'string') tc.function.name = ''
      if (typeof tc.function.arguments !== 'string') tc.function.arguments = ''
    })
  }
}

/**
 * Normalizes a full chunk (or non-streamed chat completion) object in place.
 * `ids` is a stream-scoped map of `choiceIndex → (toolCallIndex → synthetic id)`
 * so a single streamed tool call keeps one stable id across chunks.
 */
function normalizeChunk(raw: any, ids: Map<number, Map<number, string>>, preserveThinking = false): any {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.choices)) return raw
  for (const choice of raw.choices) {
    if (!choice || typeof choice !== 'object') continue
    const choiceIdx = typeof choice.index === 'number' ? choice.index : 0
    let idMap = ids.get(choiceIdx)
    if (!idMap) {
      idMap = new Map<number, string>()
      ids.set(choiceIdx, idMap)
    }
    normalizePart(choice.delta, idMap, preserveThinking)
    normalizePart(choice.message, idMap, preserveThinking)
  }
  return raw
}

/**
 * A line-buffered SSE TransformStream that normalizes each `data: {...}` frame.
 * Non-`data:` lines (event/id/comment/blank) and unparseable `data:` lines pass
 * through untouched. `data: [DONE]` and `data: null` are preserved.
 */
export function createGlmChunkSanitizer(preserveThinking = false): TransformStream<Uint8Array, Uint8Array> {
  const dec = new TextDecoder()
  const enc = new TextEncoder()
  let buffer = ''
  const ids = new Map<number, Map<number, string>>()

  const normalizeLine = (line: string): string => {
    if (!line.startsWith('data:')) return line
    const payload = line.slice(5).replace(/^\s+/, '')
    if (payload === '' || payload === '[DONE]' || payload === 'null') return line
    try {
      const parsed = JSON.parse(payload)
      if (parsed && typeof parsed === 'object') {
        return `data: ${JSON.stringify(normalizeChunk(parsed, ids, preserveThinking))}`
      }
    } catch {
      // Not JSON (or already-tolerated shape) — pass through unchanged.
    }
    return line
  }

  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += dec.decode(chunk, { stream: true })
      let nl: number
      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl)
        buffer = buffer.slice(nl + 1)
        controller.enqueue(enc.encode(normalizeLine(line) + '\n'))
      }
    },
    flush(controller) {
      const tail = buffer + dec.decode()
      if (tail.length > 0) controller.enqueue(enc.encode(normalizeLine(tail)))
    },
  })
}

/** Normalizes a single (non-streamed) JSON chat-completion response body. */
export async function sanitizeJsonResponse(resp: Response, preserveThinking = false): Promise<Response> {
  const text = await resp.clone().text()
  try {
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === 'object') {
      const fixed = normalizeChunk(parsed, new Map(), preserveThinking)
      return new Response(JSON.stringify(fixed), {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      })
    }
  } catch {
    // Return the original response unchanged if it isn't the shape we expect.
  }
  return resp
}

/**
 * Wraps an upstream `fetch` so that streamed (text/event-stream) and JSON
 * (application/json) model responses are normalized before the AI SDK parses
 * them. Well-formed responses are unaffected.
 */
export function makeSanitizingFetch(upstream: typeof fetch = fetch, preserveThinking = false): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const resp = await upstream(input, init)
    const contentType = resp.headers.get('content-type') ?? ''
    if (resp.body && contentType.includes('text/event-stream')) {
      const sanitized = resp.body
        .pipeThrough(createNullChunkStripper())
        .pipeThrough(createGlmChunkSanitizer(preserveThinking))
      return new Response(sanitized, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      })
    }
    if (resp.body && contentType.includes('application/json')) {
      return sanitizeJsonResponse(resp)
    }
    return resp
  }) as typeof fetch
}
