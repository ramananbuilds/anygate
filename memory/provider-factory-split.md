---
name: provider-factory-split
description: Split provider-factory.ts (901 lines) into core + reasoning modules
metadata:
  type: project
---

# Provider Factory Split

## What was done

Split `src/gateway/provider-factory.ts` (901 lines) into two files:

1. `src/gateway/provider-factory.ts` (277 lines) — Core SDK factory: `modelPrefersResponsesApi`, `shouldUseOpenAiResponsesEndpoint`, `VertexProviderConfig`, `ProviderModelSpec`, `isSdkUpgradedNpm`, `maxToolsForNpm`, `createLanguageModel`
2. `src/gateway/provider-reasoning.ts` (649 lines) — Reasoning capabilities: `getReasoningCapabilities`, `buildCodexReasoningLevels`, `effortProviderOptions`, `deepMergeProviderOptions`, `thinkingProviderOptions`, plus all reasoning types and model-specific detection functions

## Why

The file was 901 lines with two distinct concerns: SDK model creation and reasoning-capability detection. The reasoning section (~640 lines) was self-contained behind `getReasoningCapabilities` and could be extracted without affecting the core factory logic.

## How to apply

- `provider-factory.ts` re-exports all reasoning types and functions from `provider-reasoning.ts` for backward compatibility
- New code should import reasoning types/functions directly from `provider-reasoning.ts`
- The circular dependency (`provider-reasoning.ts` imports `modelPrefersResponsesApi` from `provider-factory.ts`) is safe because `modelPrefersResponsesApi` is a function declaration (hoisted) and only called at runtime
