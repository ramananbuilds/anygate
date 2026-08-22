# anygate v1.0 — Product & Engineering Roadmap

**Date:** 2026-08-22 · **Status:** Proposal · **Baseline:** v0.6.2 (734 source files, ~43K LOC, Svelte 5 dashboard)
**Companion doc:** `CODEBASE_REVIEW.md` (audit findings referenced as C1–C5, H1–H6, M1–M9)

---

## What "1.0" should mean for anygate

0.x says "works on my machine, expect churn." **1.0 is a stability + trust contract:**

1. **Cost-safe by default** — users can hand the gateway an agent session and trust it won't silently burn credits (audit C4/C5 fixes are prerequisites, already in flight).
2. **Resilient routing** — provider hiccups degrade gracefully instead of killing sessions (H3/H4).
3. **Install-and-it-just-works** — fresh clone builds, every supported platform tested in CI (C1).
4. **A catalog you can browse like a store** — pricing, context windows, capabilities visible before you commit.
5. **Semantic-versioned public interface** — CLI flags, `server` API routes, and `config.json` schema become committed contracts with deprecation policy.

The bar for 1.0 is *not* more features — it's making the existing breadth reliable and legible. Everything below is prioritized against that lens.

---

## 1. Command / CLI improvements

### 1.1 New high-value commands

| Command | Purpose | Why it earns 1.0 |
|---|---|---|
| `anygate spend` | Show today/month token+cost burn per provider/app/model; `--since`, `--json`, `--watch` | Completes the budget story (C5): enforcement without visibility is a black box. Data already exists in `analytics.jsonl`; add cost via models-dev pricing |
| `anygate doctor --fix` | Auto-repair what diagnostics find (port conflict → suggest `--port`, env conflicts → print exact unset lines, stale locks → remove) | Doctor today (Node/keyring/key/port/env) is read-only; the #1 support burden is manual repair |
| `anygate server status` | Detect + report a running gateway (port, PID, uptime, listen mode, request count) | Currently the gateway is a foreground black box; pairs with the `/api/ping` work from the recent lock-fix release |
| `anygate logs [--trace] [--tail]` | Open/redact/tail the trace log safely | Debug logs exist (`writeSecureLogLine`) but users must know the path and risk unredacted reads |
| `anygate models compare <a> <b>` | Side-by-side: price in/out, context window, reasoning levels, free/paid | The data is all in `models-dev-cache.json` already; makes model choice informed at decision time |

### 1.2 Improvements to existing commands

- **`anygate server`:**
  - `--port <n>` flag (fixed 17645 is a real multi-instance blocker — audit M8); auto-fallback +1 if taken, with clear message.
  - `--yes` non-interactive mode that accepts all saved defaults (headless/systemd story).
  - Startup banner shows **active budget status** ("Budget: 12.4k/500k tokens today") when enabled.
- **`anygate providers`:**
  - `providers test [id]` — fire a 16-token completion at each/all providers, print latency + OK/error table (reuses the UI Tester logic in `src/ui/api.ts handleTestModel`).
  - `providers rename` / `providers set-url` — editing today = delete + re-add, losing keys.
  - Key rotation hint when a stored key returns 401 twice.
- **`anygate claude` / `codex` / `gemini`:**
  - `--list-models` flag: print the resolved catalog as NDJSON without launching (agents/scripts).
  - `--last` flag: relaunch last provider/model combo instantly (preference memory exists; expose it).
  - Consistent exit codes across all launchers (document: 0 ok, 1 user cancel, 2 config error, 3 upstream error) — required for the AI-agent contract in `docs/AI-AGENTS.md`.
- **Global:** `ANYGATE_PROFILE=<name>` env to namespace `~/.anygate` entirely — parallel work/personal setups without clobbering (huge for testing pre-release versions).

### 1.3 Command UX polish

- All long operations (catalog refresh, model sync, keyring ops) get cancellable spinners with elapsed time — `@clack/prompts` supports this; several paths still block silently.
- Every wizard remembers *and shows* what it will reuse ("Using saved password from Windows Credential Manager ✓").
- `anygate help <command>` deep-link form (currently only top-level help).

---

## 2. UI improvements (`anygate ui`)

