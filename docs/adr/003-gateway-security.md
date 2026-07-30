# ADR 003: Gateway Server Security Model

- **Status**: Accepted
- **Date**: 2026-07-30
- **Deciders**: anygate maintainers

## Context

The `anygate server` command exposes a local HTTP server that proxies requests to upstream LLM providers. It serves the Anthropic `/v1/messages` and OpenAI `/v1/chat/completions` API formats. Security concerns include:

- **Unintended exposure**: The server may bind to `0.0.0.0` (network mode), making it accessible from other machines.
- **Credential leakage**: API keys and OAuth tokens flow through the server.
- **Unbounded request bodies**: A malicious or misconfigured client could send extremely large payloads.
- **No rate limiting**: A single client could flood the server with requests.

## Decision

The gateway server implements the following security measures:

1. **Authorization**: Password-based auth for network mode (local mode skips auth since it binds to `127.0.0.1`).
2. **Rate limiting**: 120 requests per minute per client (via `checkRateLimit` in `src/shared/http.ts`).
3. **Request body size limit**: 10 MB max (via `MAX_REQUEST_BODY_BYTES` in `src/config/constants.ts`).
4. **Security headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Cache-Control: no-store`.
5. **Error sanitization**: Unhandled errors are logged server-side with full detail; clients only receive generic "Internal server error".
6. **Credential redaction**: Trace logs redact all known secret patterns via `src/shared/redact.ts`.

## Consequences

- **Positive**: Protects against common attack vectors (DoS, credential leakage, error info disclosure).
- **Positive**: Rate limiting prevents abuse in network mode.
- **Negative**: Rate limit may need tuning for high-throughput use cases.
- **Neutral**: Password auth is simple but not cryptographically strong — relies on network security.

## References

- `src/gateway/server/router.ts`
- `src/gateway/server/server.ts`
- `src/shared/http.ts` — `sendJson`, `checkRateLimit`, `readBody`
- `src/shared/errors.ts` — `AnygateError` hierarchy
- `src/shared/redact.ts`
