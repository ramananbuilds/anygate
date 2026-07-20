# anygate 0.5.8

This release fixes the **favorites-catalog launch from the web UI** so it starts
your agent **immediately** — no more interactive provider/model prompts when you
launch with favorites. The fix applies uniformly across every app launcher.

## Why this release

When you launched an app from the web UI in "All favorites" mode, `anygate`
emitted `--favorites` but the app commands still dropped into their interactive
picker (the "Which provider?" / "Launch from favorites" prompts). That defeated
the one-click launch. Now `--favorites` is treated as a **non-interactive direct
launch** for every app launcher.

## What changed

### Non-interactive favorites launch (all app launchers)
- **Antigravity app / Antigravity IDE / `agy` CLI** — `anygate antigravity
  --favorites` (and the IDE / CLI variants) now skip the provider picker and the
  "Launch from Antigravity CLI favorites" prompt, resolving the first available
  favorite as the boot model and serving the full multi-route catalog so the
  in-app model switcher shows every favorite. Matches the existing
  `anygate claude-app --favorites` behavior.
- **ChatGPT Desktop (Codex)** — `anygate codex-app --favorites` now skips both the
  "Starting model?" picker and the "Confirm launch?" prompt when favorites exist,
  auto-selecting the first available favorite and going straight into the
  favorites catalog.
- **Claude Desktop** — already launched directly on `--favorites`; no change
  needed, behavior is now consistent across all three app launchers.
- The web UI "All favorites" launch mode (which emits bare `--favorites`) now
  produces a true one-click launch for every supported app.

### Gateway-side web search (free, works on non-Anthropic upstreams)
- **Keyword search now works on every favorite at zero cost.** Claude Desktop sends
  Anthropic's hosted `web_search_tool_20250305` (`server_tool`); on non-Anthropic
  favorites (Kilo / Mistral / Nemotron) the SDK adapter path used to **drop** any tool
  lacking `input_schema`, so the hosted search silently vanished and the model looped on
  empty results. anygate now **intercepts** that tool, executes the search itself, and
  feeds real results back to the model.
- **Free by default.** The default backend is keyless **DuckDuckGo** (HTML scrape,
  no dependency). Optional free upgrade: **self-hosted SearXNG** (`ANYGATE_SEARXNG_URL`).
  Paid backends **Brave** / **Tavily** are supported as drop-in upgrades via
  `ANYGATE_SEARCH_API_KEY`.
- **Implemented as a local Vercel AI SDK tool.** `makeWebSearchTool(name)` preserves the
  exact incoming tool name so the model's `tool_call` still matches, and its `execute`
  runs `searchWeb()`. The SDK's built-in tool loop (`stopWhen: stepCountIs(n)`) performs
  the search, returns results to the model, and the model produces a final grounded answer.
