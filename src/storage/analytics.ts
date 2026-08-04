// Local-only analytics: log token usage for every request that flows through
// anygate (Codex, Claude, Antigravity, and the `anygate server` gateway), and
// aggregate it for the dashboard's `GET /api/analytics?range=` endpoint.
//
// Privacy: we store ONLY model name + token counts + timestamp. No prompts,
// no tool arguments, no responses. Storage is an append-only JSONL file under
// the app home (~/.anygate, or ANYGATE_HOME). Aggregation happens on read.

import {
  appendFileSync,
  openSync,
  writeSync,
  closeSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from 'node:fs'
import { join, dirname } from 'node:path'
import { getAppHome } from '../config/paths.js'
import { emitAppEvent } from '../services/event-bus.js'

export type RangeId = 'all' | '30d' | '7d'

// ── storage ────────────────────────────────────────────────────────────────
const ANALYTICS_FILE = 'analytics.jsonl'

export interface UsageEvent {
  ts: string // ISO timestamp of the request
  modelId: string // upstream model id (e.g. 'claude-3-5-sonnet')
  npm?: string // OpenCode api.npm (e.g. '@ai-sdk/anthropic')
  providerId?: string // provider slug (e.g. 'anthropic', 'opencode-go')
  app: string // 'gateway' | 'claude' | 'codex' | 'gemini' | 'antigravity'
  inputTokens: number
  outputTokens: number
}

/**
 * Normalize a model id for aggregation so the same physical model logged via
 * different code paths merges into one dashboard row. The gateway records a
 * display-style name (e.g. "Tencent: Hy3 (free) (Kilo Code)") while the
 * Antigravity gateway records its route displayName / raw upstream id
 * (e.g. "tencent/hy3:free"). We lowercase, unify `/`↔`:` separators, and strip
 * a trailing provider parenthetical so these converge.
 */
export function normalizeModelKey(modelId: string): string {
  return modelId
    .toLowerCase()
    .replace(/\//g, ':')
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Normalize the recorded source app into a stable key. Producers have used
 * mixed casing over time ('Claude' from the proxy routes, 'Antigravity' from
 * the cloud-code gateway, 'gateway' from the server), which split the same app
 * into separate dashboard rows. Applied on read so existing logs converge too.
 */
export function normalizeAppKey(app: string): string {
  const key = app.trim().toLowerCase().replace(/\s+/g, '-')
  return key || 'unknown'
}

function analyticsPath(): string {
  return join(getAppHome(), ANALYTICS_FILE)
}

function appendAtomic(path: string, line: string): void {
  try {
    // The app home may not exist yet on a fresh install — without this the
    // first usage events are silently dropped (both write paths below fail
    // with ENOENT and the catch swallows it).
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
  } catch {
    // Fall through; the write attempts below will fail harmlessly if this did.
  }
  try {
    const fd = openSync(path, 'a', 0o600)
    try {
      writeSync(fd, line + '\n')
    } finally {
      closeSync(fd)
    }
  } catch {
    try {
      appendFileSync(path, line + '\n')
    } catch {
      // Analytics must never break a request. Silently ignore write failures.
    }
  }
}

/** Record a single usage event. Fire-and-forget; errors are swallowed. */
export function recordUsage(event: UsageEvent): void {
  if (!event?.ts || typeof event.modelId !== 'string' || typeof event.app !== 'string') return
  const inputTokens = Math.max(0, Math.floor(event.inputTokens || 0))
  const outputTokens = Math.max(0, Math.floor(event.outputTokens || 0))
  // Skip probe/health-check requests that carry no token usage so they don't
  // pollute real analytics (e.g. gateway capability checks while browsing providers).
  if (inputTokens === 0 && outputTokens === 0) return
  const clean: UsageEvent = {
    ts: event.ts,
    modelId: event.modelId,
    app: event.app,
    inputTokens,
    outputTokens,
  }
  if (event.npm) clean.npm = event.npm
  if (event.providerId) clean.providerId = event.providerId
  appendAtomic(analyticsPath(), JSON.stringify(clean))
  // Push to any live dashboard. Emitting is best-effort and must not throw
  // into the request path that produced the usage.
  try {
    emitAppEvent({
      type: 'usage',
      app: clean.app,
      modelId: clean.modelId,
      ...(clean.providerId ? { providerId: clean.providerId } : {}),
      inputTokens: clean.inputTokens,
      outputTokens: clean.outputTokens,
      ts: clean.ts,
    })
  } catch {
    // Ignore — analytics must never break a request.
  }
}

/** Parse the analytics jsonl into typed events (skips blank/malformed lines). */
export function readAnalyticsLog(): UsageEvent[] {
  const path = analyticsPath()
  if (!existsSync(path)) return []
  let raw: string
  try {
    raw = readFileSync(path, 'utf8')
  } catch {
    return []
  }
  const out: UsageEvent[] = []
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t) continue
    try {
      const e = JSON.parse(t) as UsageEvent
      if (e && typeof e.ts === 'string' && typeof e.modelId === 'string') out.push(e)
    } catch {
      // Skip malformed lines (e.g. a partially-written record from a crash).
    }
  }
  return out
}

// ── aggregation ──────────────────────────────────────────────────────────
// Color palette mirrors ui/src/lib/api/analytics-mock.ts so backend dots match
// the UI. Kept in sync intentionally; no shared module to avoid coupling the
// UI and backend build chains.
const MODEL_PALETTE = [
  'oklch(75% 0.16 65)', // amber (accent)
  'oklch(70% 0.15 200)', // sky blue
  'oklch(68% 0.16 150)', // teal/green
  'oklch(72% 0.17 300)', // violet
  'oklch(70% 0.18 20)', // rose/red
  'oklch(74% 0.15 95)', // gold/yellow
]

export interface HeatDay {
  date: string // YYYY-MM-DD
  count: number // messages/events that day
  intensity: 0 | 1 | 2 | 3 | 4 // bucket for coloring
}

export interface ModelUsage {
  provider: string
  model: string
  tier: string // free | zen | go | both | '' (unknown)
  app: string
  apps: string[] // distinct source apps (gateway, Antigravity, ...) that contributed
  inputTokens: number
  outputTokens: number
  share: number // 0..1
  color: string
}

export interface AppUsage {
  /** Source app: 'gateway' | 'claude' | 'codex' | 'gemini' | 'antigravity'. */
  app: string
  inputTokens: number
  outputTokens: number
  messages: number
  share: number // 0..1 of total tokens
  color: string
}

export interface DashboardAnalytics {
  range: RangeId
  sessions: number
  messages: number
  totalTokens: number
  /** Prompt tokens across the range (already collected per event). */
  inputTokens: number
  /** Completion tokens across the range (already collected per event). */
  outputTokens: number
  activeDays: number
  currentStreakDays: number
  longestStreakDays: number
  peakHour: number // 0..23
  /** Message counts per UTC hour, index 0..23. Drives the hourly rhythm chart. */
  hourly: number[]
  favoriteModel: string
  heatmap: HeatDay[]
  dailyTokens: { date: string; tokens: number }[]
  models: ModelUsage[]
  /** Token/message split by the app that originated the request. */
  apps: AppUsage[]
}

function rangeDays(range: RangeId): number {
  if (range === '7d') return 7
  if (range === '30d') return 30
  return 365
}

function dayKey(iso: string): string {
  return iso.slice(0, 10) // YYYY-MM-DD (ISO is always UTC)
}

function fmtCompact(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`
  return String(n)
}

/**
 * Build a `DashboardAnalytics` payload from the logged events for the given range.
 * Pure/local — safe to call on every request; the log file is small in practice.
 */
export function aggregateAnalytics(range: RangeId): DashboardAnalytics {
  const all = readAnalyticsLog()

  // Filter to the requested range (by UTC day).
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const cutoff = new Date(today)
  cutoff.setUTCDate(today.getUTCDate() - (rangeDays(range) - 1))
  const cutoffIso = cutoff.toISOString()
  const endIso = new Date(today.getTime() + 86_400_000).toISOString()

  const events = all.filter(e => e.ts >= cutoffIso && e.ts <= endIso)

  // ── day-level rollups ──
  const eventsByDay = new Map<string, number>() // day → event count
  const tokensByDay = new Map<string, number>() // day → token sum
  const hourCounts = new Array<number>(24).fill(0)
  const activeDaySet = new Set<string>()

  // ── model-level rollups ──
  // key = providerId|modelId
  const modelMap = new Map<
    string,
    {
      provider: string
      model: string
      app: string
      apps: Set<string>
      inputTokens: number
      outputTokens: number
    }
  >()

  let totalTokens = 0
  let messages = 0
  let totalInputTokens = 0
  let totalOutputTokens = 0

  // app → token/message rollup (the log records `app` on every event, but the
  // aggregate previously dropped it).
  const appMap = new Map<string, { inputTokens: number; outputTokens: number; messages: number }>()

  for (const e of events) {
    const day = dayKey(e.ts)
    const tok = e.inputTokens + e.outputTokens
    totalTokens += tok
    totalInputTokens += e.inputTokens
    totalOutputTokens += e.outputTokens
    messages += 1

    const appKey = normalizeAppKey(e.app || 'unknown')
    const a = appMap.get(appKey) ?? { inputTokens: 0, outputTokens: 0, messages: 0 }
    a.inputTokens += e.inputTokens
    a.outputTokens += e.outputTokens
    a.messages += 1
    appMap.set(appKey, a)

    eventsByDay.set(day, (eventsByDay.get(day) ?? 0) + 1)
    tokensByDay.set(day, (tokensByDay.get(day) ?? 0) + tok)
    activeDaySet.add(day)

    const hour = Number(e.ts.slice(11, 13))
    if (Number.isFinite(hour) && hour >= 0 && hour < 24) hourCounts[hour] += 1

    const provider = e.providerId ?? e.npm?.replace(/^@/, '').replace(/\//g, '-') ?? 'unknown'
    const key = `${provider}|${normalizeModelKey(e.modelId)}`
    const m = modelMap.get(key) ?? {
      provider,
      model: e.modelId,
      app: e.app,
      apps: new Set<string>(),
      inputTokens: 0,
      outputTokens: 0,
    }
    // Prefer a human-readable display name (contains a space) over a raw id like "tencent/hy3:free".
    if (!/\s/.test(m.model) && /\s/.test(e.modelId)) m.model = e.modelId
    m.inputTokens += e.inputTokens
    m.outputTokens += e.outputTokens
    m.apps.add(e.app)
    modelMap.set(key, m)
  }

  // ── heatmap (last N days, intensity 0–4 by daily token volume) ──
  const busiestDay = Math.max(1, ...[...tokensByDay.values()])
  const heatmap: HeatDay[] = []
  for (let i = rangeDays(range) - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setUTCDate(today.getUTCDate() - i)
    const date = d.toISOString().slice(0, 10)
    const tokens = tokensByDay.get(date) ?? 0
    let intensity: 0 | 1 | 2 | 3 | 4 = 0
    if (tokens > 0) {
      // Scale 1–4 by this day's volume relative to the busiest day, but never
      // drop a real-usage day to 0 (that made active days look empty/inactive).
      const pct = tokens / busiestDay // 0..1
      intensity = Math.max(1, Math.min(4, Math.round(1 + pct * 3))) as 0 | 1 | 2 | 3 | 4
    }
    heatmap.push({ date, count: tokens, intensity })
  }

  // ── daily tokens series ──
  const dailyTokens: { date: string; tokens: number }[] = []
  for (let i = rangeDays(range) - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setUTCDate(today.getUTCDate() - i)
    const date = d.toISOString().slice(0, 10)
    dailyTokens.push({ date, tokens: tokensByDay.get(date) ?? 0 })
  }

  // ── streaks (consecutive active days by calendar) ──
  let currentStreak = 0
  for (let i = 0; i < rangeDays(range); i++) {
    const d = new Date(today)
    d.setUTCDate(today.getUTCDate() - i)
    const date = d.toISOString().slice(0, 10)
    if (eventsByDay.has(date)) currentStreak++
    else break
  }
  let longestStreak = 0
  let run = 0
  for (const day of heatmap) {
    if (day.count > 0) {
      run++
      longestStreak = Math.max(longestStreak, run)
    } else run = 0
  }

  // ── peak hour ──
  let peakHour = 0
  let peakCount = -1
  for (let h = 0; h < 24; h++) {
    if (hourCounts[h] > peakCount) {
      peakCount = hourCounts[h]
      peakHour = h
    }
  }

  // ── models ──
  const models: ModelUsage[] = [...modelMap.entries()].map(([, m], idx) => {
    const share = totalTokens > 0 ? (m.inputTokens + m.outputTokens) / totalTokens : 0
    const apps = [...m.apps]
    return {
      provider: m.provider,
      model: m.model,
      tier: '', // source tier isn't tracked in the log; UI shows it from catalog elsewhere
      app: apps[0] ?? m.app,
      apps,
      inputTokens: m.inputTokens,
      outputTokens: m.outputTokens,
      share,
      color: MODEL_PALETTE[idx % MODEL_PALETTE.length],
    }
  })
  models.sort((a, b) => b.share - a.share)

  const favoriteModel = models.length > 0 ? `${models[0].provider}: ${models[0].model}` : ''

  // ── apps ──
  const apps: AppUsage[] = [...appMap.entries()]
    .map(([app, a], idx) => ({
      app,
      inputTokens: a.inputTokens,
      outputTokens: a.outputTokens,
      messages: a.messages,
      share: totalTokens > 0 ? (a.inputTokens + a.outputTokens) / totalTokens : 0,
      color: MODEL_PALETTE[idx % MODEL_PALETTE.length],
    }))
    .sort((x, y) => y.share - x.share)

  return {
    range,
    sessions: activeDaySet.size,
    messages,
    totalTokens,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    activeDays: activeDaySet.size,
    currentStreakDays: currentStreak,
    longestStreakDays: longestStreak,
    peakHour,
    hourly: hourCounts,
    favoriteModel,
    heatmap,
    dailyTokens,
    models,
    apps,
  }
}
