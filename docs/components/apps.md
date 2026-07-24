# Component: Apps (`src/apps/`)

> Per-tool launch logic for Claude Code, Codex, Gemini, and Antigravity, plus shared utilities.

## Structure

```text
src/apps/
├── claude/                        # Claude Code CLI & Desktop
│   ├── cli.ts                     # Claude Code CLI launch orchestration
│   ├── desktop.ts                 # Claude Desktop (Cowork) launch
│   ├── favorites-provider-display.ts  # Provider name formatting for favorites picker
│   └── index.ts
├── codex/                         # OpenAI Codex & ChatGPT App
│   ├── app-config.ts              # ChatGPT app configuration patching
│   ├── app-launch.ts              # ChatGPT app launch logic
│   ├── app-routing.ts             # Build proxy routes for Codex
│   ├── app-session.ts             # Codex app session management
│   ├── app-shutdown.ts            # Graceful shutdown handling
│   ├── catalog.ts                 # Build catalog routes for Codex favorites
│   ├── cli.ts                     # Codex CLI help text and launch
│   ├── command.ts                 # Codex subcommand handler
│   ├── favorites-catalog.ts       # Favorites catalog for Codex
│   ├── favorites-launch.ts        # Non-interactive favorites launch
│   ├── launch.ts                  # Codex launch coordination
│   ├── proxy.ts                   # Codex-specific proxy setup
│   ├── proxy-identity.ts          # Proxy identity for Codex sessions
│   ├── responses-adapter.ts       # OpenAI Responses API adapter
│   ├── session.ts                 # Session lifecycle management
│   ├── upstream-error.ts          # Upstream error handling
│   └── index.ts
├── gemini/                        # Google Gemini & Antigravity
│   ├── backend-routes.ts          # Gemini backend route building
│   ├── cli.ts                     # Gemini CLI help text
│   ├── proxy.ts                   # Gemini-specific proxy setup
│   ├── proxy-provider-options.ts  # Provider-specific Gemini options
│   └── index.ts
└── shared/                        # Cross-app utilities
    ├── ai-doc.ts                  # `anygate --ai` documentation generator
    ├── app-launcher.ts            # High-level app launch orchestration
    ├── binary-lookup.ts           # Binary path resolution
    ├── cloud-code-backend.ts      # Cloud Code backend resolution
    ├── completions.ts             # Shell completion helpers
    ├── context-model-id.ts        # Context-window-annotated model IDs
    ├── context-window.ts          # Context window resolution & heuristics
    ├── doctor.ts                  # System health check logic
    ├── favorites-resolver.ts      # Resolve favorites to launchable routes
    ├── first-run.ts               # First-run setup wizard
    ├── free-models.ts             # Free tier model filtering
    ├── key-setup.ts               # API key collection & validation
    ├── launch-target.ts           # Launch target resolution (shared)
    ├── launch.ts                  # Common launch utilities
    ├── model-compatibility.ts     # Model × agent blacklists
    ├── model-search.ts            # Fuzzy model search for large catalogs
    ├── native-launcher.ts         # OS-native app detection & spawning
    ├── prompts.ts                 # Interactive picker prompts (@clack)
    ├── reasoning-capabilities.ts  # Reasoning/thinking mode detection
    ├── self-update.ts             # CLI self-update logic
    ├── target-compatibility.ts    # Filter providers by target app
    ├── tool-search.ts             # Tool search resolution
    ├── trace-log.ts               # Debug trace logging (--trace)
    ├── ui.ts                      # ASCII banner, formatting helpers
    ├── update-check.ts            # npm update check
    └── index.ts
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `fetchProviderCatalog()` | shared via registry | Get all available providers |
| `selectModelWithSearch()` | `shared/prompts.ts` | Interactive model picker with search |
| `buildChildEnv()` | via `config/env.ts` | Environment isolation |
| `launchClaude()` | `shared/app-launcher.ts` | Spawn Claude Code child process |
| `buildCatalogRoutes()` | `codex/catalog.ts` | Build favorites catalog |
| `shouldHideModel()` | `shared/model-compatibility.ts` | Model blacklist filter |
| `resolveContextWindow()` | `shared/context-window.ts` | Get model's context window size |

## Dependencies

- **Imports from**: `config/`, `registry/`, `gateway/`, `auth/`, `launchers/`, `storage/`, `engine/`, `types/`
- **Imported by**: `cli/` subcommand handlers, `ui/api.ts`

## Architecture Reference

See [Architecture: Request Lifecycle](../architecture/request-lifecycle.md)
