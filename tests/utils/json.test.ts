import { describe, expect, it } from 'vitest'
import { safeParseJson } from '../../src/utils/json.js'

describe('safeParseJson', () => {
  it('parses valid JSON', () => {
    expect(safeParseJson('{"a":1}', {})).toEqual({ a: 1 })
  })

  it('returns fallback for invalid JSON', () => {
    expect(safeParseJson('not json', { default: true })).toEqual({ default: true })
  })

  it('returns fallback for empty string', () => {
    expect(safeParseJson('', 'fallback')).toBe('fallback')
  })

  it('parses arrays', () => {
    expect(safeParseJson('[1,2,3]', [])).toEqual([1, 2, 3])
  })

  it('parses null', () => {
    expect(safeParseJson('null', 'fallback')).toBeNull()
  })

  it('parses numbers', () => {
    expect(safeParseJson('42', 0)).toBe(42)
  })

  it('parses strings', () => {
    expect(safeParseJson('"hello"', 'fallback')).toBe('hello')
  })

  it('parses booleans', () => {
    expect(safeParseJson('true', false)).toBe(true)
  })

  it('returns fallback for truncated JSON', () => {
    expect(safeParseJson('{"a":1', { recovered: false })).toEqual({ recovered: false })
  })

  it('uses fallback of correct type', () => {
    const fallback = { count: 0 }
    const result = safeParseJson('invalid', fallback)
    expect(result).toBe(fallback)
  })
})