- **The intermediate `tool_use`/`tool_result` round-trip is hidden from the client.** The
  stream writer skips blocks whose `toolName` equals the web-search tool, so Claude Desktop
  (which can't run a hosted tool itself) just receives the final answer with the search
  incorporated — no dangling `tool_use`, no confusion. Non-web-search MCP tools behave
  exactly as before.
- **Master kill switch + config.** `ANYGATE_WEB_SEARCH` (`on`/`off`),
  `ANYGATE_WEB_SEARCH_PROVIDER`, `ANYGATE_SEARXNG_URL`, `ANYGATE_SEARCH_API_KEY`,
  `ANYGATE_WEB_SEARCH_MAX_RESULTS` (default 5). The Anthropic passthrough path is
  untouched — real Anthropic endpoints still run search natively.
- **New module** `src/gateway/web-search/` (`types`, `constants`, `index`, `tool`,
  `duckduckgo`, `searxng`, `brave`, `tavily`) + tests `tests/web-search/*` and
  `tests/sdk-adapter-websearch.test.ts`.
- **Known limitations (documented, not blocking):** the DuckDuckGo scrape is unofficial and
  may break if DDG changes its markup (SearXNG is the reliable-free path); Claude Desktop's
  native citation "chips" may not render (the answer text incorporates results + source
  URLs); the `cloud-code` (Antigravity) path is out of scope for now.

### Web UI — Model Tester (latency & benchmark lab)
- New **Model Tester** page (`/tester`): pick a **provider** then a **model**, fire a live
  request at its real upstream endpoint, and see whether it responds plus
  **connect time** (socket + TLS + handshake), **time-to-first-token (TTFT)**, **total
  round-trip**, derived **tokens/sec**, and **stream stability** (steady vs. intermittent).
- Runs **server-side** in `src/ui/api.ts` (`POST /api/models/test`) because the browser
  can't reach provider APIs directly (CORS + secret keys). The handler resolves credentials
  the same way the launch/refresh flows do, builds the anthropic (`/v1/messages`) or
  openai (`/chat/completions`) streaming request, and measures each latency phase with a
  30s abort timeout. Returns a sample of the model's response + a remediation hint on
  failure (e.g. "add an API key", "wrong endpoint").
- UI shows stat cards for Connect / TTFT / Total / Tokens-per-sec plus an animated SVG
  radial **TTFT gauge**, distinct pass (green) / fail (red, with cause + fix) / empty /
  live states, reusing the existing `tokens.css` design tokens (no new chart dependency).

---



---

# anygate 0.5.7

This release makes the **favorites catalog** work end-to-end — in the CLI,
in the Claude Desktop app, **and now from the web UI** — and polishes the
Apps & Launch experience. Picking "⭐ Favorites Catalog" (or the UI's
"All favorites" launch mode) now opens your agent with *every* saved favorite
model routed through one anygate gateway, so you can switch live from the
in-app model menu.

## Why this release

`anygate claude-app` (Claude Desktop 3P gateway mode) resolves its model
catalog from a local gateway that Claude Desktop discovers via
`GET /anthropic/v1/models`. Two gaps remained: (1) the web UI's launch modal
sent a flag that collapsed to only the **first** favorite, and (2) the
`--favorites` shortcut still dropped into the interactive provider picker
instead of launching directly. Both are fixed here, alongside a clearer
Apps & Launch page.

## What changed

### Web UI — launch the full favorites catalog
- The Apps & Launch launch modal now offers a clear **3-mode selector**:
  - **All favorites** — opens the app with every saved favorite routed
    through one anygate gateway (the full catalog, not just the first).
  - **One model** — launch with a single pre-selected provider/model.
  - **Just open** — launch the app with no model pre-set.
- The backend (`POST /api/apps/launch`) gains a `favoritesCatalog` flag that
  emits a bare `anygate <app> --favorites` (full catalog) instead of
  resolving to the first favorite. The legacy single-favorite path is kept.
- `AppCard` shows a "favorites ready" badge and a contextual launch CTA.
- The Dashboard "Apps & Launch" card is relabeled with a clarifying note.

### Claude Desktop favorites catalog (CLI)
- **Favorites resolve from the same catalog/agent as the picker.** Regular
  favorites are now loaded from the `claude-app` provider catalog (the exact
  set the user picked favorites from) instead of the `server` agent, so every
  saved favorite appears in the Claude Desktop model picker — including
  cloud-code (Antigravity) favorites, which are still served through their
  dedicated backend and merged into the same catalog.
- `--favorites` now launches the catalog **directly** — no interactive
  provider picker. When favorites exist, `anygate claude-app --favorites`
  goes straight into the multi-route catalog launch.
- The provider prompt is now labeled for the correct agent (e.g. "Which
  provider for **Claude**?" for claude-app) instead of always saying "Codex".
- The catalog keeps all favorite models (up to the 20-model cap), each with a
  gateway-discovery-safe `anthropic-*` / `claude-*` alias.

### Provider picker now defaults to Favorites Catalog
- When you have saved favorites, `anygate claude-app` now **defaults the
  provider picker to "⭐ Favorites Catalog"** instead of remembering the last
  single-provider selection (via `lastCodexProvider`). Previously, after any
  single-model launch the next run defaulted back to that one provider, so
  pressing Enter launched a single model and the picker only showed one — even
  though favorites existed. Now the full favorites catalog is the default.

### Duplicate registry models are de-duplicated
- Some registries list the same model twice (e.g. `mistral-medium-2604`).
  These produced a repeated discovery id, which could make the Claude Desktop
  picker collapse to fewer rows than expected. The favorites catalog now
  de-duplicates by `(providerId, modelId)` so each favorite shows exactly one
  row.

### Tests
- Added `tests/claude-app.test.ts` coverage asserting the favorites path
  exposes **all** favorite models in the gateway catalog.
- Added `tests/native-launcher.test.ts` coverage asserting `favoritesCatalog`
  emits a bare `--favorites` with no `--provider`/`--model`.

---

# anygate 0.5.6

This release makes small-window models keep working in long sessions and adds
accurate per-model capability (input-type) reporting across the gateway and UI.

## Why this release

Claude Desktop, Codex, and Claude Code can freeze at zero tokens once a
conversation fills a small context window (e.g. Nemotron 3 Ultra at ~131K).
Antigravity avoided this only because it rides Gemini's very large window.
0.5.6 brings the same "keep going" resilience to the other agents, and it
surfaces each model's real input capabilities (text vs. image) so clients
stop silently dropping multimodal requests.

## What changed

### Long-session context handling
- **Models keep generating when the context window fills.** A new
  `fitContextWindow` step trims the oldest conversation turns before sending to
  the upstream, while preserving the system prompt, the most recent messages,
  and paired `tool_use`/`tool_result` blocks. Small-window models now stay
  useful deep into a session instead of erroring out or freezing.
- **No more silent freezes on upstream failure.** When an upstream fails
  mid-stream, the proxy now emits a proper Anthropic `error` SSE event instead
  of an empty stream, so the client shows the failure instead of hanging.
- **Safe output sizing.** `translateRequest` now accepts `contextWindow` and
  clamps `max_output_tokens` to stay within the fitted window.

### Input-type / multimodal capability resolution
- New `resolveInputTypes` derives a concrete `['text']` or
  `['text','image']` capability per model from models.dev, with conservative
  family overrides for known-multimodal models that models.dev under-reports
  (e.g. NVIDIA Nemotron 3 Ultra).
- Input types are advertised through the Anthropic model catalog
  (`input_types`), the gateway proxy `/v1/models` payload, `localModelToRoute`,
  and the Antigravity catalog (`supportsImages`), and exposed via the
  `anygate ui` models API.
- `aliasModelId` now sanitizes slashes, spaces, and parentheses in model ids so
  gateway-discovery aliases stay valid.

### UI
- The model list gains a click-to-open **detail drawer** showing capabilities,
  badges, and metadata; rows and filters now surface input-type badges.

## Internal
- Added `tests/context-fit.test.ts` and `tests/input-types.test.ts`.
- `AnthropicMsg` / `AnthropicBlock` exported from `sdk-adapter` for reuse.
- Proxy route lookup logs not-found aliases / model ids via `quietErrorLog`.

---

# anygate 0.5.4

The headline of this release is a **complete rewrite of the `anygate ui` companion app** as a modern Svelte 5 + Vite single-page app, plus a **new local-only analytics Dashboard**. The old ~2,000-line hand-rolled `app.js` (manual `innerHTML` templates, global `onclick` handlers, no components) is retired in favor of a typed, component-based SPA.

## Added
- **Full UI rewrite — Svelte 5 + Vite SPA** (replaces the legacy `src/ui/public/app.js`).
  - **Stack:** Svelte 5 (runes: `$state`/`$derived`/`$effect`) + Vite + Tailwind v4, compiled to static assets served by the existing Node server.
  - **39 components across 6 routes** (Dashboard, Providers, Models, Apps, Server, Settings) with a persistent sidebar + topbar app shell and client-side routing.
  - **14 primitive components** (Button, Input, Select, Modal, Drawer, Tabs, Badge, Card, Toggle, Tooltip, Spinner, Skeleton, EmptyState, IconButton) — no heavy UI dependency.
  - **Reactive stores** (providers, models, favorites, apps, server w/ 5 s poll, config, theme, health, ui/toasts, presets) built on Svelte 5 runes.
  - **Typed API layer** (`client.ts` / `endpoints.ts` / `types.ts`) mirroring the existing backend contract, with `localStorage`-backed mocks for not-yet-built endpoints so the UI is fully functional today.
  - **Security:** model IDs are no longer concatenated into `onclick` attributes — Svelte auto-escapes, closing the XSS surface the old template strings had.
  - **Design system** (`tokens.css`): keeps the oklch palette, neon-per-model colors, provider gradient logos (ported from `PROVIDER_INLINE_SVGS`/`PALETTES`), dark default + light theme. Version derives from `package.json` via a Vite `__APP_VERSION__` define (no runtime string hack).
  - **Command palette (⌘K)** for global search/navigation, **drag-reorder favorites** (general / Antigravity) with capacity meter, **per-model detail drawer** (context window, cost in/out, format, reasoning), and **dry-run preview** of the exact env a launch would set (client-computed until the backend endpoint lands).
- **New Dashboard page** — usage analytics for your local gateway, powered by a new **local-only analytics backend** (`/api/analytics` + on-disk usage log; no data leaves your machine).
  - **Overview tab:** requests, tokens, providers, models, and active apps at a glance via stat cards.
  - **Activity heatmap:** GitHub-style year grid in the UI's amber theme with hover tooltips.
  - **Models tab:** per-day **token bar chart** + **model breakdown** list (share of total usage).
  - **Time-range filter:** `7d` / `30d` / `90d` / `all`, recomputing every panel live.
  - **Quick-launch** rail of detected apps + inline **Doctor health panel**.
  - Clearly-labeled **"Sample"** badge when viewing demo data before a backend is connected.
- **App launcher install guidance** — Apps & Launch cards show what to do when a tool isn't installed: CLIs show their `npm install -g …` command (Copy button), desktop apps show a "Get … " vendor link. Installed apps show their launch command.
- **In-modal model selection in the launch flow** — the Apps & Launch modal keeps the Model selector visible alongside Provider, disabled with a "pick a provider first" hint until a provider is chosen.
- **New `A` favicon** in the UI's warm-amber theme for the browser tab and bookmarks.

## Fixed
- **Launch modal model selector was inert** — the `Select` primitive didn't propagate its value back to the parent via `bind:value`; the selector now updates and populates correctly.
- **Duplicate launch folder in the modal** — the active launch folder was rendered both as the input value and as a recent-folder chip; it's now excluded from the recent chips.
- **Dashboard activity-heatmap month labels were misaligned** — month labels used percentage widths that ignored column gaps; each label now matches its week-column geometry 1:1.
- **`anygate claude-app` false "session already running" error** — a stale session lock from a previously force-killed session blocked launches; the command now recovers a dead-PID lock before the concurrent-session guard runs.
