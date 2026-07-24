# Component: Launchers (`src/launchers/`)

> OS-native process execution and app window spawning.

## Structure

```text
src/launchers/
├── app-launcher.ts        # High-level app launch orchestration (8KB)
├── native-launcher.ts     # Binary detection & process spawning (10KB)
├── launch.ts              # Launch coordination
├── desktop.ts             # Desktop app helpers
├── terminal.ts            # Terminal window spawning
├── shared.ts              # Cross-platform utilities
├── macos.ts               # macOS: `open -a`, Finder, .app paths
├── windows.ts             # Windows: registry, AppData, `start` command
├── linux.ts               # Linux: `which`, XDG, direct exec
└── index.ts
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `launchApp()` | `app-launcher.ts` | High-level app launch with env |
| `detectApp()` | `native-launcher.ts` | Find installed app binary |
| `getSupportedApps()` | `native-launcher.ts` | List all detectable apps |
| `spawnProcess()` | `launch.ts` | Low-level process spawn |

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `apps/`, `cli/`

## Architecture Reference

See [Architecture: Launcher System](../architecture/launcher-system.md)
