// Analytics store. Degrades gracefully to mock data when /api/analytics is 404.
import { fetchDashboardAnalytics, type DashboardAnalytics, type RangeId } from '../api/analytics';
import { buildAnalytics } from '../api/analytics-mock';

export const analytics = $state<{
  report: DashboardAnalytics | null;
  range: RangeId;
  loading: boolean;
  error: string | null;
  mock: boolean;
}>({ report: null, range: 'all', loading: false, error: null, mock: true });

export async function loadAnalytics(range: RangeId = analytics.range): Promise<void> {
  analytics.range = range;
  analytics.loading = true;
  try {
    let report: DashboardAnalytics;
    try {
      report = await fetchDashboardAnalytics(range);
      analytics.mock = false;
    } catch {
      // Backend not implemented yet → deterministic mock.
      report = buildAnalytics(range);
      analytics.mock = true;
    }
    analytics.report = report;
    analytics.error = null;
  } catch (err) {
    analytics.error = err instanceof Error ? err.message : String(err);
  } finally {
    analytics.loading = false;
  }
}
