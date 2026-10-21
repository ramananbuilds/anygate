# UI System

> Web dashboard backend (REST API), Svelte 5 frontend application, and in-process gateway server control.

## Location

```text
src/ui/
├── api.ts                # REST API route handler (all /api/* endpoints incl. SSE)
├── api-types.ts          # API request/response type definitions
├── command.ts            # `anygate ui` CLI subcommand handler
├── server-control.ts     # In-process gateway server start/stop management
├── app/                  # Svelte 5 frontend application
│   ├── src/
│   │   ├── App.svelte    # Root component: routing, app-wide stores, SSE connect
│   │   ├── main.ts       # Entry point
│   │   ├── app.css       # Global styles
│   │   ├── styles/
│   │   │   └── tokens.css        # Design tokens + reduced-motion guard
│   │   ├── routes/       # Page components
│   │   │   ├── Dashboard.svelte
│   │   │   ├── Providers.svelte
│   │   │   ├── Models.svelte
│   │   │   ├── Apps.svelte
│   │   │   ├── Server.svelte
│   │   │   ├── Tester.svelte
│   │   │   └── Settings.svelte
│   │   ├── lib/
│   │   │   ├── api/              # Typed client: client, endpoints, analytics, types
│   │   │   ├── components/
│   │   │   │   ├── primitives/   # 14 shared primitives (Button, Card, Modal, …)
│   │   │   │   ├── layout/       # Sidebar (live health dot), Topbar
│   │   │   │   ├── dashboard/    # StatGrid, ActivityHeatmap, TokenBarChart,
│   │   │   │   │                 # ModelBreakdownList, HourlyActivity, AppBreakdown
│   │   │   │   ├── models/       # ModelRow, ModelFilters, ModelDetailDrawer
│   │   │   │   ├── providers/    # ProviderCard, ProviderForm, ProviderLogo
│   │   │   │   ├── favorites/    # FavoriteList, FavoriteItem, CapacityMeter
│   │   │   │   ├── server/       # ServerPanel, ServerStatusBadge
│   │   │   │   └── health/       # DoctorPanel (real /api/health data)
│   │   │   └── stores/           # Rune stores (.svelte.ts), incl. events.svelte.ts
│   │   └── app.d.ts
│   ├── dist/             # Built SPA output
│   ├── vite.config.ts    # Vite build configuration
│   └── package.json      # UI package (anygate-ui)
├── dist/                 # Copied SPA for dist bundle
└── public/               # Legacy vanilla UI + static assets
```

Live-update plumbing lives outside this tree, in `src/services/event-bus.ts`, so
producers in `storage/` and `gateway/` can publish without importing `ui/`.


## REST API Endpoints

The API is defined in `api.ts` and serves as the backend for the Svelte 5 SPA.
The table below mirrors the route table in `handleUiApiRequest`; anything not
listed here returns `404 {"error":"Not found"}`.

### Apps

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/apps` | List supported apps with install status |
| POST | `/api/apps/launch` | Launch an app with provider/model selection |
| POST | `/api/apps/path` | Override app binary path |
| POST | `/api/apps/browse-folder` | Open a native folder picker |

### Providers

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/providers/templates` | List all supported provider templates |
| POST | `/api/providers/add` | Add provider from template |
| POST | `/api/providers/add-custom` | Add custom endpoint provider |
| POST | `/api/providers/delete` | Remove a configured provider |
| POST | `/api/providers/refresh` | Refresh model list for one provider |
| POST | `/api/providers/refresh-all` | Refresh all provider model lists |
| POST | `/api/keys` | Save an API key for a provider |

### Models

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/models` | List all providers with their models |
| POST | `/api/models/test` | Live latency/TTFT benchmark for one model |

Favorites are read and written through `/api/config`, not a `/api/favorites` route.

### Server (Gateway)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/server/status` | Gateway server status |
| GET | `/api/server/providers` | Providers exposed by the gateway, each with its routable models |
| POST | `/api/server/start` | Start in-process gateway server |
| POST | `/api/server/stop` | Stop in-process gateway server |

