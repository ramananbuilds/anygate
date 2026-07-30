# Component: Launchers — REMOVED

> **Removed in v0.5.12.** The `src/launchers/` directory was removed as part of
> the Phase 1 dead code cleanup. The launcher logic was found to be unused —
> actual process spawning lives in `src/apps/shared/native-launcher.ts` and
> `src/apps/shared/app-launcher.ts`.

## What was removed

- `src/launchers/` — `app-launcher.ts`, `native-launcher.ts`, `launch.ts`,
  `desktop.ts`, `terminal.ts`, `shared.ts`, `macos.ts`, `windows.ts`, `linux.ts`,
  `index.ts`

## Where the logic moved

| Original Location | New Location |
|-------------------|---------------|
| `src/launchers/native-launcher.ts` | `src/apps/shared/native-launcher.ts` |
| `src/launchers/app-launcher.ts` | `src/apps/shared/app-launcher.ts` |

## Architecture Reference

See [Architecture: Launcher System](../architecture/launcher-system.md) for current implementation.