### 2.1 Trust layer: Budget & Spend page (new route)

The single most important 1.0 UI addition, built directly on the C5 BudgetTracker + C4 usage fix:

- **Spend header widget on Dashboard:** tokens + estimated $ today/month, burn-rate sparkline, "X% of daily budget" ring.
- **Budget management card in Settings:** enable/disable, daily/monthly caps, current-period progress bars, reset button. (API: extend `/api/config` GET/POST.)
- **Live event feed:** `/api/events` SSE already streams usage events — render a compact live tail ("groq · llama-4 · 2.1k tok · $0.0003") so users *see* the gateway working.
- **Near-limit toast + banner:** warn at 80%/100% of budget in-app (and optionally desktop notification).

### 2.2 Provider catalog experience

Current state (from `Providers.svelte`, `ProviderCard/Form.svelte`): functional cards + add form + delete confirm + OAuth flow, but rough edges that matter:

- **Replace `prompt()` for API keys** (`Providers.svelte onAddKey`) with a proper masked Input modal — native browser prompts break the design system, can't paste-validate, and are logged by some password managers.
- **Provider health badges:** green/yellow/red dot per provider driven by `services/provider-health.ts` once wired (audit H4) + last-checked timestamp + "Test now" button (calls the same handler as `providers test` CLI).
- **Catalog browsing upgrade (Models route):**
  - Price column with sortable $/Mtok in/out (data exists in `model.cost` — currently only shown buried in ModelDetailDrawer).
  - Filters: Free only (exists), Reasoning-capable, Context ≥ N, Provider, Max price slider.
  - **Capability icons** on rows: vision 👁 / tools 🔧 / reasoning 🧠 / caching ⚡ — all derivable from registry metadata (`reasoning`, `supportedParameters`, `contextWindow`).
- **OAuth polish:** device-code flows show countdown + paste-code box inline (polling exists; presentation needs care), and a persistent "connected ✓" state per provider.

### 2.3 Dashboard depth

- **Cost view toggle** next to token counts everywhere (tokens hide the difference between free Groq and paid OpenAI).
- **Per-provider stacked area chart** over time (ModelBreakdownList exists for models; apps get AppBreakdown — providers are the missing cut).
- **Session count sanity:** "sessions" metric derives from gaps; document or replace with explicit session markers recorded by launchers.
- **Export button:** CSV/JSON of the filtered range (privacy-friendly local analytics deserve local export).

### 2.4 Server page hardening

`Server.svelte` is a thin wrapper today. For 1.0: show live request counter + rate-limit state, active budget bar, connected-client list (by IP, from socket state), and graceful Stop that drains SSE streams (ties to audit Low finding).

### 2.5 Shell/UX fundamentals

- Keyboard-first: CommandPalette exists — give it ⌘K global binding + actions for every route transition and common task (add provider, start server, test model).
- Empty states with one-click next actions (EmptyState primitive exists; wire real CTAs: "No providers yet → Add", "No favorites → Browse models").
- Dark/light theme persistence exists; add **system-follow** option.
- Accessibility pass: focus traps in Drawer/Modal, aria-labels on icon buttons, contrast on muted text.

---

## 3. Provider catalog improvements (registry/data layer)

### 3.1 Catalog quality

- **Pricing freshness pipeline:** `models-dev-cache.json` (2.2MB snapshot) powers `isFree`/cost — add `refresh:models-dev` to CI monthly + staleness warning in `doctor` ("pricing snapshot is 47 days old").
- **Per-provider model sync verification:** `providers refresh-models` exists — add drift detection that flags catalog entries whose listed model 404s on refresh, and auto-quarantines dead models into a `deprecatedModels` section instead of silently keeping them.
- **Template coverage review:** 30 templates ship (`src/registry/data/templates/`). Audit each against current upstream APIs quarterly; add missing major aggregators. Each template gains `docsUrl` + `statusPageUrl` fields surfaced in UI error messages ("Groq returned 401 — check key · status.groq.com").

### 3.2 Routing smarts (builds on audit H4 wiring)

