# Changelog

## 0.5.8 (2026-07-20)

### Non-interactive favorites launch (all app launchers)
- `anygate antigravity --favorites` (and the Antigravity IDE / `agy` CLI variants)
  now skip the provider picker and the "Launch from Antigravity CLI favorites"
  prompt, resolving the first available favorite as the boot model and serving the
  full multi-route catalog. Matches `anygate claude-app --favorites` behavior.
- `anygate codex-app --favorites` now skips the "Starting model?" picker and the
  "Confirm launch?" prompt when favorites exist, auto-selecting the first
  available favorite and going straight into the favorites catalog.
- Claude Desktop already launched directly on `--favorites`; behavior is now
  consistent across all three app launchers.
- The web UI "All favorites" launch mode (emits bare `--favorites`) now produces a
  true one-click launch for every supported app.

### Gateway-side web search
- Keyword search now works on every favorite at zero cost. Claude Desktop sends
  Anthropic's hosted `web_search_tool_20250305` (`server_tool`); on non-Anthropic
  favorites (Kilo / Mistral / Nemotron) the SDK adapter path used to drop any tool
  lacking `input_schema`, so the hosted search silently vanished and the model
  looped on empty results. anygate now intercepts that tool, executes the search
  itself, and feeds real results back to the model.
- Free by default. The default backend is keyless DuckDuckGo (HTML scrape, no new
  dependency). Optional free upgrade: self-hosted SearXNG (`ANYGATE_SEARXNG_URL`).
  Paid backends Brave / Tavily are supported as drop-in upgrades via
  `ANYGATE_SEARCH_API_KEY`.
