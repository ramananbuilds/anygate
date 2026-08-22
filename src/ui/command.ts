import { createServer } from 'node:http'
import {
  readFileSync,
  readdirSync,
  writeFileSync,
  unlinkSync,
  existsSync,
  mkdirSync,
} from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import pc from 'picocolors'
import * as p from '@clack/prompts'
import { getAppHome } from '../config/paths.js'
import { handleUiApiRequest, type UiServerLifecycleEvent } from './api.js'
import { getUiDebugLogPath, makeTraceLogger } from '../apps/shared/trace-log.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Served SPA is produced by `vite build` (src/ui/app → dist/ui/dist). Version is injected
// at build time via the __APP_VERSION__ define, so no runtime substitution needed.
const PUBLIC_DIR = join(__dirname, 'ui', 'dist')
const LOCK_FILE = join(getAppHome(), 'ui.lock')

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
}

function ext(path: string): string {
  const i = path.lastIndexOf('.')
  return i >= 0 ? path.slice(i) : ''
}

function buildStaticCache(): Map<string, { content: Buffer; mime: string }> {
  const cache = new Map<string, { content: Buffer; mime: string }>()
  try {
    const walk = (dir: string, prefix: string): void => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name)
        const key = `${prefix}/${name}`
        try {
          readdirSync(full) // directory — recurse
          walk(full, key)
        } catch {
          const mime = MIME[ext(name)]
          if (!mime) continue
          const raw = readFileSync(full)
          cache.set(key, { content: raw, mime })
        }
      }
    }
    walk(PUBLIC_DIR, '')
    const index = cache.get('/index.html')
    if (index) cache.set('/__spa_fallback__', index)
  } catch {}
  return cache
}

function removeLock(): void {
  try {
    unlinkSync(LOCK_FILE)
  } catch {}
}

/** Shape of `ui.lock` — where a previously started UI said it was listening. */
export interface UiLockInfo {
  pid: number
  port: number
}

export function parseUiLock(raw: string): UiLockInfo | null {
  try {
    const { pid, port } = JSON.parse(raw) as { pid?: unknown; port?: unknown }
    if (!Number.isInteger(pid) || !Number.isInteger(port)) return null
    if ((port as number) < 1 || (port as number) > 65535) return null
    return { pid: pid as number, port: port as number }
  } catch {
    return null
  }
}

/** How long a recorded port gets to identify itself before we call the lock stale. */
const PROBE_TIMEOUT_MS = 1500

/**
 * Ask whatever is listening on `port` whether it is an anygate UI.
 *
 * A PID check cannot answer this on any platform. `ui.lock` outlives a hard kill
 * — terminal window closed, taskkill, reboot — and the OS is then free to hand
 * that PID to an unrelated program, which Windows reliably does. "The PID
 * exists" is true in that case while the port is dead, so `anygate ui` refused
 * to start and pointed at a URL nothing was serving. The recorded port is
 * ephemeral too, so another service may legitimately hold it by now. Only the
 * server's own `/api/ping` marker tells a live UI apart from either impostor.
 */
