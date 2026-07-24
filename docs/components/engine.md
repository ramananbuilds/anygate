# Component: Engine (`src/engine/`)

> Routing decisions, model selection, and target-compatibility filtering.

## Structure

```text
src/engine/
├── routing/
│   ├── router.ts          # RouteRequest → RouteMatch resolution
│   ├── resolver.ts        # Model ref parsing and provider+model lookup
│   ├── dispatcher.ts      # Request dispatch coordination
│   ├── strategy.ts        # Routing strategy selection
│   ├── failover.ts        # Failover logic for unavailable routes
│   ├── health.ts          # Provider health checking
│   ├── middleware.ts       # Request/response middleware pipeline
│   └── pipeline.ts        # Full routing pipeline orchestration
├── selection/
│   ├── selector.ts        # Model selection heuristics
│   ├── target-compatibility.ts  # Target × model compatibility matrix
│   └── launch-target.ts   # Launch wizard, model slugs, non-interactive detection
├── context/
│   └── .gitkeep           # Reserved for context window estimation
└── index.ts
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `routeRequest()` | `routing/router.ts` | Match provider+model+target |
| `resolveProviderAndModel()` | `routing/resolver.ts` | Parse model ref, find in providers |
| `isTargetCompatibleModel()` | `selection/target-compatibility.ts` | Check model × target compat |
| `planLaunchWizard()` | `selection/launch-target.ts` | Decide wizard vs direct launch |
| `resolveLaunchTarget()` | `selection/launch-target.ts` | Resolve from flags/prefs |
| `parseModelSlug()` | `selection/launch-target.ts` | Split `provider__model` format |

## Key Types

```typescript
type GatewayLaunchTarget = 'claude' | 'claude-app' | 'codex' | 'codex-app' | 'gemini' | 'server' | 'antigravity';

interface RouteRequest { providerId: string; modelId: string; target: GatewayLaunchTarget; }
interface RouteMatch { provider: LocalProvider; model: LocalProviderModel; target: GatewayLaunchTarget; }
interface LaunchTarget { providerId?: string; modelId?: string; }
```

## Dependencies

- **Imports from**: `apps/shared/`, `types/`
- **Imported by**: `apps/`, `gateway/`, `cli/`

## Architecture Reference

See [Architecture: Routing Engine](../architecture/routing-engine.md)
