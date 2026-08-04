# Changelog

## Unreleased

Web dashboard: four defects where a feature was broken or showing invented data,
plus live push updates and previously-discarded analytics.

### Bug Fixes — dashboard

- **OAuth sign-in from the dashboard always failed**: `b88a876` renamed the backend routes `oauth/* → auth/*` without updating a single client. Both the Svelte app (`endpoints.ts`) and the legacy `src/ui/public/app.js` still posted to `/api/providers/oauth/start` and polled `/api/providers/oauth/status`, so every OAuth provider — Claude Code, xAI, GitHub Copilot, OpenAI, Antigravity — 404'd at the router before reaching the fully-working handlers behind it. Both spellings are now served as aliases, and a test asserts each reaches its handler rather than the router's fallback.
- **The health panel invented its results**: `GET /api/health` was never implemented. The client caught the 404 and substituted a fabricated report that hardcoded `port17645Available: true` and an empty conflicting-env-var list, and declared the keychain unavailable — so the dashboard confidently displayed values it had never checked. The real diagnostics existed in `src/services/doctor.ts` but were welded to `runDoctorCommand`, which prints ANSI and returns an exit code. Extracted `collectDoctorReport()` and wired it to a real `GET /api/health` shared with `anygate doctor`; the client fallback is deleted, so an unreachable backend now reports "Unavailable" instead of green checks.
- **Doctor rendered `[object Object]` for env conflicts**: `detectConflicts()` returns `ConflictInfo[]`, but the conflict message interpolated `conflicts.join(', ')` directly. Now joins the names, and the API returns names only so env var *values* never leave the process.
- **Doctor flagged our own gateway as a port conflict**: the port check reported 17645 as "In use by another process" whenever anygate's own gateway was running. It now distinguishes our gateway from a foreign process.
- **Every time-range click fetched analytics twice**: `Dashboard.svelte` triggered `loadAnalytics()` from both the range handler and an `$effect` tracking `analytics.range`. The effect is now the sole trigger, and the store carries a sequence guard so rapid switching can't publish a stale response over a newer one.
- **Launch presets never persisted**: they were written to `localStorage` only, so they vanished across browsers and were invisible to the CLI. Added `launchPresets` to `UserPreferences` and `GET|POST /api/presets`, with sanitization that strips unknown keys and de-duplicates ids so a malformed client cannot write arbitrary data into the shared config file. Failed saves now roll back instead of falsely reporting success.
- **Analytics silently dropped events on a fresh install**: `appendAtomic()` never created the app home directory, so both write paths failed with ENOENT into a swallowing catch and the earliest usage was lost with no diagnostic. It now creates the directory first.
- **Sidebar status dot was always green**: hardcoded to `--success` with a "Health check available" tooltip regardless of actual state. It now reflects the real health report, staying neutral until a result arrives rather than defaulting to healthy.
- **Sidebar consumed a full screen on mobile**: below 760px the shell collapses to one column, but the sidebar kept `height: 100dvh`, pushing all page content below a screenful of navigation. It now collapses to a horizontally-scrolling bar.

### Features — dashboard

- **Live updates over SSE**: new `GET /api/events` replaces the 5-second status polling. Producers publish through `src/services/event-bus.ts`, deliberately placed outside `ui/` so storage and gateway code can emit without importing the UI layer; `recordUsage` emits `usage` and the server lifecycle notifier emits `server`. The client holds one `EventSource` for the whole app and falls back to polling only after repeated failures. Server tracking moved from `Server.svelte` to `App.svelte`, so the dashboard's "server on" badge is now accurate on every route rather than only while the Server page is open.
- **Analytics dimensions that were collected but discarded**: the aggregation already built a 24-hour histogram and carried a per-event `app` field, then returned only `peakHour`. `DashboardAnalytics` now also exposes `hourly[24]`, per-app token/message rollups, and separate prompt/completion totals, surfaced by two new panels (`HourlyActivity`, `AppBreakdown`).

### Accessibility

- Global `prefers-reduced-motion` guard in `styles/tokens.css`, collapsing the shared duration tokens so every component that animates through them is covered.
- Fixed `a11y_no_noninteractive_tabindex` in `ModelRow.svelte` by splitting the interactive and static cases instead of toggling `role`/`tabindex` dynamically, keeping non-clickable rows out of the tab order. Removed dead `.open` CSS.

## 0.6.1 (2026-08-04)

Provider, OAuth, launcher, and self-update fixes — mostly cases where a feature
could never have worked, not edge cases.

GitHub Copilot and OpenAI ChatGPT sign-in could never complete: one posted to a
non-existent GitHub endpoint, the other threw on a missing template *after* already
saving its tokens. Ollama and LM Studio were unusable on any non-default port, a
keyless local server disappeared from every launcher, and three templates
(SambaNova, Fireworks, Cohere) were mis-declared badly enough that two of them could
not be added at all. The dashboard offered providers you had already configured as
new ones to add. `anygate update` was broken for every Windows user on a default Node
install, and Microsoft Store installs of Claude Desktop and ChatGPT were reported as
not installed.

### Bug Fixes — self-hosted providers (Ollama, LM Studio)

