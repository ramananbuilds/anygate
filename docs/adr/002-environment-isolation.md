# ADR 002: Environment Variable Isolation

- **Status**: Accepted
- **Date**: 2026-07-30
- **Deciders**: anygate maintainers

## Context

When anygate launches a child coding agent (Claude Code, Codex, Gemini CLI), the child process inherits the parent's environment variables. If stale or conflicting env vars are present (e.g., `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_VERTEX_PROJECT_ID`), the child tool may pick up the wrong credentials or endpoint, bypassing anygate's provider routing entirely.

## Decision

Strip all conflicting environment variables from child processes. The list of 17 variables to strip is defined in `src/config/constants.ts` as `CONFLICTING_ENV_VARS`. Child processes receive credentials exclusively through explicit env var injection (e.g., `ANTHROPIC_AUTH_TOKEN` for OAuth, or provider-specific keys resolved via `resolveLocalProviderApiKey()`).

## Consequences

- **Positive**: Prevents credential conflicts and silent routing bypasses.
- **Positive**: Users can mix anygate-managed providers with their own local config without interference.
- **Negative**: Users must not set conflicting env vars in their shell profile if they want anygate to control routing.

## References

- `src/config/constants.ts` — `CONFLICTING_ENV_VARS`
- `src/registry/provider-catalog.ts` — `resolveLocalProviderApiKey()`