- Implemented as a local Vercel AI SDK tool. `makeWebSearchTool(name)` preserves the
  exact incoming tool name so the model's `tool_call` still matches, and its
  `execute` runs `searchWeb()`. The SDK's built-in tool loop (`stopWhen:
  stepCountIs(n)`) performs the search, returns results to the model, and the model
  produces a final grounded answer.
- The intermediate `tool_use`/`tool_result` round-trip is hidden from the client.
  The stream writer skips blocks whose `toolName` equals the web-search tool, so
  Claude Desktop (which can't run a hosted tool itself) just receives the final
  answer with the search incorporated — no dangling `tool_use`. Non-web-search MCP
  tools behave exactly as before.
- Master kill switch + config. `ANYGATE_WEB_SEARCH` (`on`/`off`),
  `ANYGATE_WEB_SEARCH_PROVIDER`, `ANYGATE_SEARXNG_URL`, `ANYGATE_SEARCH_API_KEY`,
  `ANYGATE_WEB_SEARCH_MAX_RESULTS` (default 5). The Anthropic passthrough path is
  untouched — real Anthropic endpoints still run search natively.
- New module `src/gateway/web-search/` (`types`, `constants`, `index`, `tool`,
  `duckduckgo`, `searxng`, `brave`, `tavily`) + tests `tests/web-search/*` and
  `tests/sdk-adapter-websearch.test.ts`.
- Known limitations (documented, not blocking): the DuckDuckGo scrape is unofficial
  and may break if DDG changes its markup (SearXNG is the reliable-free path);
  Claude Desktop's native citation "chips" may not render (the answer text
  incorporates results + source URLs); the `cloud-code` (Antigravity) path is out of
  scope for now.

### Web UI — Model Tester
- New Model Tester page (`/tester`): pick a provider then a model, fire a live
  request at its real upstream endpoint, and see whether it responds plus connect
  time (socket + TLS + handshake), time-to-first-token (TTFT), total round-trip,
  derived tokens/sec, and stream stability.
- Runs server-side in `src/ui/api.ts` (`POST /api/models/test`) because the browser
  can't reach provider APIs directly (CORS + secret keys). The handler resolves
  credentials the same way the launch/refresh flows do, builds the anthropic
  (`/v1/messages`) or openai (`/chat/completions`) streaming request, and measures
  each latency phase with a 30s abort timeout. Returns a sample of the model's
  response + a remediation hint on failure.
- UI shows stat cards for Connect / TTFT / Total / Tokens-per-sec plus an animated
  SVG radial TTFT gauge, with distinct pass (green) / fail (red, with cause + fix) /
  empty / live states, reusing the existing `tokens.css` design tokens.

## 0.5.7 (2026-07-20)

This release makes the **favorites catalog** work end-to-end — in the CLI, in the
Claude Desktop app, **and now from the web UI** — and polishes the Apps & Launch
experience. Picking "⭐ Favorites Catalog" (or the UI's "All favorites" launch mode)
opens your agent with *every* saved favorite model routed through one anygate
gateway, so you can switch live from the in-app model menu.

### Web UI — launch the full favorites catalog
- The Apps & Launch launch modal now offers a clear **3-mode selector**:
  - **All favorites** — opens the app with every saved favorite routed through
    one anygate gateway (the full catalog, not just the first).
  - **One model** — launch with a single pre-selected provider/model.
  - **Just open** — launch the app with no model pre-set.
- The backend (`POST /api/apps/launch`) gains a `favoritesCatalog` flag that emits
  a bare `anygate <app> --favorites` (full catalog) instead of resolving to the
  first favorite. The legacy single-favorite path is kept.
- `AppCard` shows a "favorites ready" badge and a contextual launch CTA.
- The Dashboard "Apps & Launch" card is relabeled with a clarifying note.

### Claude Desktop favorites catalog (CLI)
- Favorites resolve from the same catalog/agent as the picker, so every saved
  favorite appears in the Claude Desktop model picker — including cloud-code
  (Antigravity) favorites, served through their dedicated backend and merged.
- `--favorites` now launches the catalog **directly** — no interactive provider
  picker. When favorites exist, `anygate claude-app --favorites` goes straight
  into the multi-route catalog launch.
- The provider prompt is now labeled for the correct agent (e.g. "Which provider
  for **Claude**?") instead of always saying "Codex".
- The provider picker now **defaults to "⭐ Favorites Catalog"** when favorites
  exist, instead of remembering the last single-provider selection.
- Duplicate registry models (e.g. `mistral-medium-2604`) are de-duplicated so the
  Claude Desktop picker shows the correct number of rows.
- Added `tests/claude-app.test.ts` asserting the full favorites catalog is served
  via the masked `/anthropic/v1/models` discovery payload.

## 0.5.6 (2026-07-19)

### Long-session context handling (Claude Desktop / Codex / Claude Code)
- **Models keep working when the context window fills.** New `fitContextWindow`
  trims the oldest conversation turns (preserving the system prompt, the most
  recent messages, and paired `tool_use`/`tool_result` blocks) so small-window
  upstreams like Nemotron 3 Ultra (131K) keep generating in long sessions instead
  of erroring out or freezing at zero tokens — the same resilience Antigravity
  gets from Gemini's large window, now available to the other agents.
- **Better streaming errors.** When an upstream fails mid-stream, the proxy now
  emits a proper Anthropic `error` SSE event instead of an empty stream, so the
  client shows the failure instead of appearing frozen.
- `translateRequest` now accepts `contextWindow` and clamps `max_output_tokens`
  to stay within the fitted window.

### Input-type / multimodal capability resolution
- New `resolveInputTypes` derives a concrete `['text']` / `['text','image']`
  capability per model from models.dev, with conservative family overrides for
  known-multimodal models that models.dev under-reports (e.g. NVIDIA Nemotron 3
  Ultra).
- Input types are advertised through the Anthropic model catalog
  (`input_types`), the gateway proxy `/v1/models` payload, `localModelToRoute`,
  and the Antigravity catalog (`supportsImages`), and exposed via the `anygate ui`
  models API.
- `aliasModelId` now sanitizes slashes, spaces, and parentheses in model ids so
  gateway-discovery aliases stay valid.

### UI
- Model list gains a click-to-open **detail drawer** (ModelDetailDrawer) showing
  capabilities, badges, and metadata; rows and filters updated to surface
  input-type badges.

### Internal
- Added `tests/context-fit.test.ts` and `tests/input-types.test.ts`.
- `AnthropicMsg` / `AnthropicBlock` exported from `sdk-adapter` for reuse.
- Proxy route lookup now logs not-found aliases / model ids via `quietErrorLog`.

## 0.5.5 (2026-07-19)

### Dashboard analytics fixes
- **Activity heatmap now reflects real usage only.** The per-day color intensity
  is bucketed by **daily token volume** (not raw request count), and every day
  with usage is guaranteed a visible color (level 1–4 scaled by volume relative
  to your busiest day). Unused days render as solid black squares — no more
  uniformly "highlighted" cubes.
- **Heatmap tooltips** now show token volume per day (e.g. `2026-07-18 · 211.8M tokens`).
- **Antigravity usage is counted and attributed.** The Cloud Code gateway logs
  token usage per request (app label `Antigravity`), so activity from the
  Antigravity app now appears in the dashboard instead of being invisible.
- **Model breakdown shows source-app badges.** Each model row displays the apps
  that contributed usage (`gateway`, `Antigravity`, …), and gateway + Antigravity
  entries for the same physical model are merged into one row.
- **Token volume chart** auto-scrolls to the most recent day on load so real
  usage is visible up front (no hidden scroll), with active days highlighted.
- Real-data-only dashboard: the mock fallback was removed; the store shows an
  "Offline" badge if the analytics API is unreachable rather than fake numbers.
- `B` (billion) token formatting appears automatically once combined totals
  cross 1e9 tokens.

### Internal
- `HeatDay.count` now carries the day's token total (drives color + tooltip).
- Gateway model-id normalization so Antigravity and gateway entries for the same
  model converge in the breakdown.
- Added test isolation for the Antigravity gateway tests (throwaway temp dir)
  so they no longer pollute the real `~/.anygate/analytics.jsonl`.