- **Could not be pointed at your own server**: Both templates declare a `urlPrompt`, but `ProviderTemplateData` never declared the field and `toProviderTemplate()` never copied it, so `template.urlPrompt` was always `undefined`. That single dropped field broke both add paths: the CLI's `runTemplateAddFlow()` never prompted and called `addProviderFromTemplate()` with no `baseUrl`, always probing the hardcoded default port, while the dashboard's `{#if current?.urlPrompt}` never matched so the base-URL field never rendered. Anyone running Ollama on a non-default port, or on another machine, could not configure it at all. The field is now mapped in `toProviderTemplate()`, and the CLI collects a base URL via a new `promptTemplateBaseUrl()` that mirrors the custom-endpoint flow's `http://` consent prompt and `validateCustomEndpointUrl()` SSRF check.
- **A keyless local server vanished from every launcher**: `materializeOne()` in `src/registry/loader/materialize.ts` dropped any provider resolving to a blank credential unless its template set `anonymousFreeModels`. Ollama and LM Studio are `apiKeyOptional` but not `anonymousFreeModels`, so a CLI-added local server with no key silently materialized to nothing — present in the registry, listed by `anygate providers`, invisible everywhere it mattered. The guard now honours `apiKeyOptional` via a new `providerAllowsMissingKey()`. The dashboard's workaround of persisting the template id (`"ollama"`) as a stand-in credential has been removed, since it is no longer needed and misrepresented an unauthenticated server as having a key.
- **Models advertised context windows the server truncates**: Ollama's `/v1/models` returns no `context_length`, and `parseModelList()` called `resolveContextWindow(id)` without a `providerId` — which made `PROVIDER_DEFAULTS.ollama` unreachable dead code. Generic ID heuristics then reported each model's *trained* maximum: `deepseek-r1:14b` was advertised at 1,000,000 tokens against a server serving `num_ctx` 4096 by default. Ollama truncates silently rather than erroring, so this surfaced as incoherent replies and tool-call loops with no diagnostic. `lookupContextWindow()` now consults a self-hosted server's limit **before** the OpenCode and models.dev caches: both describe what the *hosted* provider serves (models.dev lists `deepseek-r1` at 163,840, which says nothing about your machine), whereas `num_ctx` is a hard ceiling no model-derived source can override. A window the server itself reports still wins, arriving as the `explicit` argument. `OLLAMA_CONTEXT_LENGTH` — the same variable `ollama serve` reads — is honoured for raised server defaults, and `providerId` is now threaded through the call sites in `fetch-template-models.ts` and `materialize.ts` that previously dropped it.
- **An authenticated local server could not be configured from the dashboard**: `ProviderForm.svelte` hid the API-key field entirely for `apiKeyOptional` templates, so an Ollama behind a reverse proxy requiring auth had no way to accept a key. The field now renders and is labelled optional.
- **`ollamaProviderMeta` contradicted the Ollama template**: it named `ollama-ai-provider` (absent from `package.json`) and `http://localhost:11434`, missing the `/v1` suffix the SDK requires. Currently unimported, so this was latent rather than breaking, but it disagreed with the template that actually drives the add flows. Now aligned and pinned by a test.

### Bug Fixes — OAuth providers (GitHub Copilot, OpenAI ChatGPT, xAI SuperGrok)

- **GitHub Copilot sign-in could never complete**: `src/auth/github.ts` posted the device-code token request to `https://github.com/login/auth/access_token`. The real endpoint is `/login/oauth/access_token` — GitHub answers the wrong path with HTTP 422 and an HTML error page. Because the poll loop parsed with `.json().catch(() => ({}))`, that HTML collapsed to an empty object carrying neither `error` nor `access_token`, so the loop fell through to a bare `GitHub device authorization failed` with no status and no detail. Every Copilot sign-in failed, and the message named no cause. Verified against the live endpoints: the wrong path returns 422 + HTML, the correct one returns 200 + JSON. The device-code URL (`/login/device/code`) was already correct.
- **OpenAI ChatGPT sign-in failed after the tokens were saved**: `upsertOAuthProvider()` derived a template id by stripping `-oauth` unconditionally, so `openai-oauth` resolved to `openai` — but there is no `openai.json`, only `openai-oauth.json`. `getTemplateById()` returned `undefined` and the function threw `Provider openai-oauth is not in your registry and has no template`. The throw happens *after* `saveProviderCredential()`, so the user was signed in to ChatGPT with the tokens in their keychain, no provider in the registry, and an identical failure on every retry — recoverable only by installing OpenCode so the broker path could supply the entry. Template resolution now tries the bare id first (so `xai-oauth` keeps sharing `xai.json` rather than forking the catalog), then the id as given, then the registry id. A test asserts every id in `NATIVE_OAUTH_PROVIDER_IDS` resolves to a template, since any that does not fails the same way.
- **Device-code failures reported nothing actionable**: both the GitHub and xAI poll loops discarded non-JSON error bodies, which is precisely what hid the GitHub URL bug. A misrouted endpoint, an HTML error page, or a proxy failure was indistinguishable from a valid pending response. Both now read the body as text and parse it themselves, reporting the HTTP status and a 200-character excerpt. GitHub additionally fails fast on a non-JSON body instead of polling to the 15-minute deadline — an endpoint not speaking the device-flow protocol will not start speaking it. xAI now surfaces `error_description` when present and gives an actionable message on `expired_token`. OpenAI's terminal polling and token-exchange errors likewise include the response body, so a rejected client id is no longer just a status code.

### Bug Fixes — provider catalog

