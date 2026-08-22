import { describe, it, expect } from 'vitest'
import { ReadableStream } from 'node:stream/web'
import {
  createGlmChunkSanitizer,
  createNullChunkStripper,
  makeSanitizingFetch,
  sanitizeJsonResponse,
} from '../../src/gateway/providers/stream-sanitizer.js'

/** Helper: run an SSE string through a TransformStream and collect the output. */
async function runTransform(input: string, transform: TransformStream<Uint8Array, Uint8Array>): Promise<string> {
  const enc = new TextEncoder()
  const dec = new TextDecoder()
  const reader = ReadableStream.from?.([input] as any)
    ? ReadableStream.from([input].map(s => enc.encode(s)))
    : (() => {
        const src = new ReadableStream<Uint8Array>({
          start(c) {
            c.enqueue(enc.encode(input))
            c.close()
          },
        })
        return src
      })()
  const out: string[] = []
  const outReader = reader.pipeThrough(transform).getReader()
  for (;;) {
    const { done, value } = await outReader.read()
    if (done) break
    out.push(dec.decode(value))
  }
  return out.join('')
}

/** Collect all `data:` JSON frames from an SSE string. */
function parseDataLines(sse: string): any[] {
  return sse
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('data:'))
    .map(l => l.slice(5).trim())
    .filter(p => p && p !== '[DONE]')
    .map(p => JSON.parse(p))
}

/** Build a normalized SSE chunk frame for the given delta object. */
function sseFrame(delta: Record<string, any>, finishReason: string | null = null): string {
  const chunk = {
    id: 'test-chunk',
    object: 'chat.completion.chunk',
    model: 'glm-5-2',
    choices: [{ index: 0, delta, finish_reason: finishReason }],
  }
  return `data: ${JSON.stringify(chunk)}\n\n`
}

