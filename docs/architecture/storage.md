# Storage Architecture

> Local configuration, credentials, favorites, history, analytics, and session state.

## Storage Location

All persistent data lives under `~/.anygate/`:

```text
~/.anygate/
├── config.json           # User preferences (last provider, model, server settings)
├── providers.json        # Registry: configured providers with cached model lists
├── favorites.json        # Favorite models for mid-session switching
├── history.json          # Launch history for "recent" ordering
├── analytics.json        # Per-session usage data (model, tokens, duration)
├── sessions/             # Active session state
├── cache/                # Temporary caches (model lists, update checks)
└── logs/                 # Debug/trace logs (--trace mode)
```

## Source Code

```text
src/storage/
├── config.ts             # Preferences CRUD (last provider, server settings, etc.)
├── credentials.ts        # OS keyring read/write wrappers
├── favorites.ts          # Favorite model list management
├── history.ts            # Launch history recording
├── analytics.ts          # Usage tracking (per-model tokens, costs, durations)
├── sessions.ts           # Active session state
├── cache.ts              # File-based cache utilities
├── logs.ts               # Log file path resolution
└── index.ts              # Barrel exports
```

## Preferences (`config.ts`)

`UserPreferences` stores user state that persists between launches:

```typescript
interface UserPreferences {
  lastProvider?: string;         // Last used provider ID
  lastModel?: string;            // Last used model ID
  lastCodexProvider?: string;    // Per-agent last provider
  lastCodexModel?: string;
  lastGeminiProvider?: string;
  lastGeminiModel?: string;
  lastAntigravityProvider?: string;
  lastAntigravityModel?: string;
  subscriptionFilter?: 'free' | 'all';
  favoriteModels?: FavoriteModel[];
  serverPassword?: string;       // Saved server API key
  serverListenMode?: 'local' | 'network';
  serverExposedProviders?: string[];
  serverFavoritesOnly?: boolean;
  serverFreeModelsOnly?: boolean;
  serverMaskGatewayIds?: boolean;
  appPathOverrides?: Record<string, string>;
  recentLaunchFolders?: string[];
}
```

Read/write: `loadPreferences()` / `savePreferences()`.

## Credentials (`credentials.ts`)

Wraps `@napi-rs/keyring` for cross-platform credential store:

```typescript
readFromCredentialStore(service: string, account: string): string | null
writeToCredentialStore(service: string, account: string, value: string): void
deleteFromCredentialStore(service: string, account: string): void
```

Service name is always `anygate`. Account name is the provider ID or `opencode-api-key`.

## Favorites (`favorites.ts`)

```typescript
interface FavoriteModel {
  providerId: string;
  modelId: string;
  name?: string;
}
```

Favorites are stored in `config.json` under `favoriteModels`. Max 20 favorites (`MAX_MODEL_CATALOG`). Stale favorites (models no longer available) are silently skipped when building the catalog.

## Analytics (`analytics.ts`)

Records per-session usage:

```typescript
recordUsage({
  providerId: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  timestamp: number;
})
```

`aggregateAnalytics(range: RangeId)` summarizes usage by model, provider, and time range (day, week, month, all). Used by the web dashboard's analytics panel.

## Registry Storage

Provider registry has its own storage in `src/registry/storage/`:

```text
src/registry/storage/
├── io.ts                 # Load/save registry JSON
├── crud.ts               # Add/remove/update provider entries
└── custom-endpoint.ts    # Custom OpenAI/Anthropic endpoint handling
```

The registry file (`~/.anygate/providers.json`) contains an array of configured providers with their cached model lists.

---

**See also:**
- [Provider System](provider-system.md) — registry persistence details
- [Authentication](authentication.md) — credential storage
- [Reference: Configuration](../reference/configuration.md) — all config keys
