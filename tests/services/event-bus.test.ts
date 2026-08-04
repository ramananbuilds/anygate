import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  emitAppEvent,
  subscribeToAppEvents,
  resetAppEventListeners,
  appEventListenerCount,
  type AppEvent,
} from '../../src/services/event-bus.js'

describe('event bus', () => {
  beforeEach(() => resetAppEventListeners())
  afterEach(() => resetAppEventListeners())

  it('delivers events to every subscriber', () => {
    const a: AppEvent[] = []
    const b: AppEvent[] = []
    subscribeToAppEvents(e => a.push(e))
    subscribeToAppEvents(e => b.push(e))

    emitAppEvent({ type: 'server', running: true })

    expect(a).toEqual([{ type: 'server', running: true }])
    expect(b).toEqual([{ type: 'server', running: true }])
  })

  it('stops delivering after unsubscribe', () => {
    const seen: AppEvent[] = []
    const off = subscribeToAppEvents(e => seen.push(e))
    emitAppEvent({ type: 'server', running: true })
    off()
    emitAppEvent({ type: 'server', running: false })
    expect(seen).toHaveLength(1)
    expect(appEventListenerCount()).toBe(0)
  })

  it('isolates a throwing subscriber so others still receive the event', () => {
    const seen: AppEvent[] = []
    subscribeToAppEvents(() => {
      throw new Error('broken client')
    })
    subscribeToAppEvents(e => seen.push(e))

    expect(() => emitAppEvent({ type: 'server', running: true })).not.toThrow()
    expect(seen).toHaveLength(1)
  })

  it('emitting with no subscribers is a no-op', () => {
    expect(() => emitAppEvent({ type: 'providers', reason: 'refresh' })).not.toThrow()
  })
})

describe('recordUsage emits usage events', () => {
  let tempHome: string
  let previous: string | undefined

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-events-'))
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

  it('publishes an event when usage is recorded', async () => {
    const { recordUsage } = await import('../../src/storage/analytics.js')
    const seen: AppEvent[] = []
    subscribeToAppEvents(e => seen.push(e))

    recordUsage({
      ts: new Date().toISOString(),
      modelId: 'claude-sonnet-4-5',
      providerId: 'anthropic',
      app: 'gateway',
      inputTokens: 100,
      outputTokens: 50,
    })

    expect(seen).toHaveLength(1)
    expect(seen[0]).toMatchObject({
      type: 'usage',
      app: 'gateway',
      modelId: 'claude-sonnet-4-5',
      providerId: 'anthropic',
      inputTokens: 100,
      outputTokens: 50,
    })
  })

  it('does not emit for zero-token probe requests', async () => {
    const { recordUsage } = await import('../../src/storage/analytics.js')
    const seen: AppEvent[] = []
    subscribeToAppEvents(e => seen.push(e))

    recordUsage({
      ts: new Date().toISOString(),
      modelId: 'probe',
      app: 'gateway',
      inputTokens: 0,
      outputTokens: 0,
    })

    expect(seen).toHaveLength(0)
  })

  it('still records usage when a subscriber throws', async () => {
    const { recordUsage, readAnalyticsLog } = await import('../../src/storage/analytics.js')
    subscribeToAppEvents(() => {
      throw new Error('bad subscriber')
    })

    expect(() =>
      recordUsage({
        ts: new Date().toISOString(),
        modelId: 'm',
        app: 'gateway',
        inputTokens: 5,
        outputTokens: 5,
      })
    ).not.toThrow()

    expect(readAnalyticsLog()).toHaveLength(1)
  })
})
