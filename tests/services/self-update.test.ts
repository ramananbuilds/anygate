import { afterEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => {
  const spawnMock = vi.fn();
  return { spawnMock };
});

// Mock the update check so we never hit the npm registry.
vi.mock('../../src/apps/shared/update-check.js', () => ({
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

import { runUpdateCommand } from '../../src/apps/shared/self-update.js';
import { VERSION } from '../../src/config/constants.js';

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
    const { checkForUpdates } = await import('../../src/apps/shared/update-check.js');
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
    const { checkForUpdates } = await import('../../src/apps/shared/update-check.js');
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

  it('spawns npm and returns the child exit code when confirmed', async () => {
    const { checkForUpdates } = await import('../../src/apps/shared/update-check.js');
    (checkForUpdates as unknown as vi.Mock).mockResolvedValueOnce({
      currentVersion: '0.5.3',
      latestVersion: '0.6.0',
      updateAvailable: true,
    });

    const { confirm } = await import('@clack/prompts');
    (confirm as unknown as vi.Mock).mockResolvedValueOnce(true);

    // Fake child process: emits 'close' with code 0; ignores 'error'.
    const fakeChild = {
      on(event: string, cb: (arg: unknown) => void) {
        if (event === 'close') queueMicrotask(() => cb(0));
        return fakeChild;
      },
    };
    hoisted.spawnMock.mockReturnValueOnce(fakeChild as unknown as ReturnType<typeof hoisted.spawnMock>);

    const exit = await runUpdateCommand(false);
    expect(exit).toBe(0);
    expect(hoisted.spawnMock).toHaveBeenCalledTimes(1);
    const [bin, args] = hoisted.spawnMock.mock.calls[0];
    expect(args).toEqual(['install', '-g', 'anygate@latest']);
    expect(String(bin)).toMatch(/npm(\.cmd)?$/);
  });

  // Regression: `anygate update` on Windows died with
  // "spawn C:\Program Files\nodejs\npm ENOENT". `where npm` lists the
  // extensionless Unix shell script before npm.cmd, and the old predicate
  // (`endsWith('.cmd') || endsWith('npm')`) picked the first line — the one
  // file CreateProcess cannot execute. npm is now invoked by bare name through
  // the shell, so cmd.exe resolves it via PATHEXT.
  describe('npm invocation on Windows', () => {
    const realPlatform = process.platform;

    function setPlatform(value: string): void {
      Object.defineProperty(process, 'platform', { value, configurable: true });
    }

    afterEach(() => {
      setPlatform(realPlatform);
    });

    async function runConfirmedUpdate(): Promise<unknown[]> {
      const { checkForUpdates } = await import('../../src/apps/shared/update-check.js');
      (checkForUpdates as unknown as vi.Mock).mockResolvedValueOnce({
        currentVersion: '0.5.3',
        latestVersion: '0.6.0',
        updateAvailable: true,
      });
      const { confirm } = await import('@clack/prompts');
      (confirm as unknown as vi.Mock).mockResolvedValueOnce(true);

      const fakeChild = {
        on(event: string, cb: (arg: unknown) => void) {
          if (event === 'close') queueMicrotask(() => cb(0));
          return fakeChild;
        },
      };
      hoisted.spawnMock.mockReturnValueOnce(
        fakeChild as unknown as ReturnType<typeof hoisted.spawnMock>
      );

      await runUpdateCommand(false);
      return hoisted.spawnMock.mock.calls[0];
    }

    it('never hands Windows an absolute path, and enables the shell', async () => {
      setPlatform('win32');
      const [bin, args, opts] = await runConfirmedUpdate();

      // A bare name only — an absolute path reintroduces both the ENOENT and
      // the unquoted "C:\Program Files" splitting bug.
      expect(bin).toBe('npm');
      expect(String(bin)).not.toMatch(/[\\/]/);
      // Required since Node 18.20.2 to run npm.cmd at all.
      expect((opts as { shell?: boolean }).shell).toBe(true);
      expect(args).toEqual(['install', '-g', 'anygate@latest']);
    });

    it('does not enable the shell off Windows', async () => {
      setPlatform('linux');
      const [bin, , opts] = await runConfirmedUpdate();
      expect(bin).toBe('npm');
      expect((opts as { shell?: boolean }).shell).toBe(false);
    });

    it('reports a failed spawn once, not twice', async () => {
      setPlatform('win32');
      const { checkForUpdates } = await import('../../src/apps/shared/update-check.js');
      (checkForUpdates as unknown as vi.Mock).mockResolvedValueOnce({
        currentVersion: '0.5.3',
        latestVersion: '0.6.0',
        updateAvailable: true,
      });
      const { confirm, log } = await import('@clack/prompts');
      (confirm as unknown as vi.Mock).mockResolvedValueOnce(true);
      (log.error as unknown as vi.Mock).mockClear();

      // Node emits BOTH 'error' and 'close' when the binary cannot be started;
      // -4058 is the numeric ENOENT the user saw as a second error line.
      const fakeChild = {
        on(event: string, cb: (arg: unknown) => void) {
          if (event === 'error') queueMicrotask(() => cb(new Error('spawn npm ENOENT')));
          if (event === 'close') queueMicrotask(() => cb(-4058));
          return fakeChild;
        },
      };
      hoisted.spawnMock.mockReturnValueOnce(
        fakeChild as unknown as ReturnType<typeof hoisted.spawnMock>
      );

      const exit = await runUpdateCommand(false);
      expect(exit).toBe(1);
      expect((log.error as unknown as vi.Mock).mock.calls).toHaveLength(1);
    });
  });
});
