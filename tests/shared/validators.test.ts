import { describe, expect, it } from 'vitest'
import { isValidUrl, isValidApiKey } from '../../src/shared/validators.js'

describe('isValidUrl', () => {
  it('accepts valid http URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(true)
  })

  it('accepts valid https URLs', () => {
    expect(isValidUrl('https://example.com/path')).toBe(true)
  })

  it('accepts URLs with ports', () => {
    expect(isValidUrl('http://localhost:8080')).toBe(true)
  })

  it('accepts URLs with query parameters', () => {
    expect(isValidUrl('https://example.com?foo=bar')).toBe(true)
  })

  it('rejects invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidUrl('')).toBe(false)
  })

  it('rejects non-HTTP protocols', () => {
    expect(isValidUrl('ftp://example.com')).toBe(false)
  })

  it('rejects file protocol', () => {
    expect(isValidUrl('file:///etc/passwd')).toBe(false)
  })

  it('rejects protocol-relative URLs', () => {
    expect(isValidUrl('//example.com')).toBe(false)
  })
})

describe('isValidApiKey', () => {
  it('accepts non-empty string', () => {
    expect(isValidApiKey('sk-1234567890')).toBe(true)
  })

  it('accepts string with spaces', () => {
    expect(isValidApiKey('  key-with-spaces  ')).toBe(true)
  })

  it('rejects empty string', () => {
    expect(isValidApiKey('')).toBe(false)
  })

  it('rejects whitespace-only string', () => {
    expect(isValidApiKey('   ')).toBe(false)
  })

  it('rejects non-string values', () => {
    expect(isValidApiKey(null as unknown as string)).toBe(false)
    expect(isValidApiKey(undefined as unknown as string)).toBe(false)
    expect(isValidApiKey(123 as unknown as string)).toBe(false)
  })
})
