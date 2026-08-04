// Process-local publish/subscribe bus for pushing live updates to the UI.
//
// Lives in services/ (not ui/) so producers deep in the gateway — storage,
// proxies, the Antigravity gateway — can emit without importing the UI layer.
// Delivery is best-effort and synchronous: emitting must never throw into, or
// measurably slow down, a request path.

export type AppEvent =
  | {
      type: 'usage'
      /** 'gateway' | 'claude' | 'codex' | 'gemini' | 'antigravity' */
      app: string
      modelId: string
      providerId?: string
      inputTokens: number
      outputTokens: number
      ts: string
    }
  | { type: 'server'; running: boolean; listenMode?: 'local' | 'network'; modelCount?: number }
  | { type: 'providers'; reason: 'refresh' | 'added' | 'removed' }

export type AppEventListener = (event: AppEvent) => void

const listeners = new Set<AppEventListener>()

/** Subscribe to app events. Returns an unsubscribe function. */
export function subscribeToAppEvents(listener: AppEventListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Publish an event to every subscriber. A throwing subscriber is isolated so it
 * can't break the caller's request or starve the remaining subscribers.
 */
export function emitAppEvent(event: AppEvent): void {
  for (const listener of listeners) {
    try {
      listener(event)
    } catch {
      // A broken SSE client must not affect the request that produced the event.
    }
  }
}

/** Test helper: drop all subscribers. */
export function resetAppEventListeners(): void {
  listeners.clear()
}

/** Current subscriber count (used by tests and diagnostics). */
export function appEventListenerCount(): number {
  return listeners.size
}
