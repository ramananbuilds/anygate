// Config store: subscription tier, default folder, ANYGATE_HOME, log paths.
// Most of these are read-only reflections of ~/.anygate/config.json; a few
// (subscription tier) are persisted via /api/config-style endpoints later.
import * as api from '../api/endpoints';
import type { UiConfigResponse } from '../api/types';

export type SubscriptionTier = 'free' | 'zen' | 'go' | 'both';

export const config = $state<{
  loaded: UiConfigResponse | null;
  tier: SubscriptionTier;
  defaultFolder: string | null;
  anygateHome: string | null;
  logPaths: { ui?: string; trace?: string };
  loading: boolean;
}>({
  loaded: null,
  tier: 'zen',
  defaultFolder: null,
  anygateHome: null,
  logPaths: {},
  loading: false,
});

export async function loadConfig(): Promise<void> {
  config.loading = true;
  try {
    config.loaded = await api.getConfig();
    // ANYGATE_HOME / derived paths are best-effort from env at runtime.
    config.anygateHome = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env?.ANYGATE_HOME ?? null;
  } catch (err) {
    // non-fatal
  } finally {
    config.loading = false;
  }
}

export function setTier(tier: SubscriptionTier): void {
  config.tier = tier;
  // Backend-later: persist to config. For now it's a session-only UI choice.
}
