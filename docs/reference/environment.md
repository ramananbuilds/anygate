# Reference: Environment Variables

> Environment variables recognized by anygate and child process isolation rules.

## Environment Variables Read by anygate

| Variable | Purpose |
|----------|---------|
| `OPENCODE_API_KEY` | API key for OpenCode Zen/Go backends |
| `ANYGATE_TRACE` | Set to `1` or `true` to enable debug trace logging |
| `ANYGATE_LOG_PATH` | Override target debug log filepath |

## Sanitized Environment Variables (Child Isolation)

The following 17 environment variables are explicitly stripped from child process environments by `buildChildEnv()`:

1. `CLAUDE_CODE_USE_VERTEX`
2. `ANTHROPIC_VERTEX_PROJECT_ID`
3. `ANTHROPIC_VERTEX_BASE_URL`
4. `CLOUD_ML_REGION`
5. `ANTHROPIC_BEDROCK_BASE_URL`
6. `ANTHROPIC_AWS_BASE_URL`
7. `ANTHROPIC_AWS_API_KEY`
8. `ANTHROPIC_AWS_WORKSPACE_ID`
9. `ANTHROPIC_FOUNDRY_API_KEY`
10. `ANTHROPIC_FOUNDRY_BASE_URL`
11. `ANTHROPIC_AUTH_TOKEN`
12. `ANTHROPIC_API_KEY`
13. `ANTHROPIC_BASE_URL`
14. `ANTHROPIC_MODEL`
15. `ANTHROPIC_DEFAULT_OPUS_MODEL`
16. `ANTHROPIC_DEFAULT_SONNET_MODEL`
17. `ANTHROPIC_DEFAULT_HAIKU_MODEL`

## Injected Environment Variables (Child Environment)

| Variable | Set Value |
|----------|-----------|
| `ANTHROPIC_BASE_URL` | Local proxy URL (e.g. `http://127.0.0.1:<port>`) or backend URL |
| `ANTHROPIC_API_KEY` | Session key or proxy token |
| `ANTHROPIC_MODEL` | Selected model ID (annotated with context window) |
| `ENABLE_TOOL_SEARCH` | `true` (enables deferred tool loading for third-party proxies) |
