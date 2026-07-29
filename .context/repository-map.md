# Repository Directory Map

> Authoritative file-by-file inventory of the codebase across `src/` and `tests/`.

## `src/` Architecture

- `src/apps/` — Application integrations:
  - `claude/`: Claude Code CLI & Desktop launchers
  - `codex/`: OpenAI Codex & ChatGPT App launchers
  - `gemini/`: Google Gemini CLI & Antigravity launchers
  - `shared/`: Prompt builders, key setup, context-window calculation, free-models logic, and model compatibility filters
- `src/auth/` — OAuth device flows, PKCE, keyring adapters, & token handling (GitHub, OpenAI, xAI, Claude Code, Antigravity)
- `src/cli/` — Subcommand entry points (`claude.ts`, `codex.ts`, `gemini.ts`, `antigravity.ts`, `providers-command.ts`, `models.ts`, `server.ts`, `ui.ts`, `doctor.ts`, `update.ts`)
- `src/config/` — System constants, path definitions, default preferences, and environment variable resolution
- `src/gateway/` — API gateway, HTTP proxies, & protocol translation:
  - `adapters/`: `sdk-adapter.ts`, `openai-adapter.ts`, `vertex.ts`
  - `antigravity/`: Antigravity fake Cloud Code gateway server & adapters
  - `context/`: `context-fit.ts` prompt token estimation
  - `providers/`: `provider-factory.ts` dynamic SDK model builder
  - `proxy/`: `anthropic-proxy.ts`, `proxy-shared.ts`
  - `server/`: `server.ts`, `router.ts`, `auth.ts`, `vendor-mask.ts`
  - `web-search/`: `duckduckgo.ts`, `searxng.ts`, `brave.ts`, `tavily.ts`, `tool.ts`
- `src/providers/` — LM provider drivers (`opencode-serve.ts` only; per-vendor stubs removed)
- `src/registry/` — Provider & model registry:
  - `data/`: Bundled model & pricing caches
  - `loader/`: Opencode importers & materializer
  - `providers/`: Standardized per-provider metadata (`anthropic`, `google`, `groq`, `mistral`, `nvidia`, `ollama`, `openai`, `vertex`, `xai`)
  - `resolver/`: Template and model ID resolvers
  - `storage/`: Persistence & custom endpoints (`crud.ts`, `io.ts`)
  - `sync/`: Background catalog model refreshers
  - `templates/`: Provider template definitions & fetchers
  - `validation/`: URL security and credential verification
- `src/services/` — Cross-cutting services (`analytics.ts`, `doctor.ts`, `downloads.ts`, `favorites.ts`, `provider-health.ts`, `self-update.ts`)
- `src/storage/` — Persistence: preferences (`config.ts`), credentials (`credentials.ts`), favorites (`favorites.ts`), history (`history.ts`), and logs (`logs.ts`)
- `src/types/` — TypeScript type definitions (`api.ts`, `auth.ts`, `config.ts`, `gateway.ts`, `launch.ts`, `model.ts`, `provider.ts`, `registry.ts`)
- `src/ui/` — Gateway server & Web Dashboard (`api.ts`, `api-types.ts`, `server-control.ts`, and Svelte 5 frontend app at `src/ui/app/`)
- `src/utils/` — Pure helper functions (`crypto.ts`, `files.ts`, `http.ts`, `json.ts`, `network.ts`, `paths.ts`, `string.ts`)

## `tests/` Test Suite Structure

- `tests/apps/`: Application launcher, prompt, & session tests (31 test files)
- `tests/auth/`: OAuth flow & token handling tests
- `tests/cli/`: CLI subcommand & update check tests
- `tests/gateway/`: Gateway server, HTTP proxy, & SDK adapter tests
- `tests/helpers/`: Mock HTTP request/response test utilities (`ui-api-test-utils.ts`)
- `tests/registry/`: Provider registry, template fetcher, & model sync tests
- `tests/services/`: Health check, usage, & update service tests
- `tests/storage/`: Configuration & credential store tests
- `tests/ui/`: UI REST API & dashboard control tests
- `tests/web-search/`: Web search tool tests
