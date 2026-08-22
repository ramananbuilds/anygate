// C5: optional token-budget guardrails for the gateway server.
//
// Scope (intentionally minimal for v1): per-server-process, all providers
// combined. Config lives in ~/.anygate/config.json under server.budget:
//
//   "server": { "budget": { "enabled": true, "maxTokensPerDay": 500000,
//                            "maxTokensPerMonth": 5000000 } }
//
// State persists to budget-state.json in the app home so restarts don't
// reset the running total. All date keys are UTC.

import { existsSync, mkdirSync, openSync, readFileSync, writeSync, closeSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { getAppHome } from '../../config/paths.js'

export interface BudgetConfig {
  enabled?: boolean
  maxTokensPerDay?: number
  maxTokensPerMonth?: number
}

const STATE_FILENAME = 'budget-state.json'

function utcDayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10) // YYYY-MM-DD
}

function utcMonthKey(now = new Date()): string {
  return now.toISOString().slice(0, 7) // YYYY-MM
}

interface BudgetState {
  day: string
  dayTokens: number
  month: string
  monthTokens: number
}

function statePath(): string {
  return join(getAppHome(), STATE_FILENAME)
}

function emptyState(now = new Date()): BudgetState {
  return { day: utcDayKey(now), dayTokens: 0, month: utcMonthKey(now), monthTokens: 0 }
}

/** Read persisted state; returns a fresh state if absent/corrupt/date-mismatched is handled by caller. */
function readStateFile(): BudgetState | null {
  const path = statePath()
  if (!existsSync(path)) return null
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as Partial<BudgetState>
    if (
      typeof raw.day !== 'string' ||
      typeof raw.month !== 'string' ||
      typeof raw.dayTokens !== 'number' ||
      typeof raw.monthTokens !== 'number'
    ) {
      return null
    }
    return raw as BudgetState
  } catch {
    return null
  }
}

/** Atomic single-line append-free rewrite: state files are tiny; sync write with 0600 like config.json. */
function writeState(state: BudgetState): void {
  const path = statePath()
  try {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
  } catch {
    // fall through — the write below will fail loudly enough in tests.
  }
  try {
    const json = `${JSON.stringify(state)}\n`
    // Write-temp-then-rename would be nicer, but the file is <100 bytes and
    // torn writes are detected by readStateFile's validation + fresh-reset.
    const fd = openSync(path, 'w', 0o600)
    try {
      writeSync(fd, json)
    } finally {
      closeSync(fd)
    }
  } catch {
    // Persistence is best-effort enforcement aid; never throw into request path.
  }
}

/**
 * Rolling token budget tracker.
 * - `check()` answers "can a request proceed?" (optionally reserving nothing;
 *   enforcement is post-hoc on actual usage).
 * - `add()` records actual usage after each response.
 */
export class BudgetTracker {
  private state: BudgetState

  constructor(
    private readonly config: BudgetConfig,
    now = new Date()
  ) {
    this.state = this.loadRollover(now)
  }

  private loadRollover(now: Date): BudgetState {
    const persisted = readStateFile()
    const day = utcDayKey(now)
    const month = utcMonthKey(now)
    if (!persisted) return emptyState(now)
    return {
      day,
      // Day/month rollover: stale periods reset to zero automatically.
      dayTokens: persisted.day === day ? persisted.dayTokens : 0,
      month,
      monthTokens: persisted.month === month ? persisted.monthTokens : 0,
    }
  }

  get enabled(): boolean {
    return this.config.enabled === true
  }

  private dayExceeded(): boolean {
    const max = this.config.maxTokensPerDay
    return typeof max === 'number' && max > 0 && this.state.dayTokens >= max
  }

  private monthExceeded(): boolean {
    const max = this.config.maxTokensPerMonth
    return typeof max === 'number' && max > 0 && this.state.monthTokens >= max
  }

  /** Check whether requests may proceed under the configured budgets. */
  check(): { allowed: boolean; reason?: string } {
    if (!this.enabled) return { allowed: true }
    // Refresh rollover lazily so a long-running server rolls at midnight UTC.
    const now = new Date()
    if (this.state.day !== utcDayKey(now)) this.state.dayTokens = 0
    if (this.state.month !== utcMonthKey(now)) this.state.monthTokens = 0
    if (this.dayExceeded()) {
      return {
        allowed: false,
        reason: `Daily token budget exceeded (${this.state.dayTokens}/${this.config.maxTokensPerDay}).`,
      }
    }
    if (this.monthExceeded()) {
      return {
        allowed: false,
        reason: `Monthly token budget exceeded (${this.state.monthTokens}/${this.config.maxTokensPerMonth}).`,
      }
    }
    return { allowed: true }
  }

  /** Record actual usage after a completed response. */
  add(inputTokens: number, outputTokens: number): void {
    const total = Math.max(0, inputTokens) + Math.max(0, outputTokens)
    if (total === 0) return
    const now = new Date()
    if (this.state.day !== utcDayKey(now)) {
      this.state.day = utcDayKey(now)
      this.state.dayTokens = 0
    }
    if (this.state.month !== utcMonthKey(now)) {
      this.state.month = utcMonthKey(now)
      this.state.monthTokens = 0
    }
    this.state.dayTokens += total
    this.state.monthTokens += total
    writeState(this.state)
  }

  /** Current counters (for dashboards/tests). */
  snapshot(): { day: string; dayTokens: number; month: string; monthTokens: number } {
    return { ...this.state }
  }
}

/** Load budget config from user preferences (config.json → server.budget). */
export function loadBudgetConfig(read: () => { server?: { budget?: BudgetConfig } }): BudgetConfig {
  const cfg = read()?.server?.budget
  return cfg ?? {}
}
