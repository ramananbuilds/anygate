# 05 — Workflows

End-to-end user flows a model triggers through anygate. The "how it feels to use this"
companion to [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) and [04_DATA_FLOW.md](./04_DATA_FLOW.md).

---

## 1. First run (`anygate claude`)

1. `cli.ts` parses args; no command → help, but `claude` dispatches the inline wizard.
2. `findClaudeBinary()` ([launch.ts](../src/launch.ts)) locates the Claude Code binary.
3. `resolveOrCollectApiKey()` ([key-setup.ts](../src/key-setup.ts)) silently checks the
   OS keychain — if a key is found the prompt is skipped entirely.
4. `fetchProviderCatalog()` ([provider-catalog.ts](../src/provider-catalog.ts)) resolves the
   **registry-first** provider list (no OpenCode binary required).
5. If no providers/config exist, `runFirstRunWizard()` ([first-run.ts](../src/first-run.ts))
   collects an OpenCode API key (optional) and a subscription tier.
6. The model picker ([prompts.ts](../src/prompts.ts)) shows recent models per provider,
   search for lists > 25, and paginated browse (15/page).
7. `buildChildEnv()` ([env.ts](../src/env.ts)) strips 17 conflicting env vars and sets the
   `ANTHROPIC_*` trio + `--model`.
8. A local proxy ([proxy.ts](../src/proxy.ts)) is started if the model needs SDK translation.
9. `launchClaude()` spawns the agent with `stdio:inherit`. The proxy closes on exit.

---

## 2. Favorites mode (`anygate models`)

- `anygate models` opens an interactive favorites manager ([favorites.ts](../src/favorites.ts))
  reading/writing `favoriteModels` in config. Saves once on Done.
- On launch, if `favoriteModels.length > 0`, anygate enters favorites mode and builds a
  multi-route catalog ([catalog.ts](../src/catalog.ts)) — starting model + favorites, max 20.
- A single multi-route proxy (`startProxyCatalog`) serves `GET /v1/models` so the agent's
  status bar shows accurate remaining context and `/model` switches live.
- Stale favorites (unavailable models) are silently skipped.
- In Codex, favorites use `startCodexProxy(routes, { requireAuth: true })` and slugs
  `${providerId}__${modelId}` (CLI) or `codexAppModelSlug(modelId)` (App).

---

## 3. Provider management (`anygate providers`)

```
anygate providers add <template>   # built-in SDK-backed template
anygate providers add custom        # custom OpenAI/Anthropic-compatible endpoint
anygate providers import            # one-time OpenCode migration
anygate providers auth <id>         # OAuth device-code flow
anygate providers refresh-models    # refresh cached catalogs
anygate providers list              # show configured providers
```

- Config lives in `~/.anygate/providers.json` (no secrets); secrets live in the OS keychain.
- `fetchProviderCatalog()` is registry-first; OpenCode is no longer the source of truth.
- OAuth device-code flows for `github-copilot`, `openai-oauth`, `xai-oauth`, and
  `antigravity-oauth` live in [src/oauth/](../src/oauth).

---

## 4. Server / gateway mode (`anygate server`)

1. `runServerCommand()` ([server/index.ts](../src/server/index.ts)) starts a foreground
   gateway on port **17645**.
2. `loadServerModels()` converts registry providers to `ServerModelInfo[]`.
3. The router ([server/router.ts](../src/server/router.ts)) forwards Anthropic-format to
   `{baseUrl}/v1/messages` and SDK-adapts OpenAI-format.
4. The server wizard filters exposed providers, masks discovery ids, and toggles
   favorites-only / local-vs-network listen.
5. `GET /models` strips `apiKey`; `GET /health` reports status.
6. `anygate server --vertex` enables the Google Vertex AI gateway using gcloud ADC.

The **same gateway** runs in-process in `anygate ui`'s Server tab
([ui/server-control.ts](../src/ui/server-control.ts)) — no child process, stops when the UI exits.

---

## 5. Visual launcher (`anygate ui`)

1. `ui-command.ts` boots a small Node HTTP server ([ui.ts](../src/ui.ts)) serving
   [ui/public](../src/ui/public) (index.html, app.js, style.css) + a JSON API
   ([ui/api.ts](../src/ui/api.ts)).
2. App launcher cards (one per tool) let you pick a provider + model before launching.
3. Selecting provider/model passes `--provider`/`--model` straight to the terminal command,
   bypassing the interactive picker.
4. The Server tab manages the in-process gateway with live URLs, the API key, the model
   catalog, and a one-click Stop.

---

## 6. Headless / agent mode (`anygate --ai`)

- `anygate --ai` prints a comprehensive agent reference ([ai-doc.ts](../src/ai-doc.ts))
  for automated agents; `--install` writes a `SKILL.md` into agent skill directories.
- Boot flags `--provider`/`--model` drive non-interactive launches; stdout uses clean
  NDJSON/JSONL when agent mode is detected ([agent-io.ts](../src/agent-io.ts)).

---

## 7. Antigravity gateway flow

1. `anygate agy` / `antigravity` / `antigravity-ide` starts a local fake Cloud Code API
   ([antigravity/cloud-code-gateway.ts](../src/antigravity/cloud-code-gateway.ts)).
2. Antigravity routes through anygate instead of Google's real backend.
3. `request-adapter.ts` converts Cloud Code `generateContent` → SDK params; `response-adapter.ts`
   converts the SDK stream → Cloud Code SSE.
4. `normalizeFunctionCallArgs` un-stringifies MCP tool-call args.
5. **Use a throwaway Google account** — see [docs/ANTIGRAVITY.md](../docs/ANTIGRAVITY.md).
