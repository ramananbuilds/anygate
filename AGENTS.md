# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository. Note that the codebase supports Claude Code, OpenAI Codex, and Google Gemini CLI.

## Commands

```bash
npm run build       # compile TypeScript → dist/cli.js (via tsup, ESM, shebang injected) + build UI SPA
npm test            # run all tests with vitest across tests/ subdirectories
npm run typecheck   # type-check without emitting (tsc --noEmit)
npm run dev         # watch mode build

# Run a single test file or domain
npx vitest run tests/storage/env.test.ts
npx vitest run tests/registry/models.test.ts
npx vitest run tests/ui/api.test.ts

# Test the CLI locally (already npm-linked)
anygate --help
anygate models          # manage favorite models for mid-session switching
anygate claude --dry-run # simulate full first-run without writing anything
anygate claude --setup   # re-ask subscription tier
anygate claude --trace   # write debug log to /tmp/anygate-debug.log and print errors on exit
anygate providers       # interactive provider & model catalog manager
anygate server          # foreground OpenCode/registry API gateway
anygate server --vertex # foreground Vertex AI gateway (gcloud ADC)
anygate codex           # Codex CLI with registry providers (see docs/CODEX.md)
anygate codex-app       # Codex desktop app / ChatGPT app (macOS/Windows; see docs/CODEX.md)
anygate chatgpt         # Alias for anygate codex-app
anygate gemini          # Gemini CLI with registry providers (see docs/GEMINI.md)
anygate antigravity     # Antigravity CLI / IDE local Cloud Code gateway
anygate ui              # Svelte 5 web dashboard & visual launcher

# Rebuild after code changes before testing manually
npm run build && anygate --version
```

## Architecture

**Entry point:** `src/cli.ts` orchestrates command parsing and dispatches to specific subcommand handlers in `src/cli/`. Every module is a focused unit with clean imports and single-responsibility subdomains.

### Domain Directory Breakdown (`src/`)

- **`src/apps/`**: AI Application Integrations & Launchers
  - `claude/`: Claude Code CLI & Desktop app launcher logic
  - `codex/`: OpenAI Codex & ChatGPT app launcher logic
  - `gemini/`: Google Gemini CLI & Antigravity launcher logic
  - `shared/`: Shared prompt builders, key setup, context-window calculation, free-models logic, and model compatibility filters
- **`src/auth/`**: Authentication, PKCE, OAuth device flows, keyring adapters, & token handling (GitHub, OpenAI, xAI, Claude Code)
- **`src/cli/`**: Subcommand entry points (`claude.ts`, `codex.ts`, `gemini.ts`, `antigravity.ts`, `providers-command.ts`, `models.ts`, `server.ts`, `ui.ts`, `doctor.ts`, `update.ts`)
- **`src/config/`**: System constants, path definitions, default preferences, and environment variable resolution
- **`src/core/`**: Domain contracts, constants (`constants/`), error hierarchy (`errors/`), lifecycle events (`events/`), and interfaces (`interfaces/`)
- **`src/engine/`**: Core Routing & Selection Engine
  - `routing/`: `router.ts`, `resolver.ts`, `dispatcher.ts`, `strategy.ts`, `failover.ts`, `health.ts`, `middleware.ts`, `pipeline.ts`
  - `selection/`: `selector.ts`, `target-compatibility.ts`, `launch-target.ts`
  - `context/`: Token fitting & context window estimation
- **`src/gateway/`**: API Gateway, HTTP Proxies, & Protocol Translation
  - `adapters/`: Wire format translation (`sdk-adapter.ts`, `openai-adapter.ts`, `vertex.ts`)
  - `antigravity/`: Antigravity fake Cloud Code gateway server & request/response adapters
  - `context/`: Prompt context fitting (`context-fit.ts`)
  - `providers/`: SDK language model factories (`provider-factory.ts`)
  - `proxy/`: Local HTTP Anthropic/OpenAI proxies (`anthropic-proxy.ts`, `proxy-shared.ts`)
  - `server/`: Standalone gateway server (`server.ts`, `router.ts`, `auth.ts`, `vendor-mask.ts`)
  - `web-search/`: Web search tool integrations (`duckduckgo.ts`, `searxng.ts`, `brave.ts`, `tavily.ts`, `tool.ts`)
- **`src/launchers/`**: OS-native process execution & terminal window spawners (`native-launcher.ts`, `app-launcher.ts`, `macos.ts`, `windows.ts`, `linux.ts`)
- **`src/protocols/`**: Protocol payload definitions (`anthropic/`, `google/`, `openai/`)
- **`src/providers/`**: LM provider drivers (Anthropic, OpenAI, Groq, Mistral, Ollama, Vertex, OpenRouter)
- **`src/registry/`**: Provider & Model Registry
  - `data/`: Bundled model & pricing caches
  - `loader/`: Opencode importers, materializer, & data loaders
  - `providers/`: Standardized per-provider metadata (`anthropic/`, `google/`, `groq/`, `mistral/`, `nvidia/`, `ollama/`, `openai/`, `vertex/`, `xai/`)
  - `resolver/`: Template and model ID resolvers
  - `storage/`: Registry persistence, custom endpoint CRUD, & IO (`crud.ts`, `io.ts`)
  - `sync/`: Background catalog model & credential refreshers
  - `templates/`: Provider template definitions & model catalog fetchers
  - `validation/`: URL security and credential verification
