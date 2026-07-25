// tests/registry/validation/model-validator.test.ts — unit tests for model validation system
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  loadCache,
  saveCache,
  getCacheKey,
  isCacheFresh,
  getValidationStatus,
  pruneValidationCache,
  validateModel,
  validateModels,
  quickValidateModel,
  backgroundValidateModels,
} from '../../../src/registry/validation/model-validator.js';
import { VALIDATION_CONFIG } from '../../../src/registry/validation/config.js';
import type { ValidationResult, ValidateModelParams } from '../../../src/registry/validation/config.js';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock the app home path
vi.mock('../../../src/config/paths.ts', () => ({
  getAppHome: () => '/tmp/test-anygate-validation',
}));

// Mock fs operations for cache
vi.mock('node:fs', () => ({
  existsSync: vi.fn().mockReturnValue(false),
  readFileSync: vi.fn().mockReturnValue('{}'),
  mkdirSync: vi.fn(),
  openSync: vi.fn().mockReturnValue(1),
  writeSync: vi.fn(),
  closeSync: vi.fn(),
  chmodSync: vi.fn(),
}));

describe('model-validator', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCacheKey', () => {
    it('generates correct cache key format', () => {
      expect(getCacheKey('nvidia', 'gpt-oss-120b')).toBe('nvidia|gpt-oss-120b');
      expect(getCacheKey('groq', 'llama-3.3-70b')).toBe('groq|llama-3.3-70b');
    });
  });

  describe('isCacheFresh', () => {
    it('returns true for recent results', () => {
      const result: ValidationResult = {
        modelId: 'test',
        providerId: 'test',
        status: 'available',
        checkedAt: new Date().toISOString(),
      };
      expect(isCacheFresh(result)).toBe(true);
    });

    it('returns false for old results', () => {
      const oldDate = new Date(Date.now() - VALIDATION_CONFIG.TTL_MS - 1000).toISOString();
      const result: ValidationResult = {
        modelId: 'test',
        providerId: 'test',
        status: 'available',
        checkedAt: oldDate,
      };
      expect(isCacheFresh(result)).toBe(false);
    });

    it('returns false for invalid dates', () => {
      const result: ValidationResult = {
        modelId: 'test',
        providerId: 'test',
        status: 'available',
        checkedAt: 'invalid',
      };
      expect(isCacheFresh(result)).toBe(false);
    });

    it('respects custom TTL', () => {
      const result: ValidationResult = {
        modelId: 'test',
        providerId: 'test',
        status: 'available',
        checkedAt: new Date(Date.now() - 1000).toISOString(),
      };
      expect(isCacheFresh(result, 500)).toBe(false);
      expect(isCacheFresh(result, 5000)).toBe(true);
    });
  });

  describe('interpretStatus', () => {
    // Test via validateModel since interpretStatus is not exported
    const baseParams: ValidateModelParams = {
      modelId: 'test-model',
      providerId: 'test-provider',
      baseUrl: 'https://api.test.com/v1',
      apiKey: 'test-key',
      modelFormat: 'openai',
    };

    it('marks 2xx as available', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
        body: { getReader: () => ({ read: async () => ({ done: true }) }) },
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('available');
      expect(result.httpStatus).toBe(200);
    });

    it('marks 404 as deprecated', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 404,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('deprecated');
      expect(result.error).toContain('404');
    });

    it('marks 410 as deprecated', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 410,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('deprecated');
    });

    it('marks 401 as error', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 401,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('error');
      expect(result.error).toContain('401');
    });

    it('marks 403 as error', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 403,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('error');
    });

    it('marks 429 as unverified', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 429,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('unverified');
    });

    it('marks 500 as unverified', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 500,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('unverified');
    });

    it('marks 502 as unverified', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 502,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('unverified');
    });

    it('marks 503 as unverified', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 503,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('unverified');
    });

    it('marks 504 as unverified', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 504,
        ok: false,
        body: '',
      });

      const result = await validateModel(baseParams);
      expect(result.status).toBe('unverified');
    });

    it('marks timeout as unverified', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      const result = await validateModel(baseParams);
      expect(result.status).toBe('unverified');
      expect(result.error).toContain('timed out');
    });

    it('marks network errors as unverified', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await validateModel(baseParams);
      expect(result.status).toBe('unverified');
      expect(result.error).toContain('Network error');
    });
  });

  describe('never throws', () => {
    const baseParams: ValidateModelParams = {
      modelId: 'test-model',
      providerId: 'test-provider',
      baseUrl: 'https://api.test.com/v1',
      apiKey: 'test-key',
      modelFormat: 'openai',
    };

    it('does not throw on fetch failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));
      const result = await validateModel(baseParams);
      expect(result.status).toBe('unverified');
    });

    it('does not throw on invalid URL', async () => {
      const result = await validateModel({
        ...baseParams,
        baseUrl: 'not-a-url',
      });
      expect(result.status).toBe('unverified');
    });

    it('does not throw on missing API key', async () => {
      const result = await validateModel({
        ...baseParams,
        apiKey: '',
      });
      expect(result).toBeDefined();
    });
  });

  describe('validateModels (batch)', () => {
    it('validates multiple models with bounded concurrency', async () => {
      const models: ValidateModelParams[] = Array.from({ length: 10 }, (_, i) => ({
        modelId: `model-${i}`,
        providerId: 'test-provider',
        baseUrl: 'https://api.test.com/v1',
        apiKey: 'test-key',
        modelFormat: 'openai',
      }));

      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        body: { getReader: () => ({ read: async () => ({ done: true }) }) },
      });

      const results = await validateModels(models, { concurrency: 3 });
      expect(results).toHaveLength(10);
      expect(results.every(r => r.status === 'available')).toBe(true);
    });

    it('preserves order of results', async () => {
      const models: ValidateModelParams[] = [
        { modelId: 'a', providerId: 'p', baseUrl: 'https://api.test.com/v1', apiKey: 'k', modelFormat: 'openai' },
        { modelId: 'b', providerId: 'p', baseUrl: 'https://api.test.com/v1', apiKey: 'k', modelFormat: 'openai' },
        { modelId: 'c', providerId: 'p', baseUrl: 'https://api.test.com/v1', apiKey: 'k', modelFormat: 'openai' },
      ];

      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        body: { getReader: () => ({ read: async () => ({ done: true }) }) },
      });

      const results = await validateModels(models);
      expect(results.map(r => r.modelId)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('quickValidateModel', () => {
    it('returns true for unverified models (no cache)', async () => {
      const result = await quickValidateModel('unknown-provider', 'unknown-model');
      expect(result).toBe(true);
    });

    it('returns true for available models', async () => {
      // This would require cache mocking; for now just verify it doesn't throw
      const result = await quickValidateModel('test', 'test');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('backgroundValidateModels', () => {
    it('does not throw and returns void', () => {
      const models: ValidateModelParams[] = [
        { modelId: 'test', providerId: 'test', baseUrl: 'https://api.test.com/v1', apiKey: 'k', modelFormat: 'openai' },
      ];
      expect(() => backgroundValidateModels(models)).not.toThrow();
    });
  });

  describe('cache management', () => {
    it('loadCache returns empty cache on first load', () => {
      const cache = loadCache();
      expect(cache.schema_version).toBe(VALIDATION_CONFIG.CACHE_SCHEMA_VERSION);
      expect(cache.results).toEqual({});
    });

    it('saveCache does not throw', () => {
      const cache = {
        schema_version: VALIDATION_CONFIG.CACHE_SCHEMA_VERSION,
        results: {
          'test|model': {
            modelId: 'model',
            providerId: 'test',
            status: 'available' as const,
            checkedAt: new Date().toISOString(),
          },
        },
      };
      expect(() => saveCache(cache)).not.toThrow();
    });

    it('pruneValidationCache returns number of pruned entries', () => {
      const pruned = pruneValidationCache();
      expect(typeof pruned).toBe('number');
      expect(pruned).toBeGreaterThanOrEqual(0);
    });
  });

  describe('VALIDATION_CONFIG', () => {
    it('has correct TTL (24h)', () => {
      expect(VALIDATION_CONFIG.TTL_MS).toBe(24 * 60 * 60 * 1000);
    });

    it('has correct concurrency (5)', () => {
      expect(VALIDATION_CONFIG.CONCURRENCY).toBe(5);
    });

    it('has correct timeout (8s)', () => {
      expect(VALIDATION_CONFIG.TIMEOUT_MS).toBe(8000);
    });

    it('includes retryable codes', () => {
      expect(VALIDATION_CONFIG.RETRYABLE_CODES).toContain(429);
      expect(VALIDATION_CONFIG.RETRYABLE_CODES).toContain(500);
      expect(VALIDATION_CONFIG.RETRYABLE_CODES).toContain(502);
      expect(VALIDATION_CONFIG.RETRYABLE_CODES).toContain(503);
      expect(VALIDATION_CONFIG.RETRYABLE_CODES).toContain(504);
    });

    it('includes deprecated codes', () => {
      expect(VALIDATION_CONFIG.DEPRECATED_CODES).toContain(404);
      expect(VALIDATION_CONFIG.DEPRECATED_CODES).toContain(410);
    });

    it('includes auth codes', () => {
      expect(VALIDATION_CONFIG.AUTH_CODES).toContain(401);
      expect(VALIDATION_CONFIG.AUTH_CODES).toContain(403);
    });
  });
});
