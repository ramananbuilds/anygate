# Component: UI (`src/ui/`)

> Web dashboard REST API backend and Svelte 5 frontend application.

## Structure

```text
src/ui/
├── api.ts                 # REST API route handler (1246 lines, all /api/* endpoints)
├── api-types.ts           # API request/response type definitions
├── command.ts             # `anygate ui` subcommand handler (7KB)
├── server-control.ts      # In-process gateway start/stop (11KB)
├── app/                   # Svelte 5 SPA source
│   ├── src/
│   │   ├── App.svelte     # Root component with client-side routing
│   │   ├── main.ts        # Entry point
│   │   ├── app.css        # Global styles & design tokens
│   │   ├── routes/        # Page components
│   │   │   ├── Dashboard.svelte  # Overview & quick-launch
│   │   │   ├── Apps.svelte       # App launcher with provider/model pickers
│   │   │   ├── Models.svelte     # Model browser & favorites management
│   │   │   ├── Settings.svelte   # User preferences
│   │   │   └── ...               # Providers, Server pages
│   │   ├── components/    # Reusable UI components
│   │   │   ├── CommandPalette.svelte
│   │   │   └── models/ModelRow.svelte
│   │   ├── stores/        # Svelte 5 reactive stores
│   │   │   └── favorites.svelte.ts
│   │   └── lib/           # Shared utilities
│   ├── dist/              # Built SPA output
│   ├── vite.config.ts     # Vite build configuration
│   └── package.json       # anygate-ui package
├── dist/                  # Copied SPA for CLI dist bundle
└── public/                # Static assets
```

## REST API Endpoints Summary

| Category | Endpoints | Purpose |
|----------|-----------|---------|
| Apps | `GET /api/apps`, `POST /api/apps/launch` | List & launch coding tools |
| Providers | `GET/POST /api/providers/*` | CRUD for provider registry |
| Models | `GET /api/models`, `GET/POST /api/favorites` | Browse & manage models |
| Server | `GET/POST /api/server/*` | In-process gateway control |
| OAuth | `POST/GET /api/oauth/*` | Device code auth flows |
| System | `GET /api/config`, `GET /api/analytics` | Preferences & usage |

## Dependencies

- **Imports from**: `apps/`, `registry/`, `gateway/`, `auth/`, `storage/`, `config/`, `shared/`
- **Imported by**: `cli/ui.ts`

## Architecture Reference

See [Architecture: UI System](../architecture/ui-system.md)
