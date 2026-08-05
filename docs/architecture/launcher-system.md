# Launcher System

> OS-native process execution, app detection, terminal spawning, and environment isolation.

## Location

```text
src/launchers/
├── app-launcher.ts        # High-level app launch orchestration
├── native-launcher.ts     # OS-native binary detection & process spawning
├── launch.ts              # Launch coordination utilities
├── desktop.ts             # Desktop app launch helpers
├── terminal.ts            # Terminal window spawning
├── shared.ts              # Cross-platform shared utilities
├── macos.ts               # macOS-specific launch logic
├── windows.ts             # Windows-specific launch logic
├── linux.ts               # Linux-specific launch logic
└── index.ts               # Barrel exports
```

## Launch Chain

```text
CLI Command → App-specific handler (src/apps/*/command.ts)
  → buildChildEnv()          // Environment isolation
  → app-launcher.ts          // High-level launch
    → native-launcher.ts     // Binary detection
      → macos.ts / windows.ts / linux.ts  // OS-specific spawn
```

## App Detection

`native-launcher.ts` detects installed coding tools:

| Tool | Detection Method |
|------|-----------------|
| Claude Code | `which claude` / PATH search |
| Claude Desktop | macOS: `/Applications/Claude.app`, Windows: registry/AppData |
| Codex CLI | `which codex` / PATH search |
| ChatGPT Desktop | macOS: `/Applications/ChatGPT.app`, Windows: registry/AppData |
| Gemini CLI | `which gemini` / npm global |
| Antigravity CLI | `which agy` / PATH search |
| Antigravity IDE | macOS: `/Applications/Antigravity.app`, Windows: `antigravity` in PATH |

## Environment Isolation

`buildChildEnv()` in `src/config/env.ts` creates a clean environment:

### Stripped Variables (17)

```
CLAUDE_CODE_USE_VERTEX
ANTHROPIC_VERTEX_PROJECT_ID, ANTHROPIC_VERTEX_BASE_URL
CLOUD_ML_REGION
ANTHROPIC_BEDROCK_BASE_URL
ANTHROPIC_AWS_BASE_URL, ANTHROPIC_AWS_API_KEY, ANTHROPIC_AWS_WORKSPACE_ID
ANTHROPIC_FOUNDRY_API_KEY, ANTHROPIC_FOUNDRY_BASE_URL
ANTHROPIC_AUTH_TOKEN
ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL, ANTHROPIC_MODEL
ANTHROPIC_DEFAULT_OPUS_MODEL, ANTHROPIC_DEFAULT_SONNET_MODEL, ANTHROPIC_DEFAULT_HAIKU_MODEL
```

### Set Variables

| Variable | Value |
|----------|-------|
| `ANTHROPIC_BASE_URL` | Proxy URL or backend URL |
| `ANTHROPIC_API_KEY` | Session API key |
| `ANTHROPIC_AUTH_TOKEN` | Same as API key (Claude Code v2.x session auth check) |
| `ANTHROPIC_MODEL` | Context-annotated model ID |
| `ANTHROPIC_SMALL_FAST_MODEL` | Same as model (for haiku fallback) |
| `CLAUDE_CODE_MAX_CONTEXT_WINDOW` | Model's real context window |
| `ENABLE_TOOL_SEARCH` | `true` (for proxy routes) |
| `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` | `0` (keep full guardrails) |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | `1` (in catalog mode) |

## Platform-Specific Behavior

### macOS (`macos.ts`)
- Uses `open -a` for desktop apps
- Detects apps in `/Applications/`
- Supports `open -n` for new instances

### Windows (`windows.ts`)
- Uses `start` / `cmd /c` for desktop apps
- Detects apps via registry and AppData paths
- Handles Windows path separators

### Linux (`linux.ts`)
- Uses direct binary execution
- Detects apps via `which` and common paths
- Supports X11 and Wayland terminal detection

## Machine-Readable Output

For agent/headless use, anygate detects when the child tool writes structured output to stdout and suppresses its own output:

| Tool | Detection | Format |
|------|-----------|--------|
| Claude | `--print` + `--output-format stream-json\|json` | NDJSON/JSON |
| Codex | `--json` flag | JSONL events |
| Gemini | `-o stream-json\|json` | NDJSON/JSON |

When machine-readable output is detected, anygate's interactive prompts and banners are suppressed.

---

**See also:**
- [Request Lifecycle](request-lifecycle.md) — how launch fits into the full flow
- [Reference: Supported Apps](../reference/supported-apps.md) — all target apps