`GET /api/server/providers` returns one entry per provider the `server` target
can route (`providerDetailsFromCatalog` in `src/gateway/server/server.ts`), each
carrying its de-duplicated model list (`id`, `name`, `isFree`, `freeStatus`).
The Server panel renders that list under the provider so the user can pick the
models the gateway exposes.

`POST /api/server/start` takes the same provider filter as before plus
`exposedModels`: a list of `providerId:modelId` keys — the same shape favorites
use. An empty list means "every model of the exposed providers"; a non-empty
list narrows the catalog to exactly those models, and the gateway refuses to
start when the selection matches nothing. The selection is persisted in
`config.json` under `server.exposedModels` and restored by the panel on load.

### OAuth

One pair of routes handles every provider; the provider is chosen by the
`providerId` field in the body. Both the `oauth/*` and `auth/*` spellings are
served as aliases — shipped clients call `oauth/*`, and dropping it strands them
(this regressed once in `b88a876`).

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/providers/oauth/start` (alias `/api/providers/auth/start`) | Start a device-code or PKCE flow |
| GET | `/api/providers/oauth/status?sessionId=` (alias `/api/providers/auth/status`) | Poll a flow's status |
| GET | `/auth/callback` | Browser redirect target for PKCE flows |

`POST /api/providers/add` resolves the template via `getTemplateById()` (not
`listSupportedTemplates()`) so OAuth templates are found correctly. When an
OAuth template is submitted, it returns `{ oauth: true, providerId }` instead
of trying to create an API-key entry — the UI should redirect to the sign-in
endpoint above.

### System

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/config` | Read user preferences (incl. favorites) |
| POST | `/api/config` | Update user preferences |
| GET | `/api/update-status` | Check for anygate updates |
| GET | `/api/analytics?range=all\|30d\|7d` | Aggregated usage analytics |
| GET | `/api/health` | Real system diagnostics (shares `services/doctor.ts`) |
| GET | `/api/ping` | Liveness identity marker used by single-instance detection |
| GET | `/api/presets` | List saved launch presets |
| POST | `/api/presets` | Replace the saved launch preset list |
| GET | `/api/events` | SSE stream of live usage/server/provider events |

### Live updates (SSE)

`GET /api/events` is a Server-Sent Events stream that replaced the dashboard's
5-second status polling. Producers publish through `services/event-bus.ts`,
which lives outside `ui/` so gateway and storage code can emit without importing
the UI layer:

- `usage` — emitted by `recordUsage` on every recorded request
- `server` — emitted when the gateway starts or stops
- `providers` — emitted on provider catalog changes

The client (`lib/stores/events.svelte.ts`) owns one `EventSource` for the whole
app and falls back to interval polling only after repeated connection failures.

## Single-Instance Detection

`anygate ui` binds an ephemeral port (`listen(0)`) and records `{ pid, port }` in
`~/.anygate/ui.lock`. On startup, `checkExistingServer()` (`src/ui/command.ts`)
decides whether that lock still describes a live server by **probing
`GET /api/ping` on the recorded port** and requiring an `{ app: 'anygate' }`
reply:

| Lock state | Probe result | Outcome |
|------------|--------------|---------|
| Absent | — | Start a new server |
| Unparseable | not attempted | Delete lock, start a new server |
| Port silent / refused | fail | Delete lock, start a new server |
| Port held by another service | fail (no marker) | Delete lock, start a new server |
| anygate answers | pass | Reuse — print the URL and reopen the browser |

A PID check cannot make this call. The lock outlives a hard kill (terminal window
closed, `taskkill`, reboot), and the OS then reuses that PID for an unrelated
program — Windows reliably does — so "the PID exists" is true while the port is
dead. The recorded port is ephemeral, so a different service may hold it by now
too. Only the server's own `/api/ping` marker distinguishes a live UI from either
impostor, which is why `/api/ping` does no disk, keychain, or network work.

The lock is removed on `process.on('exit')` as well as SIGINT/SIGTERM, so only a
hard kill can orphan it — and the probe recovers from that on the next run.

## Server Control

`server-control.ts` manages the in-process gateway server:

