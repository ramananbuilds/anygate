# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. Note that the codebase supports Claude Code, OpenAI Codex, Google Gemini CLI, and Antigravity.

## Release workflow

Publishing is automated by GitHub Actions (`.github/workflows/publish.yml`): **pushing a `v*` tag** runs typecheck + tests + build, then `npm publish` (auth via the `GATEWAYAI` repo secret — an npm Automation token) and creates a GitHub Release from the matching `CHANGELOG.md` section. **Do NOT run `npm publish` locally** — that double-publishes and fails.

To release a new version:

```bash
# 1. Land all code changes and a CHANGELOG.md "## [x.y.z]" section first (committed).
npm version patch --no-git-tag-version   # bump package.json + package-lock (use minor/major as needed)
npm run build                            # rebuild dist — VERSION is derived from package.json automatically
git add -A && git commit -m "release: vX.Y.Z"
git tag vX.Y.Z
git push --follow-tags                   # tag push triggers CI → npm publish + GitHub Release
```

`package.json` is the single source of truth for the version. Never edit `src/config/constants.ts` manually for version bumps. `dist/` is committed, so rebuild it in the release commit.

**Every version display must derive from `package.json`, never a hardcoded string.** `src/config/constants.ts::VERSION` reads `pkg.version`. Both update automatically on `npm run build` — no manual edit needed.

## Commands

```bash
npm run build       # compile TypeScript → dist/cli.js (via tsup, ESM) + build UI SPA
npm test            # run all tests with vitest across tests/ subdirectories
npm run typecheck   # type-check without emitting (tsc --noEmit)
npm run dev         # watch mode build

# Run a single test file or domain directory
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

**Entry point:** `src/cli.ts` orchestrates command parsing and dispatches to subcommand modules in `src/cli/`.

### Directory Layout (`src/`)

- **`src/apps/`**: AI Application Integrations & Launchers
  - `claude/`: Claude Code CLI & Desktop app launchers
  - `codex/`: OpenAI Codex & ChatGPT desktop app launchers
  - `gemini/`: Google Gemini CLI & Antigravity IDE launchers
  - `shared/`: Shared prompt builders, key setup, context-window calculation, free-models logic, and model compatibility filters
- **`src/auth/`**: OAuth device flows, PKCE, keyring adapters, & token refreshers (GitHub, OpenAI, xAI, Claude Code)
- **`src/cli/`**: Subcommand handlers (`claude.ts`, `codex.ts`, `gemini.ts`, `antigravity.ts`, `providers-command.ts`, `models.ts`, `server.ts`, `ui.ts`, `doctor.ts`, `update.ts`)
- **`src/config/`**: Constants, paths, default preferences, and environment variables
- **`src/core/`**: Core domain contracts (`constants/`, `errors/`, `events/`, `interfaces/`)
- **`src/engine/`**: Routing & Selection Engine (`routing/`, `selection/`, `context/`)
- **`src/gateway/`**: API Gateway & Proxies (`adapters/`, `antigravity/`, `context/`, `providers/`, `proxy/`, `server/`, `web-search/`)
- **`src/launchers/`**: Process execution & native window spawners (`native-launcher.ts`, `app-launcher.ts`, `macos.ts`, `windows.ts`, `linux.ts`)
- **`src/protocols/`**: Wire format translations (`anthropic/`, `google/`, `openai/`)
- **`src/providers/`**: Provider implementations (Anthropic, OpenAI, Groq, Mistral, Ollama, Vertex, OpenRouter)
- **`src/registry/`**: Provider Registry Subdomain
  - `data/`: Model & pricing caches
  - `loader/`: Opencode importers & materializer
  - `providers/`: Per-provider metadata (`anthropic/`, `google/`, `groq/`, `mistral/`, `nvidia/`, `ollama/`, `openai/`, `vertex/`, `xai/`)
  - `resolver/`: Template and model ID resolvers
  - `storage/`: Registry persistence & custom endpoints (`crud.ts`, `io.ts`)
  - `sync/`: Background catalog model & credential refreshers
  - `templates/`: Provider template definitions & fetchers
  - `validation/`: URL security and credential verification
- **`src/services/`**: Cross-cutting shared services (`analytics.ts`, `doctor.ts`, `downloads.ts`, `favorites.ts`, `provider-health.ts`, `self-update.ts`)
- **`src/storage/`**: Preferences (`config.ts`), credentials (`credentials.ts`), favorites (`favorites.ts`), history (`history.ts`), and logs (`logs.ts`)
- **`src/types/`**: TypeScript type definitions
- **`src/ui/`**: Gateway Server & Web App (`api.ts`, `server-control.ts`, Svelte 5 UI frontend in `src/ui/app/`)
- **`src/utils/`**: Pure helper utilities (`crypto.ts`, `files.ts`, `http.ts`, `json.ts`, `network.ts`, `paths.ts`, `string.ts`)

### Test Suite Layout (`tests/`)

- `tests/apps/`: Application launcher & session tests
- `tests/auth/`: OAuth & authentication tests
- `tests/cli/`: CLI subcommand & argument parsing tests
- `tests/engine/`: Routing & selection engine tests
- `tests/gateway/`: Gateway server, proxy, & SDK adapter tests
- `tests/helpers/`: Mock HTTP request/response test utilities (`ui-api-test-utils.ts`)
- `tests/registry/`: Provider registry & model sync tests
- `tests/services/`: Shared service tests
- `tests/storage/`: Configuration & credential store tests
- `tests/ui/`: UI API & dashboard server tests
- `tests/web-search/`: Web search tool tests

---

## Data Flow (`anygate claude`)

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
  → proxyHandle.close()         [stop proxy after Claude exits]

  ── Catalog launch (favorites.length > 0) ──
  → buildCatalogRoutes()        [src/apps/codex/catalog.ts — starting model + favorites, max 20]
  → startProxyCatalog()         [src/gateway/proxy/anthropic-proxy.ts — multi-route proxy]
  → launchClaudeViaCatalog()    [src/cli/claude.ts — shared launch + cleanup]
```

## Key Constraints

- **`settings.json` is never touched** by Anygate. Configuration is passed exclusively via environment variables to child processes.
- **Provider Credential Resolution**: `src/registry/provider-catalog.ts::resolveLocalProviderApiKey()` is the canonical helper.
- **Vercel AI SDK Adapter**: Non-Anthropic providers route through the Vercel AI SDK (`src/gateway/adapters/sdk-adapter.ts` + `src/gateway/providers/provider-factory.ts`).
- **Web Dashboard**: `anygate ui` serves the Svelte 5 SPA from `src/ui/app/`.
