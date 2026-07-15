# 04 — Data Flow

How a request actually moves through anygate, and how the proxy decides where to route.
Read after [02_ARCHITECTURE.md](./02_ARCHITECTURE.md).

---

## 1. The two request surfaces

anygate operates as a **local server** that the target agent talks to. Two shapes:

1. **Anthropic-compatible** (`/v1/messages`, SSE streaming) — what Claude Code,
   Claude Desktop, and the `anygate server` clients use.
2. **OpenAI-compatible** (`/v1/chat/completions` or `/v1/responses`) — what Codex
   and the ChatGPT desktop app use.

The **Antigravity** path is a third, faked Cloud Code surface (see §5).

---

## 2. Anthropic request path (Claude Code)

```
Claude Code
  → POST http://127.0.0.1:<port>/v1/messages   (ANTHROPIC_BASE_URL = proxy)
  → [gateway/anthropic-proxy.ts] receives Anthropic-shaped body
       ├─ modelFormat === 'anthropic'
       │     → relayAnthropicMessages() → upstream {baseUrl}/v1/messages  (passthrough)
       └─ else (openai / sdk)
              → [gateway/sdk-adapter.ts] translateRequest()
                   • fold inline role:'system' into system prompt
                    • [gateway/provider-factory.ts] createLanguageModel({npm, modelId, apiKey, baseURL})
                   • streamAnthropicResponse() maps SDK fullStream → Anthropic SSE
             ← Anthropic SSE back to Claude Code
  → GET /v1/models  → synthetic catalog (aliasModelId, context_window)
```

Key detail: Codex/Claude inject **skills + system-reminders** as inline `role:'system'`
messages inside the body. `translateRequest` folds them into the actual `system` field so
the SDK provider doesn't drop them. Gemini's `thought_signature` round-trips encoded in
the `tool_use.id` (`{id}::ts::{signature}`) and is decoded back into
`providerOptions.google.thoughtSignature`.

---

## 3. OpenAI request path (Codex / ChatGPT app)

```
Codex CLI / ChatGPT app
  → POST {baseUrl}/v1/responses (or /v1/chat/completions)
  → [agents/codex/proxy.ts] or [agents/codex/responses-adapter.ts]
       ├─ modelPrefersResponsesApi(id) === true
       │     → provider.responses(id)  (OpenAI/xAI Responses API)
       ├─ useResponsesLite / preferWebSockets
       │     → [oauth/responses-websocket.ts] open wss://chatgpt.com/.../codex/responses
       │       forward ChatGPT-Account-Id / originator / version / x-openai-internal-codex-responses-lite
       │       stream event frames back as SSE
       └─ else chat/completions → SDK or direct
```

> `modelPrefersResponsesApi` (in [gateway/provider-factory.ts](../src/gateway/provider-factory.ts)):
> true for `gpt-5-codex`, `gpt-5-pro`, `o3`/`o4`*, any `gpt-5.N` with N≥4, any
> `gpt-*-codex`, and `grok-*-multi-agent`. OpenAI's Responses API is treated as a
> strict superset of chat-completions for every current model, so route through it by default.

---

## 4. Proxy routing model (the important part)

A `ProxyRoute` carries enough to service one model:

```
ProxyRoute {
  id: string                 // catalog id Claude Code sees
  modelFormat: 'anthropic' | 'openai'
  npm?: string               // for openai-format: which @ai-sdk/* to import
  baseURL?: string          // openai-compatible / openrouter base
  upstreamModelId?: string  // wire id sent upstream (may differ from catalog id)
  apiKey: string
  contextWindow?: number
}
```

- `startProxy(routes, startingAliasId, debug)` — multi-route catalog proxy (favorites mode).
- `startProxyCatalog(...)` — same, alias slugs `${providerId}__${modelId}`.
- `aliasModelId()` rewrites non-`Claude-*` ids to `anthropic-{provider}__{id}` so gateway
  model discovery accepts them.

**Resolve step:** given an incoming `model` header, pick the route whose `id` matches;
if `modelFormat==='anthropic'` relay raw, else send to the SDK adapter selected by `npm`.

---

## 5. Antigravity Cloud Code path

```
Antigravity CLI / app / IDE
  → faked Cloud Code API  [gateway/antigravity/cloud-code-gateway.ts]
  → [request-adapter.ts] Cloud Code generateContent → SDK params
  → SDK model (same provider-factory as everything else)
  → [response-adapter.ts] SDK stream → Cloud Code SSE
  → [cloudcode-to-anthropic.ts] if the agent expects Anthropic shape
  → [anthropic-to-cloudcode.ts] inverse
  → normalizeFunctionCallArgs() un-stringifies MCP tool-call args
```

Use a **throwaway Google account** — third-party models stringify MCP `Arguments` and
`normalizeFunctionCallArgs` repairs that, but the account risk remains.

---

## 6. Env isolation (child only)

`buildChildEnv(baseUrl, model, apiKey, proxyPort?, contextWindow?, enableGatewayDiscovery?)`
([core/env.ts](../src/core/env.ts)):

1. `env = { ...process.env }`
2. delete all 17 `CONFLICTING_ENV_VARS` (Vertex, Bedrock, AWS, Foundry, stale Anthropic)
3. `ANTHROPIC_BASE_URL = proxyPort ? http://127.0.0.1:${proxyPort} : baseUrl`
4. set `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` (via `claudeCodeClientModelId`)
5. pass `--model` to the child
6. `applyClaudeCodeThirdPartyCompat(env)` — sets `ENABLE_TOOL_SEARCH`, `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0`

The **parent shell is never mutated.** Note: Claude Code may persist the model to its own
`~/.claude/settings.json` — outside anygate's control.
