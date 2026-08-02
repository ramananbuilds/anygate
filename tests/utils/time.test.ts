import { describe, expect, it, vi } from 'vitest'
import { delayMs, formatTimestamp } from '../../src/utils/time.js'

describe('delayMs', () => {
  it('returns a promise', () => {
    expect(delayMs(0)).toBeInstanceOf(Promise)
  })

  it('resolves after the specified delay', async () => {
    const start = Date.now()
    await delayMs(50)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(40)
  })

  it('can be used with await', async () => {
    await expect(delayMs(10)).resolves.toBeUndefined()
  })

  it('handles zero delay', async () => {
    await expect(delayMs(0)).resolves.toBeUndefined()
  })
})

describe('formatTimestamp', () => {
  it('formats a timestamp as ISO string', () => {
    const ts = new Date('2024-01-15T10:30:00.000Z').getTime()
    expect(formatTimestamp(ts)).toBe('2024-01-15T10:30:00.000Z')
  })

  it('formats epoch zero', () => {
    expect(formatTimestamp(0)).toBe('1970-01-01T00:00:00.000Z')
  })

  it('formats a specific timestamp', () => {
    const result = formatTimestamp(1700000000000)
    expect(result).toBe('2023-11-14T22:13:20.000Z')
  })

  it('returns a valid ISO string', () => {
    const result = formatTimestamp(Date.now())
    const parsed = new Date(result)
    expect(parsed).toBeInstanceOf(Date)
    expect(parsed.toISOString()).toBe(result)
  })
})
