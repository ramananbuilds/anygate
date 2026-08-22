# Gateway Architecture

> The gateway layer handles all protocol translation, HTTP proxying, API serving, and Cloud Code emulation.

## Location

```text
src/gateway/
├── adapters/
│   ├── sdk-adapter.ts          # Anthropic ↔ Vercel AI SDK translation
│   ├── openai-adapter.ts       # OpenAI format handling
│   └── vertex.ts               # Vertex AI adapter
├── antigravity/
│   ├── cloud-code-gateway.ts   # Cloud Code gateway server
│   ├── anthropic-to-cloudcode.ts  # Anthropic → Cloud Code translation
│   ├── cloudcode-to-anthropic.ts  # Cloud Code → Anthropic translation
│   ├── request-adapter.ts      # Cloud Code request normalization
│   ├── response-adapter.ts     # Cloud Code response normalization
│   ├── slot-registry.ts        # Model slot management
│   ├── catalog.ts              # Antigravity model catalog
│   ├── cloud-code-proxy.ts     # Cloud Code HTTP proxy
│   ├── ide-profile.ts          # IDE profile directory management
│   ├── launch-cli.ts           # CLI launch logic
│   ├── launch-ide.ts           # IDE/app launch logic
│   ├── launch-routes.ts        # Route building for Antigravity
│   └── types.ts                # Cloud Code type definitions
├── context/
│   ├── context-fit.ts          # Token estimation & context window fitting
│   └── prompts.ts              # Server wizard prompts
├── providers/
│   ├── provider-factory.ts     # Dynamic SDK provider instantiation
│   └── provider-select.ts      # Server provider selection UI
├── proxy/
│   ├── anthropic-proxy.ts      # Local Anthropic-compatible HTTP proxy
│   ├── proxy-shared.ts         # SSE encoding, tool ID helpers, shared utilities
│   └── proxy-types.ts          # Proxy type definitions
├── server/
│   ├── server.ts               # Standalone gateway server wizard & lifecycle
│   ├── router.ts               # HTTP request routing & handler dispatch
│   ├── auth.ts                 # API key validation
│   ├── models.ts               # Model catalog formatting (Anthropic & OpenAI)
│   ├── vendor-mask.ts          # Discovery ID masking for Claude Desktop
│   └── catalog-filter.ts       # Filter by providers, favorites, free status
├── web-search/
│   ├── tool.ts                 # Web search tool factory
│   ├── duckduckgo.ts           # DuckDuckGo search backend
│   ├── searxng.ts              # SearxNG search backend
│   ├── brave.ts                # Brave Search backend
│   ├── tavily.ts               # Tavily search backend
│   ├── constants.ts            # Max search steps
│   ├── types.ts                # Search result types
│   └── index.ts                # Search backend selection
└── index.ts                    # Gateway barrel exports
```

## Anthropic Proxy

The core of the gateway is `anthropic-proxy.ts` — a local HTTP server that accepts Anthropic `/v1/messages` requests and translates them to upstream provider APIs.

### Single-Model Mode

```text
startProxy(route) → http.createServer on random port
  POST /v1/messages → translate → SDK call → stream back as Anthropic SSE
  GET /v1/models   → return single model entry
```

### Catalog Mode (Favorites)

```text
startProxyCatalog(routes[]) → http.createServer on random port
  POST /v1/messages → resolve model from request → find matching route → translate → stream
  GET /v1/models    → return all route aliases
```

Each route gets an alias ID (`providerId__modelId`). Claude Code's `/model` switch menu shows all aliases.

### Request Handling Flow

```text
Incoming POST /v1/messages
  ↓
  1. Parse JSON body (readBody)
  2. Resolve route from model ID
  3. Check if direct Anthropic or proxy-routed
  ↓
  ├── Direct Anthropic: forwardAnthropicMessages() → upstream
  ├── Cloud Code: anthropicToCloudCode() → gateway → cloudCodeToAnthropic()
  └── SDK Proxy:
      a. sdkTranslateRequest(body) → SDK messages format
      b. createLanguageModel(npm, modelId, apiKey, baseURL)
      c. streamText() or generateText() via Vercel AI SDK
      d. streamAnthropicResponse() → Anthropic SSE events
```

## SDK Adapter

`sdk-adapter.ts` translates between Anthropic and the Vercel AI SDK:

### Request Translation

- Anthropic `system` field → SDK system prompt
- Anthropic `messages` → SDK `ModelMessage[]`
- Inline `role: 'system'` messages → folded into system prompt
- `tool_use` blocks → SDK tool calls
- `tool_result` blocks → SDK tool results
- Image content → SDK image parts
- Thinking blocks → preserved via `thought_signature` round-trip

### Response Streaming

Anthropic SSE event types emitted:
- `message_start` — model, usage metadata
- `content_block_start` / `content_block_delta` / `content_block_stop` — text and tool_use blocks
- `message_delta` — stop_reason, final usage
- `message_stop` — end of stream

### Web Search Integration

When a non-Anthropic model receives Anthropic's `web_search_tool_20250305` (a `server_tool` without `input_schema`), the SDK adapter:

1. Detects the tool via `isWebSearchTool()`
2. Creates a local web search tool via `makeWebSearchTool()`
3. Executes searches using DuckDuckGo (default), SearxNG, Brave, or Tavily
4. Returns results to the model as tool results

This makes web search work on every favorite model at zero cost.

## Provider Factory

`provider-factory.ts` dynamically imports SDK provider packages:

```typescript
createLanguageModel({ npm, modelId, apiKey, baseURL })
// npm = "@ai-sdk/groq" → import("@ai-sdk/groq")
// Returns: LanguageModel instance ready for streamText()
```

