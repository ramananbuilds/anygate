# Reference: Glossary

> Domain terminology reference for anygate.

## Terms

### Provider
A service that hosts or proxies machine learning models (e.g. Groq, Anthropic, OpenRouter, Ollama). Defined via templates in `src/registry/data/templates/` or custom endpoints.

### Model Format
The protocol format used by a model:
- `anthropic`: Direct Anthropic `/v1/messages` format.
- `openai`: OpenAI Chat Completions or Responses API format (routed via Vercel AI SDK).
- `cloud-code`: Google Cloud Code / Antigravity format.
- `unsupported`: Format not currently supported by target launcher.

### Gateway Launch Target
The target coding application being launched:
- `claude` / `claude-app` (Claude Code CLI / Desktop)
- `codex` / `codex-app` (OpenAI Codex CLI / ChatGPT Desktop)
- `gemini` (Google Gemini CLI)
- `antigravity` (Antigravity CLI / App / IDE)
- `server` (Standalone background API server)

### Favorites Catalog
A multi-route catalog proxy exposing up to 20 favorite models under alias IDs (`providerId__modelId`) so tools like Claude Code can switch models mid-session using `/model`.

### Environment Isolation
The mechanism of sanitizing child process environments by deleting conflicting environment variables (`CLAUDE_CODE_USE_VERTEX`, `ANTHROPIC_BASE_URL`, etc.) before launching an agent tool.
