import { describe, it, expect, afterEach } from 'vitest';
import { resolveLocalProviderApiKey } from '../src/core/credentials.js';
import type { LocalProvider } from '../src/core/types.js';

// Minimal LocalProvider fixture — only the fields resolveLocalProviderApiKey reads.
function makeProvider(overrides: Partial<LocalProvider>): LocalProvider {
  return {
    id: 'test-provider',
    name: 'Test Provider',
    apiKey: '',
    models: [],
    ...overrides,
  };
}

// The ANYGATE_KEY_<ID> env override is consulted first by resolveProviderCredential,
// so we isolate it per-test to avoid cross-test leakage.
afterEach(() => {
  delete process.env['ANYGATE_KEY_TEST_PROVIDER'];
  delete process.env['ANYGATE_KEY_ZEN'];
  delete process.env['ANYGATE_KEY_GO'];
});

describe('resolveLocalProviderApiKey', () => {
  it('returns the direct apiKey when present (trimmed)', async () => {
    const provider = makeProvider({ apiKey: '  sk-direct-123  ' });
    expect(await resolveLocalProviderApiKey(provider)).toBe('sk-direct-123');
  });

  it('returns "anonymous" for authType "none" with no key', async () => {
    const provider = makeProvider({ authType: 'none' });
    expect(await resolveLocalProviderApiKey(provider)).toBe('anonymous');
  });

  it('returns "anonymous" for a template with apiKeyOptional', async () => {
    // 'ollama' is a built-in template with apiKeyOptional: true.
    const provider = makeProvider({ id: 'ollama', name: 'Ollama' });
    expect(await resolveLocalProviderApiKey(provider)).toBe('anonymous');
  });

  it('returns "anonymous" for a template with anonymousFreeModels', async () => {
    // 'kilo' is a built-in template with anonymousFreeModels: true.
    const provider = makeProvider({ id: 'kilo', name: 'Kilo Code' });
    expect(await resolveLocalProviderApiKey(provider)).toBe('anonymous');
  });

  it('honors the ANYGATE_KEY_<ID> env override before registry/keyring lookup', async () => {
    process.env['ANYGATE_KEY_TEST_PROVIDER'] = 'env-override-key';
    const provider = makeProvider({ id: 'test-provider' });
    expect(await resolveLocalProviderApiKey(provider)).toBe('env-override-key');
  });

  it('honors ANYGATE_KEY_<ID> for built-in cloud backends (zen/go)', async () => {
    process.env['ANYGATE_KEY_ZEN'] = 'zen-env-key';
    expect(await resolveLocalProviderApiKey(makeProvider({ id: 'zen' }))).toBe('zen-env-key');

    process.env['ANYGATE_KEY_GO'] = 'go-env-key';
    expect(await resolveLocalProviderApiKey(makeProvider({ id: 'go' }))).toBe('go-env-key');
  });
});
