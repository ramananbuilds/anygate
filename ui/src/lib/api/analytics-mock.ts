// Client-side mock for the dashboard analytics contract. Mirrors the health
// fallback pattern: the UI is fully functional before the backend ships
// /api/analytics. Deterministic (seeded) so the dashboard looks stable across
// reloads instead of flickering random numbers.

import type { DashboardAnalytics, RangeId, ModelUsage, HeatDay } from './analytics';

type Range = RangeId;

// Tiny seeded PRNG (mulberry32) so mock data is stable per range.
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MODEL_PALETTE = [
  'oklch(75% 0.16 65)', // amber (accent)
  'oklch(70% 0.15 200)', // sky blue
  'oklch(68% 0.16 150)', // teal/green
  'oklch(72% 0.17 300)', // violet
  'oklch(70% 0.18 20)', // rose/red
  'oklch(74% 0.15 95)', // gold/yellow
];

interface ModelSeed {
  provider: string;
  model: string;
  tier: string;
  app: string;
}

const MODEL_SEEDS: ModelSeed[] = [
  { provider: 'NVIDIA', model: 'Nemotron-70B', tier: 'free', app: 'Claude' },
  { provider: 'OpenCode', model: 'Go-DeepSeek-v4', tier: 'go', app: 'Codex' },
  { provider: 'Anthropic', model: 'Claude Sonnet 4', tier: 'zen', app: 'Claude' },
  { provider: 'OpenAI', model: 'GPT-5.4', tier: 'go', app: 'Codex' },
  { provider: 'Google', model: 'Gemini 2.5 Pro', tier: 'free', app: 'Antigravity' },
  { provider: 'xAI', model: 'Grok-4', tier: 'go', app: 'Codex' },
];

function rangeDays(range: Range): number {
  if (range === '7d') return 7;
  if (range === '30d') return 30;
  return 365;
}

function buildHeatmap(range: Range, rand: () => number): { days: HeatDay[]; activeDays: number } {
  const n = rangeDays(range);
  const days: HeatDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let activeDays = 0;
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Weekends quieter; recent days a bit busier.
    const dow = d.getDay();
    const weekendDamp = dow === 0 || dow === 6 ? 0.45 : 1;
    const recency = 0.6 + 0.4 * (1 - i / n);
    const roll = rand();
    const intensity = Math.max(0, Math.min(4, Math.round(roll * 4 * weekendDamp * recency))) as 0 | 1 | 2 | 3 | 4;
    if (intensity > 0) activeDays++;
    days.push({
      date: d.toISOString().slice(0, 10),
      count: intensity === 0 ? 0 : Math.round((20 + rand() * 180) * intensity),
      intensity,
    });
  }
  return { days, activeDays };
}

function buildDailySeries(range: Range, rand: () => number): { date: string; tokens: number }[] {
  const n = rangeDays(range);
  const out: { date: string; tokens: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay();
    const weekendDamp = dow === 0 || dow === 6 ? 0.5 : 1;
    const base = (1_200_000 + rand() * 9_800_000) * weekendDamp;
    out.push({ date: d.toISOString().slice(0, 10), tokens: Math.round(base) });
  }
  return out;
}

function buildModels(range: Range, rand: () => number): ModelUsage[] {
  const weights = MODEL_SEEDS.map(() => 0.4 + rand());
  const sum = weights.reduce((a, b) => a + b, 0);
  const out: ModelUsage[] = MODEL_SEEDS.map((s, i) => {
    const share = weights[i] / sum;
    const total = Math.round((8_000_000 + rand() * 90_000_000) * (range === '7d' ? 0.25 : range === '30d' ? 0.7 : 1));
    const input = Math.round(total * (0.78 + rand() * 0.06));
    return {
      provider: s.provider,
      model: s.model,
      tier: s.tier,
      app: s.app,
      inputTokens: input,
      outputTokens: total - input,
      share,
      color: MODEL_PALETTE[i % MODEL_PALETTE.length],
    };
  });
  out.sort((a, b) => b.share - a.share);
  return out;
}

function fmtCompact(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return String(n);
}

export function buildAnalytics(range: Range): DashboardAnalytics {
  const seed = range === '7d' ? 7 : range === '30d' ? 30 : 365;
  const rand = rng(seed * 2654435761);

  const heat = buildHeatmap(range, rand);
  const daily = buildDailySeries(range, rand);
  const models = buildModels(range, rand);

  const totalTokens = daily.reduce((a, b) => a + b.tokens, 0);
  const messages = Math.round(totalTokens / 1600);
  const sessions = Math.round(messages / (range === '7d' ? 577 : range === '30d' ? 577 : 577));
  const activeDays = heat.activeDays;

  // Streaks from heatmap intensity>0.
  let current = 0;
  for (let i = heat.days.length - 1; i >= 0; i--) {
    if (heat.days[i].intensity > 0) current++;
    else break;
  }
  let longest = 0;
  let run = 0;
  for (const d of heat.days) {
    if (d.intensity > 0) {
      run++;
      longest = Math.max(longest, run);
    } else run = 0;
  }

  // Peak hour: synthesize a plausible distribution.
  const peakHour = 19; // 7 PM, matches the spec example vibe

  const fav = models[0];

  return {
    range,
    sessions,
    messages,
    totalTokens,
    activeDays,
    currentStreakDays: current,
    longestStreakDays: longest,
    peakHour,
    favoriteModel: `${fav.provider}: ${fav.model}`,
    heatmap: heat.days,
    dailyTokens: daily,
    models,
  };
}
