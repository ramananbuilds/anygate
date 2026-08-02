# Migration Guide

This guide helps you upgrade anygate across versions, highlighting breaking changes,
migration steps, and common issues.

## Version Upgrade Matrix

| From | To | Breaking Changes | Migration Effort |
|------|-----|------------------|-----------------|
| 0.5.10 | 0.6.0+ | Context fitting, model validation, bare `anygate` menu | Low |
| 0.5.8 | 0.5.10 | UI serving path fix | Low |
| 0.5.7 | 0.5.9 | 17-domain architecture restructure | Low (internal) |
| 0.5.6 | 0.5.8 | Favorites catalog launch | Low |
| 0.5.5 | 0.5.7 | Favorites catalog end-to-end | Low |

---

## Upgrading to 0.6.0+

### Context Window Fitting (Enforced)

**What changed**: Context window fitting is now enforced on **all** outbound SDK
requests. Previously, fitting only triggered when `contextWindow` was explicitly
passed — many code paths left it undefined, causing small-window models
(GPT-3.5, Nemotron 131K) to be rejected with "Input length exceeds maximum tokens".

**Migration steps**:
- No action required for most users. The fitting is automatic.
- If you have custom providers with known context windows, ensure they are
  registered in the model catalog or set via `ANYGATE_CONTEXT_WINDOW_<MODEL>`.

### Self-Healing Model Validation

**What changed**: Models are now automatically validated against provider APIs.
Deprecated models (404/410) are filtered from the catalog. Unverified models
(429/5xx) are marked but still usable.

**Migration steps**:
- Run `anygate models validate` to manually trigger validation.
- If a model you use is incorrectly marked deprecated, check the provider's API
  directly and report the issue.
- Validation cache TTL is 24 hours. To force re-validation, delete
  `~/.anygate/model-validation.json`.

### Bare `anygate` Main Menu

**What changed**: Running `anygate` with no subcommand now launches a main menu
on subsequent runs (first run shows onboarding).

**Migration steps**:
- If you have scripts that call `anygate` with no arguments, they will now
  enter the interactive menu. Use `anygate --help` for non-interactive usage.
- The main menu can be bypassed by passing a subcommand directly
  (`anygate claude`, `anygate server`, etc.).

---

## Upgrading to 0.5.10

### UI Serving Path Fix

**What changed**: Fixed `anygate ui` serving "Not found" in browser. The UI
serving path was corrected from `dist/app/dist` to `dist/ui/dist`.

**Migration steps**:
- No action required. This is a transparent fix.
- If you have a custom UI build, ensure it is placed in `dist/ui/dist/`.

### CI Workflow Fix

**What changed**: Fixed `npm ci --prefix ui` → `npm ci --prefix src/ui/app`
in the publish workflow.

**Migration steps**:
- No action required for users. This only affects CI.

---

## Upgrading to 0.5.9

### 17-Domain Architecture Restructure

**What changed**: `src/` was restructured into 17 focused, single-responsibility
subdomains. The `engine/`, `providers/`, `protocols/`, `core/`, and `launchers/`
directories were reorganized.

**Migration steps**:
- **No impact on users**. This is an internal restructuring.
- If you import from anygate's internal modules (not recommended), update your
  import paths to match the new structure.
- The public CLI commands and environment variables are unchanged.

### Provider Templates Moved to JSON

**What changed**: All provider templates moved from `src/providers/provider-templates.ts`
to individual JSON files under `src/registry/data/templates/`.

**Migration steps**:
- No action required. Templates are loaded automatically.
- To add a new provider, create a JSON file in `src/registry/data/templates/`
  instead of editing TypeScript code.

---

## Upgrading to 0.5.8

### Non-Interactive Favorites Launch

**What changed**: `anygate claude-app --favorites`, `anygate codex-app --favorites`,
and `anygate antigravity --favorites` now skip the provider picker and auto-select
the first available favorite.

**Migration steps**:
- No action required. This is a UX improvement.
- If you relied on the interactive provider picker with `--favorites`, remove
  the flag and use the standard launch flow.

---

## Upgrading to 0.5.7

### Favorites Catalog End-to-End

**What changed**: The "All favorites" launch mode now opens the app with every
saved favorite routed through one anygate gateway.

**Migration steps**:
- No action required. This is a feature addition.
- The web UI "All favorites" launch mode now produces a true one-click launch
  for every supported app.

---

## Upgrading to 0.5.6

### Long-Session Context Handling

**What changed**: Models now keep working when the context window fills. The
proxy trims the oldest conversation turns (preserving system prompt and recent
messages) so small-window upstreams keep generating in long sessions.

**Migration steps**:
- No action required. This is automatic.
- If you experience issues with context trimming, check the model's context
  window configuration in the catalog.

### Streaming Error Improvements

**What changed**: When an upstream fails mid-stream, the proxy now emits a
proper Anthropic `error` SSE event instead of an empty stream.

**Migration steps**:
- No action required. Clients will now see proper error events instead of
  appearing frozen.

---

## Common Issues & Troubleshooting

### "Model not found" after upgrade

If a model that worked before is now showing as "not found":
1. Run `anygate models validate` to refresh model validation.
2. Check if the model was deprecated by the provider.
3. Verify your API key is still valid for the provider.

### "Input length exceeds maximum tokens"

This was fixed in 0.6.0. If you still see this error:
1. Ensure you are on version 0.6.0 or later.
2. Check the model's context window configuration.
3. Consider using a model with a larger context window.

### UI shows "Offline"

The dashboard now shows an "Offline" badge if the analytics API is unreachable,
instead of showing fake numbers. This is expected behavior if:
- The analytics database is not available.
- The `anygate server` is not running.
- There is a network connectivity issue.

### Provider key not found

Credential resolution is centralized in `resolveLocalProviderApiKey()`.
If a provider key is not found:
1. Set the provider-specific environment variable (e.g., `OPENAI_API_KEY`).
2. Run `anygate providers auth <provider-id>` to store the key in the keychain.
3. Check the bundled registry credentials with `anygate providers`.

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `ANYGATE_LOG_LEVEL` | `info` | Log verbosity: `debug` \| `info` \| `warn` \| `error` |
| `ANYGATE_LOG_FORMAT` | (human) | Set to `json` for structured JSON output |
| `ANYGATE_WEB_SEARCH` | `on` | Enable/disable web search: `on` \| `off` |
| `ANYGATE_WEB_SEARCH_PROVIDER` | `duckduckgo` | Search backend: `duckduckgo` \| `searxng` \| `brave` \| `tavily` |
| `ANYGATE_SEARXNG_URL` | — | Self-hosted SearXNG instance URL |
| `ANYGATE_SEARCH_API_KEY` | — | API key for paid search backends (Brave/Tavily) |
| `ANYGATE_WEB_SEARCH_MAX_RESULTS` | `5` | Maximum search results per query |
