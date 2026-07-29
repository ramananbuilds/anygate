import pc from 'picocolors'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const LEVEL_ICON: Record<LogLevel, string> = {
  debug: '◇',
  info: '●',
  warn: '▲',
  error: '✖',
}

const LEVEL_COLOR: Record<LogLevel, (s: string) => string> = {
  debug: pc.dim,
  info: pc.cyan,
  warn: pc.yellow,
  error: pc.red,
}

function getLogLevel(): LogLevel {
  const envLevel = process.env['ANYGATE_LOG_LEVEL']?.toLowerCase()
  if (envLevel && envLevel in LOG_LEVELS) return envLevel as LogLevel
  return 'info'
}

function isJsonMode(): boolean {
  return process.env['ANYGATE_LOG_FORMAT'] === 'json'
}

export interface LogFields {
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  msg: string
  ts: string
  err?: { message: string; stack?: string }
  [key: string]: unknown
}

function formatJson(entry: LogEntry): string {
  return JSON.stringify(entry)
}

function formatHuman(entry: LogEntry): string {
  const color = LEVEL_COLOR[entry.level]
  const icon = LEVEL_ICON[entry.level]
  let line = `${color(icon)} ${pc.dim(entry.ts)} ${entry.msg}`
  if (entry.err) {
    line += ` ${color(entry.err.message)}`
  }
  const extra: string[] = []
  for (const [key, value] of Object.entries(entry)) {
    if (key === 'level' || key === 'msg' || key === 'ts' || key === 'err') continue
    extra.push(`${key}=${JSON.stringify(value)}`)
  }
  if (extra.length > 0) {
    line += ` ${pc.dim(extra.join(' '))}`
  }
  return line
}

/**
 * Structured logger with JSON and human-readable output modes.
 *
 * - `ANYGATE_LOG_LEVEL` controls verbosity: `debug` | `info` | `warn` | `error`
 * - `ANYGATE_LOG_FORMAT=json` switches to JSON output: `{"level":"error","msg":"...","ts":"...","err":{...}}`
 *
 * In JSON mode all levels write to stdout. In human mode, `error` and `warn`
 * go to stderr; `info` and `debug` go to stdout.
 */
export class Logger {
  private level: LogLevel
  private prefix: string

  constructor(prefix = 'anygate') {
    this.prefix = prefix
    this.level = getLogLevel()
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level]
  }

  private write(level: LogLevel, msg: string, err?: Error, fields?: LogFields): void {
    if (!this.shouldLog(level)) return

    const ts = new Date().toISOString()
    const fullMsg = `[${this.prefix}] ${msg}`

    const entry: LogEntry = { level, msg: fullMsg, ts }
    if (err) {
      entry.err = { message: err.message }
      if (err.stack) entry.err.stack = err.stack
    }
    if (fields) {
      Object.assign(entry, fields)
    }

    const output = isJsonMode() ? formatJson(entry) : formatHuman(entry)

    if (isJsonMode()) {
      // In JSON mode, write everything to stdout for easy collection.
      console.log(output)
    } else {
      if (level === 'error' || level === 'warn') {
        console.error(output)
      } else {
        console.log(output)
      }
    }
  }

  info(msg: string, fields?: LogFields): void {
    this.write('info', msg, undefined, fields)
  }

  warn(msg: string, fields?: LogFields): void {
    this.write('warn', msg, undefined, fields)
  }

  error(msg: string, err?: Error, fields?: LogFields): void {
    this.write('error', msg, err, fields)
  }

  debug(msg: string, fields?: LogFields): void {
    this.write('debug', msg, undefined, fields)
  }
}

export const logger = new Logger()
