import { describe, expect, it } from 'vitest'
import { generateRandomHex, hashString } from '../../src/utils/crypto.js'

describe('generateRandomHex', () => {
  it('generates a hex string of the expected length', () => {
    const result = generateRandomHex(16)
    // 16 bytes = 32 hex characters
    expect(result).toHaveLength(32)
    expect(result).toMatch(/^[0-9a-f]{32}$/)
  })

  it('uses default of 16 bytes', () => {
    const result = generateRandomHex()
    expect(result).toHaveLength(32)
  })

  it('generates different values on each call', () => {
    const a = generateRandomHex(16)
    const b = generateRandomHex(16)
    expect(a).not.toBe(b)
  })

  it('supports different byte lengths', () => {
    expect(generateRandomHex(1)).toHaveLength(2)
    expect(generateRandomHex(4)).toHaveLength(8)
    expect(generateRandomHex(32)).toHaveLength(64)
  })

  it('only contains hexadecimal characters', () => {
    const result = generateRandomHex(16)
    expect(result).toMatch(/^[0-9a-f]+$/)
  })
})

describe('hashString', () => {
  it('returns a deterministic hash', () => {
    const hash1 = hashString('hello')
    const hash2 = hashString('hello')
    expect(hash1).toBe(hash2)
  })

  it('returns different hashes for different inputs', () => {
    expect(hashString('hello')).not.toBe(hashString('world'))
  })

  it('returns a 64-character hex string (SHA-256)', () => {
    const hash = hashString('test')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('handles empty string', () => {
    const hash = hashString('')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })

  it('handles unicode input', () => {
    const hash = hashString('héllo wörld 🌍')
    expect(hash).toHaveLength(64)
  })

  it('is case-sensitive', () => {
    expect(hashString('Hello')).not.toBe(hashString('hello'))
  })
})
