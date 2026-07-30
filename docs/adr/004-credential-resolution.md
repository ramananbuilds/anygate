# ADR 004: Centralized Credential Resolution

- **Status**: Accepted
- **Date**: 2026-07-30
- **Deciders**: anygate maintainers

## Context

Provider API keys can come from multiple sources: environment variables, the `~/.claude/settings.json` file, the system keychain, or the bundled provider registry. Previously, credential resolution was inlined at 7+ call sites, leading to drift where different code paths used different fallback orders.

## Decision

Centralize credential resolution in `src/registry/provider-catalog.ts::resolveLocalProviderApiKey()`. This function checks the following sources in order:

1. Provider-specific environment variable (e.g., `OPENAI_API_KEY`)
2. Keychain / credential store (via `readFromCredentialStore()`)
3. Bundled registry provider credentials

All call sites that need a provider API key use this canonical helper. Environment variable injection to child processes uses `sanitizeCredential()` to strip whitespace and newlines that could corrupt shell parsing.

## Consequences

- **Positive**: Single source of truth for credential resolution — no drift between code paths.
- **Positive**: Credential resolution is testable in isolation.
- **Negative**: Tight coupling between the registry and credential storage layers.
- **Neutral**: Keychain is an optional dependency (`@napi-rs/keyring`); resolution gracefully falls back to other sources if unavailable.

## References

- `src/registry/provider-catalog.ts` — `resolveLocalProviderApiKey()`
- `src/config/env.ts` — `sanitizeCredential()`
- `src/storage/credentials.ts`
- `docs/architecture/authentication.md`