- **Providers already configured were offered as new ones to add**: `GET /api/providers/templates` built the dashboard's Add-provider list from `listSupportedTemplates()` — the entire catalog — while filtering only the OAuth half by what the user already had. A provider set up with a working API key still appeared as something to add. It now uses `listAddableTemplates(configured)`, the same exclusion the CLI's `pickTemplateFromCatalog()` already applied, including the zen/go aliasing for `opencode-cloud`. The add *handler* deliberately still resolves against the full catalog, since re-adding an existing provider must remain possible.
- **SambaNova was mis-declared and could never be added**: `sambanova.json` used camelCase keys (`defaultBaseUrl`, `modelsPath`) that `ProviderTemplateData` does not read, so its base URL resolved to `undefined`; its `authType: "api"` also fell through the loader's `"apiKey"` check and silently degraded to `"none"`. It additionally named `@ai-sdk/sambanova`, which is not published on npm at all. Rewritten to the canonical schema against `@ai-sdk/openai-compatible`. It was the only template using non-canonical key names.
- **Fireworks could never be added**: the template named `@ai-sdk/fireworks`, which is not a dependency of this project, so `probeTemplatePackage()` rejected it with "Could not load @ai-sdk/fireworks". Repointed at `@ai-sdk/openai-compatible`, which serves the same OpenAI-compatible endpoint.
- **Cohere relied on a fallback for its SDK package**: `cohere.json` omitted `npm` entirely and depended on the `NPM_PACKAGES` lookup in `provider-templates.ts`. Now declared explicitly, alongside the `signupUrl` and `modelSource` it was also missing.
- **`@ai-sdk/anthropic` and `@ai-sdk/provider-utils` were imported but never declared**: both resolved only by transitive hoisting through `@ai-sdk/amazon-bedrock` and `@ai-sdk/google-vertex`. `provider-factory.ts` dynamically imports the former for every Anthropic-format provider (Anthropic, Agent Router, Claude Code), so a dependency bump that dropped or renamed it would have broken Anthropic routing at runtime — presenting as a provider bug rather than a missing dependency. Both are now direct dependencies at their already-resolved versions (3.0.81 and 4.0.27), so no version changed.

### Bug Fixes — launchers and self-update

- **`anygate update` failed on Windows with `spawn …\nodejs\npm ENOENT`**: `resolveNpmBin()` shelled out to `where npm` and accepted the first line ending in `.cmd` *or* `npm` — but `where` lists the extensionless Unix shell script (`C:\Program Files\nodejs\npm`) before `npm.cmd`, so it always chose the one file `CreateProcess` cannot execute. Two further latent bugs sat behind it: spawning a `.cmd` has required `shell: true` since Node 18.20.2 (the CVE-2024-27980 fix), and under `shell: true` the unquoted default path would have split at `C:\Program`. npm is now invoked by bare name with `shell: true` on Windows, letting cmd.exe resolve it via PATHEXT — no absolute path, nothing to quote. The self-update path was effectively broken for every Windows user on a default Node install.
- **One failed update printed two errors**: Node emits both `error` and `close` when a child cannot start, so a single failure produced `Could not start npm: … ENOENT` followed by `Update failed (exit -4058)` — `-4058` being the numeric ENOENT. The existing `settled` guard covered only `resolve()` while both handlers logged before consulting it, so the user still read two unrelated errors for one cause, the second a meaningless exit code. The guard now gates the logging as well. Applied to the unreferenced duplicate in `src/services/self-update.ts` too, which carried the identical bug and whose header comment asks that it be kept in sync.
- **Microsoft Store installs of Claude Desktop and ChatGPT were reported as not installed**: `findClaudeApp()` and `findCodexApp()` re-implemented the app search by hand, checking two static `%LOCALAPPDATA%` paths and never calling `findWinAppExtra()`. Store (MSIX) installs have no `.exe` at any fixed path, so `detectApp()` and the web dashboard showed both apps as missing even though `findApp()` could locate them. Both now delegate to `launcher.findApp()`, and `CodexAppLauncher` gained a `findWinAppExtra()` that resolves a Store install through `Get-StartApps` to a version-independent `shell:AppsFolder` moniker.
- **A stale path override made an installed app look missing**: `detectApp()` treated an override that no longer exists as proof the app was absent. Store paths are version-stamped (`…\WindowsApps\Claude_1.24012.1.0_x64__…`), so every Store auto-update invalidated a previously-working override and left users permanently stuck — re-browsing to the new path only re-armed the same trap on the next update. A stale override now falls through to auto-detection, which resolves the version-independent moniker.

### Tests