```typescript
startGatewayServer(request: ServerStartRequest): Promise<void>
stopGatewayServer(): Promise<void>
getServerStatus(): ServerStatus
```

This allows the web UI to start/stop the API gateway without a separate terminal process.

## Frontend Architecture

The Svelte 5 SPA uses:
- **Svelte 5 runes** for reactivity
- **File-based routing** via `routes/` directory
- **Shared stores** for cross-component state (favorites, config)
- **Vite** for dev server and production builds
- **CSS custom properties** for theming (dark mode)

### Build Pipeline

```text
src/ui/app/ ──vite build──→ src/ui/app/dist/
  ──scripts/copy-ui-assets.mjs──→ dist/ui/dist/
```

The built SPA is served as static files by the `anygate ui` HTTP server.

### Modal layout

`Modal` (`src/ui/app/src/lib/components/primitives/Modal.svelte`) is a
height-capped flex column: `max-height: calc(100dvh - 48px)`, a scrolling
`.modal-body` (`overflow-y: auto`, `min-height: 0`) and an optional **footer
snippet** rendered outside the scroll area. Dialogs pass their action row
(`Cancel` / `Save` / `Launch`) as `{#snippet footer()}` so primary actions stay
pinned and reachable when the body overflows. A footer whose snippet renders
nothing collapses (`.modal-foot:empty`).

### Server panel

`ServerPanel` (`src/ui/app/src/lib/components/server/ServerPanel.svelte`) owns
the gateway's exposure settings. The **Start/Stop** button lives in the panel
header (not in a trailing action row), so it is reachable without scrolling.

The panel is laid out top to bottom:

1. **Providers to serve** — the original provider chip grid (`.prov-grid`),
   unchanged. Each chip shows the provider name and its model count; ticking a
   chip exposes that provider and opens its model block, unticking closes it.
2. **View filter** — a segment bar (**All / Free / Paid / Favorites**, live
   counts) plus a search box. These are a *view* filter: they only narrow what
   the lists show, never what the server serves. Picking a filter opens every
   provider that still holds a match, so the matches are not buried in a
   collapsed block, and a collapsed header shows how many models it matches
   (`· 7 shown`).
3. **Model blocks** — one collapsible block per selected provider, *in provider
   order*, directly below the grid. Each block lists that provider's models
   with a checkbox, a **Select visible** / **None** pair, a `★` badge on the
   favorites and a **Free** badge on the free ones. The ticked models are the
   selection sent on start.

The **Favorites** view filter and the ***Favorites only* serve filter** are
different things and the panel keeps them apart:

- The view filter shows the favorites; it changes nothing about the exposure.
- The *Favorites only* serve filter **intersects** the ticked models with the
  favorites — the gateway serves a model only when it is both ticked and a
  favorite. A favorite that is not ticked is therefore dropped, which reads as
  "favorites don't work" unless the panel says so. It does: a note reports how
  many favorites will be served and how many the model selection excludes, a
  **Tick the favorites** action puts them back into the selection, and the rows
  the serve filters exclude are dimmed (`.mrow.muted`) so the picker never
  disagrees with the "N models exposed" count. The gateway's own error
  messages name the filter stage that dropped the last model, for the same
  reason (`src/ui/server-control.ts`).

The selection rules live in `src/ui/app/src/lib/server/selection.ts` (pure
functions, unit tested from `tests/ui/server-model-selection.test.ts`):

- `pickedModelIds` — a provider with no entry means "all of its models"; an
  empty entry means "none of them".
- `buildExposedModelKeys` — returns the `providerId:modelId` keys, or `null`
  when every exposed provider is fully ticked (`null` = serve everything, so
  the saved config stays small).
- `countServedModels` — the exact number of models the gateway will serve
  after the free/favorites filters, shown next to the provider list.
- `isFreeServerModel` / `isFavoriteModel` — the free and favorite predicates.
  A favorite is keyed by `providerId` + `modelId`, the same pair the selection
  uses, so a favorite can be ticked in the picker directly.

---

**See also:**
- [Gateway](gateway.md) — server architecture
- [Provider System](provider-system.md) — provider management
- [Authentication](authentication.md) — OAuth flows in browser
