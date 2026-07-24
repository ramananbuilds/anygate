# Architectural Invariants & Rules

> Critical rules that AI agents and contributors must observe at all times.

## Immutable Rules

1. **Never mutate `~/.claude/settings.json` directly**: Pass provider models and proxy endpoints exclusively through child process environment variables (`ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`).
2. **`package.json` is the single source of truth for versioning**: Version number in `src/config/constants.ts` reads `pkg.version`. Never hardcode version strings.
3. **`BACKENDS.baseUrl` must not include `/v1`**: The Anthropic SDK automatically appends `/v1/messages` to the base URL string.
4. **All non-Anthropic models route through Vercel AI SDK**: Wire format adapter translation (`src/gateway/adapters/sdk-adapter.ts`) standardizes requests into `@ai-sdk/*` package calls.
5. **Always preserve error classifications**: Use domain errors from `src/core/errors/` (`CredentialUnavailableError`, `UpstreamUnreachableError`) rather than throwing generic Error instances.
6. **No manual `npm publish`**: Publishing is handled exclusively by GitHub Actions upon pushing a version tag (`v*`).
