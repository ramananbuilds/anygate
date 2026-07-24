# Anygate Repository Structure

```text
anygate/
├── src/                                   # Backend CLI, Core Gateway Engine, & Server
│   ├── apps/                              # AI Application Integrations
│   │   ├── claude/                        # Claude Code CLI & Desktop launchers
│   │   │   └── index.ts
│   │   ├── codex/                         # OpenAI Codex & ChatGPT App launchers
│   │   │   ├── app-config.ts
│   │   │   ├── app-launch.ts
│   │   │   ├── app-routing.ts
│   │   │   ├── app-session.ts
│   │   │   ├── app-shutdown.ts
│   │   │   ├── catalog.ts
│   │   │   ├── command.ts
│   │   │   ├── favorites-catalog.ts
│   │   │   ├── favorites-launch.ts
│   │   │   ├── index.ts
│   │   │   ├── launch.ts
│   │   │   ├── proxy-identity.ts
│   │   │   ├── proxy.ts
│   │   │   ├── responses-adapter.ts
│   │   │   ├── session.ts
│   │   │   └── upstream-error.ts
│   │   ├── gemini/                        # Google Gemini & Antigravity IDE launchers
│   │   │   ├── backend-routes.ts
│   │   │   ├── index.ts
│   │   │   ├── proxy-provider-options.ts
│   │   │   └── proxy.ts
│   │   └── shared/                        # Shared application utilities & helpers
│   │       ├── ai-doc.ts
│   │       ├── cloud-code-backend.ts
│   │       ├── completions.ts
│   │       ├── context-model-id.ts
│   │       ├── context-window.ts
│   │       ├── favorites-picker.ts
│   │       ├── favorites-resolver.ts
│   │       ├── first-run.ts
│   │       ├── free-models.ts
│   │       ├── index.ts
│   │       ├── key-setup.ts
│   │       ├── launch-target.ts
│   │       ├── model-compatibility.ts
│   │       ├── native-launcher.ts
│   │       ├── prompts.ts
│   │       ├── reasoning-capabilities.ts
│   │       ├── self-update.ts
│   │       ├── target-compatibility.ts
│   │       ├── tool-search.ts
│   │       ├── trace-log.ts
│   │       ├── ui.ts
│   │       └── update-check.ts
│   ├── auth/                              # Authentication, PKCE, OAuth, & Keyring
│   │   ├── antigravity-oauth.ts
│   │   ├── callback-server.ts
│   │   ├── claude-code-identity.ts
│   │   ├── claude-code.ts
│   │   ├── claude-identity.ts
│   │   ├── github.ts
│   │   ├── openai.ts
│   │   ├── pkce.ts
│   │   ├── refresh-http.ts
│   │   ├── refresh.ts
│   │   ├── responses-websocket.ts
│   │   ├── types.ts
│   │   └── xai.ts
│   ├── cli/                               # Command Line Interface Subcommands
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
│   │   ├── providers-command.ts
│   │   ├── providers.ts
│   │   ├── server.ts
│   │   ├── ui.ts
│   │   └── update.ts
│   ├── cli.ts                             # CLI main entry point
│   ├── config/                            # Configuration Tokens, Paths, & Envs
│   │   ├── constants.ts
│   │   ├── defaults.ts
│   │   ├── env.ts
│   │   ├── features.ts
│   │   ├── index.ts
│   │   ├── paths.ts
│   │   └── versions.ts
│   ├── core/                              # Domain Abstractions & Contracts
│   │   ├── constants/
│   │   │   └── index.ts
│   │   ├── errors/
│   │   │   └── index.ts
│   │   ├── events/
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   └── interfaces/
│   │       └── index.ts
│   ├── engine/                            # Core Routing & Selection Engine
│   │   ├── context/
│   │   ├── index.ts
│   │   ├── routing/
│   │   │   ├── dispatcher.ts
│   │   │   ├── failover.ts
│   │   │   ├── health.ts
│   │   │   ├── middleware.ts
│   │   │   ├── pipeline.ts
│   │   │   ├── resolver.ts
│   │   │   ├── router.ts
│   │   │   └── strategy.ts
│   │   └── selection/
│   │       ├── launch-target.ts
│   │       ├── selector.ts
│   │       └── target-compatibility.ts
│   ├── gateway/                           # API Gateway, Adapters, & HTTP Proxies
│   │   ├── adapters/
│   │   │   ├── openai-adapter.ts
│   │   │   ├── sdk-adapter.ts
│   │   │   └── vertex.ts
│   │   ├── antigravity/
│   │   │   ├── anthropic-to-cloudcode.ts
│   │   │   ├── catalog.ts
│   │   │   ├── cloud-code-gateway.ts
│   │   │   ├── cloud-code-proxy.ts
│   │   │   ├── cloudcode-to-anthropic.ts
│   │   │   ├── ide-profile.ts
│   │   │   ├── launch-cli.ts
│   │   │   ├── launch-ide.ts
│   │   │   ├── launch-routes.ts
│   │   │   ├── request-adapter.ts
│   │   │   ├── response-adapter.ts
│   │   │   ├── slot-registry.ts
│   │   │   └── types.ts
│   │   ├── context/
│   │   │   ├── context-fit.ts
│   │   │   └── prompts.ts
│   │   ├── index.ts
│   │   ├── providers/
│   │   │   ├── provider-factory.ts
│   │   │   ├── provider-reasoning.ts
│   │   │   └── provider-select.ts
│   │   ├── proxy/
│   │   │   ├── anthropic-proxy.ts
│   │   │   ├── proxy-shared.ts
│   │   │   └── proxy-types.ts
│   │   ├── server/
│   │   │   ├── auth.ts
│   │   │   ├── catalog-filter.ts
│   │   │   ├── models.ts
│   │   │   ├── router.ts
│   │   │   ├── server.ts
│   │   │   └── vendor-mask.ts
│   │   └── web-search/
│   │       ├── brave.ts
│   │       ├── constants.ts
│   │       ├── duckduckgo.ts
│   │       ├── index.ts
│   │       ├── searxng.ts
│   │       ├── tavily.ts
│   │       ├── tool.ts
│   │       └── types.ts
│   ├── launchers/                         # External process launchers & execution
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
│   ├── protocols/                         # Protocol Translations & Payloads
│   │   ├── anthropic/
│   │   │   └── index.ts
│   │   ├── google/
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   └── openai/
│   │       └── index.ts
│   ├── providers/                         # Implementation Clients & Drivers
│   │   ├── anthropic.ts
│   │   ├── github.ts
│   │   ├── groq.ts
│   │   ├── index.ts
│   │   ├── mistral.ts
│   │   ├── nvidia.ts
│   │   ├── ollama.ts
│   │   ├── openai.ts
│   │   ├── opencode-serve.ts
│   │   ├── openrouter.ts
│   │   └── vertex.ts
│   ├── registry/                          # Provider & Model Registry Subdomains
│   │   ├── auth-broker.ts
│   │   ├── data/
│   │   │   ├── model-incompatible.json
│   │   │   ├── models-dev-cache.json
│   │   │   └── pricing-cache.json
│   │   ├── index.ts
│   │   ├── loader/
│   │   │   ├── data-loader.ts
│   │   │   ├── import-build.ts
│   │   │   ├── import-opencode.ts
│   │   │   ├── load.ts
│   │   │   └── materialize.ts
│   │   ├── model-source.ts
│   │   ├── models-dev.ts
│   │   ├── opencode-auth.ts
│   │   ├── pricing.ts
│   │   ├── provider-auth.ts
│   │   ├── provider-catalog.ts
│   │   ├── providers/
│   │   │   ├── anthropic/
│   │   │   │   └── index.ts
│   │   │   ├── google/
│   │   │   │   └── index.ts
│   │   │   ├── groq/
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── mistral/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── capabilities.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── limits.ts
│   │   │   │   ├── models.ts
│   │   │   │   ├── pricing.ts
│   │   │   │   └── provider.ts
│   │   │   ├── nvidia/
│   │   │   │   └── index.ts
│   │   │   ├── ollama/
│   │   │   │   └── index.ts
│   │   │   ├── openai/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── capabilities.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── limits.ts
│   │   │   │   ├── models.ts
│   │   │   │   ├── oauth-models.ts
│   │   │   │   ├── pricing.ts
│   │   │   │   └── provider.ts
│   │   │   ├── vertex/
│   │   │   │   └── index.ts
│   │   │   └── xai/
│   │   │       ├── auth.ts
│   │   │       ├── capabilities.ts
│   │   │       ├── index.ts
│   │   │       ├── limits.ts
│   │   │       ├── models.ts
│   │   │       ├── oauth-models.ts
│   │   │       ├── pricing.ts
│   │   │       └── provider.ts
│   │   ├── resolver/
│   │   │   ├── google-model-id.ts
│   │   │   └── resolve-template.ts
│   │   ├── storage/
│   │   │   ├── builtins.ts
│   │   │   ├── convert.ts
│   │   │   ├── crud.ts
│   │   │   ├── custom-endpoint.ts
│   │   │   └── io.ts
│   │   ├── sync/
│   │   │   ├── refresh-credentials.ts
│   │   │   └── refresh-models.ts
│   │   ├── templates/
│   │   │   ├── add-template.ts
│   │   │   ├── fetch-template-models.ts
│   │   │   └── provider-templates.ts
│   │   ├── types.ts
│   │   ├── upgrade.ts
│   │   └── validation/
│   │       ├── url-security.ts
│   │       ├── validate-import-key.ts
│   │       └── validate.ts
│   ├── services/                          # Cross-Cutting Shared Services
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
│   ├── shared/                            # Common Shared Helpers & Utilities
│   │   ├── errors.ts
│   │   ├── events.ts
│   │   ├── http.ts
│   │   ├── index.ts
│   │   ├── logger.ts
│   │   ├── prompts.ts
│   │   ├── redact.ts
│   │   ├── schemas.ts
│   │   └── validators.ts
│   ├── storage/                           # Config Store, Keyring, & Cache
│   │   ├── analytics.ts
│   │   ├── cache.ts
│   │   ├── config.ts
│   │   ├── credentials.ts
│   │   ├── favorites.ts
│   │   ├── history.ts
│   │   ├── index.ts
│   │   ├── logs.ts
│   │   └── sessions.ts
│   ├── types/                             # TypeScript Interface & Type Definitions
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── config.ts
│   │   ├── gateway.ts
│   │   ├── index.ts
│   │   ├── launch.ts
│   │   ├── model.ts
│   │   ├── provider.ts
│   │   └── registry.ts
│   ├── ui/                                # Web App & Dashboard Server
│   │   ├── api-types.ts
│   │   ├── api.ts
│   │   ├── app/                           # Svelte 5 / Vite UI Frontend Application
│   │   │   ├── app.css
│   │   │   ├── index.html
│   │   │   ├── package.json
│   │   │   ├── svelte.config.js
│   │   │   ├── tsconfig.json
│   │   │   ├── vite.config.ts
│   │   │   └── src/
│   │   │       ├── app.d.ts
│   │   │       ├── App.svelte
│   │   │       ├── main.ts
│   │   │       ├── lib/
│   │   │       │   ├── api/
│   │   │       │   │   ├── analytics.ts
│   │   │       │   │   ├── client.ts
│   │   │       │   │   ├── endpoints.ts
│   │   │       │   │   ├── mock.ts
│   │   │       │   │   └── types.ts
│   │   │       │   ├── components/
│   │   │       │   │   ├── apps/
│   │   │       │   │   │   └── AppCard.svelte
│   │   │       │   │   ├── CommandPalette.svelte
│   │   │       │   │   ├── dashboard/
│   │   │       │   │   │   ├── ActivityHeatmap.svelte
│   │   │       │   │   │   ├── ModelBreakdownList.svelte
│   │   │       │   │   │   ├── StatCard.svelte
│   │   │       │   │   │   ├── StatGrid.svelte
│   │   │       │   │   │   ├── TimeRangeFilter.svelte
│   │   │       │   │   │   └── TokenBarChart.svelte
│   │   │       │   │   ├── favorites/
│   │   │       │   │   │   ├── CapacityMeter.svelte
│   │   │       │   │   │   ├── FavoriteItem.svelte
│   │   │       │   │   │   └── FavoriteList.svelte
│   │   │       │   │   ├── health/
│   │   │       │   │   │   └── DoctorPanel.svelte
│   │   │       │   │   ├── layout/
│   │   │       │   │   │   ├── Sidebar.svelte
│   │   │       │   │   │   └── Topbar.svelte
│   │   │       │   │   ├── models/
│   │   │       │   │   │   ├── ModelBadges.svelte
│   │   │       │   │   │   ├── ModelDetailDrawer.svelte
│   │   │       │   │   │   ├── ModelFilters.svelte
│   │   │       │   │   │   └── ModelRow.svelte
│   │   │       │   │   ├── primitives/
│   │   │       │   │   │   ├── Badge.svelte
│   │   │       │   │   │   ├── Button.svelte
│   │   │       │   │   │   ├── Card.svelte
│   │   │       │   │   │   ├── Drawer.svelte
│   │   │       │   │   │   ├── EmptyState.svelte
│   │   │       │   │   │   ├── IconButton.svelte
│   │   │       │   │   │   ├── index.ts
│   │   │       │   │   │   ├── Input.svelte
│   │   │       │   │   │   ├── Modal.svelte
│   │   │       │   │   │   ├── Select.svelte
│   │   │       │   │   │   ├── Skeleton.svelte
│   │   │       │   │   │   ├── Spinner.svelte
│   │   │       │   │   │   ├── Tabs.svelte
│   │   │       │   │   │   ├── Toggle.svelte
│   │   │       │   │   │   └── Tooltip.svelte
│   │   │       │   │   ├── providers/
│   │   │       │   │   │   ├── DeleteConfirm.svelte
│   │   │       │   │   │   ├── ProviderCard.svelte
│   │   │       │   │   │   ├── ProviderForm.svelte
│   │   │       │   │   │   └── ProviderLogo.svelte
│   │   │       │   │   ├── server/
│   │   │       │   │   │   ├── ServerPanel.svelte
│   │   │       │   │   │   └── ServerStatusBadge.svelte
│   │   │       │   │   └── Toaster.svelte
│   │   │       │   ├── providers/
│   │   │       │   │   ├── modelFormat.ts
│   │   │       │   │   └── providerLogos.ts
│   │   │       │   └── stores/
│   │   │       │       ├── analytics.svelte.ts
│   │   │       │       ├── apps.svelte.ts
│   │   │       │       ├── config.svelte.ts
│   │   │       │       ├── favorites.svelte.ts
│   │   │       │       ├── health.svelte.ts
│   │   │       │       ├── presets.svelte.ts
│   │   │       │       ├── providers.svelte.ts
│   │   │       │       ├── router.svelte.ts
│   │   │       │       ├── server.svelte.ts
│   │   │       │       ├── theme.svelte.ts
│   │   │       │       └── ui.svelte.ts
│   │   │       ├── routes/
│   │   │       │   ├── Apps.svelte
│   │   │       │   ├── Dashboard.svelte
│   │   │       │   ├── Models.svelte
│   │   │       │   ├── Providers.svelte
│   │   │       │   ├── Server.svelte
│   │   │       │   ├── Settings.svelte
│   │   │       │   └── Tester.svelte
│   │   │       └── styles/
│   │   │           └── tokens.css
│   │   ├── command.ts
│   │   └── server-control.ts
│   ├── upstream-forward.ts
│   └── utils/                             # Pure Helper Functions & Utilities
│       ├── agent-io.ts
│       ├── array.ts
│       ├── crypto.ts
│       ├── files.ts
│       ├── http.ts
│       ├── index.ts
│       ├── json.ts
│       ├── network.ts
│       ├── paths.ts
│       ├── string.ts
│       └── time.ts
├── tests/                                 # Vitest Test Suite (Mirrors src/ architecture)
│   ├── apps/                              # Tests for AI application launchers & integrations
│   │   ├── ai-doc.test.ts
│   │   ├── antigravity-anthropic-to-cloudcode.test.ts
│   │   ├── antigravity-catalog.test.ts
│   │   ├── antigravity-cloud-code-proxy.test.ts
│   │   ├── antigravity-gateway.test.ts
│   │   ├── antigravity-ide-profile.test.ts
│   │   ├── antigravity-launch-args.test.ts
│   │   ├── antigravity-launch-cli.test.ts
│   │   ├── antigravity-launch-ide.test.ts
│   │   ├── antigravity-launch-routes.test.ts
│   │   ├── antigravity-request-adapter.test.ts
│   │   ├── antigravity-response-adapter.test.ts
│   │   ├── antigravity-slot-registry.test.ts
│   │   ├── claude-app-config.test.ts
│   │   ├── claude-app.test.ts
│   │   ├── claude-code-identity.test.ts
│   │   ├── cloud-code-backend.test.ts
│   │   ├── codex-app-config.test.ts
│   │   ├── codex-app-routing.test.ts
│   │   ├── codex-app-session.test.ts
│   │   ├── codex-app-shutdown.test.ts
│   │   ├── codex-catalog.test.ts
│   │   ├── codex-command.test.ts
│   │   ├── codex-favorites-catalog.test.ts
│   │   ├── codex-favorites-launch.test.ts
│   │   ├── codex-launch.test.ts
│   │   ├── codex-proxy-identity.test.ts
│   │   ├── codex-proxy.test.ts
│   │   ├── codex-responses-adapter.test.ts
│   │   ├── codex-session.test.ts
│   │   ├── codex-upstream-error.test.ts
│   │   ├── completions.test.ts
│   │   ├── context-model-id.test.ts
│   │   ├── context-window.test.ts
│   │   ├── favorites-picker.test.ts
│   │   ├── favorites-resolver.test.ts
│   │   ├── first-run.test.ts
│   │   ├── free-models.test.ts
│   │   ├── gemini-backend-routes.test.ts
│   │   ├── gemini-proxy-provider-options.test.ts
│   │   ├── gemini-proxy.test.ts
│   │   ├── model-compatibility.test.ts
│   │   ├── native-launcher.test.ts
│   │   ├── prompts.test.ts
│   │   ├── reasoning-capabilities.test.ts
│   │   ├── tool-search.test.ts
│   │   └── trace-log.test.ts
│   ├── auth/                              # Tests for authentication, PKCE, OAuth, & credentials
│   │   ├── debug-openai-oauth.test.ts
│   │   ├── debug-xai.test.ts
│   │   ├── oauth-claude-code.test.ts
│   │   ├── oauth-github.test.ts
│   │   ├── oauth-openai.test.ts
│   │   ├── oauth.test.ts
│   │   └── responses-websocket.test.ts
│   ├── cli/                               # Tests for CLI commands & argument parsing
│   │   ├── cli-update-check.test.ts
│   │   ├── cli.test.ts
│   │   ├── doctor.test.ts
│   │   ├── providers-command.test.ts
│   │   └── ui-command.test.ts
│   ├── engine/                            # Tests for routing engine, selection, & targets
│   │   ├── launch-target.test.ts
│   │   └── target-compatibility.test.ts
│   ├── gateway/                           # Tests for gateway servers, proxies, & SDK adapters
│   │   ├── context-fit.test.ts
│   │   ├── provider-factory.test.ts
│   │   ├── proxy-model-id-path.test.ts
│   │   ├── proxy-sdk-provider-id.test.ts
│   │   ├── proxy-shared.test.ts
│   │   ├── proxy.test.ts
│   │   ├── sdk-adapter-websearch.test.ts
│   │   ├── sdk-adapter.test.ts
│   │   ├── server-auth.test.ts
│   │   ├── server-catalog-filter.test.ts
│   │   ├── server-favorites-only.test.ts
│   │   ├── server-index.test.ts
│   │   ├── server-models.test.ts
│   │   ├── server-router.test.ts
│   │   ├── server-vendor-mask.test.ts
│   │   └── vertex-config.test.ts
│   ├── helpers/                           # Test utilities & mock request/response helpers
│   │   └── ui-api-test-utils.ts
│   ├── registry/                          # Tests for provider registry, templates, & sync
│   │   ├── catalog.test.ts
│   │   ├── fetch-template-models.test.ts
│   │   ├── google-model-id.test.ts
│   │   ├── import-opencode.test.ts
│   │   ├── input-types.test.ts
│   │   ├── model-source.test.ts
│   │   ├── models.test.ts
│   │   ├── opencode-auth.test.ts
│   │   ├── pricing.test.ts
│   │   ├── provider-auth.test.ts
│   │   ├── provider-catalog-display.test.ts
│   │   ├── provider-templates.test.ts
│   │   ├── providers.test.ts
│   │   ├── refresh-credentials.test.ts
│   │   ├── refresh-models.test.ts
│   │   ├── registry-add-template.test.ts
│   │   ├── registry-convert.test.ts
│   │   ├── registry-refresh-models.test.ts
│   │   ├── registry.test.ts
│   │   ├── resolve-template.test.ts
│   │   ├── url-security.test.ts
│   │   └── validate-import-key.test.ts
│   ├── services/                          # Tests for shared cross-cutting services
│   │   ├── analytics-log.test.ts
│   │   ├── cloudcode-usage.test.ts
│   │   ├── http-utils.test.ts
│   │   ├── launch.test.ts
│   │   ├── self-update.test.ts
│   │   ├── update-check.test.ts
│   │   └── upstream-forward.test.ts
│   ├── storage/                           # Tests for preferences, credentials, & config
│   │   ├── config.test.ts
│   │   ├── core-credentials.test.ts
│   │   ├── core-errors.test.ts
│   │   ├── env.test.ts
│   │   └── favorites.test.ts
│   ├── ui/                                # Tests for UI API endpoints & dashboard server
│   │   ├── api.test.ts
│   │   ├── ui-api-apps.test.ts
│   │   └── ui-api-server.test.ts
│   └── web-search/                        # Tests for web search tools & providers
│       ├── duckduckgo.test.ts
│       ├── searxng.test.ts
│       └── tool.test.ts
├── docs/                                  # Project Documentation & Guides
└── dist/                                  # Compiled ESM Output & CLI Entry Points
```

## Key Architectural Principles

1. **Clean Subdomain Separation**: Code logic is grouped into single-responsibility subdomains (e.g., `registry/` handles metadata resolution, `gateway/` handles HTTP request proxying and SDK transformation).
2. **Standardized Barrel Exports**: Core subdomains export their public surface via `index.ts` barrel files.
3. **Registry-First Provider Discovery**: Provider definitions and OAuth metadata live inside per-provider subdirectories under `src/registry/providers/`.
4. **Decoupled Gateway Protocol Adapters**: Protocol translation (Anthropic SSE, Vercel AI SDK, Vertex, Cloud Code) is encapsulated within dedicated adapters in `src/gateway/adapters/` and `src/protocols/`.
5. **Colocated UI**: The Svelte 5 web dashboard is located cleanly under `src/ui/app/`, avoiding root workspace clutter.
