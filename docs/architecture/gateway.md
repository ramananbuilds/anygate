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

---

**See also:**
- [Request Lifecycle](request-lifecycle.md) — how the gateway fits into the full flow
- [Provider System](provider-system.md) — where provider configurations come from
- [Authentication](authentication.md) — credential handling
