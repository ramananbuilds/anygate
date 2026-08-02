# ADR 005: Structured JSON Logging

- **Status**: Accepted
- **Date**: 2026-07-30
- **Deciders**: anygate maintainers

## Context

The gateway server previously used `console.error()` for error logging with no structured format. This made it difficult to parse logs in production, aggregate them in log management systems, or correlate requests across services.

## Decision

Introduce a structured logger (`src/shared/logger.ts`) with:

1. **JSON output mode**: Set `ANYGATE_LOG_FORMAT=json` to emit structured JSON: `{"level":"error","msg":"...","ts":"...","err":{"message":"...","stack":"..."}}`.
2. **Log level control**: Set `ANYGATE_LOG_LEVEL` to `debug` | `info` | `warn` | `error` to control verbosity (default: `info`).
3. **Error object support**: Pass `Error` instances as the second argument to automatically include message and stack trace.
4. **Structured fields**: Pass a fields object as the last argument to include arbitrary key-value pairs.
5. **Human-readable fallback**: When `ANYGATE_LOG_FORMAT` is not set, output uses colored, human-readable format with icons and timestamps.

All gateway server error logging now uses `logger.error()` instead of `console.error()`.

## Consequences

- **Positive**: Structured logs are machine-parseable and aggregatable.
- **Positive**: Log level control enables production tuning without code changes.
- **Positive**: Error objects include stack traces for debugging.
- **Negative**: JSON mode is verbose; users must opt-in via env var.
- **Neutral**: The logger is a zero-dependency module using only `picocolors` for human mode.

## References

- `src/shared/logger.ts`
- `src/gateway/server/router.ts` — error handling
- `src/gateway/server/server.ts` — server startup logging
