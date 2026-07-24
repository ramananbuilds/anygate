# Component: Services (`src/services/`)

> Cross-cutting shared services: diagnostics, updates, health, analytics.

## Structure

```text
src/services/
├── doctor.ts              # System health diagnostics (3.5KB)
├── self-update.ts         # CLI self-update via npm (2.3KB)
├── update-check.ts        # npm update availability check (5.8KB)
├── provider-health.ts     # Provider API health probing
├── favorites.ts           # Favorites service logic
├── model-sync.ts          # Background model list sync
├── analytics.ts           # Analytics service layer
├── downloads.ts           # Download utilities
├── updates.ts             # Update orchestration
└── index.ts
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `checkForUpdates()` | `update-check.ts` | Check npm for newer version |
| `selfUpdate()` | `self-update.ts` | Run `npm update -g anygate` |
| `runDoctor()` | `doctor.ts` | System health diagnostics |

## Dependencies

- **Imports from**: `config/`, `storage/`, `registry/`, `types/`
- **Imported by**: `cli/`, `ui/`

---

# Component: UI (`src/ui/`)

> Web dashboard REST API backend and Svelte 5 frontend application.

## Structure

```text
src/ui/
├── api.ts                 # REST API route handler (1246 lines)
├── api-types.ts           # API request/response type definitions
├── command.ts             # `anygate ui` subcommand handler (7KB)
├── server-control.ts      # In-process gateway start/stop (11KB)
├── app/                   # Svelte 5 SPA source
│   ├── src/
│   │   ├── App.svelte     # Root component with routing
│   │   ├── main.ts        # Entry point
│   │   ├── routes/        # Page components (Dashboard, Apps, Models, Settings, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── stores/        # Svelte stores
│   │   └── lib/           # Shared utilities
│   ├── dist/              # Built SPA output
│   └── package.json
├── dist/                  # Copied SPA for CLI dist bundle
└── public/                # Static assets
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `handleApiRequest()` | `api.ts` | Route all /api/* requests |
| `startGatewayServer()` | `server-control.ts` | Start in-process gateway |
| `stopGatewayServer()` | `server-control.ts` | Stop in-process gateway |
| `getServerStatus()` | `server-control.ts` | Query gateway status |

## Dependencies

- **Imports from**: `apps/`, `registry/`, `gateway/`, `auth/`, `storage/`, `config/`, `shared/`
- **Imported by**: `cli/ui.ts`

## Architecture Reference

See [Architecture: UI System](../architecture/ui-system.md)
