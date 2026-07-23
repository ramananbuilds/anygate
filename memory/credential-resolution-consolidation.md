---
name: credential-resolution-consolidation
description: Consolidated 6 inconsistent credential error messages to use centralized CredentialUnavailableError
metadata:
  type: project
---

# Credential Resolution Error Message Consolidation

## What was done

Replaced 6 inconsistent "No credential" / "No API key" error messages across the codebase with the centralized `CredentialUnavailableError` from `src/core/errors.ts`.

## Files changed

1. `src/agents/gemini/antigravity.ts` — `No credential for ${provider.name}. Run: anygate providers auth ${provider.id} or add an API key.` → `new CredentialUnavailableError(provider.id).userMessage`
2. `src/agents/gemini/cli.ts` — `No API key found for ${activeProvider.name}. Set it with anygate providers add.` → `new CredentialUnavailableError(activeProvider.id).userMessage`
3. `src/agents/codex/app.ts` — `No credential for ${activeProvider.name}. Run anygate providers auth ${activeProvider.id}.` → `new CredentialUnavailableError(activeProvider.id).userMessage`
4. `src/agents/codex/cli.ts` — `No credential for ${activeProvider.name}. Run anygate providers auth ${activeProvider.id} or add an API key.` → `new CredentialUnavailableError(activeProvider.id).userMessage`
5. `src/commands/claude.ts` — `No credential found for ${activeProvider.name}. Add a key with anygate providers or set OPENCODE_API_KEY.` → `new CredentialUnavailableError(activeProvider.id).userMessage`
6. `src/agents/claude/desktop.ts` — `No credential for ${activeProvider.name}. Run anygate providers auth ${activeProvider.id}.` → `new CredentialUnavailableError(activeProvider.id).userMessage`

## Why

The `CredentialUnavailableError` class in `src/core/errors.ts` is the canonical error for missing provider credentials. Its `userMessage` is: `No credential available for provider "${providerId}". Run \`anygate providers auth ${providerId}\` or set the key.`

Previously, 6 files had their own ad-hoc error messages with varying wording ("No credential", "No API key found", "No credential found") and different instructions. This inconsistency made debugging harder and could confuse users.

## How to apply

When adding a new launcher or agent, always use `new CredentialUnavailableError(providerId).userMessage` for credential resolution failures, not ad-hoc error messages.
