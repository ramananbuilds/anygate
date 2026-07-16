import { afterEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => {
  const spawnMock = vi.fn();
  return { spawnMock };
});

// Mock the update check so we never hit the npm registry.
vi.mock('../src/agents/shared/update-check.js', () => ({
  checkForUpdates: vi.fn(async () => ({
    currentVersion: '0.5.3',
    latestVersion: null,
    updateAvailable: false,
  })),
  UPDATE_COMMAND: 'npm install -g anygate@latest',
}));

// Mock @clack/prompts confirm (non-configurable export otherwise).
vi.mock('@clack/prompts', () => ({
  confirm: vi.fn(async () => false),
  isCancel: vi.fn(() => false),
  log: {
    info: vi.fn(),
    success: vi.fn(),
    step: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock node:child_process so the dry-run / declined paths can assert that
// spawn is never called (and the confirm path can verify it).
vi.mock('node:child_process', () => ({
  spawn: hoisted.spawnMock,
  execFileSync: vi.fn(() => Buffer.from('')),
}));

import { runUpdateCommand } from '../src/agents/shared/self-update.js';
import { VERSION } from '../src/core/constants.js';

describe('update command', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    hoisted.spawnMock.mockClear();
  });

  it('reports up-to-date and exits 0 when no update is available', async () => {
    const { log } = await import('@clack/prompts');
    const exit = await runUpdateCommand(false);
    expect(exit).toBe(0);
    const out = (log.success as unknown as vi.Mock).mock.calls.flat().join('\n');
    expect(out).toContain(`up to date (v${VERSION})`);
  });

  it('does not spawn npm in dry-run mode and prints the command', async () => {
    const { checkForUpdates } = await import('../src/agents/shared/update-check.js');
    (checkForUpdates as unknown as vi.Mock).mockResolvedValueOnce({
      currentVersion: '0.5.3',
      latestVersion: '0.6.0',
      updateAvailable: true,
    });

    const { log } = await import('@clack/prompts');

    const exit = await runUpdateCommand(true);
    expect(exit).toBe(0);
    const out = (log.step as unknown as vi.Mock).mock.calls.flat().join('\n');
    expect(out).toContain('Would run');
    expect(out).toContain('install -g anygate@latest');
    expect(hoisted.spawnMock).not.toHaveBeenCalled();
  });

  it('prompts and (when declined) does not spawn npm', async () => {
    const { checkForUpdates } = await import('../src/agents/shared/update-check.js');
    (checkForUpdates as unknown as vi.Mock).mockResolvedValueOnce({
      currentVersion: '0.5.3',
      latestVersion: '0.6.0',
      updateAvailable: true,
    });

    const { confirm, log } = await import('@clack/prompts');
    (confirm as unknown as vi.Mock).mockResolvedValueOnce(false);

    const exit = await runUpdateCommand(false);
    expect(exit).toBe(0);
    expect(hoisted.spawnMock).not.toHaveBeenCalled();
    const out = (log.info as unknown as vi.Mock).mock.calls.flat().join('\n');
    expect(out).toContain('Update skipped');
  });
});