export async function probeUiServer(
  port: number,
  fetchImpl: typeof fetch = fetch
): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
  try {
    const res = await fetchImpl(`http://127.0.0.1:${port}/api/ping`, { signal: controller.signal })
    if (!res.ok) return false
    const body = (await res.json()) as { app?: unknown }
    return body?.app === 'anygate'
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Resolve the lock file to a URL only when a live anygate UI answers there. Any
 * other outcome — no lock, unreadable lock, silent or unrecognized port — clears
 * the lock so this run starts a fresh server instead of stalling on a dead one.
 */
export async function checkExistingServer(fetchImpl: typeof fetch = fetch): Promise<string | null> {
  if (!existsSync(LOCK_FILE)) return null
  let lock: UiLockInfo | null = null
  try {
    lock = parseUiLock(readFileSync(LOCK_FILE, 'utf8'))
  } catch {
    lock = null
  }
  if (lock && (await probeUiServer(lock.port, fetchImpl))) {
    return `http://127.0.0.1:${lock.port}`
  }
  removeLock()
  return null
}

export function isUiApiRoute(url: string): boolean {
  return url.startsWith('/api/') || url.startsWith('/auth/callback')
}

export function formatUiServerLifecycleMessage(event: UiServerLifecycleEvent): string {
  if (event.type === 'stopped') return '◇ Server Gateway stopped'
  const mode = event.listenMode === 'network' ? 'Network' : 'Local'
  const modelLabel = event.modelCount === 1 ? 'model' : 'models'
  return `◆ Server Gateway started · ${mode} mode · ${event.modelCount} ${modelLabel} exposed`
}

export async function resolveUiShutdownDecision(
  signal: NodeJS.Signals,
  promptClose: () => Promise<boolean | symbol> = () =>
    p.confirm({
      message: 'anygate UI is still running. Close it?',
      initialValue: true,
    })
): Promise<'close' | 'keep'> {
  if (signal !== 'SIGINT') return 'close'
  const shouldClose = await promptClose()
  if (p.isCancel(shouldClose)) return 'close'
  return shouldClose ? 'close' : 'keep'
}

export async function runUiCommand(opts: { trace?: boolean } = {}): Promise<number> {
  const existing = await checkExistingServer()
  if (existing) {
    console.log(
      `\n  ${pc.bold('anygate UI')} already running at ${pc.cyan(existing)}\n  ${pc.dim('Press Ctrl+C in that terminal to stop it')}\n`
    )
    // Reopen the tab: someone typing `anygate ui` wants the dashboard in front
    // of them, and printing a URL to an already-running instance left them with
    // nothing to click.
    try {
      const { default: open } = await import('open')
      await open(existing)
    } catch {
      // Browser couldn't open — URL already printed above
    }
    return 0
  }

  if (opts.trace) {
    process.env.ANYGATE_TRACE = '1'
  }

  const staticCache = buildStaticCache()
  const traceLogPath = opts.trace ? getUiDebugLogPath() : undefined
  const trace = traceLogPath ? makeTraceLogger(traceLogPath) : undefined
  trace?.('ui server starting')

  const server = createServer((req, res) => {
    const url = req.url ?? '/'

    res.setHeader('X-Content-Type-Options', 'nosniff')

    if (isUiApiRoute(url)) {
      handleUiApiRequest(req, res, {
        trace: opts.trace,
        traceLogPath,
        onServerLifecycle: event => {
          console.log(`\n  ${formatUiServerLifecycleMessage(event)}\n`)
        },
      })
      return
    }

    const key = url === '/' ? '/index.html' : url.split('?')[0]
    trace?.(`static ${req.method ?? 'GET'} ${url} -> ${key}`)
    const cached = staticCache.get(key)
    if (cached) {
      res.writeHead(200, { 'Content-Type': cached.mime })
      res.end(cached.content)
      return
    }

    // SPA fallback: serve index.html for any non-asset route (client-side hash routing).
    if (!ext(key) && staticCache.has('/__spa_fallback__')) {
      const fb = staticCache.get('/__spa_fallback__')!
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(fb.content)
      return
    }
    res.writeHead(404)
    res.end('Not found')
  })

  await new Promise<void>((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => resolve())
    server.once('error', reject)
  })

  const addr = server.address()
  if (!addr || typeof addr === 'string') {
    console.error('Failed to bind server')
    return 1
  }

  const port = addr.port
  const url = `http://127.0.0.1:${port}`

  mkdirSync(getAppHome(), { recursive: true })
  writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, port }))

  // Covers every exit this process can still observe, including an uncaught
  // throw — the signal handlers below only fire for Ctrl+C and SIGTERM. A hard
  // kill or reboot still orphans the lock, which is what probeUiServer is for.
  process.on('exit', removeLock)

  const cleanup = () => {
    removeLock()
    server.close()
    process.exit(0)
  }
  let handlingSignal = false
  const handleSignal = async (signal: NodeJS.Signals) => {
    if (handlingSignal) return
    handlingSignal = true
    const decision = await resolveUiShutdownDecision(signal)
    if (decision === 'keep') {
      handlingSignal = false
      return
    }
    cleanup()
  }
  process.on('SIGINT', () => {
    void handleSignal('SIGINT')
  })
  process.on('SIGTERM', () => {
    void handleSignal('SIGTERM')
  })

  console.log(
    `\n  ${pc.bold('anygate UI')}  ${pc.cyan(url)}\n  ${pc.dim('Press Ctrl+C to stop')}\n`
  )
  if (traceLogPath) {
    console.log(`  ${pc.dim(`Trace log: ${traceLogPath}`)}\n`)
    trace?.(`ui server listening ${url}`)
  }

  try {
    const { default: open } = await import('open')
    await open(url)
    trace?.(`browser open ${url}`)
  } catch {
    trace?.(`browser open failed ${url}`)
    // Browser couldn't open — URL already printed above
  }

  await new Promise<void>(() => {}) // keep alive until signal
  return 0
}
