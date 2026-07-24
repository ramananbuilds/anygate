# Component: Storage (`src/storage/`)

> Local preferences, credentials, favorites, history, analytics, and sessions.

## Structure

```text
src/storage/
├── config.ts              # Preferences CRUD — last provider/model, server settings (9KB)
├── credentials.ts         # OS keyring read/write via @napi-rs/keyring
├── favorites.ts           # Favorite model list management
├── history.ts             # Launch history recording
├── analytics.ts           # Per-session usage tracking (11KB)
├── sessions.ts            # Active session state
├── cache.ts               # File-based cache utilities
├── logs.ts                # Log file path resolution
└── index.ts
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `loadPreferences()` | `config.ts` | Read user preferences |
| `savePreferences()` | `config.ts` | Write user preferences |
| `readFromCredentialStore()` | `credentials.ts` | Read from OS keyring |
| `writeToCredentialStore()` | `credentials.ts` | Write to OS keyring |
| `recordUsage()` | `analytics.ts` | Record session usage data |
| `aggregateAnalytics()` | `analytics.ts` | Summarize usage by range |

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `apps/`, `cli/`, `registry/`, `gateway/`, `services/`, `ui/`

## Architecture Reference

See [Architecture: Storage](../architecture/storage.md)
