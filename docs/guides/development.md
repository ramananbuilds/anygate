# Guide: UI Development

> Developing the Anygate web dashboard — mock API mode, dev server, build, and conventions.

## Overview

The web dashboard is a Svelte 5 + Vite application in `src/ui/app/`. It communicates with the anygate backend via a typed REST API (`/api/*` endpoints proxied to `http://127.0.0.1:17645`).

## Mock API Mode

The UI includes a **mock API mode** that returns synthetic data for all endpoints, allowing full dashboard development without a running anygate backend.

### Enabling Mock Mode

Set the `VITE_USE_MOCK_API` environment variable to `1` (or `true`) before starting the dev server:

```bash
# Windows (PowerShell)
$env:VITE_USE_MOCK_API=1; npm --prefix src/ui/app run dev

# Windows (cmd)
set VITE_USE_MOCK_API=1 && npm --prefix src/ui/app run dev

# macOS / Linux
VITE_USE_MOCK_API=1 npm --prefix src/ui/app run dev
```

### What Mock Mode Covers

| Endpoint | Mock Behavior |
|----------|--------------|
| `GET /api/config` | Returns 2 favorite models (Claude + GPT) |
| `GET /api/models` | Returns 2 providers (Anthropic + OpenAI) with 4 models total |
| `GET /api/apps` | Returns 3 app entries (Claude, Codex, Gemini) |
| `GET /api/health` | Returns healthy status |
| `GET /api/server/status` | Returns stopped server state |
| `POST /api/config` | Returns `{ ok: true }` |
| `POST /api/models/test` | Returns synthetic latency + sample output |
| `POST /api/apps/launch` | Returns mock command string |
| `POST /api/providers/*` | Returns `{ ok: true }` with synthetic counts |
| `POST /api/server/start` | Returns mock server status |

### When Mock Mode is OFF (default)

When `VITE_USE_MOCK_API` is not set or is `0`/`false`, the UI makes real API calls to the anygate backend. Some endpoints (health, presets) still have client-side fallbacks that activate when the backend returns 404.

## Development Server

```bash
npm --prefix src/ui/app run dev
```

The Vite dev server proxies `/api` and `/oauth` requests to `http://127.0.0.1:17645` (the anygate gateway port). For full-stack development, start the anygate server first:

```bash
anygate server  # in another terminal
```

## Building for Production

```bash
npm run build
```

The UI is built as part of the main anygate build — `npm run build` compiles the TypeScript CLI and bundles the UI SPA.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_USE_MOCK_API` | `0` | Enable mock API mode (`1` or `true`) |
| `__APP_VERSION__` | (from package.json) | Injected at build time for the settings/about page |
