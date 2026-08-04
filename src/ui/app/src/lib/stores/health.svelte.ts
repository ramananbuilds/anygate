// Health / Doctor store, backed by the real `GET /api/health` diagnostics.
// There is intentionally NO fallback report: if the endpoint is unreachable we
// surface an error so the panel can say so, rather than rendering invented
// green checks that look authoritative.
import * as api from '../api/endpoints'
import type { HealthReport } from '../api/types'

export const health = $state<{
  report: HealthReport | null
  /** True once a real report has been received (regardless of pass/fail). */
  available: boolean
  loading: boolean
  error: string | null
}>({ report: null, available: false, loading: false, error: null })

export async function loadHealth(): Promise<void> {
  health.loading = true
  health.error = null
  try {
    const report = await api.getHealth()
    health.report = report
    // `available` means "we have real data", not "every check passed" — a
    // failing check is still a successful health read.
    health.available = true
  } catch (err) {
    health.report = null
    health.available = false
    health.error = err instanceof Error ? err.message : String(err)
  } finally {
    health.loading = false
  }
}