- **Explicit failover chains:** `providers.json` gains optional `"fallback": ["groq/free", "mistral"]` per favorite — on 429/5xx-before-first-byte, try next; emit `anthropic-warning`.
- **Capability-aware suggestions:** when a picked model lacks tool support but the client sends tools, warn *before* dispatch (registry knows capabilities; today it fails upstream mid-session).
- **Latency-based default ordering:** remember measured latencies (provider-health) and offer "fastest healthy free model" as first picker option.

### 3.3 Cost intelligence

- Central `estimateCost(model, usage)` helper (input/output/cache rates × tokens) used by: analytics aggregation, `spend` command, budget warnings, dashboard widgets. One implementation, four surfaces.
- Cache-token accounting: Anthropic/OpenAI return cache_read/cache_write tokens — capture them in usage events (they're often 90% of real cost).

---

## 4. Functional / platform improvements

### 4.1 Reliability (the audit items that are also features)

Already dispatched to the fix agent — restated as v1 scope: bounded body reads (C2), timeouts + disconnect aborts (H3), retry/backoff + health circuit-breaker (H4), passthrough usage accounting (C4), budgets (C5), timing-safe auth (H1), rate-limit keying (H2).

### 4.2 Observability

- Structured request log (NDJSON, redacted, rotating): method, route, model, latency, tokens, outcome. Powers `logs`, dashboard live feed, and postmortems.
- `/health` upgrades: include version, uptime, budget state, provider-health summary (still cheap/no-auth).

### 4.3 Platform & distribution

- **Windows CI leg** (ubuntu-only today): path separators, keyring quirks, and the C3-class permission assumptions justify it permanently.
- **Coverage thresholds** on gateway/server/storage packages (≥80% lines) — the packages where regressions cost users money.
- **Smoke-test script** `scripts/smoke.mjs`: boots server on throwaway port + fake key env, exercises /models + one mocked messages call + budget 429 path; run in CI and before publishing. This is the release gate that would have caught C1/C4.

### 4.4 Docs for 1.0

- Versioned config schema doc (`~/.anygate/config.json` every key, who writes it, safe-to-edit).
- "Security model" page: what's stored where, keyring vs fallback, network-mode threat model, what redaction covers.
- Update `docs/API_SERVER.md` with budget headers/errors and the warning-header convention from H5.

---

## 5. Explicitly NOT in 1.0 (guard against scope creep)

- **Multi-user/team features, remote dashboards, hosted control plane** — anygate's identity is *local-first*; cloud sync is a 2.x conversation.
- **Response caching / semantic cache** — correctness risks (tool calls, streaming) outweigh savings for interactive coding traffic.
- **New app targets** (Windsurf, Cursor, etc.) — breadth is already ahead of hardening; 1.0 deepens, not widens.
- **Plugin/third-party template marketplace** — supply-chain surface with no vetting infra yet.
- **Prompt-library features** — adjacent product, not gateway.

---

## 6. Suggested sequencing

| Milestone | Theme | Items |
|---|---|---|
| **v0.7** | Safety net shipped | Audit fixes (agent running now) + `spend` command + budget card in Settings + smoke-test script |
| **v0.8** | Resilient routing | Health wiring + retries/failover chains + `server status`/`--port` + provider test command + structured logs |
| **v0.9** | Catalog & UI maturity | Pricing columns + capability icons + provider health badges + masked key modal + live usage feed + Windows CI + coverage gates |
| **v1.0** | Contract freeze | Semver policy doc, config schema doc, security-model page, deprecation policy, final a11y/polish pass |

Each milestone ships independently useful increments; none requires breaking changes to user data (budget config and failover fields are additive to `config.json`).

---

## 7. Release checklist (the actual 1.0 gate)

- [ ] Fresh clone on clean machine: build + full suite green (proves C1 class fixed)
- [ ] `npm audit --omit=dev` zero high/critical in CI (H6)
- [ ] Smoke test passes on macOS, Windows, Linux
- [ ] Network-mode e2e: wrong password → 401, no password → refuses start, budget exceeded → 429 (C3/C5)
- [ ] Usage parity check: SDK-path and passthrough-path requests both appear in analytics within 1s (C4)
- [ ] Docs: config schema, security model, API server updated; CHANGELOG curated
- [ ] Version bumped to 1.0.0; `--version` output verified in all binaries
