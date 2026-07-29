import { describe, expect, it } from 'vitest'
import {
  isProviderHealthy,
  getProviderHealth,
  updateProviderHealth,
  type ProviderHealthStatus,
} from '../../src/engine/routing/health.js'
import { checkProviderHealth } from '../../src/services/provider-health.js'

describe('Provider Health', () => {
  describe('updateProviderHealth', () => {
    it('stores health status for a provider', () => {
      const status: ProviderHealthStatus = {
        providerId: 'test-provider-1',
        healthy: true,
        latencyMs: 42,
        lastChecked: Date.now(),
      }
      updateProviderHealth(status)

      const result = getProviderHealth('test-provider-1')
      expect(result).toEqual(status)
    })

    it('overwrites previous status on update', () => {
      const providerId = 'test-provider-2'
      updateProviderHealth({
        providerId,
        healthy: true,
        lastChecked: 1000,
      })
      updateProviderHealth({
        providerId,
        healthy: false,
        lastChecked: 2000,
        error: 'timeout',
      })

      const result = getProviderHealth(providerId)
      expect(result?.healthy).toBe(false)
      expect(result?.error).toBe('timeout')
      expect(result?.lastChecked).toBe(2000)
    })
  })

  describe('getProviderHealth', () => {
    it('returns undefined for unknown provider', () => {
      const result = getProviderHealth('nonexistent-provider')
      expect(result).toBeUndefined()
    })

    it('returns stored status for known provider', () => {
      const providerId = 'test-provider-3'
      const status: ProviderHealthStatus = {
        providerId,
        healthy: true,
        latencyMs: 10,
        lastChecked: Date.now(),
      }
      updateProviderHealth(status)

      expect(getProviderHealth(providerId)).toBe(status)
    })
  })

  describe('isProviderHealthy', () => {
    it('returns true for healthy provider', () => {
      updateProviderHealth({
        providerId: 'healthy-provider',
        healthy: true,
        lastChecked: Date.now(),
      })
      expect(isProviderHealthy('healthy-provider')).toBe(true)
    })

    it('returns false for unhealthy provider', () => {
      updateProviderHealth({
        providerId: 'unhealthy-provider',
        healthy: false,
        lastChecked: Date.now(),
        error: 'connection refused',
      })
      expect(isProviderHealthy('unhealthy-provider')).toBe(false)
    })

    it('returns true for unknown provider (default healthy)', () => {
      expect(isProviderHealthy('unknown-provider')).toBe(true)
    })
  })

  describe('checkProviderHealth (service layer)', () => {
    it('returns stored status for known provider', () => {
      const providerId = 'service-provider-1'
      const status: ProviderHealthStatus = {
        providerId,
        healthy: true,
        latencyMs: 50,
        lastChecked: Date.now(),
      }
      updateProviderHealth(status)

      const result = checkProviderHealth(providerId)
      expect(result).toEqual(status)
    })

    it('returns unknown status for unconfigured provider', () => {
      const result = checkProviderHealth('never-checked-provider')
      expect(result).toEqual({ healthy: true, status: 'unknown' })
    })

    it('reflects unhealthy status from health map', () => {
      const providerId = 'service-provider-2'
      updateProviderHealth({
        providerId,
        healthy: false,
        lastChecked: Date.now(),
        error: 'API key rejected',
      })

      const result = checkProviderHealth(providerId)
      expect(result.healthy).toBe(false)
      expect(result.error).toBe('API key rejected')
    })
  })

  describe('Health status transitions', () => {
    it('transitions from healthy to unhealthy and back', () => {
      const providerId = 'transition-provider'

      // Start healthy
      updateProviderHealth({
        providerId,
        healthy: true,
        latencyMs: 10,
        lastChecked: 1000,
      })
      expect(isProviderHealthy(providerId)).toBe(true)

      // Transition to unhealthy
      updateProviderHealth({
        providerId,
        healthy: false,
        latencyMs: 5000,
        lastChecked: 2000,
        error: 'timeout',
      })
      expect(isProviderHealthy(providerId)).toBe(false)

      // Transition back to healthy
      updateProviderHealth({
        providerId,
        healthy: true,
        latencyMs: 20,
        lastChecked: 3000,
      })
      expect(isProviderHealthy(providerId)).toBe(true)
      expect(getProviderHealth(providerId)?.error).toBeUndefined()
    })
  })

  describe('Multiple providers', () => {
    it('tracks health independently per provider', () => {
      updateProviderHealth({
        providerId: 'provider-a',
        healthy: true,
        lastChecked: 1000,
      })
      updateProviderHealth({
        providerId: 'provider-b',
        healthy: false,
        lastChecked: 1000,
        error: 'down',
      })

      expect(isProviderHealthy('provider-a')).toBe(true)
      expect(isProviderHealthy('provider-b')).toBe(false)
    })
  })
})
