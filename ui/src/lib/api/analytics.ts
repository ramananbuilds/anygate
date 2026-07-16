// Typed contract for the dashboard analytics endpoint (backend-later).
// The UI consumes this shape today via a client-side mock; when the backend
// ships `GET /api/analytics?range=`, swap the call in endpoints.ts — no UI change.

export type RangeId = 'all' | '30d' | '7d';

export interface HeatDay {
  date: string; // YYYY-MM-DD
  count: number; // messages/sessions that day
  intensity: 0 | 1 | 2 | 3 | 4; // bucket for coloring
}

export interface ModelUsage {
  provider: string;
  model: string;
  tier: string; // free | zen | go | both
  app: string; // Claude | Codex | Antigravity
  inputTokens: number;
  outputTokens: number;
  share: number; // 0..1
  color: string; // dot color (our palette)
}

export interface DashboardAnalytics {
  range: RangeId;
  sessions: number;
  messages: number;
  totalTokens: number;
  activeDays: number;
  currentStreakDays: number;
  longestStreakDays: number;
  peakHour: number; // 0..23
  favoriteModel: string;
  heatmap: HeatDay[];
  dailyTokens: { date: string; tokens: number }[];
  models: ModelUsage[];
}

export async function fetchDashboardAnalytics(range: RangeId): Promise<DashboardAnalytics> {
  const res = await fetch(`/api/analytics?range=${range}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`analytics ${res.status}`);
  return (await res.json()) as DashboardAnalytics;
}
