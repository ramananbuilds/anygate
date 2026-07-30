import { describe, expect, it } from 'vitest'
import { redactTraceLine, redactTraceLog } from '../../src/shared/redact.js'

describe('redactTraceLine', () => {
  it('redacts Bearer tokens', () => {
    const input = 'Authorization: Bearer sk-1234567890abcdef'
    const result = redactTraceLine(input)
    expect(result).toContain('Bearer [REDACTED]')
    expect(result).not.toContain('sk-1234567890abcdef')
  })

  it('redacts JSON authorization fields', () => {
    const input = '{"authorization": "Bearer abc123"}'
    const result = redactTraceLine(input)
    expect(result).toContain('authorization": "[REDACTED]"')
    expect(result).not.toContain('abc123')
  })

  it('redacts x-api-key fields', () => {
    const input = '{"x-api-key": "secret-key-123"}'
    const result = redactTraceLine(input)
    expect(result).toContain('x-api-key": "[REDACTED]"')
    expect(result).not.toContain('secret-key-123')
  })

  it('redacts sk- API keys', () => {
    const input = 'key=sk-1234567890abcdef'
    const result = redactTraceLine(input)
    expect(result).toContain('sk-[REDACTED]')
    expect(result).not.toContain('sk-1234567890abcdef')
  })

  it('redacts sk-ant- API keys', () => {
    const input = 'key=sk-ant-1234567890abcdef'
    const result = redactTraceLine(input)
    expect(result).toContain('sk-ant-[REDACTED]')
    expect(result).not.toContain('sk-ant-1234567890abcdef')
  })

  it('redacts Google API keys (AIza)', () => {
    const input = 'key=AIzaSy1234567890abcdefghijklmnopqrstuvwxyz'
    const result = redactTraceLine(input)
    expect(result).toContain('AIza[REDACTED]')
    expect(result).not.toContain('AIzaSy1234567890abcdefghijklmnopqrstuvwxyz')
  })

  it('redacts gsk_ API keys', () => {
    const input = 'key=gsk_1234567890abcdefghijklmnop'
    const result = redactTraceLine(input)
    expect(result).toContain('gsk_[REDACTED]')
    expect(result).not.toContain('gsk_1234567890abcdefghijklmnop')
  })

  it('leaves non-secret lines unchanged', () => {
    const input = 'GET /v1/messages HTTP/1.1'
    const result = redactTraceLine(input)
    expect(result).toBe(input)
  })

  it('handles empty string', () => {
    expect(redactTraceLine('')).toBe('')
  })

  it('handles lines with multiple secrets', () => {
    const input = 'Bearer sk-1234567890abcdef and x-api-key: "secret"'
    const result = redactTraceLine(input)
    expect(result).toContain('Bearer [REDACTED]')
    expect(result).toContain('[REDACTED]')
    expect(result).not.toContain('sk-1234567890abcdef')
    expect(result).not.toContain('secret')
  })
})

describe('redactTraceLog', () => {
  it('redacts secrets across multiple lines', () => {
    const content = [
      'Authorization: Bearer sk-1234567890abcdef',
      'GET /v1/messages',
      'x-api-key: "my-secret-key"',
    ].join('\n')

    const result = redactTraceLog(content)
    expect(result).toContain('Bearer [REDACTED]')
    expect(result).toContain('GET /v1/messages')
    expect(result).toContain('[REDACTED]')
    expect(result).not.toContain('sk-1234567890abcdef')
    expect(result).not.toContain('my-secret-key')
  })

  it('handles empty content', () => {
    expect(redactTraceLog('')).toBe('')
  })

  it('handles single line content', () => {
    const result = redactTraceLog('Bearer sk-1234567890abcdef')
    expect(result).toContain('Bearer [REDACTED]')
  })

  it('preserves line structure', () => {
    const content = 'line1\nline2\nline3'
    const result = redactTraceLog(content)
    expect(result.split('\n')).toHaveLength(3)
  })
})
