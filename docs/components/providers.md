# Component: Providers (`src/providers/`)

> Per-vendor LLM driver implementations and provider discovery.

## Structure

```text
src/providers/
└── opencode-serve.ts     # OpenCode local serve discovery (findOpenBinary, fetchRawOpencodeProviders)
```

> **Note**: Per-vendor stubs (anthropic.ts, openai.ts, groq.ts, etc.) were removed
> in Phase 1. Provider-specific logic now lives in `src/registry/providers/` (metadata)
> and `src/gateway/providers/` (SDK model building).

## Purpose

`src/providers/opencode-serve.ts` provides:
- `findOpencodeBinary()` — Locate the OpenCode CLI binary on the system
- `fetchRawOpencodeProviders()` — Import provider/model data from OpenCode's cache

These are lightweight wrappers — the heavy lifting is done by the Vercel AI SDK via
`src/gateway/providers/provider-factory.ts`.

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `registry/` (`auth-broker.ts`, `loader/import-opencode.ts`, `provider-auth.ts`), `cli/` (`providers-command.ts`), `apps/shared/` (`first-run.ts`)

## Architecture Reference

See [Architecture: Provider System](../architecture/provider-system.md)
