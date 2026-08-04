import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMockRequest, createMockResponse } from '../helpers/ui-api-test-utils.js'

// Regression coverage for the four dashboard defects fixed together:
//  1. OAuth routes were renamed backend-side (b88a876) but no client followed.
//  2. GET /api/health did not exist, so the UI rendered a fabricated report.
//  3. (client-side) analytics double-fetch — covered in the store, not here.
//  4. Launch presets never reached the backend.

vi.mock('../../src/apps/shared/native-launcher.js', () => ({
  getSupportedApps: () => [],
  getSupportedApp: () => undefined,
  detectApp: () => ({ installed: false, path: null }),
  getGatewayLaunchCommand: () => 'anygate',
}))

async function call(method: string, url: string, body?: unknown) {
  const { handleUiApiRequest } = await import('../../src/ui/api.js')
  const req = createMockRequest(method, url, body !== undefined ? JSON.stringify(body) : undefined)
  const mockRes = createMockResponse()
  handleUiApiRequest(req, mockRes.res, {})
  // Health runs a real port probe + credential-store read, so allow time.
  await new Promise(resolve => setTimeout(resolve, 400))
  return { code: mockRes.result.code, body: JSON.parse(mockRes.result.data) }
}

describe('ui dashboard defect fixes', () => {
  let tempHome: string
  let previous: string | undefined

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-ui-fixes-'))
    previous = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = join(tempHome, 'home')
  })

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true })
    if (previous === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previous
  })

  // ── 1. OAuth route contract ────────────────────────────────────────────
  describe('OAuth route aliases', () => {
    // Both spellings must resolve to the same handler. A 404 here means a
    // client got stranded by a rename again.
    for (const path of ['/api/providers/oauth/start', '/api/providers/auth/start']) {
      it(`POST ${path} reaches the handler (not 404)`, async () => {
        const { code, body } = await call('POST', path, { providerId: 'not-a-real-provider' })
        expect(code).not.toBe(404)
        // Rejected on provider validation, proving the route was matched.
        expect(code).toBe(400)
        expect(String(body.error)).toContain('providerId must be one of')
      })
    }

    for (const path of ['/api/providers/oauth/status', '/api/providers/auth/status']) {
      it(`GET ${path} reaches the handler, not the router fallback`, async () => {
        const { body } = await call('GET', `${path}?sessionId=missing`)
        // The handler's own 404 says "Session not found or expired"; the router's
        // unmatched-route 404 says "Not found". Only the latter is a regression.
        expect(body.error).not.toBe('Not found')
        expect(body.error).toContain('Session not found')
      })
    }
  })

  // ── 2. Real health endpoint ────────────────────────────────────────────
  describe('GET /api/health', () => {
    it('returns a real diagnostic report matching the UI contract', async () => {
      const { code, body } = await call('GET', '/api/health')
      expect(code).toBe(200)
      expect(body).toMatchObject({
        ok: expect.any(Boolean),
        nodeVersion: expect.any(String),
        keychain: { available: expect.any(Boolean) },
        conflictingEnvVars: expect.any(Array),
        gatewayPort: 17645,
        port17645Available: expect.any(Boolean),
      })
    })

    it('reports every named check with a stable id', async () => {
      const { body } = await call('GET', '/api/health')
      const ids = (body.checks as { id: string }[]).map(c => c.id)
      expect(ids).toEqual(
        expect.arrayContaining([
          'node',
          'keychain',
          'opencode-key',
          'env-conflicts',
          'gateway-port',
        ])
      )
      for (const check of body.checks) {
        expect(check).toMatchObject({
          id: expect.any(String),
          label: expect.any(String),
          ok: expect.any(Boolean),
          detail: expect.any(String),
          critical: expect.any(Boolean),
        })
      }
    })

    it('reports conflicting env vars as names, never as objects', async () => {
      process.env['ANTHROPIC_API_KEY'] = 'sk-test-conflict'
      try {
        const { body } = await call('GET', '/api/health')
        expect(body.conflictingEnvVars).toContain('ANTHROPIC_API_KEY')
        for (const name of body.conflictingEnvVars) expect(typeof name).toBe('string')
        // The detail string must not leak the secret value.
        const conflictCheck = body.checks.find((c: { id: string }) => c.id === 'env-conflicts')
        expect(conflictCheck.detail).toContain('ANTHROPIC_API_KEY')
        expect(conflictCheck.detail).not.toContain('sk-test-conflict')
        expect(conflictCheck.detail).not.toContain('[object Object]')
      } finally {
        delete process.env['ANTHROPIC_API_KEY']
      }
    })
  })

  // ── 4. Preset persistence ──────────────────────────────────────────────
  describe('/api/presets', () => {
    it('starts empty', async () => {
      const { code, body } = await call('GET', '/api/presets')
      expect(code).toBe(200)
      expect(body.presets).toEqual([])
    })

    it('round-trips presets through the config file on disk', async () => {
      const preset = {
        id: 'p1',
        appId: 'claude',
        providerId: 'anthropic',
        modelId: 'claude-sonnet-4-5',
        label: 'Daily driver',
      }
      const saved = await call('POST', '/api/presets', { presets: [preset] })
      expect(saved.code).toBe(200)
      expect(saved.body.ok).toBe(true)

      const reread = await call('GET', '/api/presets')
      expect(reread.body.presets).toEqual([preset])

      // Must be durable, not in-memory: assert it hit the config file.
      const configPath = join(process.env['ANYGATE_HOME']!, 'config.json')
      expect(existsSync(configPath)).toBe(true)
      expect(JSON.parse(readFileSync(configPath, 'utf8')).launchPresets).toEqual([preset])
    })

    it('rejects a non-array payload with 400', async () => {
      const { code } = await call('POST', '/api/presets', { presets: 'nope' })
      expect(code).toBe(400)
    })

    it('drops entries missing required identity fields', async () => {
      const { body } = await call('POST', '/api/presets', {
        presets: [{ id: 'ok', appId: 'codex' }, { appId: 'no-id' }, { id: 'no-app' }, null, 'junk'],
      })
      expect(body.presets).toEqual([{ id: 'ok', appId: 'codex' }])
    })

    it('strips unknown keys so clients cannot write arbitrary config', async () => {
      const { body } = await call('POST', '/api/presets', {
        presets: [{ id: 'p', appId: 'claude', savedServerPassword: 'pwned', nested: { a: 1 } }],
      })
      expect(body.presets[0]).toEqual({ id: 'p', appId: 'claude' })
      expect(body.presets[0]).not.toHaveProperty('savedServerPassword')
    })

    it('de-duplicates repeated ids, last write winning', async () => {
      const { body } = await call('POST', '/api/presets', {
        presets: [
          { id: 'dup', appId: 'claude', label: 'first' },
          { id: 'dup', appId: 'codex', label: 'second' },
        ],
      })
      expect(body.presets).toHaveLength(1)
      expect(body.presets[0].label).toBe('second')
    })

    it('clears the stored key when saving an empty list', async () => {
      await call('POST', '/api/presets', { presets: [{ id: 'x', appId: 'claude' }] })
      await call('POST', '/api/presets', { presets: [] })
      const { body } = await call('GET', '/api/presets')
      expect(body.presets).toEqual([])
      const configPath = join(process.env['ANYGATE_HOME']!, 'config.json')
      expect(JSON.parse(readFileSync(configPath, 'utf8'))).not.toHaveProperty('launchPresets')
    })

    it('preserves unrelated preferences when writing presets', async () => {
      await call('POST', '/api/config', { favoriteModels: [{ providerId: 'a', modelId: 'b' }] })
      await call('POST', '/api/presets', { presets: [{ id: 'p', appId: 'claude' }] })
      const { body } = await call('GET', '/api/config')
      expect(body.favoriteModels).toEqual([{ providerId: 'a', modelId: 'b' }])
    })
  })
})
