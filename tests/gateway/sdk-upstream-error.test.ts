// Regression tests: upstream failures on the non-streaming SDK path and the
// OpenAI SSE path must surface the real status + message (e.g. provider 403s
// like OpenCode Zen's FreeTierError), not an opaque 502 or an empty stream.
import { createServer } from 'node:http'
import { afterAll, describe, expect, it } from 'vitest'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { ModelMessage } from 'ai'
import { generateAnthropicResponse } from '../../src/gateway/adapters/sdk-adapter.js'
import { streamOpenAiResponse } from '../../src/gateway/adapters/openai-adapter.js'

const FREE_TIER_MESSAGE =
  "OpenCode's free tier can only be used from within OpenCode. Download it at https://opencode.ai and keep building."

const servers: Array<{ close: () => Promise<void> }> = []

afterAll(async () => {
  await Promise.all(servers.map(s => s.close()))
})

async function startForbiddenUpstream(): Promise<string> {
  const server = createServer((_req, res) => {
    res.writeHead(403, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        type: 'error',
        error: { type: 'FreeTierError', message: FREE_TIER_MESSAGE },
      })
    )
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('missing upstream address')
  servers.push({
    close: () =>
      new Promise<void>((resolve, reject) => server.close(err => (err ? reject(err) : resolve()))),
  })
  return `http://127.0.0.1:${address.port}`
}

function model(baseURL: string) {
  return createOpenAICompatible({ name: 'test', baseURL, apiKey: 'test-key' })('big-pickle')
}

const params = {
  messages: [{ role: 'user', content: [{ type: 'text', text: 'hi' }] }] as ModelMessage[],
  maxOutputTokens: 16,
}

function errorText(err: unknown): string {
  const rec = err as { message?: string; responseBody?: string; data?: unknown }
  return [rec?.message ?? '', rec?.responseBody ?? '', JSON.stringify(rec?.data ?? '')].join(' ')
}

describe('generateAnthropicResponse upstream error propagation', () => {
  it('rejects with the upstream status + message instead of a generic no-output error', async () => {
    const baseURL = await startForbiddenUpstream()
    let caught: unknown
    try {
      await generateAnthropicResponse(model(baseURL), params, 'big-pickle')
    } catch (err) {
      caught = err
    }
    expect(caught).toBeDefined()
    expect((caught as { statusCode?: number }).statusCode).toBe(403)
    expect(errorText(caught)).toContain('free tier can only be used from within OpenCode')
  })
})

describe('streamOpenAiResponse mid-stream error frame', () => {
  it('emits an OpenAI-shaped error frame and does not report a clean [DONE]', async () => {
    const baseURL = await startForbiddenUpstream()
    let out = ''
    await streamOpenAiResponse(model(baseURL), params, 'big-pickle', chunk => {
      out += chunk
    })
    expect(out).toContain('"error"')
    expect(out).toContain('free tier can only be used from within OpenCode')
    expect(out).not.toContain('[DONE]')
  })
})