- **`tests/registry/ollama-provider.test.ts`** (15 tests): `urlPrompt` survives template loading for both self-hosted providers; a keyless `apiKeyOptional` provider materializes while one that genuinely requires a key is still dropped; context windows report the server limit rather than the trained maximum, honour `OLLAMA_CONTEXT_LENGTH`, ignore malformed values, and do not clamp hosted providers; the same model id is clamped under Ollama but not under its hosted provider; `ollamaProviderMeta` matches the template.
- **`tests/auth/oauth-provider-setup.test.ts`** (14 tests): GitHub posts to the correct token endpoint, reports status and body on a non-JSON response, fails fast rather than polling to the deadline, and still retries `authorization_pending`; xAI reports non-JSON bodies with status, surfaces `error_description`, gives an actionable `expired_token` message, and still retries `authorization_pending`/`slow_down`; every native OAuth provider resolves to a template, `openai-oauth` falls back correctly while `xai-oauth` keeps sharing `xai.json`, the canonical and registry ids resolve identically, and Copilot's `Editor-Version` header survives. Existing response doubles in `tests/auth/oauth-github.test.ts` and `oauth-openai.test.ts` supplied only `json()`; they now also supply `text()`, matching real `Response` objects, rather than the product being weakened to fit incomplete fixtures.
- **`tests/registry/provider-configuration.test.ts`** (14 tests): every supported template names an SDK package the factory can construct **and** that is a declared dependency; every `api-list` template resolves a base URL or asks for one; no template carries an invalid auth type or degrades to anonymous while advertising a key; `http://` base URLs are restricted to key-optional, `urlPrompt`-carrying local servers. The Add-provider endpoint is driven end-to-end against a real registry, asserting configured providers are excluded, unconfigured ones are still offered, the custom-endpoint entries always survive, and the UI's list matches the CLI's for identical registry state.
- **`tests/apps/detect-app-override.test.ts`** (6 tests): a live override is honoured, a stale one falls through to auto-detection rather than reporting the app missing, and Store-install detection resolves through `Get-StartApps`.
- Fixes were verified red-capable rather than assumed: reverting the Add-list change turns 2 of its 14 tests red; restoring the wrong GitHub URL fails the endpoint test; restoring the unconditional `-oauth` strip fails two resolution tests; removing the log guard from the `close` handler fails the double-error test. Each goes green again when restored.

### Documentation

- **`docs/reference/supported-providers.md`** named the wrong SDK package in 6 of 17 rows (NVIDIA, Ollama, DeepSeek, Perplexity, GitHub Copilot, and rows for templates that no longer exist) and covered 19 of 32 templates. Rebuilt from actual template values, split by how each provider is added (interactive add / OAuth / cloud credentials), with base URLs included and a note that the JSON templates are the source of truth.
- **`docs/PROVIDERS.md`**: the local-models section now covers the `urlPrompt` behaviour, the loopback/private-network `http://` policy, keyless materialization, and why the context window follows the server rather than the model.
- **`docs/architecture/provider-system.md`**: corrected the SDK-backed provider count and list (SambaNova was missing), and documented the requirement that every template's `npm` name a declared dependency.

### Notes

- `dist/` is committed and the installed CLI loads templates from `dist/registry/data/templates/`, so template JSON edits do not reach users until `npm run build` copies them. The three template fixes in this release were stale in `dist/` until rebuilt; verified afterwards through the built bundle that `urlPrompt` survives, all SDK packages resolve, and the Add-list exclusion holds.
- Verified against a mock server matching Ollama's documented `/v1/models` shape — Ollama was not installed on the machine these fixes were developed on. SambaNova and Fireworks templates load and construct correctly, but their live model listing was not exercised against real keys.
- The OAuth fixes were verified against the live provider endpoints (device-code and token URLs probed directly for GitHub and xAI) and through the real code paths under test, but **not** end-to-end with active Copilot, ChatGPT, or SuperGrok subscriptions. The GitHub URL and the OpenAI template resolution were both hard blockers that no subscription could work around, so those paths could not have succeeded before; whether any further issue sits behind them is unverified.

## 0.6.0 (2026-08-03)

