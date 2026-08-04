import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Regression coverage for app attribution.
//
// The dashboard reported ~78% of all tokens as "Server gateway" for a user who
// had never run `anygate server`. Cause: the gateway router hardcoded
// app: 'gateway' at every recordUsage site, but the router is *embedded* by
// launchers (Claude Desktop) as well as being the `anygate server` backend, so
// all embedded traffic was attributed to the gateway.

describe('usage attribution', () => {
  let tempHome: string
  let previous: string | undefined

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-attrib-'))
    previous = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = join(tempHome, 'home')
  })

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true })
    if (previous === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previous
  })

  it('ServerOptions carries an optional app label defaulting to gateway', async () => {
    const src = await import('node:fs').then(fs =>
      fs.readFileSync('src/gateway/server/router.ts', 'utf8')
    )
    // All four recordUsage sites must honour the option rather than hardcoding.
    expect(src).not.toMatch(/app: 'gateway',/)
    expect((src.match(/app: options\.app \?\? 'gateway',/g) ?? []).length).toBe(4)
  })

  it('Claude Desktop identifies itself rather than inheriting gateway', async () => {
    const src = await import('node:fs').then(fs =>
      fs.readFileSync('src/apps/claude/desktop.ts', 'utf8')
    )
    expect(src).toMatch(/app: 'claude-desktop'/)
  })

  it('the Claude proxy catalog path labels its traffic', async () => {
    const src = await import('node:fs').then(fs => fs.readFileSync('src/cli/claude.ts', 'utf8'))
    // startProxyCatalog previously passed no app, so routes built by
    // localModelToRoute (which has no app of its own) fell through to 'gateway'.
    expect(src).toMatch(/startProxyCatalog\(catalogRoutes,[\s\S]*?app: 'Claude'/)
  })

  describe('normalizeAppKey', () => {
    it('folds the mixed casing different producers have used', async () => {
      const { normalizeAppKey } = await import('../../src/storage/analytics.js')
      expect(normalizeAppKey('Claude')).toBe('claude')
      expect(normalizeAppKey('Antigravity')).toBe('antigravity')
      expect(normalizeAppKey('gateway')).toBe('gateway')
      expect(normalizeAppKey('Claude Desktop')).toBe('claude-desktop')
    })

    it('falls back to unknown for blank input', async () => {
      const { normalizeAppKey } = await import('../../src/storage/analytics.js')
      expect(normalizeAppKey('   ')).toBe('unknown')
    })
  })

  it('merges differently-cased records for the same app into one row', async () => {
    const { recordUsage, aggregateAnalytics } = await import('../../src/storage/analytics.js')
    const ts = new Date().toISOString()
    // Historical logs contain both spellings for the same app.
    recordUsage({ ts, modelId: 'm1', app: 'Claude', inputTokens: 60, outputTokens: 0 })
    recordUsage({ ts, modelId: 'm2', app: 'claude', inputTokens: 40, outputTokens: 0 })

    const report = aggregateAnalytics('all')
    expect(report.apps).toHaveLength(1)
    expect(report.apps[0]!.app).toBe('claude')
    expect(report.apps[0]!.inputTokens).toBe(100)
  })

  it('keeps genuinely different apps separate', async () => {
    const { recordUsage, aggregateAnalytics } = await import('../../src/storage/analytics.js')
    const ts = new Date().toISOString()
    recordUsage({ ts, modelId: 'm', app: 'claude-desktop', inputTokens: 70, outputTokens: 0 })
    recordUsage({ ts, modelId: 'm', app: 'gateway', inputTokens: 30, outputTokens: 0 })

    const report = aggregateAnalytics('all')
    const byApp = Object.fromEntries(report.apps.map(a => [a.app, a]))
    expect(byApp['claude-desktop']!.inputTokens).toBe(70)
    expect(byApp['gateway']!.inputTokens).toBe(30)
    expect(byApp['claude-desktop']!.share).toBeCloseTo(0.7, 5)
  })
})
