# anygate 0.5.7

This release fixes the **Claude Desktop favorites catalog** so picking
"⭐ Favorites Catalog" launches Claude Desktop with *every* saved favorite
model, not just the first one.

## Why this release

`anygate claude-app` (Claude Desktop 3P gateway mode) resolves its model
catalog from a local gateway that Claude Desktop discovers via
`GET /anthropic/v1/models`. The favorites path was pulling regular (non
cloud-code) favorites from the **server** catalog agent, which hides
cloud-code models and can normalize provider ids differently from the
picker the user actually selected favorites from. Favorites that didn't
survive that mismatch were silently dropped — so the Claude Desktop model
picker showed only one (or a few) models instead of the full favorites list.

## What changed

### Claude Desktop favorites catalog
- **Favorites resolve from the same catalog/agent as the picker.** Regular
  favorites are now loaded from the `claude-app` provider catalog (the exact
  set the user picked favorites from) instead of the `server` agent, so every
  saved favorite appears in the Claude Desktop model picker — including
  cloud-code (Antigravity) favorites, which are still served through their
  dedicated backend and merged into the same catalog.
- The catalog keeps all favorite models (up to the 20-model cap), each with a
  gateway-discovery-safe `anthropic-*` / `claude-*` alias, so Claude Desktop
  surfaces the full list.

### Tests
- Added `tests/claude-app.test.ts` coverage asserting the favorites path
  exposes **all** favorite models in the gateway catalog and the masked
  discovery payload, not just the first.

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
