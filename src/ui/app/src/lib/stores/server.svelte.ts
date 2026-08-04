// Server gateway store. Status changes arrive over the SSE event stream; the
// 5s poll is kept only as a fallback for when SSE can't connect (mock mode, or
// a proxy that strips text/event-stream).
import * as api from '../api/endpoints'
import type { ServerStatusPayload, ServerStartRequest } from '../api/types'
import { toast } from './ui.svelte'
import { connectEvents, onAppEvent, events } from './events.svelte'

export const server = $state<{
  status: ServerStatusPayload | null
  loading: boolean
  starting: boolean
  error: string | null
}>({ status: null, loading: false, starting: false, error: null })

let pollTimer: ReturnType<typeof setInterval> | null = null
let degradedWatch: ReturnType<typeof setInterval> | null = null
let unsubscribe: (() => void) | null = null
let fallbackIntervalMs = 5000

export async function loadStatus(): Promise<void> {
  // `loading` was declared but never assigned, so Server.svelte's initial
  // spinner could never render. Only flag the first read — later refreshes are
  // silent so live updates don't flicker the panel.
  if (!server.status) server.loading = true
  try {
    server.status = await api.getServerStatus()
    server.error = null
  } catch (err) {
    server.error = err instanceof Error ? err.message : String(err)
  } finally {
    server.loading = false
  }
}

function startFallbackPolling(): void {
  if (pollTimer) return
  pollTimer = setInterval(() => {
    void loadStatus()
  }, fallbackIntervalMs)
}

function stopFallbackPolling(): void {
  if (!pollTimer) return
  clearInterval(pollTimer)
  pollTimer = null
}

/**
 * Begin tracking server status. Prefers the push stream and only polls while
 * the stream is unavailable.
 *
 * @param intervalMs Fallback poll interval, used only when SSE is degraded.
 */
export function startPolling(intervalMs = 5000): void {
  fallbackIntervalMs = intervalMs
  void loadStatus()
  connectEvents()

  if (!unsubscribe) {
    unsubscribe = onAppEvent(event => {
      // Re-read the full payload rather than patching from the event: status
      // carries saved config and network URLs the event doesn't include.
      if (event.type === 'server') void loadStatus()
    })
  }

  // Poll only while the stream isn't carrying events for us. Checked on a
  // timer rather than an $effect so this stays a plain module function with no
  // component lifecycle to own (and no effect roots to leak).
  if (!degradedWatch) {
    degradedWatch = setInterval(() => {
      if (events.degraded) startFallbackPolling()
      else stopFallbackPolling()
    }, 1000)
  }
}

export function stopPolling(): void {
  stopFallbackPolling()
  if (degradedWatch) {
    clearInterval(degradedWatch)
    degradedWatch = null
  }
  unsubscribe?.()
  unsubscribe = null
}

export async function start(req: ServerStartRequest): Promise<boolean> {
  server.starting = true
  try {
    const res = await api.startServer(req)
    if (res.ok && res.status) {
      server.status = res.status
      toast('Server gateway started', 'success')
      return true
    }
    toast(res.error ?? 'Failed to start server', 'error')
    return false
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error')
    return false
  } finally {
    server.starting = false
  }
}

export async function stop(): Promise<void> {
  try {
    await api.stopServer()
    await loadStatus()
    toast('Server gateway stopped', 'info')
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error')
  }
}
