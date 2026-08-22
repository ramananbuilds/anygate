import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMockRequest, createMockResponse } from '../helpers/ui-api-test-utils.js'

vi.mock('../../src/apps/shared/native-launcher.js', () => ({
  getSupportedApps: () => [],
  getSupportedApp: () => undefined,
  detectApp: () => ({ installed: false, path: null }),
  getGatewayLaunchCommand: () => 'anygate',
}))

/** A fetch stand-in that resolves to the given status/body without touching the network. */
function fakeFetch(status: number, body: unknown): typeof fetch {
  return (async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })) as unknown as typeof fetch
}

describe('parseUiLock', () => {
  it('reads pid and port out of a well-formed lock', async () => {
    const { parseUiLock } = await import('../../src/ui/command.js')
    expect(parseUiLock('{"pid":14748,"port":54266}')).toEqual({ pid: 14748, port: 54266 })
  })

  it('rejects malformed or incomplete locks instead of throwing', async () => {
    const { parseUiLock } = await import('../../src/ui/command.js')
    expect(parseUiLock('not json')).toBeNull()
    expect(parseUiLock('')).toBeNull()
    expect(parseUiLock('{"pid":14748}')).toBeNull()
    expect(parseUiLock('{"port":54266}')).toBeNull()
    expect(parseUiLock('{"pid":"14748","port":"54266"}')).toBeNull()
    expect(parseUiLock('{"pid":14748,"port":1.5}')).toBeNull()
  })

  it('rejects ports outside the valid range', async () => {
    const { parseUiLock } = await import('../../src/ui/command.js')
    expect(parseUiLock('{"pid":14748,"port":0}')).toBeNull()
    expect(parseUiLock('{"pid":14748,"port":70000}')).toBeNull()
    expect(parseUiLock('{"pid":14748,"port":-1}')).toBeNull()
  })
})

describe('probeUiServer', () => {
  it('accepts a port that answers with the anygate marker', async () => {
    const { probeUiServer } = await import('../../src/ui/command.js')
    expect(await probeUiServer(54266, fakeFetch(200, { app: 'anygate', version: '9.9.9' }))).toBe(
      true
    )
  })

  it('rejects a port held by some other service', async () => {
    const { probeUiServer } = await import('../../src/ui/command.js')
    expect(await probeUiServer(54266, fakeFetch(200, { app: 'something-else' }))).toBe(false)
    expect(await probeUiServer(54266, fakeFetch(200, { status: 'ok' }))).toBe(false)
    expect(await probeUiServer(54266, fakeFetch(404, { error: 'Not found' }))).toBe(false)
  })

  it('rejects a dead port (connection refused)', async () => {
    const { probeUiServer } = await import('../../src/ui/command.js')
    const refuse = (async () => {
      throw Object.assign(new Error('connect ECONNREFUSED'), { code: 'ECONNREFUSED' })
    }) as unknown as typeof fetch
    expect(await probeUiServer(54266, refuse)).toBe(false)
  })

  it('rejects a response whose body is not JSON', async () => {
    const { probeUiServer } = await import('../../src/ui/command.js')
    const html = (async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error('Unexpected token < in JSON')
      },
    })) as unknown as typeof fetch
    expect(await probeUiServer(54266, html)).toBe(false)
  })
})

describe('checkExistingServer', () => {
  let tempHome: string
  let previous: string | undefined
  let lockFile: string

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-uilock-'))
    previous = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = tempHome
    lockFile = join(tempHome, 'ui.lock')
    mkdirSync(tempHome, { recursive: true })
    // LOCK_FILE is resolved at module load, so each test needs a fresh module.
    vi.resetModules()
  })

  afterEach(() => {
    if (previous === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previous
    rmSync(tempHome, { recursive: true, force: true })
  })

  it('returns null when no lock file exists', async () => {
    const { checkExistingServer } = await import('../../src/ui/command.js')
    expect(await checkExistingServer(fakeFetch(200, { app: 'anygate' }))).toBeNull()
  })

  it('returns the URL when a live anygate UI answers on the recorded port', async () => {
    writeFileSync(lockFile, JSON.stringify({ pid: 14748, port: 54266 }))
    const { checkExistingServer } = await import('../../src/ui/command.js')
    expect(await checkExistingServer(fakeFetch(200, { app: 'anygate' }))).toBe(
      'http://127.0.0.1:54266'
    )
    expect(existsSync(lockFile)).toBe(true)
  })

  // The reported bug: the UI was killed hard, Windows recycled its PID to an
  // unrelated process (opera.exe), and the PID-only check reported the dead
  // ephemeral port as live — so `anygate ui` refused to start and printed a URL
  // nothing was serving.
  it('clears the lock and starts fresh when the recorded port is dead', async () => {
    writeFileSync(lockFile, JSON.stringify({ pid: 14748, port: 54266 }))
    const refuse = (async () => {
      throw Object.assign(new Error('connect ECONNREFUSED'), { code: 'ECONNREFUSED' })
    }) as unknown as typeof fetch
    const { checkExistingServer } = await import('../../src/ui/command.js')
    expect(await checkExistingServer(refuse)).toBeNull()
    expect(existsSync(lockFile)).toBe(false)
  })

  it('clears the lock when an unrelated service now owns the recorded port', async () => {
    writeFileSync(lockFile, JSON.stringify({ pid: 14748, port: 54266 }))
    const { checkExistingServer } = await import('../../src/ui/command.js')
    expect(await checkExistingServer(fakeFetch(200, { app: 'other-app' }))).toBeNull()
    expect(existsSync(lockFile)).toBe(false)
  })

  it('clears an unparseable lock without probing', async () => {
    writeFileSync(lockFile, 'corrupted{')
    const probe = vi.fn()
    const { checkExistingServer } = await import('../../src/ui/command.js')
    expect(await checkExistingServer(probe as unknown as typeof fetch)).toBeNull()
    expect(probe).not.toHaveBeenCalled()
    expect(existsSync(lockFile)).toBe(false)
  })
})

describe('GET /api/ping', () => {
  it('identifies the server so a stale lock can be told from a live one', async () => {
    const { handleUiApiRequest } = await import('../../src/ui/api.js')
    const { VERSION } = await import('../../src/config/constants.js')
    const req = createMockRequest('GET', '/api/ping')
    const { res, result } = createMockResponse()
    handleUiApiRequest(req, res, {})
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(result.code).toBe(200)
    expect(JSON.parse(result.data)).toEqual({
      app: 'anygate',
      version: VERSION,
      pid: process.pid,
    })
  })
})
