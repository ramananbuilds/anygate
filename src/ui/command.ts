import { createServer } from 'node:http';
import { readFileSync, readdirSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import pc from 'picocolors';
import * as p from '@clack/prompts';
import { getAppHome } from '../core/paths.js';
import { handleUiApiRequest, type UiServerLifecycleEvent } from './api.js';
import { getUiDebugLogPath, makeTraceLogger } from '../agents/shared/trace-log.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Served SPA is produced by `vite build` (ui/ → src/ui/dist). Version is injected
// at build time via the __APP_VERSION__ define, so no runtime substitution needed.
const PUBLIC_DIR = join(__dirname, 'ui', 'dist');
const LOCK_FILE = join(getAppHome(), 'ui.lock');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
};

function ext(path: string): string {
  const i = path.lastIndexOf('.');
  return i >= 0 ? path.slice(i) : '';
}

function buildStaticCache(): Map<string, { content: Buffer; mime: string }> {
  const cache = new Map<string, { content: Buffer; mime: string }>();
  try {
    const walk = (dir: string, prefix: string): void => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        const key = `${prefix}/${name}`;
        try {
          readdirSync(full); // directory — recurse
          walk(full, key);
        } catch {
          const mime = MIME[ext(name)];
          if (!mime) continue;
          const raw = readFileSync(full);
          cache.set(key, { content: raw, mime });
        }
      }
    };
    walk(PUBLIC_DIR, '');
    const index = cache.get('/index.html');
    if (index) cache.set('/__spa_fallback__', index);
  } catch {}
  return cache;
}

function removeLock(): void {
  try { unlinkSync(LOCK_FILE); } catch {}
}

function checkExistingServer(): string | null {
  if (!existsSync(LOCK_FILE)) return null;
  try {
    const { pid, port } = JSON.parse(readFileSync(LOCK_FILE, 'utf8'));
    // On Windows, process.kill(pid, 0) doesn't throw for non-existent PIDs.
    // Use tasklist to reliably check if the process exists.
    const isWindows = process.platform === 'win32';
    let processExists = false;
    if (isWindows) {
      try {
        const output = execSync(`tasklist /FI "PID eq ${pid}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        processExists = output.includes(String(pid));
      } catch {
        processExists = false;
      }
    } else {
      process.kill(pid, 0);
      processExists = true;
    }
    if (processExists) {
      return `http://127.0.0.1:${port}`;
    }
  } catch {
    // Ignore errors
  }
  removeLock();
  return null;
}

export function isUiApiRoute(url: string): boolean {
  return url.startsWith('/api/') || url.startsWith('/oauth/callback');
}

export function formatUiServerLifecycleMessage(event: UiServerLifecycleEvent): string {
  if (event.type === 'stopped') return '◇ Server Gateway stopped';
  const mode = event.listenMode === 'network' ? 'Network' : 'Local';
  const modelLabel = event.modelCount === 1 ? 'model' : 'models';
  return `◆ Server Gateway started · ${mode} mode · ${event.modelCount} ${modelLabel} exposed`;
}

export async function resolveUiShutdownDecision(
  signal: NodeJS.Signals,
  promptClose: () => Promise<boolean | symbol> = () => p.confirm({
    message: 'anygate UI is still running. Close it?',
    initialValue: true,
  }),
): Promise<'close' | 'keep'> {
  if (signal !== 'SIGINT') return 'close';
  const shouldClose = await promptClose();
  if (p.isCancel(shouldClose)) return 'close';
  return shouldClose ? 'close' : 'keep';
}

export async function runUiCommand(opts: { trace?: boolean } = {}): Promise<number> {
  const existing = checkExistingServer();
  if (existing) {
    console.log(`\n  ${pc.bold('anygate UI')} already running at ${pc.cyan(existing)}\n`);
    return 0;
  }

  if (opts.trace) {
    process.env.ANYGATE_TRACE = '1';
  }

  const staticCache = buildStaticCache();
  const traceLogPath = opts.trace ? getUiDebugLogPath() : undefined;
  const trace = traceLogPath ? makeTraceLogger(traceLogPath) : undefined;
  trace?.('ui server starting');

  const server = createServer((req, res) => {
    const url = req.url ?? '/';

    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (isUiApiRoute(url)) {
      handleUiApiRequest(req, res, {
        trace: opts.trace,
        traceLogPath,
        onServerLifecycle: event => {
          console.log(`\n  ${formatUiServerLifecycleMessage(event)}\n`);
        },
      });
      return;
    }

    const key = url === '/' ? '/index.html' : url.split('?')[0];
    trace?.(`static ${req.method ?? 'GET'} ${url} -> ${key}`);
    const cached = staticCache.get(key);
    if (cached) {
      res.writeHead(200, { 'Content-Type': cached.mime });
      res.end(cached.content);
      return;
    }

        // SPA fallback: serve index.html for any non-asset route (client-side hash routing).
    if (!ext(key) && staticCache.has('/__spa_fallback__')) {
      const fb = staticCache.get('/__spa_fallback__')!;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fb.content);
      return;
    }
    res.writeHead(404);
    res.end('Not found');
  });

  await new Promise<void>((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => resolve());
    server.once('error', reject);
  });

  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    console.error('Failed to bind server');
    return 1;
  }

  const port = addr.port;
  const url = `http://127.0.0.1:${port}`;

  mkdirSync(getAppHome(), { recursive: true });
  writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, port }));

  const cleanup = () => {
    removeLock();
    server.close();
    process.exit(0);
  };
  let handlingSignal = false;
  const handleSignal = async (signal: NodeJS.Signals) => {
    if (handlingSignal) return;
    handlingSignal = true;
    const decision = await resolveUiShutdownDecision(signal);
    if (decision === 'keep') {
      handlingSignal = false;
      return;
    }
    cleanup();
  };
  process.on('SIGINT', () => { void handleSignal('SIGINT'); });
  process.on('SIGTERM', () => { void handleSignal('SIGTERM'); });

  console.log(`\n  ${pc.bold('anygate UI')}  ${pc.cyan(url)}\n  ${pc.dim('Press Ctrl+C to stop')}\n`);
  if (traceLogPath) {
    console.log(`  ${pc.dim(`Trace log: ${traceLogPath}`)}\n`);
    trace?.(`ui server listening ${url}`);
  }

  try {
    const { default: open } = await import('open');
    await open(url);
    trace?.(`browser open ${url}`);
  } catch {
    trace?.(`browser open failed ${url}`);
    // Browser couldn't open — URL already printed above
  }

  await new Promise<void>(() => {}); // keep alive until signal
  return 0;
}


