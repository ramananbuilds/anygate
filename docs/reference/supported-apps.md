# Reference: Supported Applications

> List of coding applications supported by anygate launchers.

| Application | Command | Supported Protocols | Key Features |
|-------------|---------|---------------------|--------------|
| Claude Code CLI | `anygate claude` | Anthropic `/v1/messages` | Full interactive CLI, favorites `/model` catalog switch, `--print` support |
| Claude Desktop (Cowork) | `anygate claude-app` | Anthropic `/v1/messages` | Desktop GUI launch, vendor mask discovery ID support |
| OpenAI Codex CLI | `anygate codex` | OpenAI Responses API | Codex CLI session launch, `--json` stream output |
| ChatGPT Desktop App | `anygate codex-app`, `anygate chatgpt` | OpenAI Responses API | Desktop app launcher, Responses-Lite WebSocket transport |
| Google Gemini CLI | `anygate gemini` | Gemini API | Interactive & non-interactive streaming NDJSON |
| Antigravity CLI / App / IDE | `anygate antigravity`, `anygate agy` | Cloud Code API | Local Cloud Code gateway emulation, slot registry |
| API Gateway Server | `anygate server` | Anthropic + OpenAI | Dual-protocol background HTTP server on port 17645 |
| Web Dashboard | `anygate ui` | REST + Web UI | Svelte 5 SPA, point-and-click launch, provider & model manager |
