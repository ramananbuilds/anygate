import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  recordUsage,
  aggregateAnalytics,
  readAnalyticsLog,
  type UsageEvent,
} from '../src/core/analytics-log.js';

// Use a temp app home so we never touch the real ~/.anygate.
const TMP = mkdtempSync(join(tmpdir(), 'anygate-analytics-'));
process.env.ANYGATE_HOME = TMP;

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(13, 0, 0, 0); // 1 PM — a stable peak hour
  return d.toISOString();
}

function ev(over: Partial<UsageEvent> & Pick<UsageEvent, 'ts' | 'modelId' | 'app'>): UsageEvent {
  return { inputTokens: 0, outputTokens: 0, ...over };
}

afterAll(() => {
  rmSync(TMP, { recursive: true, force: true });
  delete process.env.ANYGATE_HOME;
});

describe('analytics-log', () => {
  beforeEach(() => {
    // Start each test with a clean log by pointing at a fresh subdir.
    const run = mkdtempSync(join(tmpdir(), 'anygate-analytics-run-'));
    process.env.ANYGATE_HOME = run;
  });

  it('records and reads back usage events', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'claude-sonnet', app: 'Claude', inputTokens: 10, outputTokens: 5 }));
    const log = readAnalyticsLog();
    expect(log).toHaveLength(1);
    expect(log[0]!.modelId).toBe('claude-sonnet');
    expect(log[0]!.inputTokens).toBe(10);
    expect(log[0]!.outputTokens).toBe(5);
  });

  it('clamps negative token counts to 0 and skips the resulting probe', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'm', app: 'Codex', inputTokens: -3, outputTokens: -1 }));
    // Clamped to 0/0 → treated as a probe and not recorded.
    expect(readAnalyticsLog()).toHaveLength(0);
  });

  it('ignores invalid events', () => {
    // @ts-expect-error testing runtime guard
    recordUsage({} as UsageEvent);
    expect(readAnalyticsLog()).toHaveLength(0);
  });

  it('skips zero-token probe/health-check events', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'claude-native', app: 'gateway', inputTokens: 0, outputTokens: 0 }));
    expect(readAnalyticsLog()).toHaveLength(0);
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'claude-native', app: 'gateway', inputTokens: 1, outputTokens: 0 }));
    expect(readAnalyticsLog()).toHaveLength(1);
  });

  it('aggregates totals, sessions, and messages', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'a', app: 'Claude', inputTokens: 100, outputTokens: 50 }));
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'b', app: 'Claude', inputTokens: 200, outputTokens: 100 }));
    recordUsage(ev({ ts: daysAgoIso(5), modelId: 'a', app: 'Codex', inputTokens: 40, outputTokens: 60 }));

    const a = aggregateAnalytics('all');
    expect(a.messages).toBe(3);
    expect(a.totalTokens).toBe(100 + 50 + 200 + 100 + 40 + 60);
    expect(a.activeDays).toBe(2); // two distinct UTC days
    expect(a.sessions).toBe(2);
  });

  it('filters by range', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'a', app: 'Claude', inputTokens: 1, outputTokens: 1 }));
    recordUsage(ev({ ts: daysAgoIso(10), modelId: 'b', app: 'Codex', inputTokens: 999, outputTokens: 999 }));

    expect(aggregateAnalytics('7d').messages).toBe(1);
    expect(aggregateAnalytics('30d').messages).toBe(2);
    expect(aggregateAnalytics('all').messages).toBe(2);
  });

  it('computes streaks and peak hour', () => {
    // Today + yesterday active, 3 days ago active, gap before.
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'a', app: 'Claude', inputTokens: 1 }));
    recordUsage(ev({ ts: daysAgoIso(1), modelId: 'a', app: 'Claude', inputTokens: 1 }));
    recordUsage(ev({ ts: daysAgoIso(3), modelId: 'a', app: 'Claude', inputTokens: 1 }));

    const a = aggregateAnalytics('all');
    expect(a.currentStreakDays).toBe(2); // today + yesterday
    expect(a.longestStreakDays).toBe(2);
    expect(a.peakHour).toBe(13);
  });

  it('favorite model is the top model by tokens', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'popular', providerId: 'opencode-go', app: 'Claude', inputTokens: 500, outputTokens: 500 }));
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'rare', providerId: 'opencode-go', app: 'Claude', inputTokens: 1, outputTokens: 1 }));

    const a = aggregateAnalytics('all');
    expect(a.favoriteModel).toContain('popular');
    expect(a.favoriteModel).toBe('opencode-go: popular');
  });

  it('model shares sum to ~1 and are sorted descending', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'x', providerId: 'p', app: 'Claude', inputTokens: 300, outputTokens: 0 }));
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'y', providerId: 'p', app: 'Codex', inputTokens: 100, outputTokens: 0 }));

    const a = aggregateAnalytics('all');
    const sum = a.models.reduce((s, m) => s + m.share, 0);
    expect(sum).toBeCloseTo(1, 5);
    expect(a.models[0]!.share).toBeGreaterThanOrEqual(a.models[1]!.share);
    // every model carries an app label
    for (const m of a.models) expect(['Claude', 'Codex', 'Antigravity', 'gateway']).toContain(m.app);
  });

  it('attributes Antigravity usage separately by app label', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'gemini-flash', providerId: 'antigravity', app: 'Antigravity', inputTokens: 400, outputTokens: 100 }));
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'claude-sonnet', providerId: 'anthropic', app: 'Claude', inputTokens: 10, outputTokens: 10 }));

    const a = aggregateAnalytics('all');
    const agy = a.models.find(m => m.app === 'Antigravity');
    expect(agy).toBeDefined();
    expect(agy!.model).toBe('gemini-flash');
    expect(agy!.provider).toBe('antigravity');
    expect(agy!.inputTokens).toBe(400);
    expect(agy!.outputTokens).toBe(100);
  });

  it('daily token series and heatmap cover the full range with zero-fill', () => {
    recordUsage(ev({ ts: daysAgoIso(0), modelId: 'a', app: 'Claude', inputTokens: 10, outputTokens: 10 }));
    const a = aggregateAnalytics('7d');
    expect(a.dailyTokens).toHaveLength(7);
    expect(a.heatmap).toHaveLength(7);
    expect(a.dailyTokens[a.dailyTokens.length - 1]!.tokens).toBe(20);
    // heatmap.count now carries the day's token volume (not event count)
    expect(a.heatmap[a.heatmap.length - 1]!.count).toBe(20);
    expect(a.heatmap[a.heatmap.length - 1]!.intensity).toBeGreaterThan(0);
  });
});
