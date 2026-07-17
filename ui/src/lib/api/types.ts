// Typed DTOs mirroring the anygate UI API contract (src/ui/api-types.ts),
// plus the new backend-later endpoints (health, presets, dry-run, import/export)
// which the UI supports behind client-side fallbacks until the backend ships.

export interface UiApiError {
  error: string;
  hint?: string;
}

export interface FavoriteModel {
  providerId: string;
  providerName: string;
  model: string;
  modelId: string;
  contextWindow?: number;
  cost?: unknown;
}

export interface UiConfigResponse {
  favoriteModels: FavoriteModel[];
  antigravityCliFavoriteModels: FavoriteModel[];
}

export interface UiProviderModel {
  id: string;
  name: string;
  isFree: boolean;
  freeStatus?: string;
  freeLabel?: string;
  contextWindow?: number;
  cost?: unknown;
  // Enriched fields (backend-later; derived client-side when absent)
  format?: 'anthropic' | 'openai' | 'unsupported';
  reasoning?: boolean;
  supportedParameters?: string[];
  sourceBackend?: string;
}

export type ProviderAuthType = 'api' | 'oauth' | 'custom';

export interface UiProvider {
  id: string;
  name: string;
  favoriteName: string;
  hasKey: boolean;
  freeAccess: boolean;
  authType: ProviderAuthType;
  modelCount: number;
  models: UiProviderModel[];
  signupUrl?: string | null;
}

export interface UiModelsResponse {
  providers: UiProvider[];
}

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

export interface UiApp {
  id: string;
  name: string;
  type: 'cli' | 'app';
  installed: boolean;
  path?: string;
  gatewayCommand?: string;
  launchCommand?: string;
  /** Shell command to install this app (CLIs). Absent for desktop apps. */
  installHint?: string;
  /** Vendor download page for desktop apps. Absent for CLIs. */
  installUrl?: string;
}

export interface UiAppsResponse {
  apps: UiApp[];
  recentLaunchFolders: string[];
}

export type OAuthStatus = 'pending' | 'done' | 'error';

export interface UiOAuthSessionResponse {
  status: OAuthStatus;
  error?: string;
}

export interface UiOAuthStartResponse {
  sessionId: string;
  url: string;
  userCode?: string;
  pkce?: boolean;
  authUrl?: string;
}

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

// ── Server ─────────────────────────────────────────────────────────────
export type ServerListenMode = 'local' | 'network';

export interface ServerStartRequest {
  favoritesOnly: boolean;
  freeModelsOnly: boolean;
  exposedProviders: string[] | null;
  maskGatewayIds: boolean;
  listenMode: ServerListenMode;
  passwordMode?: 'saved' | 'new';
  password?: string;
  savePassword?: boolean;
}

export interface ServerModelRow {
  providerLabel: string;
  name: string;
  anthropicId: string;
  openaiId: string;
}

export interface ServerSavedConfig {
  favoritesOnly: boolean;
  freeModelsOnly: boolean;
  exposedProviders: string[] | null;
  maskGatewayIds: boolean;
  listenMode: ServerListenMode;
  hasSavedPassword: boolean;
}

export interface ServerNetworkUrl {
  name: string;
  anthropicUrl: string;
  openaiUrl: string;
}

export interface ServerStatusPayload {
  running: boolean;
  saved: ServerSavedConfig;
  listenMode?: ServerListenMode;
  anthropicUrl?: string;
  openaiUrl?: string;
  networkUrls?: ServerNetworkUrl[];
  apiKey?: string;
  exposedProviders?: string[] | null;
  favoritesOnly?: boolean;
  freeModelsOnly?: boolean;
  maskGatewayIds?: boolean;
  providerSummary?: string;
  models?: ServerModelRow[];
}

export interface UiServerProvidersResponse {
  providers: { id: string; name: string; models: number }[];
}

// ── New / backend-later endpoints (typed contract) ─────────────────────

export interface HealthReport {
  ok: boolean;
  note?: string;
  keychain?: { available: boolean; note?: string };
  conflictingEnvVars?: string[];
  port17645Available?: boolean;
  providerReachability?: { id: string; ok: boolean; error?: string }[];
}

export interface Preset {
  id: string;
  appId: string;
  providerId?: string;
  modelId?: string;
  folder?: string;
  flags?: string[];
  label?: string;
}

export interface DryRunEnvEntry {
  key: string;
  value: string;
  masked?: boolean;
}

export interface DryRunPreview {
  env: DryRunEnvEntry[];
  command?: string;
}
