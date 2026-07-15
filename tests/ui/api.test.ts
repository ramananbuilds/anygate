import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createMockRequest, createMockResponse } from '../helpers/ui-api-test-utils.js';

// --- Contract test for the frozen ui/api.ts surface ---
// Locks the route table + response shapes documented in src/ui/api-types.ts.

const state = vi.hoisted(() => ({
  catalog: [] as Array<{
    id: string;
    name: string;
    authType?: string;
    models: Array<{ id: string; name: string; isFree?: boolean }>;
  }>,
  updateAvailable: false,
  updateInfo: { current: '0.1.0', latest: '0.4.4', updateAvailable: false } as any,
}));

vi.mock('../../src/providers/provider-catalog.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/providers/provider-catalog.js')>('../../src/providers/provider-catalog.js');
  return {
    ...actual,
    fetchProviderCatalog: vi.fn(async () => state.catalog),
  };
});

vi.mock('../../src/agents/shared/update-check.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/agents/shared/update-check.js')>('../../src/agents/shared/update-check.js');
  return {
    ...actual,
    checkForUpdates: vi.fn(async () => state.updateInfo),
  };
});

vi.mock('../../src/agents/shared/native-launcher.js', () => ({
  getSupportedApps: () => [],
  getSupportedApp: () => undefined,
  detectApp: () => ({ installed: false, path: null }),
  getGatewayLaunchCommand: () => 'anygate',
}));

async function call(method: string, url: string, body?: unknown) {
  const { handleUiApiRequest } = await import('../../src/ui/api.js');
  const req = createMockRequest(method, url, body !== undefined ? JSON.stringify(body) : undefined);
  const mockRes = createMockResponse();
  handleUiApiRequest(req, mockRes.res, {});
  await new Promise((resolve) => setTimeout(resolve, 50));
  return { code: mockRes.result.code, body: JSON.parse(mockRes.result.data) };
}

describe('ui/api.ts frozen contract', () => {
  let tempHome: string;
  let previous: string | undefined;

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-ui-api-contract-'));
    previous = process.env['ANYGATE_HOME'];
    process.env['ANYGATE_HOME'] = join(tempHome, 'home');
    state.catalog = [
      {
        id: 'zen',
        name: 'OpenCode Zen',
        authType: 'api',
        models: [{ id: 'opus', name: 'Opus', isFree: false }],
      },
    ];
    state.updateInfo = { current: '0.1.0', latest: '0.4.4', updateAvailable: false };
  });

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true });
    if (previous === undefined) delete process.env['ANYGATE_HOME'];
    else process.env['ANYGATE_HOME'] = previous;
  });

  it('GET /api/config returns the frozen config shape', async () => {
    const { code, body } = await call('GET', '/api/config');
    expect(code).toBe(200);
    expect(body).toHaveProperty('favoriteModels');
    expect(body).toHaveProperty('antigravityCliFavoriteModels');
    expect(Array.isArray(body.favoriteModels)).toBe(true);
  });

  it('GET /api/update-status returns 200', async () => {
    const { code, body } = await call('GET', '/api/update-status');
    expect(code).toBe(200);
    expect(body).toHaveProperty('current');
    expect(body).toHaveProperty('latest');
  });

  it('GET /api/models returns providers[] with the frozen provider shape', async () => {
    const { code, body } = await call('GET', '/api/models');
    expect(code).toBe(200);
    expect(Array.isArray(body.providers)).toBe(true);
    expect(body.providers[0]).toMatchObject({
      id: 'zen',
      name: 'OpenCode Zen',
      favoriteName: expect.any(String),
      hasKey: expect.any(Boolean),
      freeAccess: expect.any(Boolean),
      authType: 'api',
      modelCount: expect.any(Number),
      models: expect.any(Array),
    });
  });

  it('GET /api/apps returns apps[] with the frozen app shape', async () => {
    const { code, body } = await call('GET', '/api/apps');
    expect(code).toBe(200);
    expect(Array.isArray(body.apps)).toBe(true);
    expect(body).toHaveProperty('recentLaunchFolders');
    if (body.apps.length > 0) {
      expect(body.apps[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        type: expect.any(String),
        installed: expect.any(Boolean),
      });
    }
  });

  it('GET /api/server/status returns 200 with a status payload', async () => {
    const { code, body } = await call('GET', '/api/server/status');
    expect(code).toBe(200);
    expect(body).toHaveProperty('running');
    expect(body).toHaveProperty('saved');
  });

  it('GET /api/providers/templates returns templates[]', async () => {
    const { code, body } = await call('GET', '/api/providers/templates');
    expect(code).toBe(200);
    expect(Array.isArray(body.templates)).toBe(true);
  });

  it('returns 404 for unknown routes', async () => {
    const { code, body } = await call('GET', '/api/does-not-exist');
    expect(code).toBe(404);
    expect(body).toEqual({ error: 'Not found' });
  });

  it('POST /api/config rejects malformed JSON with 400', async () => {
    const { handleUiApiRequest } = await import('../../src/ui/api.js');
    const req = createMockRequest('POST', '/api/config', '{not json');
    const mockRes = createMockResponse();
    handleUiApiRequest(req, mockRes.res, {});
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(mockRes.result.code).toBe(400);
  });
});