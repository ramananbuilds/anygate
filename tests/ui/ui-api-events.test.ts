import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMockRequest, createMockResponse } from '../helpers/ui-api-test-utils.js'
import {
  emitAppEvent,
  resetAppEventListeners,
  appEventListenerCount,
} from '../../src/services/event-bus.js'

vi.mock('../../src/apps/shared/native-launcher.js', () => ({
  getSupportedApps: () => [],
  getSupportedApp: () => undefined,
  detectApp: () => ({ installed: false, path: null }),
  getGatewayLaunchCommand: () => 'anygate',
}))

/** Open the SSE stream and return the mock req/res so the test can drive it. */
async function openStream() {
  const { handleUiApiRequest } = await import('../../src/ui/api.js')
  const req = createMockRequest('GET', '/api/events')
  const mockRes = createMockResponse()
  handleUiApiRequest(req, mockRes.res, {})
  await new Promise(resolve => setTimeout(resolve, 20))
  return { req, ...mockRes }
}

/** Parse `data:` frames out of an SSE body. */
function frames(body: string): unknown[] {
  return body
    .split('\n\n')
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.startsWith('data:'))
    .map(chunk => JSON.parse(chunk.slice(5).trim()))
}

describe('GET /api/events (SSE)', () => {
  let tempHome: string
  let previous: string | undefined

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-sse-'))
    previous = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = join(tempHome, 'home')
    resetAppEventListeners()
  })

  afterEach(() => {
    resetAppEventListeners()
    rmSync(tempHome, { recursive: true, force: true })
    if (previous === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previous
  })

  it('responds with event-stream headers and no buffering', async () => {
    const { result } = await openStream()
    expect(result.code).toBe(200)
    expect(result.headers['content-type']).toContain('text/event-stream')
    expect(result.headers['cache-control']).toContain('no-cache')
    expect(result.headers['x-accel-buffering']).toBe('no')
  })

  it('streams events emitted after the client connects', async () => {
    const { result } = await openStream()
    emitAppEvent({ type: 'server', running: true, listenMode: 'local', modelCount: 3 })
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(frames(result.data)).toContainEqual({
      type: 'server',
      running: true,
      listenMode: 'local',
      modelCount: 3,
    })
  })

  it('streams usage events produced by recordUsage', async () => {
    const { result } = await openStream()
    const { recordUsage } = await import('../../src/storage/analytics.js')

    recordUsage({
      ts: new Date().toISOString(),
      modelId: 'gpt-5.5',
      providerId: 'openai',
      app: 'claude',
      inputTokens: 10,
      outputTokens: 20,
    })
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(frames(result.data)).toContainEqual(
      expect.objectContaining({ type: 'usage', app: 'claude', modelId: 'gpt-5.5' })
    )
  })

  it('unsubscribes when the client disconnects', async () => {
    const { req } = await openStream()
    expect(appEventListenerCount()).toBe(1)

    req.emit('close')
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(appEventListenerCount()).toBe(0)
  })

  it('supports multiple concurrent clients', async () => {
    const a = await openStream()
    const b = await openStream()
    expect(appEventListenerCount()).toBe(2)

    emitAppEvent({ type: 'providers', reason: 'refresh' })
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(frames(a.result.data)).toContainEqual({ type: 'providers', reason: 'refresh' })
    expect(frames(b.result.data)).toContainEqual({ type: 'providers', reason: 'refresh' })
  })
})

describe('GET /api/analytics exposes previously-dropped dimensions', () => {
  let tempHome: string
  let previous: string | undefined

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-analytics-'))
    previous = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = join(tempHome, 'home')
    resetAppEventListeners()
  })

  afterEach(() => {
    resetAppEventListeners()
    rmSync(tempHome, { recursive: true, force: true })
    if (previous === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previous
  })

  async function getAnalytics(range = 'all') {
    const { handleUiApiRequest } = await import('../../src/ui/api.js')
    const req = createMockRequest('GET', `/api/analytics?range=${range}`)
    const mockRes = createMockResponse()
    handleUiApiRequest(req, mockRes.res, {})
    await new Promise(resolve => setTimeout(resolve, 30))
    return JSON.parse(mockRes.result.data)
  }

  it('returns a 24-slot hourly histogram', async () => {
    const { recordUsage } = await import('../../src/storage/analytics.js')
    const ts = new Date()
    ts.setUTCHours(14, 0, 0, 0)
    recordUsage({
      ts: ts.toISOString(),
      modelId: 'm',
      app: 'gateway',
      inputTokens: 1,
      outputTokens: 1,
    })

    const body = await getAnalytics()
    expect(body.hourly).toHaveLength(24)
    expect(body.hourly[14]).toBe(1)
    expect(body.peakHour).toBe(14)
  })

  it('splits usage by originating app', async () => {
    const { recordUsage } = await import('../../src/storage/analytics.js')
    const ts = new Date().toISOString()
    recordUsage({ ts, modelId: 'm1', app: 'gateway', inputTokens: 70, outputTokens: 0 })
    recordUsage({ ts, modelId: 'm2', app: 'antigravity', inputTokens: 30, outputTokens: 0 })

    const body = await getAnalytics()
    const byApp = Object.fromEntries(body.apps.map((a: any) => [a.app, a]))
    expect(byApp['gateway'].inputTokens).toBe(70)
    expect(byApp['antigravity'].inputTokens).toBe(30)
    expect(byApp['gateway'].share).toBeCloseTo(0.7, 5)
    // Sorted by share, largest first.
    expect(body.apps[0].app).toBe('gateway')
  })

  it('reports prompt/completion token totals separately', async () => {
    const { recordUsage } = await import('../../src/storage/analytics.js')
    const ts = new Date().toISOString()
    recordUsage({ ts, modelId: 'm', app: 'gateway', inputTokens: 25, outputTokens: 75 })

    const body = await getAnalytics()
    expect(body.inputTokens).toBe(25)
    expect(body.outputTokens).toBe(75)
    expect(body.totalTokens).toBe(100)
  })

  it('returns empty-but-valid arrays with no usage recorded', async () => {
    const body = await getAnalytics()
    expect(body.hourly).toHaveLength(24)
    expect(body.hourly.every((n: number) => n === 0)).toBe(true)
    expect(body.apps).toEqual([])
    expect(body.totalTokens).toBe(0)
    expect(body.inputTokens).toBe(0)
    expect(body.outputTokens).toBe(0)
  })
})
