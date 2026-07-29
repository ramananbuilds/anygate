import pc from 'picocolors'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export class Logger {
  constructor(private prefix = 'anygate') {}

  info(msg: string): void {
    console.log(`${pc.cyan('●')} [${this.prefix}] ${msg}`)
  }

  warn(msg: string): void {
    console.warn(`${pc.yellow('▲')} [${this.prefix}] ${msg}`)
  }

  error(msg: string): void {
    console.error(`${pc.red('✖')} [${this.prefix}] ${msg}`)
  }

  debug(msg: string): void {
    if (process.env['DEBUG']) {
      console.log(`${pc.dim('◇')} [${this.prefix}] ${msg}`)
    }
  }
}

export const logger = new Logger()
