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
| GET | `/api/server/providers` | Providers exposed by the gateway |
| POST | `/api/server/start` | Start in-process gateway server |
| POST | `/api/server/stop` | Stop in-process gateway server |

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

### System

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/config` | Read user preferences (incl. favorites) |
| POST | `/api/config` | Update user preferences |
| GET | `/api/update-status` | Check for anygate updates |
| GET | `/api/analytics?range=all\|30d\|7d` | Aggregated usage analytics |
| GET | `/api/health` | Real system diagnostics (shares `services/doctor.ts`) |
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

---

**See also:**
- [Gateway](gateway.md) — server architecture
- [Provider System](provider-system.md) — provider management
- [Authentication](authentication.md) — OAuth flows in browser
