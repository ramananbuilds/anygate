// Server gateway store: polls GET /api/server/status every 5s while mounted.
import * as api from '../api/endpoints';
import type { ServerStatusPayload, ServerStartRequest } from '../api/types';
import { toast } from './ui.svelte';

export const server = $state<{
  status: ServerStatusPayload | null;
  loading: boolean;
  starting: boolean;
  error: string | null;
}>({ status: null, loading: false, starting: false, error: null });

let pollTimer: ReturnType<typeof setInterval> | null = null;

export async function loadStatus(): Promise<void> {
  try {
    server.status = await api.getServerStatus();
    server.error = null;
  } catch (err) {
    server.error = err instanceof Error ? err.message : String(err);
  }
}

export function startPolling(intervalMs = 5000): void {
  if (pollTimer) return;
  void loadStatus();
  pollTimer = setInterval(() => { void loadStatus(); }, intervalMs);
}

export function stopPolling(): void {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
}

export async function start(req: ServerStartRequest): Promise<boolean> {
  server.starting = true;
  try {
    const res = await api.startServer(req);
    if (res.ok && res.status) {
      server.status = res.status;
      toast('Server gateway started', 'success');
      return true;
    }
    toast(res.error ?? 'Failed to start server', 'error');
    return false;
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error');
    return false;
  } finally {
    server.starting = false;
  }
}

export async function stop(): Promise<void> {
  try {
    await api.stopServer();
    await loadStatus();
    toast('Server gateway stopped', 'info');
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error');
  }
}
