import { describe, expect, it } from 'vitest'
import { getLocalIpAddresses } from '../../src/utils/network.js'

describe('getLocalIpAddresses', () => {
  it('returns an array of strings', () => {
    const ips = getLocalIpAddresses()
    expect(Array.isArray(ips)).toBe(true)
    for (const ip of ips) {
      expect(typeof ip).toBe('string')
    }
  })

  it('returns only non-internal IPv4 addresses', () => {
    const ips = getLocalIpAddresses()
    for (const ip of ips) {
      // IPv4 addresses match x.x.x.x pattern
      expect(ip).toMatch(/^\d+\.\d+\.\d+\.\d+$/)
    }
  })

  it('handles machines with no external interfaces', () => {
    // On some CI/headless environments, there may be no non-internal IPs.
    // This test just verifies the function doesn't throw.
    expect(() => getLocalIpAddresses()).not.toThrow()
  })
})
