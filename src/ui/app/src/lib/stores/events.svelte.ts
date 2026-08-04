// Live event stream (SSE) from GET /api/events.
//
// Replaces per-store interval polling: one connection carries usage, server,
// and provider events. EventSource handles reconnection itself, so there is no
// manual retry loop here — we only track connection state so the UI can show
// whether it is live, and fall back to polling when the stream never connects.
import { useMockApi } from '../api/env'

export type AppEvent =
  | {
      type: 'usage'
      app: string
      modelId: string
      providerId?: string
      inputTokens: number
      outputTokens: number
      ts: string
    }
  | { type: 'server'; running: boolean; listenMode?: 'local' | 'network'; modelCount?: number }
  | { type: 'providers'; reason: 'refresh' | 'added' | 'removed' }

export const events = $state<{
  connected: boolean
  /** True once we've given up on SSE and callers should poll instead. */
  degraded: boolean
  lastEventAt: number | null
}>({ connected: false, degraded: false, lastEventAt: null })

type Handler = (event: AppEvent) => void

const handlers = new Set<Handler>()
let source: EventSource | null = null
let failures = 0

/** Max consecutive connection errors before we declare SSE unusable. */
const MAX_FAILURES = 3

export function onAppEvent(handler: Handler): () => void {
  handlers.add(handler)
  return () => handlers.delete(handler)
}

export function connectEvents(): void {
  // Mock mode has no backend to stream from; callers keep their polling path.
  if (source || useMockApi || typeof EventSource === 'undefined') {
    if (useMockApi || typeof EventSource === 'undefined') events.degraded = true
    return
  }

  const es = new EventSource('/api/events')
  source = es

  es.onopen = () => {
    failures = 0
    events.connected = true
    events.degraded = false
  }

  es.onmessage = (msg: MessageEvent<string>) => {
    events.lastEventAt = Date.now()
    let parsed: AppEvent
    try {
      parsed = JSON.parse(msg.data) as AppEvent
    } catch {
      return // Ignore malformed frames rather than tearing down the stream.
    }
    for (const handler of handlers) {
      try {
        handler(parsed)
      } catch {
        // One bad subscriber must not break delivery to the rest.
      }
    }
  }

  es.onerror = () => {
    events.connected = false
    // EventSource retries on its own; only stop trusting it after repeated
    // failures, at which point stores fall back to polling.
    if (++failures >= MAX_FAILURES) {
      events.degraded = true
      es.close()
      source = null
    }
  }
}

export function disconnectEvents(): void {
  source?.close()
  source = null
  events.connected = false
}
