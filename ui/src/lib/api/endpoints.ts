// One typed function per API endpoint. Existing endpoints hit the backend today;
// backend-later endpoints fall back to client-side adapters (see mock.ts).
import { getJson, postJson } from './client';
import type {
  UiConfigResponse, UiModelsResponse, UiTemplatesResponse, UiAppsResponse,
  UiOAuthStartResponse, UiOAuthSessionResponse, UiRefreshAllResponse,
  UiServerProvidersResponse, ServerStatusPayload, ServerStartRequest, UiApp,
  FavoriteModel, HealthReport, Preset, DryRunPreview, UiProvider,
} from './types';
import * as mock from './mock';

// ── Config / favorites ────────────────────────────────────────────────
export function getConfig(): Promise<UiConfigResponse> {
  return getJson<UiConfigResponse>('/api/config');
}
export function saveConfig(body: { favoriteModels?: FavoriteModel[]; antigravityCliFavoriteModels?: FavoriteModel[] }): Promise<{ ok: boolean }> {
  return postJson<{ ok: boolean }>('/api/config', body);
}

export function getUpdateStatus(): Promise<unknown> {
  return getJson('/api/update-status');
}

// ── Models / providers ───────────────────────────────────────────────
export function getModels(): Promise<UiModelsResponse> {
  return getJson<UiModelsResponse>('/api/models');
}
export function saveKey(providerId: string, key: string): Promise<{ ok: boolean }> {
  return postJson('/api/keys', { providerId, key });
}
export function refreshProvider(providerId: string): Promise<{ ok: boolean; count?: number } & Record<string, unknown>> {
  return postJson('/api/providers/refresh', { providerId });
}
export function refreshAllProviders(): Promise<UiRefreshAllResponse> {
  return postJson<UiRefreshAllResponse>('/api/providers/refresh-all');
}
export function getTemplates(): Promise<UiTemplatesResponse> {
  return getJson<UiTemplatesResponse>('/api/providers/templates');
}
export function addProvider(templateId: string, key?: string, baseUrl?: string): Promise<{ ok: boolean; name?: string; count?: number } & Record<string, unknown>> {
  return postJson('/api/providers/add', { templateId, key, baseUrl });
}
export function addCustomProvider(body: { kind: 'openai' | 'anthropic'; displayName: string; baseUrl: string; apiKey?: string; headers?: Record<string, string> }): Promise<{ ok: boolean; name?: string; count?: number } & Record<string, unknown>> {
  return postJson('/api/providers/add-custom', body);
}
export function deleteProvider(providerId: string): Promise<{ ok: boolean; name?: string } & Record<string, unknown>> {
  return postJson('/api/providers/delete', { providerId });
}
export function startOAuth(providerId: string): Promise<UiOAuthStartResponse> {
  return postJson<UiOAuthStartResponse>('/api/providers/oauth/start', { providerId });
}
export function getOAuthStatus(sessionId: string): Promise<UiOAuthSessionResponse> {
  return getJson<UiOAuthSessionResponse>(`/api/providers/oauth/status?sessionId=${encodeURIComponent(sessionId)}`);
}

// ── Apps ──────────────────────────────────────────────────────────────
export function getApps(): Promise<UiAppsResponse> {
  return getJson<UiAppsResponse>('/api/apps');
}
export function setAppPath(appId: string, path: string | null): Promise<{ ok: boolean; apps: UiApp[] }> {
  return postJson('/api/apps/path', { appId, path });
}
export function launchApp(body: { appId: string; favorites?: boolean; providerId?: string; modelId?: string; cwd?: string }): Promise<{ ok: boolean; command: string }> {
  return postJson('/api/apps/launch', body);
}
export function browseFolder(): Promise<{ ok: boolean; path?: string; canceled?: boolean }> {
  return postJson('/api/apps/browse-folder');
}

// ── Server gateway ───────────────────────────────────────────────────
export function getServerStatus(): Promise<ServerStatusPayload> {
  return getJson<ServerStatusPayload>('/api/server/status');
}
export function getServerProviders(): Promise<UiServerProvidersResponse> {
  return getJson<UiServerProvidersResponse>('/api/server/providers');
}
export function startServer(req: ServerStartRequest): Promise<{ ok: boolean; status?: ServerStatusPayload; error?: string }> {
  return postJson('/api/server/start', req);
}
export function stopServer(): Promise<{ ok: boolean; stopped: boolean }> {
  return postJson('/api/server/stop');
}

// ── Backend-later endpoints (with client-side fallback) ──────────────

export async function getHealth(): Promise<HealthReport> {
  try {
    return await getJson<HealthReport>('/api/health');
  } catch (err) {
    // 404 (backend not yet implemented) → degrade gracefully.
    return mock.healthFallback(err);
  }
}

export function getPresets(): Promise<Preset[]> {
  // Backend GET /api/presets not yet implemented → localStorage.
  return Promise.resolve(mock.loadPresets());
}
export function savePresets(presets: Preset[]): Promise<{ ok: boolean }> {
  mock.storePresets(presets);
  return Promise.resolve({ ok: true });
}

// Favorites-only export/import (portable backup) via /api/config today.
export async function exportConfig(): Promise<string> {
  const cfg = await getConfig();
  return JSON.stringify({ version: 1, favoriteModels: cfg.favoriteModels, antigravityCliFavoriteModels: cfg.antigravityCliFavoriteModels }, null, 2);
}
export async function importConfig(json: string): Promise<void> {
  const parsed = JSON.parse(json) as { favoriteModels?: FavoriteModel[]; antigravityCliFavoriteModels?: FavoriteModel[] };
  if (!Array.isArray(parsed.favoriteModels) && !Array.isArray(parsed.antigravityCliFavoriteModels)) {
    throw new Error('Invalid config file: missing favoriteModels');
  }
  await saveConfig({
    favoriteModels: parsed.favoriteModels ?? [],
    antigravityCliFavoriteModels: parsed.antigravityCliFavoriteModels ?? [],
  });
}

// Client-side dry-run preview of the env a launch would set.
export function computeDryRun(opts: { provider?: UiProvider; modelId?: string; contextWindow?: number }): DryRunPreview {
  return mock.computeDryRun(opts);
}
