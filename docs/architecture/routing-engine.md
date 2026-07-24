# Routing Engine

> The engine decides which provider and model to use for a given launch, and whether that combination is compatible with the target app.

## Location

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
│   └── launch-target.ts   # Launch target resolution and wizard planning
└── context/
    └── .gitkeep           # Reserved for context window estimation
```

## Core Concepts

### GatewayLaunchTarget

Every launch is associated with a target app. The `GatewayLaunchTarget` type defines the valid targets:

```typescript
type GatewayLaunchTarget =
  | 'claude'        // Claude Code CLI
  | 'claude-app'    // Claude Desktop
  | 'codex'         // OpenAI Codex CLI
  | 'codex-app'     // ChatGPT Desktop
  | 'gemini'        // Gemini CLI
  | 'server'        // API gateway server
  | 'antigravity';  // Antigravity CLI/App/IDE
```

### Model Format Classification

Every model is classified into one of four formats, which determines how it's routed:

| Format | Meaning | Routing |
|--------|---------|---------|
| `anthropic` | Native Anthropic `/v1/messages` | Direct connection, no proxy |
| `openai` | OpenAI-compatible or SDK-routed | SDK adapter proxy required |
| `cloud-code` | Gemini/Cloud Code format | Antigravity gateway translation |
| `unsupported` | Cannot be proxied (e.g., GPT on Zen) | Hidden from picker |

Classification happens in `classifyModelFormat()` (`src/config/constants.ts`):
1. Check `providerNpm` — if `@ai-sdk/anthropic` → `anthropic`, if `@ai-sdk/openai` or `@ai-sdk/google` → `unsupported`
2. Fallback to ID heuristics — `claude-*` → `anthropic`, `gpt-*` → `unsupported`, `gemini-*` → `unsupported`
3. Default → `openai` (SDK-routed)

### Target Compatibility

Not every model works with every target. `isTargetCompatibleModel()` checks:

1. **Blacklist filter**: `shouldHideModel()` hides models known to be incompatible with a target (e.g., models requiring specific APIs that a target doesn't support).
2. **Format check**:
   - `cloud-code` models are incompatible with `server` target
   - `anthropic` models are always compatible
   - `openai` models need an `npm` package to be compatible (except Zen/Go models)
   - `unsupported` models are always incompatible

## Launch Target Resolution

When the user runs a command, anygate resolves the launch target through a multi-step process:

```text
parseArgs() → LaunchTarget { providerId?, modelId? }
  ↓
planLaunchWizard(explicit, childArgs, agent, prefs)
  ↓
  ├── Explicit complete (--provider + --model) → skip wizard, use target
  ├── Partial explicit → error: "Both --provider and --model required"
  ├── Non-interactive mode → resolve from saved prefs, error if missing
  └── Interactive mode → show wizard (provider picker → model picker)
```

### Model Slug Format

Models can be referenced as `providerId__modelId` (double underscore). The `parseModelSlug()` function splits this:

```typescript
parseModelSlug("groq__llama-3.3-70b")
// → { providerId: "groq", modelId: "llama-3.3-70b" }

parseModelSlug("claude-3-5-sonnet")
// → { modelId: "claude-3-5-sonnet" }  // no provider prefix
```

## Route Resolution

The `routeRequest()` function in `router.ts` matches a `RouteRequest` to a provider and model:

```typescript
interface RouteRequest {
  providerId: string;
  modelId: string;
  target: GatewayLaunchTarget;
}

function routeRequest(providers: LocalProvider[], request: RouteRequest): RouteMatch | null
```

Steps:
1. Find provider by ID in the provider list
2. Find model by ID within that provider
3. Check target compatibility via `isTargetCompatibleModel()`
4. Return `RouteMatch` or `null`

## Non-Interactive Detection

For agent/headless use, anygate detects non-interactive mode per target:

| Target | Detection |
|--------|-----------|
| Claude | `--print` / `-p` flag |
| Codex | Positional argument (subcommand or prompt) |
| Gemini | `-p` / `--prompt` / `-i` / positional arg |
| Antigravity | `-p` / `--prompt` / `--print` |

In non-interactive mode, anygate resolves from saved preferences or `--provider`/`--model` flags. If resolution fails, it errors with a clear message instead of blocking on an interactive prompt.

---

**See also:**
- [Request Lifecycle](request-lifecycle.md) — how routing fits into the full flow
- [Provider System](provider-system.md) — where providers and models come from
- [Gateway](gateway.md) — what happens after routing
