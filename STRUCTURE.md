# Anygate Repository Structure

```
anygate/
├── src/                               # Backend CLI, Core Gateway Engine, & Server
│   ├── apps/                          # AI Application Integrations
│   │   ├── claude/                    # Claude Code CLI & Desktop launchers
│   │   │   ├── desktop-launch.ts
│   │   │   ├── desktop.ts
│   │   │   └── favorites-picker.ts
│   │   ├── codex/                     # OpenAI Codex & ChatGPT App launchers
│   │   │   ├── app-launch.ts
│   │   │   ├── app.ts
│   │   │   ├── cli.ts
│   │   │   └── routing.ts
│   │   ├── gemini/                    # Google Gemini & Antigravity IDE launchers
│   │   │   ├── antigravity.ts
│   │   │   └── cli.ts
│   │   └── shared/                    # Shared app utilities
│   │       ├── ai-doc.ts
│   │       ├── binary-lookup.ts
│   │       ├── cloud-code-backend.ts
│   │       ├── completions.ts
│   │       ├── context-model-id.ts
│   │       ├── context-window.ts
│   │       ├── favorites-resolver.ts
│   │       ├── first-run.ts
│   │       ├── free-models.ts
│   │       ├── key-setup.ts
│   │       ├── model-compatibility.ts
│   │       ├── model-search.ts
│   │       ├── prompts.ts
│   │       ├── reasoning-capabilities.ts
│   │       ├── tool-search.ts
│   │       ├── trace-log.ts
│   │       └── ui.ts
│   ├── auth/                          # Authentication, PKCE, OAuth, & Keyring
│   │   ├── github.ts
│   │   ├── index.ts
│   │   ├── openai.ts
│   │   ├── responses-websocket.ts
│   │   └── xai.ts
│   ├── cli/                           # Command Line Interface Subcommands
│   │   ├── antigravity.ts
│   │   ├── claude-app.ts
│   │   ├── claude.ts
│   │   ├── codex-app.ts
│   │   ├── codex.ts
│   │   ├── completions.ts
│   │   ├── doctor.ts
│   │   ├── gemini.ts
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── providers.ts
│   │   ├── server.ts
│   │   ├── ui.ts
│   │   └── update.ts
│   ├── config/                        # Configuration Tokens, Paths, & Envs
│   │   ├── constants.ts
│   │   ├── defaults.ts
│   │   ├── env.ts
│   │   ├── features.ts
│   │   ├── index.ts
│   │   ├── paths.ts
│   │   └── versions.ts
│   ├── data/                          # Shared OAuth & Model Definitions
│   │   ├── openai-oauth-models.ts
│   │   └── xai-oauth-models.ts
│   ├── engine/                        # Core Routing & Selection Engine
│   │   ├── dispatcher.ts
│   │   ├── failover.ts
│   │   ├── health.ts
│   │   ├── index.ts
│   │   ├── launch-target.ts
│   │   ├── middleware.ts
│   │   ├── pipeline.ts
│   │   ├── resolver.ts
│   │   ├── router.ts
│   │   ├── selector.ts
│   │   ├── strategy.ts
│   │   └── target-compatibility.ts
│   ├── gateway/                       # API Gateway, Adapters, & HTTP Proxies
│   │   ├── anthropic-proxy.ts
│   │   ├── antigravity/
│   │   │   ├── catalog.ts
│   │   │   ├── cloud-code-gateway.ts
│   │   │   ├── launch-cli.ts
│   │   │   ├── launch-ide.ts
│   │   │   └── launch-routes.ts
│   │   ├── auth.ts
│   │   ├── catalog-filter.ts
│   │   ├── context-fit.ts
│   │   ├── models.ts
│   │   ├── openai-adapter.ts
│   │   ├── prompts.ts
│   │   ├── provider-factory.ts
│   │   ├── provider-reasoning.ts
│   │   ├── provider-select.ts
│   │   ├── proxy-shared.ts
│   │   ├── proxy-types.ts
│   │   ├── router.ts
│   │   ├── sdk-adapter.ts
│   │   ├── server.ts
│   │   ├── vendor-mask.ts
│   │   ├── vertex.ts
│   │   └── web-search/
│   │       ├── duckduckgo.ts
│   │       ├── searxng.ts
│   │       ├── tool.ts
│   │       └── types.ts
│   ├── launchers/                     # Cross-Platform Application Launchers
│   │   ├── app-launcher.ts
│   │   ├── desktop.ts
│   │   ├── index.ts
│   │   ├── launch.ts
│   │   ├── linux.ts
│   │   ├── macos.ts
│   │   ├── native-launcher.ts
│   │   ├── shared.ts
│   │   ├── terminal.ts
│   │   └── windows.ts
│   ├── providers/                     # Direct Provider Implementation Modules
│   │   ├── anthropic.ts
│   │   ├── command.ts
│   │   ├── github.ts
│   │   ├── groq.ts
│   │   ├── index.ts
│   │   ├── mistral.ts
│   │   ├── nvidia.ts
│   │   ├── ollama.ts
│   │   ├── opencode-serve.ts
│   │   ├── openai.ts
│   │   ├── openrouter.ts
│   │   ├── provider-catalog.ts
│   │   ├── provider-templates.ts
│   │   └── vertex.ts
│   ├── registry/                      # Provider & Model Registry Data & Resolvers
│   │   ├── add-template.ts
│   │   ├── auth-broker.ts
│   │   ├── builtins.ts
│   │   ├── convert.ts
│   │   ├── crud.ts
│   │   ├── custom-endpoint.ts
│   │   ├── data/
│   │   │   ├── providers/
│   │   │   │   ├── go.json
│   │   │   │   └── zen.json
│   │   │   └── templates/
│   │   │       └── [30+ JSON provider templates]
│   │   ├── data-loader.ts
│   │   ├── fetch-template-models.ts
│   │   ├── google-model-id.ts
│   │   ├── import-build.ts
│   │   ├── import-opencode.ts
│   │   ├── index.ts
│   │   ├── io.ts
│   │   ├── load.ts
│   │   ├── materialize.ts
│   │   ├── model-source.ts
│   │   ├── models-dev.ts
│   │   ├── opencode-auth.ts
│   │   ├── pricing.ts
│   │   ├── provider-auth.ts
│   │   ├── providers/
│   │   │   ├── index.ts
│   │   │   ├── mistral/
│   │   │   │   └── index.ts
│   │   │   ├── nvidia/
│   │   │   │   └── index.ts
│   │   │   └── openai/
│   │   │       ├── auth.ts
│   │   │       ├── capabilities.ts
│   │   │       ├── index.ts
│   │   │       ├── limits.ts
│   │   │       ├── models.ts
│   │   │       ├── pricing.ts
│   │   │       └── provider.ts
│   │   ├── refresh-credentials.ts
│   │   ├── refresh-models.ts
│   │   ├── resolve-template.ts
│   │   ├── types.ts
│   │   ├── upgrade.ts
│   │   ├── url-security.ts
│   │   ├── validate-import-key.ts
│   │   └── validate.ts
│   ├── services/                      # Shared Business Logic & Background Services
│   │   ├── analytics.ts
│   │   ├── doctor.ts
│   │   ├── downloads.ts
│   │   ├── favorites.ts
│   │   ├── index.ts
│   │   ├── model-sync.ts
│   │   ├── provider-health.ts
│   │   ├── self-update.ts
│   │   ├── update-check.ts
│   │   └── updates.ts
│   ├── shared/                        # Shared Reusable Utility Modules
│   │   ├── errors.ts
│   │   ├── events.ts
│   │   ├── http.ts
│   │   ├── index.ts
│   │   ├── logger.ts
│   │   ├── prompts.ts
│   │   ├── redact.ts
│   │   ├── schemas.ts
│   │   └── validators.ts
│   ├── storage/                       # Config, Cache, Session, & Log Storage
│   │   ├── analytics.ts
│   │   ├── cache.ts
│   │   ├── config.ts
│   │   ├── credentials.ts
│   │   ├── favorites.ts
│   │   ├── history.ts
│   │   ├── index.ts
│   │   ├── logs.ts
│   │   └── sessions.ts
│   ├── types/                         # Shared Domain TypeScript Definitions
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── config.ts
│   │   ├── gateway.ts
│   │   ├── index.ts
│   │   ├── launch.ts
│   │   ├── model.ts
│   │   ├── provider.ts
│   │   └── registry.ts
│   ├── ui/                            # Embedded UI Gateway API Server
│   │   ├── api-types.ts
│   │   ├── api.ts
│   │   ├── command.ts
│   │   └── server-control.ts
│   ├── cli.ts                         # Main CLI Entry Point
│   └── upstream-forward.ts             # Upstream HTTP Forwarder
├── ui/                                # Web Dashboard Frontend (Svelte + Vite)
│   ├── public/                        # Static UI Assets & Icons
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/            # UI Components (Apps, Models, Providers, Primitives, Server)
│   │   │   │   ├── apps/
│   │   │   │   │   ├── AppCard.svelte
│   │   │   │   │   └── LaunchModal.svelte
│   │   │   │   ├── models/
│   │   │   │   │   ├── ModelBadges.svelte
│   │   │   │   │   ├── ModelDetailDrawer.svelte
│   │   │   │   │   ├── ModelFilters.svelte
│   │   │   │   │   └── ModelRow.svelte
│   │   │   │   ├── primitives/
│   │   │   │   │   ├── Badge.svelte
│   │   │   │   │   ├── Button.svelte
│   │   │   │   │   ├── Card.svelte
│   │   │   │   │   ├── Drawer.svelte
│   │   │   │   │   ├── Modal.svelte
│   │   │   │   │   ├── Select.svelte
│   │   │   │   │   └── Tabs.svelte
│   │   │   │   ├── providers/
│   │   │   │   │   ├── ProviderCard.svelte
│   │   │   │   │   ├── ProviderForm.svelte
│   │   │   │   │   └── ProviderLogo.svelte
│   │   │   │   └── server/
│   │   │   │       ├── ServerPanel.svelte
│   │   │   │       └── ServerStatusBadge.svelte
│   │   │   ├── providers/             # UI Logos & Model Formatting
│   │   │   ├── stores/                # Reactive State (Apps, Config, Favorites, Server, UI, Theme)
│   │   │   └── Topbar.svelte
│   │   ├── routes/                    # SPA Page Views
│   │   │   ├── Apps.svelte
│   │   │   ├── Dashboard.svelte
│   │   │   ├── Models.svelte
│   │   │   ├── Providers.svelte
│   │   │   ├── Server.svelte
│   │   │   ├── Settings.svelte
│   │   │   └── Tester.svelte
│   │   ├── styles/
│   │   │   └── tokens.css
│   │   ├── App.svelte                 # Main SPA Layout
│   │   └── main.ts                    # UI Application Entry
│   ├── index.html
│   ├── package.json
│   ├── svelte.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── tests/                             # Vitest Test Suite (117 test files)
│   ├── ai-doc.test.ts
│   ├── analytics-log.test.ts
│   ├── antigravity-gateway.test.ts
│   ├── antigravity-launch-ide.test.ts
│   ├── catalog.test.ts
│   ├── claude-app.test.ts
│   ├── cli.test.ts
│   ├── codex-app.test.ts
│   ├── codex-proxy.test.ts
│   ├── config.test.ts
│   ├── doctor.test.ts
│   ├── env.test.ts
│   ├── favorites.test.ts
│   ├── launch-target.test.ts
│   ├── launch.test.ts
│   ├── model-compatibility.test.ts
│   ├── models.test.ts
│   ├── native-launcher.test.ts
│   ├── oauth.test.ts
│   ├── provider-factory.test.ts
│   ├── providers.test.ts
│   ├── proxy.test.ts
│   ├── registry.test.ts
│   ├── sdk-adapter.test.ts
│   ├── self-update.test.ts
│   ├── server-index.test.ts
│   ├── server-router.test.ts
│   ├── target-compatibility.test.ts
│   ├── ui-api-apps.test.ts
│   ├── ui-api-server.test.ts
│   ├── update-check.test.ts
│   └── ...
├── package.json                       # Workspace Configuration & Dependencies
├── tsconfig.json                      # Root TypeScript Config
├── tsup.config.ts                     # Tsup Build Config (dist/cli.js)
└── vitest.config.ts                   # Vitest Runner Config
```
