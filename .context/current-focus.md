# Current Focus & Recent Changes

> Active development status and recent major architecture updates.

## Current Version: 0.6.0

### Recent Architectural Refactoring
1. **17-Domain `src/` Restructuring**: Clean, single-responsibility domain subdirectories.
2. **Engine Subdomain Split**: Reorganized `src/engine/` into `routing/` and `selection/`.
3. **Registry Provider Metadata**: Standardized provider metadata in `src/registry/providers/`.
4. **Colocated Svelte 5 Frontend**: Web dashboard app located in `src/ui/app/`.
5. **Reorganized Test Suite**: All 117 test files relocated to matching `tests/` domain subdirectories.
6. **Documentation System**: Established `docs/` (architecture, components, guides, reference) and `.context/` AI agent working memory.

## Development Checklist for New Features & UI Changes

Whenever a feature is added, modified, or deleted in the codebase or UI:
- [x] Update `docs/architecture/` if system data flow or lifecycle changes
- [x] Update `docs/components/` for modified modules
- [x] Update `docs/reference/` if new providers, apps, config keys, or env vars are introduced
- [x] Update `.context/current-focus.md` with the change summary
- [x] Update `AGENTS.md` and `CLAUDE.md` if agent workflows are affected
- [x] Update `CHANGELOG.md`

## Recent Changes (v0.5.11)

1. **Bare `anygate` Command**: New `src/cli/root.ts` handler — onboarding flow on first run (3-step: categorize providers, handle selections, summary) and main menu on subsequent runs.
2. **Provider-Aware Model Format Detection**: Rewrote `src/ui/app/src/lib/providers/modelFormat.ts` with `inferModelFormat(modelId, providerId)` that distinguishes OpenAI-compatible providers (NVIDIA, Groq, etc.) from the actual OpenAI provider. Fixes NVIDIA `openai/gpt-oss-120b` being incorrectly marked "unsupported".
3. **Non-TTY Graceful Degradation**: Bare `anygate` in non-interactive mode falls back to help text instead of crashing.
4. **Self-Healing Model Validation**: New `src/registry/validation/` module with `model-validator.ts` and `config.ts`. Automatically checks model availability via provider APIs, caches results (24h TTL), and integrates into `fetch-template-models.ts` (background validation), `provider-catalog.ts` (filter deprecated), `cli/claude.ts` (block deprecated at launch), and `cli/models.ts` (`validate` subcommand).
5. **Context Window Safety Margin**: Enforced context fitting on ALL outbound SDK requests. `translateRequest()` now always resolves a context window (explicit option or model-id lookup via `resolveContextWindowFromModel`) and trims with an 85% safety margin. `startProxy()` and `startProxyCatalog()` resolve `route.contextWindow` with the same fallback. Fixes HTTP 400 "Input length exceeds maximum allowed tokens" on small-window models.

## Recent Changes (v0.6.0)

1. **Agent Router Provider**: New template `src/registry/data/templates/agentrouter.json` — `@ai-sdk/anthropic` against `https://agentrouter.org`, models from `/v1/models`. Registered in Anthropic format deliberately: Agent Router's `sensitive_words` content filter runs only on its OpenAI chat/completions relay, so the native `/v1/messages` path avoids spurious HTTP 500 `sensitive_words_detected` errors. The template declares the `User-Agent: claude-cli/1.0.0 (external, cli)` and `x-app: cli` headers the gateway gates on.
2. **`signupNote` Template Field**: Optional one-line note rendered beside the signup link. Threaded through `ProviderTemplate` / `ProviderTemplateData` (`src/registry/templates/provider-templates.ts`, `src/registry/loader/data-loader.ts`), `toProviderTemplate()`, `printApiKeyProviderPanel()` (`src/apps/shared/ui.ts`), the signup hint in `src/cli/root.ts`, `GET /api/providers/templates` (`src/ui/api.ts`), the `UiTemplate` contract on both sides, and `ProviderForm.svelte`. Only Agent Router sets it today.
3. **Template Headers Persisted on Add**: `addProviderFromTemplate()` (`src/registry/templates/add-template.ts`) previously discarded `template.headers`; runtime reads them from `provider.api.headers` via `materializeOne()`, so header-gated providers passed the add-time connection test and then 401'd on every call. Also fixes GitHub Copilot's `Editor-Version`.
4. **Bearer Fallback for Anthropic-Format Model Listing**: `fetch-template-models.ts` now sends both `x-api-key` and `Authorization: Bearer` for `@ai-sdk/anthropic` templates whose host is not `api.anthropic.com`, because new-api/one-api forks serve Anthropic-format messages but authenticate listing with Bearer.
5. **Custom Header Delivery Fixes**: Antigravity's request path no longer drops provider headers, and `src/gateway/providers/provider-factory.ts` wraps `fetch` to force configured headers past `createOpenAICompatible`'s own header handling (which differed between streaming and non-streaming). Added `createNullChunkStripper()` to drop non-compliant `data: null` SSE lines that caused `AI_TypeValidationError`.

## Phase 0/1 Changes (folded into v0.6.0; 0.5.12 was never published)

1. **Dead Code Removal**: Removed 30+ dead files across `src/engine/` (10 files), `src/providers/` (8 files), `src/protocols/` (3 files), `src/core/` (4 directories), `src/launchers/` (8 files), and `tests/engine/` (2 files). Only `src/engine/routing/health.ts` and `src/providers/opencode-serve.ts` were retained as they are actively imported.
2. **Bare `anygate` Main Menu Dispatch**: Fixed `src/cli/root.ts` `runMainMenu()` to dispatch to actual command handlers via `dispatchCommand()` instead of printing messages and returning 0.
3. **Gateway Server Security Hardening**: Added security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Cache-Control`), rate limiting (120 req/min), and `Content-Length` to all JSON responses in `src/shared/http.ts`.
4. **Gateway Server Error Handling**: Fixed `src/gateway/server/router.ts` catch block to use `sendError()` for `AnygateError` instances and send generic "Internal server error" for other errors.
5. **ESLint + Prettier**: Added linting and formatting configuration with pre-commit hooks.
