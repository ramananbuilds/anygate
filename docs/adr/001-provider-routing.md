# ADR 001: Non-Anthropic Provider Routing via Vercel AI SDK

- **Status**: Accepted
- **Date**: 2026-07-30
- **Deciders**: anygate maintainers

## Context

Anygate needs to route chat completions and streaming requests to multiple LLM providers (OpenAI, Google, Groq, Mistral, etc.) that all use different API formats. The Anthropic format (`/v1/messages`) is the canonical input format because Claude Code and Claude Desktop expect it natively.

Writing and maintaining hand-crafted HTTP adapters for each provider is error-prone, requires extensive testing, and doesn't benefit from the ecosystem's ongoing work on SDK reliability, retries, and error normalization.

## Decision

Route all non-Anthropic models through the Vercel AI SDK (`ai` + `@ai-sdk/*` packages). The SDK adapter (`src/gateway/adapters/sdk-adapter.ts`) translates Anthropic-format requests into Vercel AI SDK calls, and the provider factory (`src/gateway/providers/provider-factory.ts`) dynamically builds `LanguageModel` instances per provider.

Anthropic-native requests with a `baseUrl` are forwarded directly via HTTP proxy without SDK translation.

## Consequences

- **Positive**: Single adapter handles all non-Anthropic providers; SDK handles retries, error normalization, and token streaming.
- **Positive**: Adding a new provider is a one-line addition to `provider-factory.ts`.
- **Negative**: Adds a dependency on the Vercel AI SDK ecosystem.
- **Negative**: SDK update cycles may lag behind provider API changes.

## References

- `src/gateway/adapters/sdk-adapter.ts`
- `src/gateway/providers/provider-factory.ts`
- `docs/architecture/gateway.md`
