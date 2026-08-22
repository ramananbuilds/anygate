// C5: budget tracker unit tests — day/month rollover, persistence round-trip,
// exceeded detection, and disabled-by-default behavior.
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { rmSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { BudgetTracker, loadBudgetConfig } from '../../src/gateway/server/budget.js'

const TEST_HOME = join(tmpdir(), `anygate-budget-test-${process.pid}`)

beforeEach(() => {
  mkdirSync(TEST_HOME, { recursive: true })
  process.env.ANYGATE_HOME = TEST_HOME
})

afterEach(() => {
  try {
    rmSync(TEST_HOME, { recursive: true, force: true })
  } catch {
    // best-effort cleanup
  }
})

function dateAtUtc(iso: string): Date {
  return new Date(iso)
}

describe('BudgetTracker', () => {
  it('allows everything when disabled (default)', () => {
    const t = new BudgetTracker({})
    expect(t.enabled).toBe(false)
    expect(t.check()).toEqual({ allowed: true })
    t.add(1_000_000, 1_000_000) // no cap configured → still allowed
    expect(t.check()).toEqual({ allowed: true })
  })

  it('does not enforce when enabled but no caps set', () => {
    const t = new BudgetTracker({ enabled: true })
    expect(t.check().allowed).toBe(true)
  })

  it('blocks once the daily budget is exceeded', () => {
    const t = new BudgetTracker(
      { enabled: true, maxTokensPerDay: 100 },
      dateAtUtc('2026-08-22T10:00:00Z')
    )
    expect(t.check().allowed).toBe(true)
    t.add(60, 30) // 90 total
    expect(t.check().allowed).toBe(true)
    t.add(20, 0) // 110 total → over the 100/day cap
    const verdict = t.check()
    expect(verdict.allowed).toBe(false)
    expect(verdict.reason).toContain('Daily token budget exceeded')
    expect(verdict.reason).toContain('110/100')
  })

  it('blocks once the monthly budget is exceeded even with daily headroom', () => {
    const t = new BudgetTracker(
      { enabled: true, maxTokensPerMonth: 200 },
      dateAtUtc('2026-08-22T10:00:00Z')
    )
    t.add(150, 60) // 210 monthly → over cap
    const verdict = t.check()
    expect(verdict.allowed).toBe(false)
    expect(verdict.reason).toContain('Monthly token budget exceeded')
  })

  it('rolls over the daily counter at UTC midnight', () => {
    const t = new BudgetTracker(
      { enabled: true, maxTokensPerDay: 100 },
      dateAtUtc('2026-08-22T23:59:00Z')
    )
    t.add(80, 19) // 99 — just under
    expect(t.check().allowed).toBe(true)

    // Persist state, then construct a fresh tracker "the next day".
    const nextDay = dateAtUtc('2026-08-23T00:01:00Z')
    const t2 = new BudgetTracker({ enabled: true, maxTokensPerDay: 100 }, nextDay)
    expect(t2.check().allowed).toBe(true)
    expect(t2.snapshot().day).toBe('2026-08-23')
    expect(t2.snapshot().dayTokens).toBe(0)
  })

  it('rolls over the monthly counter across months', () => {
    const t = new BudgetTracker(
      { enabled: true, maxTokensPerMonth: 50 },
      dateAtUtc('2026-08-31T12:00:00Z')
    )
    t.add(40, 20) // 60 > 50 → blocked on Aug 31
    expect(t.check().allowed).toBe(false)

    const nextMonth = dateAtUtc('2026-09-01T00:05:00Z')
    const t2 = new BudgetTracker({ enabled: true, maxTokensPerMonth: 50 }, nextMonth)
    expect(t2.check().allowed).toBe(true)
    expect(t2.snapshot().monthTokens).toBe(0)
  })

  it('persists usage across tracker instances (restart survival)', () => {
    const t1 = new BudgetTracker(
      { enabled: true, maxTokensPerDay: 100 },
      dateAtUtc('2026-08-22T10:00:00Z')
    )
    t1.add(70, 25) // 95 persisted

    const t2 = new BudgetTracker(
      { enabled: true, maxTokensPerDay: 100 },
      dateAtUtc('2026-08-22T11:00:00Z')
    )
    // Same day: counters survive restart.
    expect(t2.snapshot().dayTokens).toBe(95)
    expect(t2.check().allowed).toBe(true)
    t2.add(10, 0) // 105 → now over
    expect(t2.check().allowed).toBe(false)
  })

  it('ignores negative/garbage adds', () => {
    const t = new BudgetTracker({ enabled: true, maxTokensPerDay: 100 })
    t.add(-5, -3)
    expect(t.snapshot().dayTokens).toBe(0)
  })

  it('corrupt state file resets to a fresh period instead of crashing', () => {
    const { writeFileSync } = require('node:fs') as typeof import('node:fs')
    writeFileSync(join(TEST_HOME, 'budget-state.json'), '{ not json !!!')
    const t = new BudgetTracker(
      { enabled: true, maxTokensPerDay: 100 },
      dateAtUtc('2026-08-22T10:00:00Z')
    )
    expect(t.snapshot().dayTokens).toBe(0)
    expect(t.check().allowed).toBe(true)
  })
})

describe('loadBudgetConfig', () => {
  it('returns {} when config has no server block', () => {
    expect(loadBudgetConfig(() => ({}))).toEqual({})
  })

  it('returns the budget block when present', () => {
    const cfg = loadBudgetConfig(() => ({
      server: { budget: { enabled: true, maxTokensPerDay: 500 } },
    }))
    expect(cfg.enabled).toBe(true)
    expect(cfg.maxTokensPerDay).toBe(500)
  })
})
