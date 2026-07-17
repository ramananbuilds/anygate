# anygate 0.5.4

The headline of this release is a **complete rewrite of the `anygate ui` companion app** as a modern Svelte 5 + Vite single-page app, plus a **new local-only analytics Dashboard**. The old ~2,000-line hand-rolled `app.js` (manual `innerHTML` templates, global `onclick` handlers, no components) is retired in favor of a typed, component-based SPA.

## Added
- **Full UI rewrite → Svelte 5 + Vite SPA** (replaces the legacy `src/ui/public/app.js`).
  - **Stack:** Svelte 5 (runes: `$state`/`$derived`/`$effect`) + Vite + Tailwind v4, compiled to static assets served by the existing Node server.
  - **39 components across 6 routes** (Dashboard, Providers, Models, Apps, Server, Settings) with a persistent sidebar + topbar app shell and client-side routing.
  - **14 primitive components** (Button, Input, Select, Modal, Drawer, Tabs, Badge, Card, Toggle, Tooltip, Spinner, Skeleton, EmptyState, IconButton) — no heavy UI dependency.
  - **Reactive stores** (providers, models, favorites, apps, server w/ 5 s poll, config, theme, health, ui/toasts, presets) built on Svelte 5 runes.
  - **Typed API layer** (`client.ts` / `endpoints.ts` / `types.ts`) mirroring the existing backend contract, with `localStorage`-backed mocks for not-yet-built endpoints so the UI is fully functional today.
  - **Security:** model IDs are no longer concatenated into `onclick` attributes — Svelte auto-escapes, closing the XSS surface the old template strings had.
  - **Design system** (`tokens.css`): keeps the oklch palette, neon-per-model colors, provider gradient logos (ported from `PROVIDER_INLINE_SVGS`/`PALETTES`), dark default + light theme. Version derives from `package.json` via a Vite `__APP_VERSION__` define (no runtime string hack).
  - **Command palette (⌘K)** for global search/navigation, **drag-reorder favorites** (≤20 general / ≤6 Antigravity) with capacity meter, **per-model detail drawer** (context window, cost in/out, format, reasoning), and **dry-run preview** of the exact env a launch would set (client-computed until the backend endpoint lands).
- **New Dashboard page** — usage analytics for your local gateway, powered by a new **local-only analytics backend** (`/api/analytics` + on-disk usage log; no data leaves your machine).
  - **Overview tab:** requests, tokens, providers, models, and active apps at a glance via stat cards.
  - **Activity heatmap:** GitHub-style year grid in the UI's amber theme with hover tooltips.
  - **Models tab:** per-day **token bar chart** + **model breakdown** list (share of total usage).
  - **Time-range filter:** `7d` / `30d` / `90d` / `all`, recomputing every panel live.
  - **Quick-launch** rail of detected apps + inline **Doctor health panel**.
  - Clearly-labeled **"Sample"** badge when viewing demo data before a backend is connected.
- **App launcher install guidance** — Apps & Launch cards show what to do when a tool isn't installed: CLIs show their `npm install -g …` command (Copy button), desktop apps show a "Get … →" vendor link. Installed apps show their launch command.
- **In-modal model selection in the launch flow** — the Apps & Launch modal keeps the Model selector visible alongside Provider, disabled with a "— pick a provider first —" hint until a provider is chosen.
- **New `A` favicon** in the UI's warm-amber theme for the browser tab and bookmarks.

## Fixed
- **Launch modal model selector was inert** — the `Select` primitive didn't propagate its value back to the parent via `bind:value`; the selector now updates and populates correctly.
- **Duplicate launch folder in the modal** — the active launch folder was rendered both as the input value and as a recent-folder chip; it's now excluded from the recent chips.
- **Dashboard activity-heatmap month labels were misaligned** — month labels used percentage widths that ignored column gaps; each label now matches its week-column geometry 1:1.
- **`anygate claude-app` false "session already running" error** — a stale session lock from a previously force-killed session blocked launches; the command now recovers a dead-PID lock before the concurrent-session guard runs.
