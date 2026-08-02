# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) and other AI coding agents working with code in this repository. Note that the codebase supports Claude Code, OpenAI Codex, Google Gemini CLI, and Antigravity.

> 💡 **Documentation Memory System**: Deep technical documentation and AI context files are maintained in `docs/` and `.context/`. Always consult these documents before making architectural changes:
> - **Architecture Docs**: [docs/architecture/overview.md](docs/architecture/overview.md), [request-lifecycle.md](docs/architecture/request-lifecycle.md), [routing-engine.md](docs/architecture/routing-engine.md), [provider-system.md](docs/architecture/provider-system.md), [gateway.md](docs/architecture/gateway.md), [authentication.md](docs/architecture/authentication.md), [launcher-system.md](docs/architecture/launcher-system.md), [storage.md](docs/architecture/storage.md), [ui-system.md](docs/architecture/ui-system.md)
> - **Component Guides**: [docs/components/](docs/components/)
> - **Developer Guides**: [docs/guides/](docs/guides/)
> - **Reference Lookups**: [docs/reference/](docs/reference/)
> - **AI Context & Rules**: [.context/vision.md](.context/vision.md), [.context/architecture-rules.md](.context/architecture-rules.md), [.context/coding-standards.md](.context/coding-standards.md), [.context/repository-map.md](.context/repository-map.md), [.context/current-focus.md](.context/current-focus.md)
>
> ⚠️ **Living Context Maintenance**: Whenever you add, delete, or update a feature or UI component, you MUST update the corresponding documentation files in `docs/`, `.context/`, `AGENTS.md`, and `CLAUDE.md`.

## Commands

```bash
npm run build       # compile TypeScript → dist/cli.js (via tsup, ESM, shebang injected) + build UI SPA
npm test            # run all tests with vitest across tests/ subdirectories
npm run typecheck   # type-check without emitting (tsc --noEmit)
npm run lint        # run ESLint on src/ (TypeScript)
npm run lint:fix    # auto-fix ESLint issues
npm run format      # format src/ with Prettier
npm run format:check # check formatting without writing
npm run dev         # watch mode build

# Run a single test file or domain
npx vitest run tests/storage/env.test.ts
npx vitest run tests/registry/models.test.ts
npx vitest run tests/ui/api.test.ts

# Test the CLI locally (already npm-linked)
anygate                 # bare command: onboarding flow (first run) or main menu (subsequent)
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
- **`src/auth/`**: Authentication, PKCE, OAuth device flows, keyring adapters, & token handling (GitHub, OpenAI, xAI, Claude Code, Antigravity)
- **`src/cli/`**: Subcommand entry points (`root.ts`, `claude.ts`, `claude-app.ts`, `codex.ts`, `codex-app.ts`, `gemini.ts`, `antigravity.ts`, `providers-command.ts`, `providers.ts`, `models.ts`, `server.ts`, `ui.ts`, `doctor.ts`, `update.ts`, `completions.ts`, `index.ts`)
- **`src/config/`**: System constants, path definitions, default preferences, and environment variable resolution
- **`src/gateway/`**: API Gateway, HTTP Proxies, & Protocol Translation
  - `adapters/`: Wire format translation (`sdk-adapter.ts`, `openai-adapter.ts`, `vertex.ts`)
  - `antigravity/`: Antigravity fake Cloud Code gateway server & request/response adapters
  - `context/`: Prompt context fitting (`context-fit.ts`)
  - `providers/`: SDK language model factories (`provider-factory.ts`)
  - `proxy/`: Local HTTP Anthropic/OpenAI proxies (`anthropic-proxy.ts`, `proxy-shared.ts`)
  - `server/`: Standalone gateway server (`server.ts`, `router.ts`, `auth.ts`, `vendor-mask.ts`)
  - `web-search/`: Web search tool integrations (`duckduckgo.ts`, `searxng.ts`, `brave.ts`, `tavily.ts`, `tool.ts`)
- **`src/providers/`**: LM provider drivers (`opencode-serve.ts` only; per-vendor stubs removed)
- **`src/registry/`**: Provider & Model Registry
  - `data/`: Bundled model & pricing caches
  - `loader/`: Opencode importers, materializer, & data loaders
  - `providers/`: Standardized per-provider metadata (`anthropic/`, `google/`, `groq/`, `mistral/`, `nvidia/`, `ollama/`, `openai/`, `vertex/`, `xai/`)
  - `resolver/`: Template and model ID resolvers
  - `storage/`: Registry persistence, custom endpoint CRUD, & IO (`crud.ts`, `io.ts`)
  - `sync/`: Background catalog model & credential refreshers
  - `templates/`: Provider template definitions & model catalog fetchers
  - `validation/`: URL security, credential verification, & self-healing model validation (`model-validator.ts`, `config.ts`)
- **`src/services/`**: Cross-cutting shared services (`analytics.ts`, `doctor.ts`, `downloads.ts`, `favorites.ts`, `index.ts`, `model-sync.ts`, `provider-health.ts`, `self-update.ts`, `update-check.ts`, `updates.ts`)
- **`src/storage/`**: Local configuration (`config.ts`), credentials (`credentials.ts`), favorites (`favorites.ts`), history (`history.ts`), and logs (`logs.ts`)
- **`src/types/`**: TypeScript type definitions (`api.ts`, `auth.ts`, `config.ts`, `gateway.ts`, `launch.ts`, `model.ts`, `provider.ts`, `registry.ts`)
- **`src/ui/`**: Web App Backend & Dashboard Server
  - `api.ts`, `api-types.ts`, `server-control.ts`
  - `app/`: Modern Svelte 5 / Vite UI Frontend Application (`src/`, `components/`, `routes/`, `stores/`)
- **`src/utils/`**: Pure helper functions (`agent-io.ts`, `array.ts`, `crypto.ts`, `files.ts`, `http.ts`, `index.ts`, `json.ts`, `network.ts`, `paths.ts`, `string.ts`, `time.ts`)

### Test Suite Structure (`tests/`)

Tests mirror `src/` domain subdirectories:
- `tests/apps/`: Application launcher, prompt, & session tests (31 test files)
- `tests/auth/`: OAuth flow & token handling tests
- `tests/cli/`: CLI subcommand & update check tests
- `tests/gateway/`: Gateway server, HTTP proxy, & SDK adapter tests
- `tests/helpers/`: Mock HTTP request/response test utilities (`ui-api-test-utils.ts`)
- `tests/registry/`: Provider registry, template fetcher, & model sync tests
- `tests/services/`: Health check, usage, & update service tests
- `tests/shared/`: Shared utility tests (logger, redact, validators)
- `tests/utils/`: Utility function tests (array, crypto, files, http, json, network, paths, string, time)
- `tests/storage/`: Configuration & credential store tests
- `tests/ui/`: UI REST API & dashboard control tests
- `tests/web-search/`: Web search tool tests

---

## Release Status & Constraints

- `package.json` is the single source of truth for versioning. `VERSION` in `src/config/constants.ts` reads `pkg.version`.
- Never touch `settings.json` directly; configuration is passed via environment variables to child processes.
- `--dry-run` ignores saved state and skips all disk writes.
