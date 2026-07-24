# UI System

> Web dashboard backend (REST API), Svelte 5 frontend application, and in-process gateway server control.

## Location

```text
src/ui/
├── api.ts                # REST API route handler (1200+ lines, all /api/* endpoints)
├── api-types.ts          # API request/response type definitions
├── command.ts            # `anygate ui` CLI subcommand handler
├── server-control.ts     # In-process gateway server start/stop management
├── app/                  # Svelte 5 frontend application
│   ├── src/
│   │   ├── App.svelte    # Root component with routing
│   │   ├── main.ts       # Entry point
│   │   ├── app.css       # Global styles
│   │   ├── routes/       # Page components
│   │   │   ├── Dashboard.svelte
│   │   │   ├── Apps.svelte
│   │   │   ├── Models.svelte
│   │   │   ├── Providers.svelte (implied)
│   │   │   ├── Server.svelte (implied)
│   │   │   └── Settings.svelte
│   │   ├── components/   # Reusable UI components
│   │   │   ├── CommandPalette.svelte
│   │   │   └── models/ModelRow.svelte
│   │   ├── stores/       # Svelte stores (state management)
│   │   │   └── favorites.svelte.ts
│   │   └── lib/          # Shared utilities
│   ├── dist/             # Built SPA output
│   ├── vite.config.ts    # Vite build configuration
│   └── package.json      # UI package (anygate-ui)
├── dist/                 # Copied SPA for dist bundle
└── public/               # Static assets
```

## REST API Endpoints

The API is defined in `api.ts` and serves as the backend for the Svelte 5 SPA:

### Apps

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/apps` | List supported apps with install status |
| POST | `/api/apps/launch` | Launch an app with provider/model selection |
| POST | `/api/apps/set-path` | Override app binary path |

### Providers

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/providers` | List configured providers with models |
| GET | `/api/providers/templates` | List all supported provider templates |
| POST | `/api/providers/add` | Add provider from template |
| POST | `/api/providers/add-custom` | Add custom endpoint provider |
| POST | `/api/providers/remove` | Remove a configured provider |
| POST | `/api/providers/refresh-models` | Refresh model list for a provider |
| POST | `/api/providers/refresh-all-models` | Refresh all provider model lists |

### Models

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/models` | List all models across providers |
| GET | `/api/favorites` | List favorite models |
| POST | `/api/favorites` | Save favorite models list |

### Server (Gateway)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/server/status` | Gateway server status |
| POST | `/api/server/start` | Start in-process gateway server |
| POST | `/api/server/stop` | Stop in-process gateway server |

### OAuth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/oauth/xai/start` | Start xAI device code flow |
| GET | `/api/oauth/xai/poll/:session` | Poll xAI auth status |
| POST | `/api/oauth/openai/start` | Start OpenAI device code flow |
| GET | `/api/oauth/openai/poll/:session` | Poll OpenAI auth status |
| POST | `/api/oauth/github/start` | Start GitHub device code flow |
| GET | `/api/oauth/github/poll/:session` | Poll GitHub auth status |
| POST | `/api/oauth/claude-code/start` | Start Claude Code PKCE flow |
| POST | `/api/oauth/antigravity/start` | Start Antigravity Google OAuth |
| POST | `/api/oauth/antigravity/callback` | Handle Antigravity OAuth callback |

### System

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/config` | Read user preferences |
| POST | `/api/config` | Update user preferences |
| GET | `/api/update-status` | Check for anygate updates |
| GET | `/api/analytics` | Usage analytics data |

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
