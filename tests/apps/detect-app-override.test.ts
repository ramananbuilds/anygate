import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// detectApp() reads the override through storage/config and probes disk via
// node:fs, so both are mocked to keep these deterministic on every platform.
const getAppPathOverride = vi.fn<(appId: string) => string | undefined>();
const existsSync = vi.fn<(path: string) => boolean>();
const findClaudeApp = vi.fn<() => string | null>();
const findCodexApp = vi.fn<() => string | null>();

vi.mock('../../src/storage/config.js', () => ({ getAppPathOverride }));
vi.mock('../../src/apps/claude/desktop-launch.js', () => ({ findClaudeApp }));
vi.mock('../../src/apps/codex/app-launch.js', () => ({ findCodexApp }));
vi.mock('node:fs', async importOriginal => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return { ...actual, existsSync: (p: string) => existsSync(p) };
});
// findBinaryOnPath shells out to where.exe/which; force it to miss so the tests
// exercise the override + app-finder branches rather than a real PATH hit.
vi.mock('../../src/apps/shared/binary-lookup.js', () => ({
  findBinaryOnPath: () => null,
}));

const STORE_MONIKER = 'shell:AppsFolder\\Claude_pzs8sxrjxfjjc!Claude';
// A Microsoft Store (MSIX) install path. The version stamp is the whole problem:
// it changes on every Store auto-update, invalidating any saved override.
const STALE_OVERRIDE =
  'C:\\Program Files\\WindowsApps\\Claude_1.24012.1.0_x64__pzs8sxrjxfjjc\\app\\claude.exe';

describe('detectApp — path override handling', () => {
  beforeEach(() => {
    vi.resetModules();
    getAppPathOverride.mockReset();
    existsSync.mockReset();
    findClaudeApp.mockReset();
    findCodexApp.mockReset();
    getAppPathOverride.mockReturnValue(undefined);
    existsSync.mockReturnValue(false);
    findClaudeApp.mockReturnValue(null);
    findCodexApp.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function detect(id: string) {
    const { detectApp } = await import('../../src/apps/shared/native-launcher.js');
    return detectApp(id);
  }

  it('uses a manual override while the path still exists', async () => {
    getAppPathOverride.mockReturnValue(STALE_OVERRIDE);
    existsSync.mockImplementation(p => p === STALE_OVERRIDE);

    expect(await detect('claude-app')).toEqual({
      installed: true,
      path: STALE_OVERRIDE,
      pathSource: 'override',
    });
  });

  // Regression: a stale override used to short-circuit detection and report
  // installed:false, so a Store auto-update (which bumps the version-stamped
  // directory) left the app permanently invisible to the web UI. Re-browsing to
  // the new path only re-armed the same trap on the following update.
  it('falls through to auto-detection when the override path is gone', async () => {
    getAppPathOverride.mockReturnValue(STALE_OVERRIDE);
    existsSync.mockReturnValue(false);
    findClaudeApp.mockReturnValue(STORE_MONIKER);

    expect(await detect('claude-app')).toEqual({
      installed: true,
      path: STORE_MONIKER,
      pathSource: 'auto',
    });
  });

  it('reports not-installed only when the override is stale AND nothing is found', async () => {
    getAppPathOverride.mockReturnValue(STALE_OVERRIDE);
    existsSync.mockReturnValue(false);
    findClaudeApp.mockReturnValue(null);

    expect(await detect('claude-app')).toEqual({
      installed: false,
      path: null,
      pathSource: null,
    });
  });

  // Store/MSIX installs have no .exe at any fixed path, so the static fallback
  // lists can never match them; detectApp must consult the app finder, which
  // resolves a version-independent shell:AppsFolder moniker via Get-StartApps.
  it('detects a Store (MSIX) install with no override set', async () => {
    findClaudeApp.mockReturnValue(STORE_MONIKER);

    expect(await detect('claude-app')).toEqual({
      installed: true,
      path: STORE_MONIKER,
      pathSource: 'auto',
    });
  });

  it('applies the same override fall-through to codex-app', async () => {
    const codexMoniker = 'shell:AppsFolder\\OpenAI.ChatGPT_abc123!App';
    getAppPathOverride.mockReturnValue('C:\\gone\\ChatGPT.exe');
    existsSync.mockReturnValue(false);
    findCodexApp.mockReturnValue(codexMoniker);

    expect(await detect('codex-app')).toEqual({
      installed: true,
      path: codexMoniker,
      pathSource: 'auto',
    });
  });

  // Only claude-app and codex-app have dedicated Store finders; other ids must
  // not silently inherit one.
  it('does not invoke an app finder for ids that have none', async () => {
    getAppPathOverride.mockReturnValue(undefined);

    expect(await detect('antigravity')).toEqual({
      installed: false,
      path: null,
      pathSource: null,
    });
    expect(findClaudeApp).not.toHaveBeenCalled();
    expect(findCodexApp).not.toHaveBeenCalled();
  });
});
