# Memory

## Project: anygate

- [Domain Model CONTEXT.md](CONTEXT.md) — Domain model glossary for anygate: providers, models, credentials, agents, gateway, registry, oauth. Created 2026-07-24.
- [Credential Resolution Consolidation](memory/credential-resolution-consolidation.md) — Consolidated 6 inconsistent "No credential" error messages across gemini/antigravity.ts, gemini/cli.ts, codex/app.ts, codex/cli.ts, commands/claude.ts, claude/desktop.ts to use centralized CredentialUnavailableError from core/errors.ts.
- [Provider Factory Split](memory/provider-factory-split.md) — Split src/gateway/provider-factory.ts (901 lines) into provider-factory.ts (277 lines, core SDK factory) + provider-reasoning.ts (649 lines, reasoning capabilities).
- [Providers Reorganization](memory/providers-reorganization.md) — Reorganized src/providers/ into registry/, pricing/, models/, capabilities/ subdirectories. command.ts reduced from 906 to 504 lines.
