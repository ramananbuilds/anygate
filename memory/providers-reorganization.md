---
name: providers-reorganization
description: Reorganized providers/ into registry/, pricing/, models/, capabilities/ subdirectories
metadata:
  type: project
---

# Providers Directory Reorganization

## What was done

Split `src/providers/command.ts` (906 lines) into a scalable directory structure:

```
src/providers/
  command.ts          (504 lines) — arg parsing, help, add flow, hub, dispatch
  provider-catalog.ts (328 lines) — provider catalog fetching
  provider-templates.ts (218 lines) — template definitions
  opencode-serve.ts   (123 lines) — OpenCode serve integration
  models/
    index.ts          (144 lines) — refresh model lists, pick from catalog
  registry/
    index.ts          (182 lines) — import, auth, remove, list
  capabilities/
    index.ts          (122 lines) — provider detail, cloud catalog, hub choice values
  pricing/
    index.ts          (23 lines)  — cost formatting helpers
```

## Why

The single `command.ts` file was 906 lines with 17 functions spanning 5 concerns. The subdirectory structure makes each concern independently navigable and testable.

## How to apply

- `command.ts` re-exports `providerHubChoiceValue` from `capabilities/` for backward compatibility
- New code should import directly from the subdirectory (e.g. `import { runProvidersRefreshModels } from '../models/index.js'`)
- `command.ts` remains the main entry point, importing from subdirectories
