# Component: Gateway (`src/gateway/`)

> HTTP proxies, SDK adapters, API server, Cloud Code gateway, and web search integration.

## Structure

```text
src/gateway/
├── adapters/
│   ├── sdk-adapter.ts          # Anthropic ↔ Vercel AI SDK translation (554 lines)
│   ├── openai-adapter.ts       # OpenAI format handling
│   └── vertex.ts               # Vertex AI adapter
├── antigravity/
│   ├── cloud-code-gateway.ts   # Cloud Code API server (631 lines)
│   ├── anthropic-to-cloudcode.ts  # Anthropic → Cloud Code request translation
│   ├── cloudcode-to-anthropic.ts  # Cloud Code → Anthropic response translation
│   ├── request-adapter.ts      # Cloud Code request normalization
│   ├── response-adapter.ts     # Response normalization
│   ├── slot-registry.ts        # Model slot management
│   ├── catalog.ts              # Antigravity model catalog building
│   ├── cloud-code-proxy.ts     # Cloud Code HTTP proxy
│   ├── ide-profile.ts          # IDE profile directory management
│   ├── launch-cli.ts           # Antigravity CLI launch
│   ├── launch-ide.ts           # Antigravity IDE/app launch
│   ├── launch-routes.ts        # Route building for Antigravity
│   ├── fixtures/               # Test fixtures
│   └── types.ts                # Cloud Code type definitions
├── context/
│   ├── context-fit.ts          # Token estimation & context window fitting
│   └── prompts.ts              # Server wizard prompts
├── providers/
│   ├── provider-factory.ts     # Dynamic SDK provider instantiation
│   ├── provider-reasoning.ts   # Reasoning-capability detection & wire-format mapping
│   ├── stream-sanitizer.ts     # SSE/JSON stream normalization (preserveThinking, tool-call IDs, null stripping)
│   └── provider-select.ts      # Server provider selection UI
├── proxy/
│   ├── anthropic-proxy.ts      # Local Anthropic HTTP proxy (540 lines)
│   ├── proxy-shared.ts         # SSE encoding, tool IDs, shared utils
│   └── proxy-types.ts          # Proxy type definitions
├── server/
│   ├── server.ts               # Gateway server wizard & lifecycle (579 lines)
│   ├── router.ts               # HTTP request routing (492 lines)
│   ├── auth.ts                 # API key validation
│   ├── models.ts               # Model catalog formatting
│   ├── vendor-mask.ts          # Discovery ID masking
│   └── catalog-filter.ts       # Provider/favorites/selection/free filtering
├── web-search/
│   ├── tool.ts                 # Web search tool factory
│   ├── duckduckgo.ts           # DuckDuckGo backend
│   ├── searxng.ts              # SearxNG backend
│   ├── brave.ts                # Brave Search backend
│   ├── tavily.ts               # Tavily backend
│   ├── constants.ts            # Max search steps
│   ├── types.ts                # Search result types
│   └── index.ts                # Backend selection
└── index.ts
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `startProxy()` | `proxy/anthropic-proxy.ts` | Start single-model proxy |
| `startProxyCatalog()` | `proxy/anthropic-proxy.ts` | Start multi-route favorites proxy |
| `sdkTranslateRequest()` | `adapters/sdk-adapter.ts` | Anthropic → SDK translation |
| `streamAnthropicResponse()` | `adapters/sdk-adapter.ts` | SDK → Anthropic SSE streaming |
| `createLanguageModel()` | `providers/provider-factory.ts` | Dynamic SDK provider import |
| `startServer()` | `server/router.ts` | Start gateway HTTP server |
| `runServerCommand()` | `server/server.ts` | Server wizard + lifecycle |

## Exposure filters

`server/catalog-filter.ts` narrows the model catalog the gateway serves. The
stages run in this order, and each one can empty the catalog:

1. **Providers** — only the exposed providers (`server.exposedProviders`).
2. **Selection** — only the ticked models (`server.exposedModels`, a list of
   `providerId:modelId` keys). An empty list means *every* model of the exposed
   providers, never "none".
3. **Favorites** — with `server.favoritesOnly`, only the models that are
   favorites (`providerId` + `modelId`). A favorite that is not ticked in the
   selection is dropped: served = ticked ∧ favorite.
4. **Free** — with `server.freeModelsOnly`, only the free models.

`src/ui/server-control.ts` reports which stage emptied the catalog, so the
message names the filter the user has to change instead of blaming the
selection that did match.

## Dependencies

- **Imports from**: `apps/shared/`, `config/`, `registry/`, `auth/`, `shared/`, `storage/`, `types/`
- **Imported by**: `apps/`, `cli/`, `ui/`

## Architecture Reference

See [Architecture: Gateway](../architecture/gateway.md)
