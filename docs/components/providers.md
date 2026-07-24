# Component: Providers (`src/providers/`)

> Per-vendor LLM driver implementations and provider discovery.

## Structure

```text
src/providers/
├── anthropic.ts          # Anthropic provider driver
├── openai.ts             # OpenAI provider driver
├── groq.ts               # Groq provider driver
├── mistral.ts            # Mistral provider driver
├── nvidia.ts             # NVIDIA provider driver
├── ollama.ts             # Ollama provider driver
├── github.ts             # GitHub Copilot provider driver
├── openrouter.ts         # OpenRouter provider driver
├── vertex.ts             # Vertex AI provider driver
├── opencode-serve.ts     # OpenCode local serve discovery
└── index.ts              # Barrel exports
```

## Purpose

Each provider file defines vendor-specific configuration: default base URLs, model list paths, SDK package names, and any provider quirks. These are lightweight wrappers — the heavy lifting is done by the Vercel AI SDK via `gateway/providers/provider-factory.ts`.

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `registry/`, `gateway/`

---

# Component: Auth (`src/auth/`)

> OAuth device flows, PKCE, keyring adapters, and token management.

## Structure

```text
src/auth/
├── github.ts              # GitHub Copilot device code flow
├── openai.ts              # OpenAI device code flow
├── xai.ts                 # xAI (Grok) device code flow
├── claude-code.ts         # Claude Code PKCE auth flow
├── claude-code-identity.ts # Claude Code CLI identity
├── claude-identity.ts     # Claude session identity & billing
├── antigravity-oauth.ts   # Antigravity Google OAuth (11KB)
├── pkce.ts                # PKCE challenge utilities
├── callback-server.ts     # Local OAuth callback HTTP server
├── refresh.ts             # Token refresh orchestration
├── refresh-http.ts        # HTTP token refresh
├── responses-websocket.ts # ChatGPT WebSocket transport
└── types.ts               # Token/credential types
```

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `registry/`, `gateway/`, `apps/`, `cli/`, `ui/`

## Architecture Reference

See [Architecture: Authentication](../architecture/authentication.md)

---

# Component: CLI (`src/cli/`)

> Subcommand entry points dispatched from `src/cli.ts`.

## Structure

```text
src/cli/
├── claude.ts              # `anygate claude` — main Claude Code launch (19KB)
├── claude-app.ts          # `anygate claude-app` — Claude Desktop launch
├── codex.ts               # `anygate codex` — Codex CLI launch
├── codex-app.ts           # `anygate codex-app` — ChatGPT Desktop launch
├── gemini.ts              # `anygate gemini` — Gemini CLI launch
├── antigravity.ts         # `anygate antigravity` — Antigravity launch
├── providers-command.ts   # `anygate providers` — provider management (27KB)
├── providers.ts           # Provider subcommand dispatcher
├── models.ts              # `anygate models` — favorites manager (10KB)
├── server.ts              # `anygate server` — gateway server
├── ui.ts                  # `anygate ui` — web dashboard
├── doctor.ts              # `anygate doctor` — system health check
├── update.ts              # `anygate update` — self-update
├── completions.ts         # Shell completions generator
└── index.ts               # Command dispatcher
```

## Dependencies

- **Imports from**: `apps/`, `gateway/`, `registry/`, `storage/`, `config/`, `services/`
- **Imported by**: `src/cli.ts` (entry point)

---

# Component: Launchers (`src/launchers/`)

> OS-native process execution and app window spawning.

## Structure

```text
src/launchers/
├── app-launcher.ts        # High-level app launch orchestration
├── native-launcher.ts     # Binary detection & process spawning (10KB)
├── launch.ts              # Launch coordination
├── desktop.ts             # Desktop app helpers
├── terminal.ts            # Terminal window spawning
├── shared.ts              # Cross-platform utilities
├── macos.ts               # macOS launch specifics
├── windows.ts             # Windows launch specifics
├── linux.ts               # Linux launch specifics
└── index.ts
```

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `apps/`, `cli/`

## Architecture Reference

See [Architecture: Launcher System](../architecture/launcher-system.md)

---

# Component: Storage (`src/storage/`)

> Local preferences, credentials, favorites, history, analytics, and sessions.

## Structure

```text
src/storage/
├── config.ts              # Preferences CRUD (9KB)
├── credentials.ts         # OS keyring wrappers
├── favorites.ts           # Favorite model management
├── history.ts             # Launch history
├── analytics.ts           # Usage tracking (11KB)
├── sessions.ts            # Session state
├── cache.ts               # File cache utilities
├── logs.ts                # Log path resolution
└── index.ts
```

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `apps/`, `cli/`, `registry/`, `gateway/`, `services/`, `ui/`

## Architecture Reference

See [Architecture: Storage](../architecture/storage.md)

---

# Component: Services (`src/services/`)

> Cross-cutting shared services.

## Structure

```text
src/services/
├── doctor.ts              # System health diagnostics
├── self-update.ts         # CLI self-update via npm
├── update-check.ts        # Check npm for newer versions (6KB)
├── provider-health.ts     # Provider API health checking
├── favorites.ts           # Favorites service logic
├── model-sync.ts          # Background model sync
├── analytics.ts           # Analytics service
├── downloads.ts           # Download utilities
├── updates.ts             # Update orchestration
└── index.ts
```

## Dependencies

- **Imports from**: `config/`, `storage/`, `registry/`, `types/`
- **Imported by**: `cli/`, `ui/`

---

# Component: UI (`src/ui/`)

> Web dashboard backend and Svelte 5 frontend.

## Structure

```text
src/ui/
├── api.ts                 # REST API handler (1246 lines, all endpoints)
├── api-types.ts           # API request/response types
├── command.ts             # `anygate ui` subcommand handler
├── server-control.ts      # In-process gateway start/stop (11KB)
├── app/                   # Svelte 5 SPA
│   ├── src/               # Source (routes, components, stores)
│   ├── dist/              # Built output
│   └── package.json       # anygate-ui package
├── dist/                  # Copied SPA assets
└── public/                # Static files
```

## Dependencies

- **Imports from**: `apps/`, `registry/`, `gateway/`, `auth/`, `storage/`, `config/`, `shared/`
- **Imported by**: `cli/ui.ts`

## Architecture Reference

See [Architecture: UI System](../architecture/ui-system.md)
