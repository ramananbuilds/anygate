# Component: CLI (`src/cli/`)

> Subcommand entry points dispatched from `src/cli.ts`.

## Structure

```text
src/cli/
├── claude.ts              # `anygate claude` — main Claude Code orchestration (19KB)
├── claude-app.ts          # `anygate claude-app` — Claude Desktop launch
├── codex.ts               # `anygate codex` — Codex CLI launch
├── codex-app.ts           # `anygate codex-app` — ChatGPT Desktop launch
├── gemini.ts              # `anygate gemini` — Gemini CLI launch
├── antigravity.ts         # `anygate antigravity` — Antigravity launch
├── providers-command.ts   # `anygate providers` — full provider management (27KB)
├── providers.ts           # Provider subcommand dispatcher
├── models.ts              # `anygate models` — favorites manager (10KB)
├── server.ts              # `anygate server` — gateway server
├── ui.ts                  # `anygate ui` — web dashboard
├── doctor.ts              # `anygate doctor` — system health check
├── update.ts              # `anygate update` — self-update
├── completions.ts         # Shell completions generator
└── index.ts               # Command dispatcher (dispatchCommand)
```

## Subcommands

| Command | Handler | Purpose |
|---------|---------|---------|
| `anygate claude` | `claude.ts` | Launch Claude Code with provider/model selection |
| `anygate claude-app` | `claude-app.ts` | Launch Claude Desktop (Cowork) |
| `anygate codex` | `codex.ts` | Launch OpenAI Codex CLI |
| `anygate codex-app` / `chatgpt` | `codex-app.ts` | Launch ChatGPT Desktop app |
| `anygate gemini` | `gemini.ts` | Launch Google Gemini CLI |
| `anygate antigravity` / `agy` | `antigravity.ts` | Launch Antigravity CLI/App/IDE |
| `anygate providers` | `providers-command.ts` | Add, remove, list, refresh providers |
| `anygate models` | `models.ts` | Manage favorite models |
| `anygate server` | `server.ts` | Run API gateway server |
| `anygate ui` | `ui.ts` | Open web dashboard |
| `anygate doctor` | `doctor.ts` | System health check |
| `anygate update` | `update.ts` | Self-update via npm |

## Dependencies

- **Imports from**: `apps/`, `gateway/`, `registry/`, `storage/`, `config/`, `services/`
- **Imported by**: `src/cli.ts` (root entry point)