Also handles reasoning metadata detection (`getReasoningCapabilities()`), thinking budget configuration, and provider-specific options merging.

### Stream Normalization

Generic SDK providers (`@ai-sdk/mistral`, `@ai-sdk/openai-compatible`, etc.) route upstream model streams through a sanitizing fetch wrapper defined in `provider-factory.ts` → `stream-sanitizer.ts`. Two upstream non-conformances are common from reseller/multi-provider gateways (e.g. GLM-5.2 served behind a Mistral-compatible endpoint):

1. **`delta.content` is a structured array** of `{type:"thinking"|"text",...}` blocks instead of a plain string. The Vercel AI SDK validates each SSE frame against a strict Zod schema and throws `expected string, received array`, aborting the entire stream.
2. **`delta.tool_calls[]` omits the required `id` field** (and sometimes `function.arguments`). The SDK throws `expected string, received undefined` for `id`.
3. **`data: null` keepalive lines** are interleaved between valid chunks; the SDK throws on them too.

### Two Normalization Paths

- **Mistral adapter** (`@ai-sdk/mistral`, `preserveThinking=true`): Thinking content arrays are **preserved intact** in `delta.content` as `[{type:'thinking',thinking:[...]}]`. The Mistral SDK natively processes these and emits `reasoning-start`/`reasoning-delta`/`reasoning-end` stream parts, which AnyGate serializes as Anthropic `thinking` blocks. Tool-call `id` injection and `data: null` stripping still apply.
- **OpenAI-compatible** (`@ai-sdk/openai-compatible`, `preserveThinking=false`/default): Thinking content arrays are **flattened** into `content` (string) + `reasoning_content` (string), which the OpenAI-compatible SDK reads natively. Tool-call `id` injection and `data: null` stripping still apply.

Both paths share the same stable tool-call ID injection logic: IDs are generated once per tool-call index (per choice index), cached in a stream-scoped `Map`, and reused for all subsequent chunks with the same `index`.

### Tool-Call Streaming Deduplication

The `@ai-sdk/mistral` SDK v3.0.37 emits `tool-input-start` → `tool-input-delta` → `tool-input-end` → `tool-call` as a group **for every streaming chunk** that contains `tool_calls` data, unlike `@ai-sdk/openai` which only emits `tool-input-start` once per tool-call index. AnyGate's `writeAnthropicStream()` in `sdk-adapter.ts` guards against duplicate `content_block_start` SSE events by checking `idToBlock.has(toolKey)` before calling `openBlock`, skipping re-opening when a block is already open for that tool ID.

## Gateway Server

`anygate server` runs a standalone API gateway on port **17645**:

### Endpoints

| Endpoint | Format | Purpose |
|----------|--------|---------|
| `/v1/messages` | Anthropic | Claude Code / Anthropic SDK clients |
| `/anthropic/v1/messages` | Anthropic | Explicit Anthropic namespace |
| `/openai/v1/chat/completions` | OpenAI | OpenAI SDK clients |
| `/v1/models` | Anthropic | Model catalog listing |
| `/openai/v1/models` | OpenAI | Model catalog listing |

### Server Features

- **Provider filtering**: Expose only selected providers
- **Favorites-only mode**: Only serve favorited models
- **Free-models-only mode**: Only serve free-tier models
- **Vendor masking**: Rewrite discovery IDs for Claude Desktop compatibility
- **Password auth**: Optional API key requirement for network mode
- **Listen modes**: Local (127.0.0.1) or network (0.0.0.0)
- **Security headers**: All responses include `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Cache-Control: no-store`
- **Rate limiting**: 120 requests per minute per client (429 response with `Retry-After` header)
- **Body size limit**: 10 MB maximum request body
- **Safe error handling**: `AnygateError` instances use typed `sendError()`; other errors return generic "Internal server error" to prevent information leakage

## Antigravity Gateway

The Antigravity subsystem (`src/gateway/antigravity/`) emulates Google's Cloud Code API so Antigravity can use anygate providers:

### Key Components

- **cloud-code-gateway.ts** — Full Cloud Code API server emulation
- **slot-registry.ts** — Model slot management (Antigravity uses numbered "slots")
- **anthropic-to-cloudcode.ts** — Anthropic → Cloud Code request translation
- **cloudcode-to-anthropic.ts** — Cloud Code → Anthropic response translation
- **request-adapter.ts / response-adapter.ts** — Normalize Cloud Code payloads
- **catalog.ts** — Build Antigravity-compatible model catalog
- **ide-profile.ts** — Create Antigravity IDE profile with `cloudCodeUrl`

## Context Fitting

`context-fit.ts` handles context window management:

- `estimateContextTokens()` — rough token count for a message array
- `fitContextWindow()` — truncate conversation history to fit within model's context window
  - Applies an 85% safety margin (`safeWindow = floor(contextWindow * 0.85)`) so token-estimation
    error and upstream framing overhead never trigger an "input length exceeds maximum" 400.
  - Preserves the system prompt, most recent messages, and tool_use/tool_result pairs.

`sdk-adapter.ts` resolves the context window for every request:

- `resolveContextWindowFromModel(modelId)` — delegates to the shared context-window resolver
  (OpenCode cache → ID-pattern heuristics → 200k default).
- `translateRequest()` — always fits when `contextWindow > 0`, using the explicit option if
  provided or falling back to a model-id lookup so no code path can silently skip fitting.
- `anthropic-proxy.ts` — `startProxy()` and `startProxyCatalog()` resolve `route.contextWindow`
  with the same fallback before passing it to `sdkTranslateRequest()`.

---

**See also:**
- [Request Lifecycle](request-lifecycle.md) — how the gateway fits into the full flow
- [Provider System](provider-system.md) — where provider configurations come from
- [Authentication](authentication.md) — credential handling