- **`src/services/`**: Cross-cutting shared services (`analytics.ts`, `doctor.ts`, `downloads.ts`, `favorites.ts`, `provider-health.ts`, `self-update.ts`)
- **`src/storage/`**: Local configuration (`config.ts`), credentials (`credentials.ts`), favorites (`favorites.ts`), history (`history.ts`), and logs (`logs.ts`)
- **`src/types/`**: TypeScript type definitions (`api.ts`, `auth.ts`, `config.ts`, `gateway.ts`, `launch.ts`, `model.ts`, `provider.ts`, `registry.ts`)
- **`src/ui/`**: Web App Backend & Dashboard Server
  - `api.ts`, `api-types.ts`, `server-control.ts`
  - `app/`: Modern Svelte 5 / Vite UI Frontend Application (`src/`, `components/`, `routes/`, `stores/`)
- **`src/utils/`**: Pure helper functions (`crypto.ts`, `files.ts`, `http.ts`, `json.ts`, `network.ts`, `paths.ts`, `string.ts`)

### Test Suite Structure (`tests/`)

Tests mirror `src/` domain subdirectories:
- `tests/apps/`: Application launcher, prompt, & session tests (31 test files)
- `tests/auth/`: OAuth flow & token handling tests
- `tests/cli/`: CLI subcommand & update check tests
- `tests/engine/`: Routing & selection heuristic tests
- `tests/gateway/`: Gateway server, HTTP proxy, & SDK adapter tests
- `tests/helpers/`: Mock HTTP request/response test utilities (`ui-api-test-utils.ts`)
- `tests/registry/`: Provider registry, template fetcher, & model sync tests
- `tests/services/`: Health check, usage, & update service tests
- `tests/storage/`: Configuration & credential store tests
- `tests/ui/`: UI REST API & dashboard control tests
- `tests/web-search/`: Web search tool tests

---

## Data Flow (`anygate claude` / `anygate codex`)

```
src/cli.ts
  → handleClaudeCommand()       [src/cli/claude.ts — orchestrate launch]
  → resolveProvidersForDisplay() [src/registry/provider-catalog.ts — resolve configured providers]
  → p.select "Which provider?"  [shown when providers are available]

  ── OpenCode cloud path (default) ──
  → resolveOrCollectApiKey()    [src/apps/shared/key-setup.ts — read credential store or prompt]
  → loadRegistry()             [src/registry/storage/io.ts — fetch registry catalog]
  → selectModelWithSearch()     [src/apps/shared/prompts.ts — select backend model]

  ── Registry provider path ──
  → pickLocalModel()            [src/apps/shared/prompts.ts — filter/select model from provider]

  ── Shared launch (no favorites) ──
  → startProxy()                [src/gateway/proxy/anthropic-proxy.ts — single-model proxy]
  → buildChildEnv(baseUrl, …)   [src/config/env.ts — strip 17 conflicting vars, set child env]
  → launchClaude()              [src/launchers/app-launcher.ts — spawn child process]
  → proxyHandle.close()         [stop proxy after CLI exits]

  ── Catalog launch (favorites.length > 0) ──
  → buildCatalogRoutes()        [src/apps/codex/catalog.ts — starting model + favorites, max 20]
  → startProxyCatalog()         [src/gateway/proxy/anthropic-proxy.ts — multi-route proxy]
  → launchClaudeViaCatalog()    [src/cli/claude.ts — shared launch + cleanup]
```

## Favorites & Catalog Routing

**`anygate models`**: Interactive favorites manager (`src/storage/favorites.ts`). Reads/writes `favoriteModels` in config. Stale favorites (unavailable models) are silently skipped when building the catalog.

**Catalog routing**: `localModelToRoute`, `makeRouteResolver`, `buildCatalogRoutes`. Routes built for starting model + favorites. Alias IDs via `aliasModelId()` in proxy so coding tools see unique model names in `/model`.

**Critical URL constraint**: `BACKENDS.baseUrl` in `src/config/constants.ts` must NOT include `/v1`. The Anthropic SDK appends `/v1/messages` automatically.

## Translation Layer — Vercel AI SDK Adapter

All non-Anthropic providers route through the Vercel AI SDK (`ai` + `@ai-sdk/*`), which owns wire format, endpoint selection, and provider quirks.
- **`src/gateway/providers/provider-factory.ts`**: `createLanguageModel({ npm, modelId, apiKey, baseURL })` dynamically imports the SDK provider package (`@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/groq`, etc.).
- **`src/gateway/adapters/sdk-adapter.ts`**: Anthropic `/v1/messages` ↔ SDK adapter. Folds inline `role: 'system'` messages into system prompts, streams Anthropic SSE, and round-trips `thought_signature`.

## Credential Storage

Per-provider API keys and OAuth tokens use `@napi-rs/keyring` (installed as `optionalDependencies`) for cross-platform credential store access (macOS Keychain, Windows Credential Manager, Linux Secret Service). Missing native binaries degrade gracefully to plaintext shell profiles.

## Server Tab & UI (`anygate ui`)

Runs the gateway in-process inside the `anygate ui` web server (`src/ui/server-control.ts`). Provides a Svelte 5 frontend app (`src/ui/app/`) for point-and-click launching, provider management, model browsing, and gateway controls.

---

## Release Status & Constraints

- `package.json` is the single source of truth for versioning. `VERSION` in `src/config/constants.ts` reads `pkg.version`.
- Never touch `settings.json` directly; configuration is passed via environment variables to child processes.
- `--dry-run` ignores saved state and skips all disk writes.