describe('createGlmChunkSanitizer', () => {
  it('flattens array content with thinking into string content + reasoning_content', async () => {
    const input =
      'data: {"id":"fc5","object":"chat.completion.chunk","created":1,"model":"glm-5-2","choices":[{"index":0,"delta":{"index":0,"content":[{"type":"thinking","thinking":[{"type":"text","text":"The"}],"closed":true}]},"finish_reason":null,"logprobs":null}]}\n\n'
    const out = await runTransform(input, createGlmChunkSanitizer())
    const frames = parseDataLines(out)
    expect(frames).toHaveLength(1)
    const delta = frames[0].choices[0].delta
    // thinking block removed from content
    expect(delta.content).toBe('')
    // and surfaced as reasoning_content
    expect(delta.reasoning_content).toBe('The')
  })

  it('preserves thinking content array when preserveThinking=true', async () => {
    const input = sseFrame({
      content: [
        { type: 'thinking', thinking: [{ type: 'text', text: 'The' }], closed: true },
      ],
    })
    const out = await runTransform(input, createGlmChunkSanitizer(true))
    const frames = parseDataLines(out)
    expect(frames).toHaveLength(1)
    const delta = frames[0].choices[0].delta
    // Content array preserved intact — NOT flattened to reasoning_content
    expect(Array.isArray(delta.content)).toBe(true)
    expect(delta.content[0].type).toBe('thinking')
    expect(delta.reasoning_content).toBeUndefined()
  })

  it('flattens text blocks inside array content into a plain string', async () => {
    const input =
      'data: {"id":"x","model":"glm","choices":[{"index":0,"delta":{"content":[{"type":"text","text":"hello "},{"type":"text","text":"world"}]}}]}\n\n'
    const out = await runTransform(input, createGlmChunkSanitizer())
    const frames = parseDataLines(out)
    expect(frames[0].choices[0].delta.content).toBe('hello world')
    expect(frames[0].choices[0].delta.reasoning_content).toBeUndefined()
  })

  it('injects a stable synthetic id into tool_calls missing one', async () => {
    const c1 =
      'data: {"id":"529","object":"chat.completion.chunk","model":"glm-5-2","choices":[{"index":0,"delta":{"tool_calls":[{"type":"function","function":{"name":"","arguments":"{\\"filePath\\": \\"E:\\\\studio-lite"},"index":0}]},"finish_reason":null}]}\n\n'
    const c2 =
      'data: {"id":"529","object":"chat.completion.chunk","model":"glm-5-2","choices":[{"index":0,"delta":{"tool_calls":[{"function":{"arguments":"foo"},"index":0}]},"finish_reason":null}]}\n\n'
    const out = await runTransform(c1 + c2, createGlmChunkSanitizer())
    const frames = parseDataLines(out)
    const id1 = frames[0].choices[0].delta.tool_calls[0].id
    const id2 = frames[1].choices[0].delta.tool_calls[0].id
    expect(typeof id1).toBe('string')
    expect(id1.length).toBeGreaterThan(0)
    // Same tool call index keeps the same synthetic id across chunks.
    expect(id2).toBe(id1)
  })

  it('defaults missing function.arguments to empty string', async () => {
    const input =
      'data: {"id":"y","model":"glm","choices":[{"index":0,"delta":{"tool_calls":[{"type":"function","function":{"name":"read"},"index":0}]}}]}\n\n'
    const out = await runTransform(input, createGlmChunkSanitizer())
    const tc = parseDataLines(out)[0].choices[0].delta.tool_calls[0]
    expect(tc.id).toBeTypeOf('string')
    expect(tc.function.arguments).toBe('')
  })

  it('passes well-formed string content through unchanged', async () => {
    const input =
      'data: {"id":"z","model":"gpt","choices":[{"index":0,"delta":{"content":"normal text","tool_calls":[{"id":"call_1","function":{"name":"f","arguments":"{}"}}]}}]}\n\n'
    const out = await runTransform(input, createGlmChunkSanitizer())
    const delta = parseDataLines(out)[0].choices[0].delta
    expect(delta.content).toBe('normal text')
    expect(delta.tool_calls[0].id).toBe('call_1')
  })

  it('preserves data: [DONE] and data: null lines', async () => {
    const input = 'data: null\ndata: [DONE]\n'
    const out = await runTransform(input, createGlmChunkSanitizer())
    expect(out).toContain('data: null')
    expect(out).toContain('data: [DONE]')
  })

  it('handles multi-line buffers split mid-frame', async () => {
    const frame =
      'data: {"id":"m","model":"glm","choices":[{"index":0,"delta":{"content":[{"type":"text","text":"ab"}]}}]}\n\n'
    const enc = new TextEncoder()
    const dec = new TextDecoder()
    const chunks = [frame.slice(0, 30), frame.slice(30)]
    const src = new ReadableStream<Uint8Array>({
      start(c) {
        for (const ch of chunks) c.enqueue(enc.encode(ch))
        c.close()
      },
    })
    const out: string[] = []
    const reader = src.pipeThrough(createGlmChunkSanitizer()).getReader()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      out.push(dec.decode(value))
    }
    const delta = parseDataLines(out.join(''))[0].choices[0].delta
    expect(delta.content).toBe('ab')
  })
})

describe('createNullChunkStripper', () => {
  it('drops data: null keepalive lines', async () => {
    const input = 'data: {"a":1}\ndata: null\ndata: {"a":2}\n'
    const out = await runTransform(input, createNullChunkStripper())
    expect(out).not.toContain('data: null')
    expect(out).toContain('"a":1')
    expect(out).toContain('"a":2')
  })
})

