# Component: Engine (`src/engine/`) — DEPRECATED

> **Removed in v0.5.13.** The `src/engine/` directory was consolidated into
> `src/services/provider-health.ts` and `src/apps/shared/`. The routing and
> selection engine was found to be unused dead code — actual routing logic
> lives in `src/gateway/proxy/` and `src/registry/provider-catalog.ts`.

## What was removed

- `src/engine/routing/` — Router, resolver, dispatcher, strategy, failover,
  health, middleware, pipeline (all removed in Phase 1)
- `src/engine/selection/` — Selector, target-compatibility, launch-target (all
  removed in Phase 1)
- `src/engine/routing/health.ts` — Consolidated into `src/services/provider-health.ts`

## Where the logic moved

| Original Location | New Location |
|-------------------|---------------|
| `src/engine/routing/health.ts` | `src/services/provider-health.ts` |
| `src/engine/selection/target-compatibility.ts` | `src/apps/shared/target-compatibility.ts` |
| `src/engine/selection/launch-target.ts` | `src/apps/shared/launch-target.ts` |

## Architecture Reference

See [Architecture: Routing Engine](../architecture/routing-engine.md) for historical context.
See [ADR 001: Provider Routing](docs/adr/001-provider-routing.md) for current routing decisions.
