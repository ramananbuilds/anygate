# Component: Providers (`src/providers/`)

> Per-vendor LLM driver implementations and provider discovery.

## Structure

```text
src/providers/
├── opencode-serve.ts     # OpenCode local serve discovery (findOpenBinary, fetchRawOpencodeProviders)
└── opencode-gate.ts      # OpenCode Zen client emulation (session ids, gate headers, body shaping, SSE→JSON buffering)
```

> **Note**: Per-vendor stubs (anthropic.ts, openai.ts, groq.ts, etc.) were removed
> in Phase 1. Provider-specific logic now lives in `src/registry/providers/` (metadata)
> and `src/gateway/providers/` (SDK model building).

## Purpose

`src/providers/opencode-serve.ts` provides:
- `findOpencodeBinary()` — Locate the OpenCode CLI binary on the system
- `fetchRawOpencodeProviders()` — Import provider/model data from OpenCode's cache

`src/providers/opencode-gate.ts` provides the OpenCode Zen compatibility shaper so
gateway traffic passes Zen's server-side client gate (free tier otherwise returns
`403 FreeTierError`):

- `createOpenCodeSessionId()` / `getOpenCodeSessionId()` — `ses_…` ids matching
  OpenCode's `Identifier.descending("session")` (48-bit inverted timestamp hex +
  14 Base62 chars), cached 10 minutes and rotated after.
- `applyOpenCodeZenHeaders()` — pins `User-Agent: opencode/1.18.34`,
  `x-opencode-client: cli`, `x-opencode-session`, and
  `Authorization: Bearer <key || "public">` on any outbound header set.
- `shapeOpenCodeZenChatBody()` — ensures the `bash`/`read` gate tools, drops
  `_noop`, forces `stream: true`, and reports whether the caller wanted JSON.
- `bufferOpenCodeSseResponse()` / `aggregateOpenCodeSseStream()` — reassembles the
  forced SSE stream (content, `reasoning_content`, tool-call fragments, usage)
  into a non-streaming `chat.completion` for `stream: false` callers.
- `makeOpenCodeZenFetch()` — drop-in fetch wrapper applying all of the above on
  `opencode.ai` hosts (no-op elsewhere). Used by the SDK provider factory, the
  direct `/v1/messages` + `/v1/chat/completions` forwarding, the model health
  probe, and catalog discovery.

These are lightweight wrappers — the heavy lifting is done by the Vercel AI SDK via
`src/gateway/providers/provider-factory.ts`.

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `registry/` (`auth-broker.ts`, `loader/import-opencode.ts`, `provider-auth.ts`), `cli/` (`providers-command.ts`), `apps/shared/` (`first-run.ts`, `model-compatibility.ts`), `gateway/` (`providers/provider-factory.ts`, `server/router.ts` via `upstream-forward.ts`), `upstream-forward.ts`, `registry/validation/model-validator.ts`

## Architecture Reference

See [Architecture: Provider System](../architecture/provider-system.md)