describe('makeSanitizingFetch', () => {
  it('sanitizes a text/event-stream response body', async () => {
    const frame =
      'data: {"id":"fc5","model":"glm-5-2","choices":[{"index":0,"delta":{"content":[{"type":"thinking","thinking":[{"type":"text","text":"X"}],"closed":true}]}}]}\n\n'
    const upstream = async (_i: any, _init?: any) =>
      new Response(frame, { headers: { 'content-type': 'text/event-stream' } })
    const fetch = makeSanitizingFetch(upstream as any)
    const resp = await fetch('http://x')
    const text = await resp.text()
    const delta = parseDataLines(text)[0].choices[0].delta
    expect(delta.content).toBe('')
    expect(delta.reasoning_content).toBe('X')
  })

  it('sanitizes a non-streamed application/json chat completion', async () => {
    const body = JSON.stringify({
      id: 'c',
      model: 'glm',
      choices: [
        { index: 0, message: { role: 'assistant', content: [{ type: 'text', text: 'hi' }], tool_calls: [{ function: { name: 'f' } }] } },
      ],
    })
    const upstream = async (_i: any, _init?: any) =>
      new Response(body, { headers: { 'content-type': 'application/json' } })
    const fetch = makeSanitizingFetch(upstream as any)
    const resp = await fetch('http://x')
    const parsed = await resp.json()
    expect(parsed.choices[0].message.content).toBe('hi')
    expect(parsed.choices[0].message.tool_calls[0].id).toBeTypeOf('string')
  })

  it('leaves unrelated content types untouched', async () => {
    const upstream = async (_i: any, _init?: any) =>
      new Response('plain', { headers: { 'content-type': 'text/plain' } })
    const fetch = makeSanitizingFetch(upstream as any)
    const resp = await fetch('http://x')
    expect(await resp.text()).toBe('plain')
  })
})

describe('sanitizeJsonResponse', () => {
  it('normalizes a cloned json response', async () => {
    const resp = new Response(
      JSON.stringify({ choices: [{ index: 0, message: { role: 'assistant', content: [{ type: 'text', text: 'ok' }] } }] }),
      { headers: { 'content-type': 'application/json' } }
    )
    const fixed = await sanitizeJsonResponse(resp)
    const parsed = await fixed.json()
    expect(parsed.choices[0].message.content).toBe('ok')
  })
})

// ── Regression tests for GLM-5.2 / Mistral streaming ──────────────────────

