# Current Focus & Recent Changes

> Active development status and recent major architecture updates.

## Current Version: 0.6.2

## Recent Changes (Dashboard: correctness, live data, SSE)

Four dashboard defects fixed, plus new live-data plumbing. Details:

1. **OAuth from the UI was fully broken.** `b88a876` renamed the backend routes
   `oauth/* → auth/*` but updated no client, so both the Svelte app and the
   legacy `src/ui/public/app.js` 404'd on every OAuth sign-in (Claude Code, xAI,
   GitHub Copilot, OpenAI, Antigravity). `src/ui/api.ts` now serves both
   spellings as aliases, with a test asserting neither falls through to the
   router's 404.
2. **The health panel was fabricating data.** `GET /api/health` did not exist;
   `getHealth()` swallowed the 404 and returned a hardcoded report claiming
   `port17645Available: true` and no env conflicts. The diagnostics in
   `src/services/doctor.ts` were trapped inside `runDoctorCommand`, which prints
   ANSI and returns an exit code. Extracted `collectDoctorReport()` (structured,
   no terminal output), wired it to a real `GET /api/health` shared with
   `anygate doctor`, and deleted the client-side fallback so an unreachable
   backend now reads "Unavailable" instead of green checks. Also fixed a latent
   bug where `conflicts.join()` on `ConflictInfo[]` rendered `[object Object]`,
   and taught the port check that our own running gateway holding 17645 is the
   healthy case, not a conflict.
3. **Analytics fetched twice per interaction.** `Dashboard.svelte` called
   `loadAnalytics()` from the range handler *and* from an `$effect` tracking
   `analytics.range`. The effect is now the single fetch trigger, and the store
   carries a request sequence guard so fast range switching can't publish a
   stale response.
4. **Launch presets never left the browser.** They were `localStorage`-only.
   Added `launchPresets` to `UserPreferences`, `load/saveLaunchPresets()` in
   `src/storage/config.ts`, and `GET|POST /api/presets` with input sanitization
   (unknown keys stripped, ids de-duplicated last-write-wins) so a malformed
   client can't write arbitrary data into the shared config file. The store
   rolls back its optimistic update when a save fails.
5. **Silent analytics data loss (found while testing).** `appendAtomic()` in
   `src/storage/analytics.ts` never created the app home directory, so on a
   fresh install the earliest usage events were dropped with both write paths
   failing ENOENT into a swallowing catch. Now `mkdir -p`s first.
6. **Previously-discarded analytics dimensions exposed.** The aggregation
   already computed a 24-hour histogram and carried a per-event `app` field, but
   emitted only `peakHour` and dropped the rest. `DashboardAnalytics` now
   includes `hourly[24]`, per-`app` token/message rollups, and separate
   `inputTokens`/`outputTokens`, surfaced by two new panels
   (`HourlyActivity.svelte`, `AppBreakdown.svelte`).
7. **SSE replaces status polling.** New `src/services/event-bus.ts` — placed
   outside `ui/` so storage and gateway producers don't import the UI layer —
   backs `GET /api/events`. `recordUsage` emits `usage`, the server lifecycle
   notifier emits `server`. The client keeps one `EventSource` for the whole app
   (`lib/stores/events.svelte.ts`) and only falls back to interval polling after
   repeated connection failures. Server tracking moved from `Server.svelte` to
   `App.svelte` so the dashboard's "server on" badge stays accurate on every
   route.
8. **Visual/UX correctness.** The sidebar's status dot was hardcoded green with
   a "Health check available" tooltip regardless of state — it now reflects the
   real report with neutral/ok/warn/error states. Below 760px the sidebar was
   still `height: 100dvh`, pushing all content below a full screen of nav; it
   now collapses to a horizontally-scrolling bar. Added a global
   `prefers-reduced-motion` guard in `styles/tokens.css`, and fixed the
   `a11y_no_noninteractive_tabindex` warning plus unused CSS in
   `ModelRow.svelte`.

Coverage: `tests/ui/ui-api-dashboard-fixes.test.ts` (15),
`tests/ui/ui-api-events.test.ts` (9), `tests/services/event-bus.test.ts` (7).
`tests/helpers/ui-api-test-utils.ts` gained EventEmitter + `writableEnded`
support so streaming handlers are testable.

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
