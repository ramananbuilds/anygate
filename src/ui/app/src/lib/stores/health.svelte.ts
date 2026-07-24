// Health / Doctor store. Degrades gracefully when /api/health is 404.
import * as api from '../api/endpoints';
import type { HealthReport } from '../api/types';

export const health = $state<{
  report: HealthReport | null;
  available: boolean; // false when backend doesn't implement /api/health yet
  loading: boolean;
  error: string | null;
}>({ report: null, available: false, loading: false, error: null });

export async function loadHealth(): Promise<void> {
  health.loading = true;
  try {
    const report = await api.getHealth();
    health.report = report;
    health.available = report.ok || Boolean(report.keychain?.available) || (report.conflictingEnvVars?.length ?? 0) > 0;
  } catch (err) {
    health.error = err instanceof Error ? err.message : String(err);
    health.available = false;
  } finally {
    health.loading = false;
  }
}
