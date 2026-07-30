import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Logger } from '../../src/shared/logger.js'

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env['ANYGATE_LOG_FORMAT']
    delete process.env['ANYGATE_LOG_LEVEL']
  })

  describe('human-readable mode (default)', () => {
    it('outputs info messages to stdout', () => {
      const logger = new Logger('test')
      logger.info('hello world')

      expect(consoleLogSpy).toHaveBeenCalledOnce()
      const output = consoleLogSpy.mock.calls[0][0] as string
      expect(output).toContain('hello world')
      expect(output).toContain('[test]')
      expect(output).toContain('●')
    })

    it('outputs warn messages to stderr', () => {
      const logger = new Logger('test')
      logger.warn('warning message')

      expect(consoleWarnSpy).toHaveBeenCalledOnce()
      const output = consoleWarnSpy.mock.calls[0][0] as string
      expect(output).toContain('warning message')
      expect(output).toContain('▲')
    })

    it('outputs error messages to stderr', () => {
      const logger = new Logger('test')
      logger.error('error message')

      expect(consoleErrorSpy).toHaveBeenCalledOnce()
      const output = consoleErrorSpy.mock.calls[0][0] as string
      expect(output).toContain('error message')
      expect(output).toContain('✖')
    })

    it('includes timestamp in output', () => {
      const logger = new Logger('test')
      logger.info('test message')

      const output = consoleLogSpy.mock.calls[0][0] as string
      expect(output).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('includes error message when error object is provided', () => {
      const logger = new Logger('test')
      const err = new Error('something went wrong')
      logger.error('operation failed', err)

      const output = consoleErrorSpy.mock.calls[0][0] as string
      expect(output).toContain('operation failed')
      expect(output).toContain('something went wrong')
    })

    it('includes structured fields in output', () => {
      const logger = new Logger('test')
      logger.info('request processed', { requestId: 'abc-123', status: 200 })

      const output = consoleLogSpy.mock.calls[0][0] as string
      expect(output).toContain('requestId')
      expect(output).toContain('abc-123')
    })
  })

  describe('JSON mode', () => {
    it('outputs JSON when ANYGATE_LOG_FORMAT=json', () => {
      process.env['ANYGATE_LOG_FORMAT'] = 'json'
      const logger = new Logger('test')

      logger.info('json message', { key: 'value' })

      const output = consoleLogSpy.mock.calls[0][0] as string
      const parsed = JSON.parse(output)
      expect(parsed.level).toBe('info')
      expect(parsed.msg).toContain('json message')
      expect(parsed.ts).toMatch(/\d{4}-\d{2}-\d{2}T/)
      expect(parsed.key).toBe('value')
    })

    it('includes error object in JSON output', () => {
      process.env['ANYGATE_LOG_FORMAT'] = 'json'
      const logger = new Logger('test')
      const err = new Error('json error')

      logger.error('failed', err)

      const output = consoleLogSpy.mock.calls[0][0] as string
      const parsed = JSON.parse(output)
      expect(parsed.level).toBe('error')
      expect(parsed.err.message).toBe('json error')
      expect(parsed.err.stack).toBeDefined()
    })

    it('includes structured fields in JSON output', () => {
      process.env['ANYGATE_LOG_FORMAT'] = 'json'
      const logger = new Logger('test')

      logger.info('test', { provider: 'openai', latency: 42 })

      const output = consoleLogSpy.mock.calls[0][0] as string
      const parsed = JSON.parse(output)
      expect(parsed.provider).toBe('openai')
      expect(parsed.latency).toBe(42)
    })

    it('outputs all levels to stdout in JSON mode', () => {
      process.env['ANYGATE_LOG_FORMAT'] = 'json'
      process.env['ANYGATE_LOG_LEVEL'] = 'debug'
      const logger = new Logger('test')

      logger.debug('debug msg')
      logger.info('info msg')
      logger.warn('warn msg')
      logger.error('error msg')

      // In JSON mode, all output goes to stdout
      expect(consoleLogSpy).toHaveBeenCalledTimes(4)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })
  })

  describe('log level filtering', () => {
    it('filters out debug messages when level is info', () => {
      process.env['ANYGATE_LOG_LEVEL'] = 'info'
      const logger = new Logger('test')

      logger.debug('should not appear')
      logger.info('should appear')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy.mock.calls[0][0]).toContain('should appear')
    })

    it('filters out info and debug when level is warn', () => {
      process.env['ANYGATE_LOG_LEVEL'] = 'warn'
      const logger = new Logger('test')

      logger.debug('debug')
      logger.info('info')
      logger.warn('warn')

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    it('filters out all but error when level is error', () => {
      process.env['ANYGATE_LOG_LEVEL'] = 'error'
      const logger = new Logger('test')

      logger.debug('debug')
      logger.info('info')
      logger.warn('warn')
      logger.error('error')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it('shows all messages when level is debug', () => {
      process.env['ANYGATE_LOG_LEVEL'] = 'debug'
      const logger = new Logger('test')

      logger.debug('debug')
      logger.info('info')
      logger.warn('warn')
      logger.error('error')

      expect(consoleLogSpy).toHaveBeenCalledTimes(2) // debug + info
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('prefix', () => {
    it('uses custom prefix', () => {
      const logger = new Logger('my-app')
      logger.info('test')

      const output = consoleLogSpy.mock.calls[0][0] as string
      expect(output).toContain('[my-app]')
    })

    it('defaults to anygate prefix', () => {
      const logger = new Logger()
      logger.info('test')

      const output = consoleLogSpy.mock.calls[0][0] as string
      expect(output).toContain('[anygate]')
    })
  })
})
