# Changelog

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
