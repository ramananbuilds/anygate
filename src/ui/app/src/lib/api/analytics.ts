// Typed contract for the dashboard analytics endpoint (backend-later).
// The UI consumes this shape today via a client-side mock; when the backend
// ships `GET /api/analytics?range=`, swap the call in endpoints.ts — no UI change.

export type RangeId = 'all' | '30d' | '7d'

export interface HeatDay {
  date: string // YYYY-MM-DD
  count: number // total tokens that day (drives color intensity)
  intensity: 0 | 1 | 2 | 3 | 4 // bucket for coloring
}

export interface ModelUsage {
  provider: string
  model: string
  tier: string // free | zen | go | both
  app: string // primary source app (gateway | Antigravity | ...)
  apps: string[] // all distinct source apps that contributed usage
  inputTokens: number
  outputTokens: number
  share: number // 0..1
  color: string // dot color (our palette)
}

export interface AppUsage {
  app: string // gateway | claude | codex | gemini | antigravity
  inputTokens: number
  outputTokens: number
  messages: number
  share: number // 0..1
  color: string
}

export interface DashboardAnalytics {
  range: RangeId
  sessions: number
  messages: number
  totalTokens: number
  inputTokens: number
  outputTokens: number
  activeDays: number
  currentStreakDays: number
  longestStreakDays: number
  peakHour: number // 0..23
  /** Message counts per UTC hour, index 0..23. */
  hourly: number[]
  favoriteModel: string
  heatmap: HeatDay[]
  dailyTokens: { date: string; tokens: number }[]
  models: ModelUsage[]
  apps: AppUsage[]
}

export async function fetchDashboardAnalytics(range: RangeId): Promise<DashboardAnalytics> {
  const res = await fetch(`/api/analytics?range=${range}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`analytics ${res.status}`)
  const raw = (await res.json()) as Partial<DashboardAnalytics>
  // Normalize array/number fields so a response from an older backend can't
  // crash a chart with `undefined.map`.
  return {
    ...(raw as DashboardAnalytics),
    hourly:
      Array.isArray(raw.hourly) && raw.hourly.length === 24 ? raw.hourly : new Array(24).fill(0),
    apps: Array.isArray(raw.apps) ? raw.apps : [],
    models: Array.isArray(raw.models) ? raw.models : [],
    heatmap: Array.isArray(raw.heatmap) ? raw.heatmap : [],
    dailyTokens: Array.isArray(raw.dailyTokens) ? raw.dailyTokens : [],
    inputTokens: raw.inputTokens ?? 0,
    outputTokens: raw.outputTokens ?? 0,
  }
}
