// Client-side fallbacks for backend-later endpoints. These implement the
// contract locally (localStorage / derivation) so the UI is fully functional
// before the backend ships. Once the backend implements the real endpoints,
// swap the calls in endpoints.ts — no UI change needed.
import type { HealthReport, Preset, DryRunPreview, UiProvider } from './types';

const PRESETS_KEY = 'anygate-presets';
const RECENT_FOLDERS_KEY = 'anygate-recent-folders';

// ── Health ───────────────────────────────────────────────────────────
export function healthFallback(err: unknown): HealthReport {
  const status = (err as { status?: number })?.status;
  const degraded = status === 404;
  return {
    ok: degraded,
    keychain: { available: false, note: degraded ? 'Health check needs a newer anygate' : 'Unable to reach backend' },
    conflictingEnvVars: [],
    port17645Available: true,
    providerReachability: [],
  };
}

// ── Presets (localStorage) ──────────────────────────────────────────
export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    return raw ? (JSON.parse(raw) as Preset[]) : [];
  } catch {
    return [];
  }
}
export function storePresets(presets: Preset[]): void {
  try { localStorage.setItem(PRESETS_KEY, JSON.stringify(presets)); } catch {}
}

export function loadRecentFolders(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_FOLDERS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
export function pushRecentFolder(folder: string): string[] {
  const list = loadRecentFolders().filter(f => f !== folder);
  list.unshift(folder);
  const next = list.slice(0, 10);
  try { localStorage.setItem(RECENT_FOLDERS_KEY, JSON.stringify(next)); } catch {}
  return next;
}

// ── Dry-run preview (client-computed) ───────────────────────────────
// Mirrors the buildChildEnv / printDryRun rules from the CLI.
export function computeDryRun(opts: { provider?: UiProvider; modelId?: string; contextWindow?: number }): DryRunPreview {
  const { provider, modelId, contextWindow } = opts;
  const env: DryRunPreview['env'] = [];
  env.push({ key: 'ANTHROPIC_BASE_URL', value: 'http://127.0.0.1:<proxy-port>' });
  if (provider && modelId) {
    env.push({ key: 'ANTHROPIC_MODEL', value: `${provider.id}__${modelId}` });
    env.push({ key: 'CLAUDE_CODE_MAX_CONTEXT_TOKENS', value: String(contextWindow ?? 200000) });
  }
  env.push({ key: 'ANTHROPIC_AUTH_TOKEN', value: '<proxy-local-token>', masked: true });
  env.push({ key: 'CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY', value: '1' });
  return { env, command: provider && modelId ? `anygate ${provider.id} --model ${modelId}` : 'anygate <provider>' };
}
