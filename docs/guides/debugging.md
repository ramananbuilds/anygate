# Guide: Debugging & Troubleshooting

> Debug flags, trace logs, common error types, and troubleshooting steps.

## Debug Flags

### `--trace`
Writes a detailed debug trace log to `~/.anygate/logs/` and prints errors on process exit.

```bash
anygate claude --trace
anygate server --trace
```

Trace logs capture:
- Child environment variable construction
- HTTP request/response headers (redacted)
- Proxy routing decisions
- Upstream HTTP status codes and error payloads

### `--dry-run`
Simulates the full wizard and launch plan without executing child processes or writing persistent state to disk.

```bash
anygate claude --dry-run
```

## Health Diagnostics (`anygate doctor`)

Run `anygate doctor` to diagnose local environment issues:
- Keyring module health (`@napi-rs/keyring`)
- OpenCode CLI availability
- Child tool installations (Claude Code, Codex, Gemini, Antigravity)
- Port 17645 availability for `anygate server`

## Error Hierarchy

anygate uses structured error types defined in `src/core/errors/`:

- `CredentialUnavailableError` — missing or unreadable credentials
- `UpstreamUnreachableError` — network failure or unreachable provider endpoint
- `ModelFormatUnsupportedError` — model format incompatible with target app
