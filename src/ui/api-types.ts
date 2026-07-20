// src/ui/api-types.ts � frozen JSON contract for the anygate web UI API.
//
// This module is the single typed description of every request/response shape
// that `ui/api.ts` emits. It contains NO runtime logic � only types � so both
// the current vanilla UI (`ui/public/`) and any future advanced UI can share
// one schema without importing `ui/api.ts`'s implementation. Treat these shapes
// as a public contract: changing them is a breaking change for the UI.

import type { ServerStartRequest, ServerStatusPayload } from './server-control.js';

/** Standard error body returned by every failing route. */
export interface UiApiError {
  error: string;
  /** Optional remediation hint (provider/template add flows). */
  hint?: string;
}

/** `GET /api/config` */
export interface UiConfigResponse {
  favoriteModels: unknown[];
  antigravityCliFavoriteModels: unknown[];
}

/** A single model row inside a provider card. */
export interface UiProviderModel {
  id: string;
  name: string;
  isFree: boolean;
  freeStatus?: string;
  freeLabel?: string;
  contextWindow?: number;
  cost?: unknown;
}

/** `GET /api/models` */
export interface UiProvider {
  id: string;
  name: string;
  favoriteName: string;
  hasKey: boolean;
  freeAccess: boolean;
  authType: string;
  modelCount: number;
  models: UiProviderModel[];
}

export interface UiModelsResponse {
  providers: UiProvider[];
}

/** `GET /api/providers/templates` */
export interface UiTemplate {
  id: string;
  name: string;
  signupUrl: string | null;
  authType: string;
  anonymousFreeModels?: boolean;
  urlPrompt?: string | null;
  defaultBaseUrl?: string | null;
  apiKeyOptional?: boolean;
  custom?: boolean;
  subscriptionRisk?: boolean;
}

export interface UiTemplatesResponse {
  templates: UiTemplate[];
}

/** `GET /api/apps` */
export interface UiApp {
  id: string;
  name: string;
  type: string;
  installed: boolean;
  path?: string;
  gatewayCommand?: string;
  launchCommand?: string;
}

export interface UiAppsResponse {
  apps: UiApp[];
  recentLaunchFolders: string[];
}

/** `GET|POST /api/providers/oauth/status` */
export interface UiOAuthSessionResponse {
  status: 'pending' | 'done' | 'error';
  error?: string;
}

export interface UiOAuthStartResponse {
  sessionId: string;
  url: string;
  userCode?: string;
  pkce?: boolean;
  authUrl?: string;
}

/** `GET /api/server/status` � re-exported from server-control. */
export type { ServerStatusPayload as UiServerStatus };

/** `GET /api/server/providers` */
export interface UiServerProvidersResponse {
  providers: unknown[];
}

/** Body for `POST /api/server/start` � re-exported from server-control. */
export type { ServerStartRequest as UiServerStartRequest };

/** Generic success wrapper used by several routes. */
export interface UiOkResponse {
  ok: boolean;
  error?: string;
}

/** Per-provider refresh summary (`POST /api/providers/refresh-all`). */
export interface UiRefreshProviderSummary {
  id: string;
  name: string;
  ok: boolean;
  count: number;
  skipped: boolean;
  oauthWarning: boolean;
  reason?: string;
}

export interface UiRefreshAllResponse {
  ok: boolean;
  providers: UiRefreshProviderSummary[];
  total: number;
}
/** POST /api/models/test — live latency/benchmark result for one provider+model. */
export interface UiModelTestResult {
  ok: boolean;
  providerId: string;
  modelId: string;
  format: 'anthropic' | 'openai' | 'unsupported' | 'unknown';
  /** ms from request start to first response headers/byte (socket+TLS+handshake). */
  connectMs: number | null;
  /** ms from request start to first streamed token/chunk. */
  ttftMs: number | null;
  /** ms from request start to end of stream. */
  totalMs: number | null;
  /** Approximate tokens (or chunks) streamed. */
  tokens: number;
  /** Derived throughput: tokens/sec (null if no tokens or no ttft). */
  tokensPerSec: number | null;
  /** 'steady' == even chunk cadence, 'intermittent' == bursty gaps. */
  streamStability: 'steady' | 'intermittent' | 'n/a';
  /** First ~400 chars of the model's response, for a sanity sample. */
  sample: string;
  error?: string;
  /** Remediation hint (e.g. "add an API key", "wrong endpoint"). */
  errorHint?: string;
}