describe('GLM-5.2 / Mistral streaming regression tests', () => {
  // Test 1 — Normal text stream passes through unchanged
  it('Test 1: normal text stream passes through', async () => {
    const input = sseFrame({ content: 'Hello' })
    const out = await runTransform(input, createGlmChunkSanitizer())
    const delta = parseDataLines(out)[0].choices[0].delta
    expect(delta.content).toBe('Hello')
  })

  // Test 2 — Thinking chunk: content array preserved with preserveThinking=true
  it('Test 2: thinking chunk preserved as reasoning (not stringified)', async () => {
    const input = sseFrame({
      content: [
        { type: 'thinking', thinking: [{ type: 'text', text: 'The' }] },
      ],
    })
    // With preserveThinking=true (mistral SDK path), the array is kept intact
    const out = await runTransform(input, createGlmChunkSanitizer(true))
    const delta = parseDataLines(out)[0].choices[0].delta
    expect(Array.isArray(delta.content)).toBe(true)
    expect(delta.content[0].type).toBe('thinking')
    expect(delta.content[0].thinking[0].text).toBe('The')
    // Should NOT be stringified or flattened into content
    expect(delta.content).not.toBe('{"type":"thinking",...')
  })

  // Test 3 — Tool call without ID gets a stable synthetic ID
  it('Test 3: tool call without id gets stable synthetic id', async () => {
    const input = sseFrame({
      tool_calls: [
        {
          index: 0,
          type: 'function',
          function: { name: '', arguments: '{"filePath":' },
        },
      ],
    })
    const out = await runTransform(input, createGlmChunkSanitizer())
    const tc = parseDataLines(out)[0].choices[0].delta.tool_calls[0]
    expect(tc.id).not.toBeUndefined()
    expect(typeof tc.id).toBe('string')
    expect(tc.id.length).toBeGreaterThan(0)
  })

  // Test 4 — Multiple tool argument chunks keep the same ID
  it('Test 4: multiple tool argument chunks share the same id', async () => {
    const c1 = sseFrame({
      tool_calls: [{ index: 0, type: 'function', function: { name: 'read_file', arguments: '{"filePath":' } }],
    })
    const c2 = sseFrame({
      tool_calls: [{ index: 0, type: 'function', function: { arguments: '"E:\\studio-lite' } }],
    })
    const c3 = sseFrame({
      tool_calls: [{ index: 0, type: 'function', function: { arguments: '"}}' } }],
    })
    const out = await runTransform(c1 + c2 + c3, createGlmChunkSanitizer())
    const frames = parseDataLines(out)
    const id1 = frames[0].choices[0].delta.tool_calls[0].id
    const id2 = frames[1].choices[0].delta.tool_calls[0].id
    const id3 = frames[2].choices[0].delta.tool_calls[0].id
    expect(id1).toBe(id2)
    expect(id2).toBe(id3)
  })

  // Test 5 — Multiple tool calls get distinct IDs
  it('Test 5: multiple tool calls get distinct ids', async () => {
    const input = sseFrame({
      tool_calls: [
        { index: 0, type: 'function', function: { name: 'read_file', arguments: '{' } },
        { index: 1, type: 'function', function: { name: 'write_file', arguments: '{' } },
      ],
    })
    const out = await runTransform(input, createGlmChunkSanitizer())
    const tcs = parseDataLines(out)[0].choices[0].delta.tool_calls
    expect(tcs[0].id).not.toBe(tcs[1].id)
  })

  // Test 6 — Tool name arrives later (empty name first, then real name)
  it('Test 6: tool name arriving after empty name', async () => {
    const c1 = sseFrame({
      tool_calls: [{ index: 0, type: 'function', function: { name: '', arguments: '' } }],
    })
    const c2 = sseFrame({
      tool_calls: [{ index: 0, type: 'function', function: { name: 'read_file', arguments: '{"path":' } }],
    })
    const out = await runTransform(c1 + c2, createGlmChunkSanitizer())
    const frames = parseDataLines(out)
    // First chunk: name is empty but id is already assigned
    expect(frames[0].choices[0].delta.tool_calls[0].id).toBeTypeOf('string')
    expect(frames[0].choices[0].delta.tool_calls[0].function.name).toBe('')
    // Second chunk: name filled in, id is stable
    expect(frames[1].choices[0].delta.tool_calls[0].function.name).toBe('read_file')
    expect(frames[1].choices[0].delta.tool_calls[0].id).toBe(frames[0].choices[0].delta.tool_calls[0].id)
  })

  // Test 7 — Thinking → text → tool call → finish
  it('Test 7: thinking → text → tool call → finish processes without errors', async () => {
    const input =
      sseFrame({ content: [{ type: 'thinking', thinking: [{ type: 'text', text: 'R1' }] }] }) +
      sseFrame({ content: [{ type: 'thinking', thinking: [{ type: 'text', text: 'R2' }] }] }) +
      sseFrame({ content: 'Hello' }) +
      sseFrame({ content: ' world' }) +
      sseFrame({
        tool_calls: [{ index: 0, type: 'function', function: { name: 'read_file', arguments: '{"filePath":' } }],
      }) +
      sseFrame({
        tool_calls: [{ index: 0, type: 'function', function: { arguments: '"test.ts' } }],
      }) +
      sseFrame({}, 'tool_calls')

    // With preserveThinking=true (mistral SDK), thinking arrays are preserved
    const out = await runTransform(input, createGlmChunkSanitizer(true))
    const frames = parseDataLines(out)
    expect(frames).toHaveLength(7)
    // Frame 0: thinking
    expect(frames[0].choices[0].delta.content[0].type).toBe('thinking')
    // Frame 2: text (after thinking, content is a plain string)
    expect(frames[2].choices[0].delta.content).toBe('Hello')
    // Frame 3: text continuation
    expect(frames[3].choices[0].delta.content).toBe(' world')
    // Frame 4: tool call with id
    expect(frames[4].choices[0].delta.tool_calls[0].id).toBeTypeOf('string')
    // Frame 6: finish
    expect(frames[6].choices[0].finish_reason).toBe('tool_calls')
  })

  // Test 8 — Tool call → reasoning → another tool call
  it('Test 8: tool call → reasoning → tool call → text sequence', async () => {
    const input =
      sseFrame({
        tool_calls: [{ index: 0, type: 'function', function: { name: 'tool_a', arguments: '{}' } }],
      }) +
      sseFrame({
        tool_calls: [{ index: 0, type: 'function', function: { arguments: '{"done":true}' } }],
      }) +
      sseFrame({ content: [{ type: 'thinking', thinking: [{ type: 'text', text: 'After tool' }] }] }) +
      sseFrame({
        tool_calls: [{ index: 0, type: 'function', function: { name: 'tool_b', arguments: '{"x":' } }],
      }) +
      sseFrame({ content: 'Final text' }) +
      sseFrame({}, 'stop')

    const out = await runTransform(input, createGlmChunkSanitizer(true))
    const frames = parseDataLines(out)
    expect(frames).toHaveLength(6)
    // Frame 0: first tool call — id assigned
    expect(frames[0].choices[0].delta.tool_calls[0].id).toBeTypeOf('string')
    // Frame 1: same tool call, same id
    expect(frames[1].choices[0].delta.tool_calls[0].id).toBe(frames[0].choices[0].delta.tool_calls[0].id)
    // Frame 2: thinking preserved
    expect(frames[2].choices[0].delta.content[0].type).toBe('thinking')
    // Frame 3: second tool call — same index 0, so same id; name updates
    expect(frames[3].choices[0].delta.tool_calls[0].id).toBe(frames[0].choices[0].delta.tool_calls[0].id)
    expect(frames[3].choices[0].delta.tool_calls[0].function.name).toBe('tool_b')
    // Frame 4: text + finish
    expect(frames[4].choices[0].delta.content).toBe('Final text')
    expect(frames[5].choices[0].finish_reason).toBe('stop')
  })

  // Test 8b — Multiple tool call indices with thinking interleaved
  it('Test 8b: multiple tool call indices with thinking interleaved', async () => {
    const input =
      sseFrame({
        tool_calls: [
          { index: 0, type: 'function', function: { name: 'tool_a', arguments: '{' } },
          { index: 1, type: 'function', function: { name: 'tool_b', arguments: '{' } },
        ],
      }) +
      sseFrame({ content: [{ type: 'thinking', thinking: [{ type: 'text', text: 'Thinking' }] }] }) +
      sseFrame({
        tool_calls: [{ index: 0, type: 'function', function: { arguments: '"x":1' } }],
      }) +
      sseFrame({
        tool_calls: [{ index: 1, type: 'function', function: { arguments: '"y":2' } }],
      }) +
      sseFrame({}, 'tool_calls')

    const out = await runTransform(input, createGlmChunkSanitizer(true))
    const frames = parseDataLines(out)
    expect(frames).toHaveLength(5)
    // Frame 0: two tool calls with distinct ids
    const id0 = frames[0].choices[0].delta.tool_calls[0].id
    const id1 = frames[0].choices[0].delta.tool_calls[1].id
    expect(id0).not.toBe(id1)
    // Frame 2: tool call 0 — same id
    expect(frames[2].choices[0].delta.tool_calls[0].id).toBe(id0)
    // Frame 3: tool call 1 — same id
    expect(frames[3].choices[0].delta.tool_calls[0].id).toBe(id1)
    // Frame 1: thinking preserved (not flattened)
    expect(frames[1].choices[0].delta.content[0].type).toBe('thinking')
  })
})