### Features
- **Agent Router provider**: New built-in template (`src/registry/data/templates/agentrouter.json`) for [Agent Router](https://agentrouter.org), a credit-based multi-model gateway (Claude, GPT, Gemini) behind a single key. Registered against `@ai-sdk/anthropic` with base URL `https://agentrouter.org`, so requests travel the native Anthropic Messages path (`/v1/messages`) rather than the OpenAI chat/completions relay. Models are discovered from `/v1/models`. Verified working with Claude Code, Claude Desktop, and Antigravity.
- **Client-identity headers in templates**: The Agent Router template declares the `User-Agent: claude-cli/1.0.0 (external, cli)` and `x-app: cli` headers the gateway requires. Without them it answers `401 unauthorized client detected` on every request. These are now carried automatically instead of having to be entered by hand in the custom-provider form.
- **Signup notes on provider templates**: New optional `signupNote` field on provider templates, surfaced next to the "Get an API key" link in both the CLI panel (`printApiKeyProviderPanel`) and the dashboard's add-provider form. Threaded through `ProviderTemplate`, `ProviderTemplateData`, `toProviderTemplate()`, `GET /api/providers/templates`, and the `UiTemplate` contract on both sides. Currently used only by Agent Router, to disclose that its signup link is a referral link carrying $50 in bonus credits over registering directly.

### Bug Fixes
- **Template headers were dropped when adding a provider**: `addProviderFromTemplate()` in `src/registry/templates/add-template.ts` built `api: { npm, url }` and silently discarded `template.headers`, but every runtime request reads them back from `provider.api.headers` via `materializeOne()`. The result was a provider that passed the connection test at add time and then failed on every subsequent call. Headers declared on a template are now persisted. This also fixes GitHub Copilot's `Editor-Version` header, which had the same exposure.
- **Model listing failed on third-party Anthropic-compatible gateways**: `fetchTemplateModels()` sent only `x-api-key` for `@ai-sdk/anthropic` templates, but new-api/one-api forks serve `/v1/messages` in Anthropic format while authenticating model listing with a Bearer token. Off `api.anthropic.com`, both headers are now sent so listing succeeds either way; the official API ignores the extra `Authorization` header.
- **Antigravity dropped custom provider headers**: Custom headers configured on a provider were not carried into Antigravity's request path, producing `401` responses from gateways that gate on client identity. Fixed across the launcher's header plumbing.
- **OpenAI-compatible adapter overwrote configured headers**: `createOpenAICompatible` builds its own `User-Agent` and applied header options inconsistently between streaming and non-streaming requests. `src/gateway/providers/provider-factory.ts` now wraps `fetch` and forces the provider's configured headers onto every outbound request.
- **`AI_TypeValidationError` on non-compliant SSE streams**: Some gateways emit `data: null` keepalive lines mid-stream, which the SDK's stream parser rejects. Added `createNullChunkStripper()` to drop these lines before parsing.
- **GitHub Releases were published without their changelog notes**: The release-notes extraction in `.github/workflows/publish.yml` was double-escaped — inside the double-quoted shell string `\\s` collapsed to `\s`, which JavaScript then read as a literal `s`, making the pattern `##s+0.5.11`. It never matched any version, and because the workflow falls back to the commit message when extraction yields nothing, the failure was silent. Replaced with `scripts/changelog-notes.mjs`, which finds section boundaries by scanning lines (no regex, so version dots need no escaping and nothing depends on shell quoting) and exits non-zero when a section is missing so the fallback is deliberate and logged. Verified against all sections from 0.5.5 to 0.6.0.

### Phase 0: Context Window Safety & Self-Healing Validation
- **Context window exceeded (HTTP 400)**: Enforced context fitting on ALL outbound SDK requests. `translateRequest()` now always resolves a context window (explicit option or model-id lookup via `resolveContextWindowFromModel`) and trims the conversation with an 85% safety margin. Previously, fitting only triggered when `contextWindow` was explicitly passed — many code paths left it undefined, causing small-window models (GPT-3.5, Nemotron 131K, etc.) to be rejected with "Input length exceeds maximum allowed tokens". `startProxy()` and `startProxyCatalog()` now resolve `route.contextWindow` with the same fallback before passing it to `sdkTranslateRequest()`.
- **Robust context window resolution**: Added provider defaults, models.dev cache integration, and audit scripts for context window resolution. `resolveContextWindowFromModel()` now falls back through: explicit option → OpenCode cache → ID-pattern heuristics → 200k default.
- **Self-healing model validation**: New `src/registry/validation/` module (`model-validator.ts`, `config.ts`) that automatically checks model availability by calling provider APIs. Features: 24h cache TTL, 5 concurrent validations, 8s timeout, HTTP status interpretation (2xx→available, 404/410→deprecated, 401/403→error, 429/5xx→unverified), fire-and-forget background validation in `fetch-template-models.ts`, deprecated model filtering in `provider-catalog.ts`, launch-time blocking in `cli/claude.ts`, and `anygate models validate` subcommand in `cli/models.ts`.

### Phase 1: Critical Fixes
- **Bare `anygate` main menu dispatch**: The main menu in `src/cli/root.ts` now dispatches to the actual command handlers via `dispatchCommand()` instead of printing a message and returning 0. Selecting "Launch Claude", "Launch Codex", "Configure Providers", "Doctor", "Server", "Dashboard", or "Settings" from the bare `anygate` menu now launches the corresponding subcommand.
- **Dead code removal**: Removed 30+ dead files across `src/engine/` (10 files), `src/providers/` (8 files), `src/protocols/` (3 files), `src/core/` (4 directories), `src/launchers/` (8 files), and `tests/engine/` (2 files). Only `src/engine/routing/health.ts` and `src/providers/opencode-serve.ts` were retained as they are actively imported.
- **Gateway server error handling**: The catch-all in `src/gateway/server/router.ts` now uses `sendError()` for `AnygateError` instances and sends a generic "Internal server error" message for other errors, preventing internal details (stack traces, file paths, internal service names) from leaking to clients.
- **Gateway server security hardening**: Added security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Cache-Control: no-store`) to all JSON responses via `sendJson()`. Added in-memory rate limiting (120 requests/minute per client) with `429` responses and `Retry-After` header. Added `Content-Length` header to all responses. Added 10MB request body size limit.
- **ModelFormat type consistency**: Added `'cloud-code'` to `ModelFormat` in `src/types/model.ts` and updated all inline type literals (`LocalProviderModel`, `CachedModel`, `ServerModelFormat`, `AntigravityRoute`, `anthropic-proxy.ts`) to use the shared `ModelFormat` type. Eliminates type mismatch where `ServerModelFormat` had `'cloud-code'` but `ModelFormat` did not.
- **ESLint + Prettier**: Added ESLint with TypeScript support and Prettier for code formatting. New scripts: `lint`, `lint:fix`, `format`, `format:check`. Husky pre-commit hook runs lint-staged + typecheck. Formatted all 263 source files.
- **Security integration tests**: Added 14 tests in `tests/gateway/server-integration.test.ts` covering rate limiting (`checkRateLimit`), error handling (`sendError`), and security constants (`MAX_REQUEST_BODY_BYTES`).
- **Fixed ESM violation**: Replaced `require()` in `src/apps/shared/app-launcher.ts` with static import (ESM modules don't support `require()`).
- **Fixed pre-existing typecheck error**: Added `JSONSchema7` type assertion in `src/gateway/antigravity/request-adapter.ts`.

### Notes
- 0.5.12 was never published — `package.json` never left 0.5.11. Its changelog entry has been folded into this release, which is why this section carries the Phase 0 and Phase 1 headings above.

## 0.5.11 (2026-07-25)

### Features
- **Bare `anygate` command**: New `src/cli/root.ts` handler — running `anygate` with no subcommand now launches a 3-step onboarding flow on first run (categorize providers: keyless vs API-key-required; handle each selection: paste key, open signup page, or skip; show summary) and a main menu on subsequent runs (Launch Claude, Launch Codex, Configure Providers, Free Setup, Doctor, Server, Dashboard, Settings). Non-TTY mode gracefully falls back to help text.
- **Provider-aware model format detection**: Rewrote `src/ui/app/src/lib/providers/modelFormat.ts` with `inferModelFormat(modelId, providerId)` that distinguishes OpenAI-compatible providers (NVIDIA, Groq, Mistral, etc.) from the actual OpenAI provider. Fixes NVIDIA's `openai/gpt-oss-120b` being incorrectly marked "Unsupported" because its model ID contains "openai". Added `providerId` to `UiProviderModel` type, API response, and `CachedModel` type.
- **Self-healing model validation**: New `src/registry/validation/` module (`model-validator.ts`, `config.ts`) that automatically checks model availability by calling provider APIs. Features: 24h cache TTL, 5 concurrent validations, 8s timeout, HTTP status interpretation (2xx→available, 404/410→deprecated, 401/403→error, 429/5xx→unverified), fire-and-forget background validation in `fetch-template-models.ts`, deprecated model filtering in `provider-catalog.ts`, launch-time blocking in `cli/claude.ts`, and `anygate models validate` subcommand in `cli/models.ts`.

### Bug Fixes
- **Context window exceeded (HTTP 400)**: Enforced context fitting on ALL outbound SDK requests. `translateRequest()` now always resolves a context window (explicit option or model-id lookup via `resolveContextWindowFromModel`) and trims the conversation with an 85% safety margin. Previously, fitting only triggered when `contextWindow` was explicitly passed — many code paths left it undefined, causing small-window models (GPT-3.5, Nemotron 131K, etc.) to be rejected with "Input length exceeds maximum allowed tokens". `startProxy()` and `startProxyCatalog()` now resolve `route.contextWindow` with the same fallback before passing it to `sdkTranslateRequest()`.

## 0.5.10 (2026-07-24)

### Bug Fixes
- **UI serving path**: Fixed `anygate ui` serving "Not found" in browser. The `PUBLIC_DIR` in `src/ui/command.ts` was pointing to `dist/app/dist` (leftover from the old root-level `ui/` folder), but the build copies assets to `dist/ui/dist`. Updated to `join(__dirname, 'ui', 'dist')`.
- **CI workflow**: Fixed `npm ci --prefix ui` → `npm ci --prefix src/ui/app` in publish workflow (UI app lives at `src/ui/app/`, not `ui/`).
- **CI workflow**: Fixed release notes extraction to use `CHANGELOG.md` instead of non-existent `RELEASE_NOTES.md`.
- **Version sync**: Synced `package-lock.json` version with `package.json`.

## 0.5.9 (2026-07-24)

### Architectural Refactoring & Domain Modularization
- **17-Domain `src/` Architecture**: Restructured `src/` into focused, single-responsibility subdomains (`apps/`, `auth/`, `cli/`, `config/`, `core/`, `engine/`, `gateway/`, `launchers/`, `protocols/`, `providers/`, `registry/`, `services/`, `shared/`, `storage/`, `types/`, `ui/`, `utils/`).
- **Engine Subdomain Reorganization**: Split core routing and selection engine into `src/engine/routing/` (`router.ts`, `resolver.ts`, `dispatcher.ts`, `strategy.ts`, `failover.ts`, `health.ts`, `middleware.ts`, `pipeline.ts`) and `src/engine/selection/` (`selector.ts`, `target-compatibility.ts`, `launch-target.ts`).
- **Registry Provider Metadata**: Standardized provider metadata definitions inside `src/registry/providers/` (`anthropic`, `google`, `groq`, `mistral`, `nvidia`, `ollama`, `openai`, `vertex`, `xai`).
- **Colocated Web UI**: Relocated Svelte 5 visual launcher frontend application to `src/ui/app/`.
- **Domain Test Suite Structure**: Reorganized all 117 test files into matching `tests/` subdirectories (`apps/`, `auth/`, `cli/`, `engine/`, `gateway/`, `helpers/`, `registry/`, `services/`, `storage/`, `ui/`, `web-search/`).

### UI — Full provider catalog in web UI
- Fixed `GET /api/providers/templates` to return **all supported templates** (via `listSupportedTemplates()`) instead of only templates not yet configured (`listAddableTemplates()`).
- The web UI "Add Provider" modal now shows **all 19 supported providers** (Anthropic, Cerebras, Cohere, DeepInfra, DeepSeek, Fireworks, Groq, Kilo, LM Studio, Mistral, NVIDIA, Ollama, OpenCode Cloud, OpenRouter, OVH, Perplexity, Scaleway, Together AI, Venice, xAI) plus 3 OAuth providers (GitHub Copilot, OpenAI, xAI) and 2 custom templates — matching the CLI behavior.

### Provider catalog — `listSupportedTemplates()` / `listAddableTemplates()` distinction
- `listSupportedTemplates()` now returns all supported templates (used by UI and `anygate providers add` picker).
- `listAddableTemplates()` still filters out already-configured providers (used by CLI provider hub).

### Provider templates moved to JSON data
- All provider templates moved from `src/providers/provider-templates.ts` to individual JSON files under `src/registry/data/templates/` (19 files) and `src/registry/data/providers/` (Zen/Go).
- Added `src/registry/data-loader.ts` for synchronous/async loading with graceful fallback.
- `src/providers/provider-templates.ts` now loads from JSON at build time with fallback to in-memory array; `src/registry/builtins.ts` loads Zen/Go from JSON.
- Enables easy addition of new providers without code changes; schema validation possible.

## 0.5.8 (2026-07-20)

### Non-interactive favorites launch (all app launchers)
- `anygate antigravity --favorites` (and the Antigravity IDE / `agy` CLI variants)
  now skip the provider picker and the "Launch from Antigravity CLI favorites"
  prompt, resolving the first available favorite as the boot model and serving the
  full multi-route catalog. Matches `anygate claude-app --favorites` behavior.
- `anygate codex-app --favorites` now skips the "Starting model?" picker and the
  "Confirm launch?" prompt when favorites exist, auto-selecting the first
  available favorite and going straight into the favorites catalog.
- Claude Desktop already launched directly on `--favorites`; behavior is now
  consistent across all three app launchers.
- The web UI "All favorites" launch mode (emits bare `--favorites`) now produces a
  true one-click launch for every supported app.

### Gateway-side web search
- Keyword search now works on every favorite at zero cost. Claude Desktop sends
  Anthropic's hosted `web_search_tool_20250305` (`server_tool`); on non-Anthropic
  favorites (Kilo / Mistral / Nemotron) the SDK adapter path used to drop any tool
  lacking `input_schema`, so the hosted search silently vanished and the model
  looped on empty results. anygate now intercepts that tool, executes the search
  itself, and feeds real results back to the model.
- Free by default. The default backend is keyless DuckDuckGo (HTML scrape, no new
  dependency). Optional free upgrade: self-hosted SearXNG (`ANYGATE_SEARXNG_URL`).
  Paid backends Brave / Tavily are supported as drop-in upgrades via
  `ANYGATE_SEARCH_API_KEY`.
- Implemented as a local Vercel AI SDK tool. `makeWebSearchTool(name)` preserves the
  exact incoming tool name so the model's `tool_call` still matches, and its
  `execute` runs `searchWeb()`. The SDK's built-in tool loop (`stopWhen:
  stepCountIs(n)`) performs the search, returns results to the model, and the model
  produces a final grounded answer.
- The intermediate `tool_use`/`tool_result` round-trip is hidden from the client.
  The stream writer skips blocks whose `toolName` equals the web-search tool, so
  Claude Desktop (which can't run a hosted tool itself) just receives the final
  answer with the search incorporated — no dangling `tool_use`. Non-web-search MCP
  tools behave exactly as before.
- Master kill switch + config. `ANYGATE_WEB_SEARCH` (`on`/`off`),
  `ANYGATE_WEB_SEARCH_PROVIDER`, `ANYGATE_SEARXNG_URL`, `ANYGATE_SEARCH_API_KEY`,
  `ANYGATE_WEB_SEARCH_MAX_RESULTS` (default 5). The Anthropic passthrough path is
  untouched — real Anthropic endpoints still run search natively.
- New module `src/gateway/web-search/` (`types`, `constants`, `index`, `tool`,
  `duckduckgo`, `searxng`, `brave`, `tavily`) + tests `tests/web-search/*` and
  `tests/sdk-adapter-websearch.test.ts`.
- Known limitations (documented, not blocking): the DuckDuckGo scrape is unofficial
  and may break if DDG changes its markup (SearXNG is the reliable-free path);
  Claude Desktop's native citation "chips" may not render (the answer text
  incorporates results + source URLs); the `cloud-code` (Antigravity) path is out of
  scope for now.

### Web UI — Model Tester
- New Model Tester page (`/tester`): pick a provider then a model, fire a live
  request at its real upstream endpoint, and see whether it responds plus connect
  time (socket + TLS + handshake), time-to-first-token (TTFT), total round-trip,
  derived tokens/sec, and stream stability.
- Runs server-side in `src/ui/api.ts` (`POST /api/models/test`) because the browser
  can't reach provider APIs directly (CORS + secret keys). The handler resolves
  credentials the same way the launch/refresh flows do, builds the anthropic
  (`/v1/messages`) or openai (`/chat/completions`) streaming request, and measures
  each latency phase with a 30s abort timeout. Returns a sample of the model's
  response + a remediation hint on failure.
- UI shows stat cards for Connect / TTFT / Total / Tokens-per-sec plus an animated
  SVG radial TTFT gauge, with distinct pass (green) / fail (red, with cause + fix) /
  empty / live states, reusing the existing `tokens.css` design tokens.

## 0.5.7 (2026-07-20)

This release makes the **favorites catalog** work end-to-end — in the CLI, in the
Claude Desktop app, **and now from the web UI** — and polishes the Apps & Launch
experience. Picking "⭐ Favorites Catalog" (or the UI's "All favorites" launch mode)
opens your agent with *every* saved favorite model routed through one anygate
gateway, so you can switch live from the in-app model menu.

### Web UI — launch the full favorites catalog
- The Apps & Launch launch modal now offers a clear **3-mode selector**:
  - **All favorites** — opens the app with every saved favorite routed through
    one anygate gateway (the full catalog, not just the first).
  - **One model** — launch with a single pre-selected provider/model.
  - **Just open** — launch the app with no model pre-set.
- The backend (`POST /api/apps/launch`) gains a `favoritesCatalog` flag that emits
  a bare `anygate <app> --favorites` (full catalog) instead of resolving to the
  first favorite. The legacy single-favorite path is kept.
- `AppCard` shows a "favorites ready" badge and a contextual launch CTA.
- The Dashboard "Apps & Launch" card is relabeled with a clarifying note.

### Claude Desktop favorites catalog (CLI)
- Favorites resolve from the same catalog/agent as the picker, so every saved
  favorite appears in the Claude Desktop model picker — including cloud-code
  (Antigravity) favorites, served through their dedicated backend and merged.
- `--favorites` now launches the catalog **directly** — no interactive provider
  picker. When favorites exist, `anygate claude-app --favorites` goes straight
  into the multi-route catalog launch.
- The provider prompt is now labeled for the correct agent (e.g. "Which provider
  for **Claude**?") instead of always saying "Codex".
- The provider picker now **defaults to "⭐ Favorites Catalog"** when favorites
  exist, instead of remembering the last single-provider selection.
- Duplicate registry models (e.g. `mistral-medium-2604`) are de-duplicated so the
  Claude Desktop picker shows the correct number of rows.
- Added `tests/claude-app.test.ts` asserting the full favorites catalog is served
  via the masked `/anthropic/v1/models` discovery payload.

## 0.5.6 (2026-07-19)

### Long-session context handling (Claude Desktop / Codex / Claude Code)
- **Models keep working when the context window fills.** New `fitContextWindow`
  trims the oldest conversation turns (preserving the system prompt, the most
  recent messages, and paired `tool_use`/`tool_result` blocks) so small-window
  upstreams like Nemotron 3 Ultra (131K) keep generating in long sessions instead
  of erroring out or freezing at zero tokens — the same resilience Antigravity
  gets from Gemini's large window, now available to the other agents.
- **Better streaming errors.** When an upstream fails mid-stream, the proxy now
  emits a proper Anthropic `error` SSE event instead of an empty stream, so the
  client shows the failure instead of appearing frozen.
- `translateRequest` now accepts `contextWindow` and clamps `max_output_tokens`
  to stay within the fitted window.

### Input-type / multimodal capability resolution
- New `resolveInputTypes` derives a concrete `['text']` / `['text','image']`
  capability per model from models.dev, with conservative family overrides for
  known-multimodal models that models.dev under-reports (e.g. NVIDIA Nemotron 3
  Ultra).
- Input types are advertised through the Anthropic model catalog
  (`input_types`), the gateway proxy `/v1/models` payload, `localModelToRoute`,
  and the Antigravity catalog (`supportsImages`), and exposed via the `anygate ui`
  models API.
- `aliasModelId` now sanitizes slashes, spaces, and parentheses in model ids so
  gateway-discovery aliases stay valid.

### UI
- Model list gains a click-to-open **detail drawer** (ModelDetailDrawer) showing
  capabilities, badges, and metadata; rows and filters updated to surface
  input-type badges.

### Internal
- Added `tests/context-fit.test.ts` and `tests/input-types.test.ts`.
- `AnthropicMsg` / `AnthropicBlock` exported from `sdk-adapter` for reuse.
- Proxy route lookup now logs not-found aliases / model ids via `quietErrorLog`.

## 0.5.5 (2026-07-19)

### Dashboard analytics fixes
- **Activity heatmap now reflects real usage only.** The per-day color intensity
  is bucketed by **daily token volume** (not raw request count), and every day
  with usage is guaranteed a visible color (level 1–4 scaled by volume relative
  to your busiest day). Unused days render as solid black squares — no more
  uniformly "highlighted" cubes.
- **Heatmap tooltips** now show token volume per day (e.g. `2026-07-18 · 211.8M tokens`).
- **Antigravity usage is counted and attributed.** The Cloud Code gateway logs
  token usage per request (app label `Antigravity`), so activity from the
  Antigravity app now appears in the dashboard instead of being invisible.
- **Model breakdown shows source-app badges.** Each model row displays the apps
  that contributed usage (`gateway`, `Antigravity`, …), and gateway + Antigravity
  entries for the same physical model are merged into one row.
- **Token volume chart** auto-scrolls to the most recent day on load so real
  usage is visible up front (no hidden scroll), with active days highlighted.
- Real-data-only dashboard: the mock fallback was removed; the store shows an
  "Offline" badge if the analytics API is unreachable rather than fake numbers.
- `B` (billion) token formatting appears automatically once combined totals
  cross 1e9 tokens.

### Internal
- `HeatDay.count` now carries the day's token total (drives color + tooltip).
- Gateway model-id normalization so Antigravity and gateway entries for the same
  model converge in the breakdown.
- Added test isolation for the Antigravity gateway tests (throwaway temp dir)
  so they no longer pollute the real `~/.anygate/analytics.jsonl`.
