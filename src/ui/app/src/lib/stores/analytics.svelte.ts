// Analytics store. Always reflects real data from the node backend.
// There is intentionally NO mock fallback: if /api/analytics is unreachable
// we surface an honest error/empty state rather than fake numbers.
import { fetchDashboardAnalytics, type DashboardAnalytics, type RangeId } from '../api/analytics'

export const analytics = $state<{
  report: DashboardAnalytics | null
  range: RangeId
  loading: boolean
  error: string | null
  /** True when the backend returned a real report with at least one token. */
  hasData: boolean
}>({ report: null, range: 'all', loading: false, error: null, hasData: false })

// Monotonic request counter. Rapid range switching can resolve out of order, so
// only the newest in-flight request is allowed to publish its result.
let requestSeq = 0

export async function loadAnalytics(range: RangeId = analytics.range): Promise<void> {
  const seq = ++requestSeq
  analytics.range = range
  analytics.loading = true
  analytics.error = null
  try {
    const report = await fetchDashboardAnalytics(range)
    if (seq !== requestSeq) return
    analytics.report = report
    analytics.hasData = report.totalTokens > 0 || report.messages > 0
  } catch (err) {
    if (seq !== requestSeq) return
    analytics.report = null
    analytics.hasData = false
    analytics.error =
      err instanceof Error
        ? `Couldn't reach the analytics backend (${err.message}). Run \`anygate ui\` and reload.`
        : 'Couldn’t reach the analytics backend. Run `anygate ui` and reload.'
  } finally {
    if (seq === requestSeq) analytics.loading = false
  }
}
