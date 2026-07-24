# Anygate Repository Structure

```text
anygate/
├── src/                               # Backend CLI, Core Gateway Engine, & Server
│   ├── apps/                          # AI Application Integrations
│   │   ├── claude/                    # Claude Code CLI & Desktop launchers
│   │   ├── codex/                     # OpenAI Codex & ChatGPT App launchers
│   │   ├── gemini/                    # Google Gemini & Antigravity IDE launchers
│   │   └── shared/                    # Shared application utilities & helpers
│   ├── auth/                          # Authentication, PKCE, OAuth, & Keyring
│   ├── cli/                           # Command Line Interface Subcommands
│   ├── config/                        # Configuration Tokens, Paths, & Envs
│   ├── core/                          # Domain Abstractions & Contracts
│   │   ├── constants/                 # Immutable application constants
│   │   ├── errors/                    # Standardized error hierarchy
│   │   ├── events/                    # Event bus & lifecycle definitions
│   │   └── interfaces/                # Core domain types & abstractions
│   ├── engine/                        # Core Routing & Selection Engine
│   │   ├── context/                   # Context window & token fitting
│   │   ├── routing/                   # Route dispatchers & strategies
│   │   └── selection/                 # Model selection & fallback heuristics
│   ├── gateway/                       # API Gateway, Adapters, & HTTP Proxies
│   │   ├── adapters/                  # Wire format & provider adapters
│   │   ├── antigravity/               # Cloud Code / Antigravity gateway
│   │   ├── context/                   # Prompt & context assembly
│   │   ├── providers/                 # Language model provider factories
│   │   ├── proxy/                     # Anthropic & OpenAI HTTP proxies
│   │   ├── server/                    # Standalone gateway HTTP server & router
│   │   └── web-search/                # Web search tooling integrations
│   ├── launchers/                     # External process launchers & execution
│   ├── protocols/                     # Protocol Translations & Payloads
│   │   ├── anthropic/                 # Anthropic protocol wire format & SSE
│   │   ├── google/                    # Google / Gemini wire format translation
│   │   └── openai/                    # OpenAI Responses / Chat API translation
│   ├── providers/                     # Implementation Clients & Drivers
│   ├── registry/                      # Provider & Model Registry Subdomains
│   │   ├── data/                      # Bundled static model caches & data
│   │   ├── loader/                    # Registry loaders, importers, & materializer
│   │   ├── providers/                 # Per-provider definitions & metadata
│   │   ├── resolver/                  # ID normalization & resolution logic
│   │   ├── storage/                   # Registry CRUD, IO, & persistence
│   │   ├── sync/                      # Model catalog background refresh & sync
│   │   ├── templates/                 # Provider templates & model fetchers
│   │   └── validation/                # Credential & model schema validators
│   ├── services/                      # Cross-Cutting Shared Services
│   ├── shared/                        # Common Shared Helpers & Utilities
│   ├── storage/                       # Config Store, Keyring, & Cache
│   ├── types/                         # TypeScript Interface & Type Definitions
│   ├── ui/                            # Web App & Dashboard
│   │   └── app/                       # Svelte 5 / Vite UI Frontend Application
│   └── utils/                         # Pure Helper Functions & Utilities
├── tests/                             # Vitest Test Suites (Mirrors src/ architecture)
│   ├── apps/                          # Tests for AI application launchers & integrations
│   ├── auth/                          # Tests for authentication, PKCE, OAuth, & credentials
│   ├── cli/                           # Tests for CLI commands & argument parsing
│   ├── engine/                        # Tests for routing engine, selection, & targets
│   ├── gateway/                       # Tests for gateway servers, proxies, & SDK adapters
│   ├── helpers/                       # Test utilities & mock request/response helpers
│   ├── registry/                      # Tests for provider registry, templates, & sync
│   ├── services/                      # Tests for shared cross-cutting services
│   ├── storage/                       # Tests for preferences, credentials, & config
│   ├── ui/                            # Tests for UI API endpoints & dashboard server
│   └── web-search/                    # Tests for web search tools & providers
├── docs/                              # Project Documentation & Guides
└── dist/                              # Compiled ESM Output & CLI Entry Points
```

## Key Architectural Principles

1. **Clean Subdomain Separation**: Code logic is grouped into single-responsibility subdomains (e.g., `registry/` handles metadata resolution, `gateway/` handles HTTP request proxying and SDK transformation).
2. **Standardized Barrel Exports**: Core subdomains export their public surface via `index.ts` barrel files.
3. **Registry-First Provider Discovery**: Provider definitions and OAuth metadata live inside per-provider subdirectories under `src/registry/providers/`.
4. **Decoupled Gateway Protocol Adapters**: Protocol translation (Anthropic SSE, Vercel AI SDK, Vertex, Cloud Code) is encapsulated within dedicated adapters in `src/gateway/adapters/` and `src/protocols/`.
5. **Colocated UI**: The Svelte 5 web dashboard is located cleanly under `src/ui/app/`, avoiding root workspace clutter.
