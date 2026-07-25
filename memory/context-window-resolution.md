---
name: context-window-resolution
description: Context window resolution system with cache, heuristics, provider defaults, and models.dev integration
metadata:
  type: project
---

# Context Window Resolution System

## Overview

Context window resolution in Anygate uses a 5-level priority chain to determine the correct context window for any model:

1. **OpenCode cache** (`~/.cache/opencode/models.json`) — authoritative `limit.context` values for Zen/Go provider keys
2. **models.dev cache** (bundled `src/registry/data/models-dev-cache.json` or user cache) — per-model `limit.context` from models.dev API
3. **HEURISTIC_RULES** — regex patterns in `src/apps/shared/context-window.ts` (e.g., `/gpt-oss/i → 131072`)
4. **PROVIDER_DEFAULTS** — provider-level fallback map (e.g., `poolside → 262112`)
5. **DEFAULT_CONTEXT_WINDOW** (200,000) — Claude Code's own fallback

## Key Files

- `src/apps/shared/context-window.ts` — core resolution logic, HEURISTIC_RULES, PROVIDER_DEFAULTS
- `src/gateway/context/context-fit.ts` — 85% safety margin trimming (SAFETY_MARGIN = 0.85)
- `src/gateway/adapters/sdk-adapter.ts` — debug logging via `[ctx]` prefix when ANYGATE_TRACE=1
- `src/registry/models-dev.ts` — ModelsDevModel interface (now includes `limit` field)
- `scripts/audit-context-windows.ts` — audit script comparing heuristics vs models.dev
- `scripts/generate-context-rules.ts` — auto-generate heuristic rules from models.dev data

## Provider Defaults

Key provider defaults in PROVIDER_DEFAULTS:
- `poolside`: 262,112
- `google`: 1,000,000
- `openai`: 128,000
- `anthropic`: 200,000
- `nvidia`: 131,072
- `groq`: 131,072

## Debug Logging

When `ANYGATE_TRACE=1`, the SDK adapter logs:
- `[ctx] {modelId}: {inputTokens}/{resolvedContextWindow} ({util}%)` — before fitting
- `[ctx] TRIMMED: {before} -> {after} ({beforeMsgs} -> {afterMsgs} msgs)` — when trimming occurs

## Scripts

```bash
npm run audit:context-windows     # audit heuristics vs models.dev
npm run generate:context-rules    # generate heuristic rules from models.dev
npm run refresh:models-dev        # refresh bundled models.dev cache
```

## Why

Models without explicit heuristic rules previously fell back to DEFAULT_CONTEXT_WINDOW (200K), but many providers have different limits (Poolside: 262K, Google: 1M, some: 128K). This caused HTTP 400 errors when actual input exceeded the provider's real limit but not our heuristic.

## How to Apply

- To resolve a context window: `resolveContextWindow(modelId, explicit, providerId)`
- To resolve from model only: `resolveContextWindowFromModel(modelId, providerId)`
- Provider ID is available via `options?.reasoningMetadata?.providerId` in the SDK adapter
- The 85% safety margin in context-fit.ts provides headroom for token estimation error
