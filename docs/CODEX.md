# Codex with anygate

Use **OpenAI Codex** (terminal CLI or desktop app) with models from your anygate registry — Anthropic, xAI, Google Gemini, Nvidia, DeepSeek, OpenAI, and more.

| Command | What it launches | Config target |
|---------|------------------|---------------|
| **`anygate codex`** | Codex **terminal** (TUI) | Temporary sidecar profile — never touches your main Codex config |
| **`anygate codex-app`** | Codex **desktop app** (macOS / Windows) | Patches `~/.codex/config.toml` with backup; restored on Ctrl+C |

Both commands use the same registry (`~/.anygate/providers.json`) and provider picker. The CLI uses OpenAI directly when possible; the desktop app always uses the local Responses proxy so it can keep Codex's built-in provider identity and preserve history visibility.

**Full flag reference:** `anygate codex --help` and `anygate codex-app --help`. This guide explains *how it works*, *what files are touched*, and *how to recover*.

**Agent / alef-agent integration** (boot flags, NDJSON, `exec --json`): see **[AI-AGENTS.md](AI-AGENTS.md)** or run `anygate --ai`.

---

## Prerequisites

1. **anygate** installed on your PATH (`npm install -g anygate`, or built locally with `npm run build && npm link`).
2. **At least one provider** in the registry:
   ```bash
   anygate providers add
   # or: anygate providers import
   ```
3. **Codex installed:**
   - **CLI:** `npm install -g @openai/codex` (required for `anygate codex`)
   - **Desktop app:** [Codex for macOS or Windows](https://developers.openai.com/codex/cli) (required for `anygate codex-app`)

**Supported in Codex:** registry providers plus OpenCode Zen/Go cloud backends route through anygate's local Responses proxy.

---

## How it works (both commands)

Codex speaks the **OpenAI Responses API** (`POST /v1/responses`). Most registry providers do not. anygate bridges the gap:

```
Codex  →  anygate Responses proxy (127.0.0.1, Tier 2)  →  Vercel AI SDK  →  Anthropic / xAI / Gemini / …
Codex  →  OpenAI directly (Tier 1, OpenAI only)
```

| Tier | Providers | What anygate does |
|------|-----------|-------------------|
| **Tier 1 — Direct** | OpenAI (API key or ChatGPT OAuth) | Points Codex at OpenAI; no local proxy |
| **Tier 2 — Proxy** | Anthropic, xAI, Gemini, Nvidia, DeepSeek, most others | Local HTTP server translates Responses ↔ upstream SDK |

Your real API keys stay in anygate (keychain / registry). The proxy holds them in memory for the session.

---

## Codex CLI (`anygate codex`)

### Quick start

```bash
anygate codex
```

Pick provider → pick model → Codex TUI opens. anygate runs:

```bash
codex --profile anygate-launch -m <model-id>
```

### anygate flags

| Flag | Purpose |
|------|---------|
| *(none)* | Interactive launch |
| `--restore` | Remove leftover anygate CLI files after a crash |
| `--config` | Write profile + catalog to disk, print paths, exit (no Codex launch) |
| `--help` | Help text |

anygate **manages** `--profile` and `-m` / `--model`. Sandbox defaults to `danger-full-access`; pass other Codex flags directly:

```bash
anygate codex -s workspace-write
```

You do **not** need `--` before `-s`.

### Files anygate owns (CLI)

| File | Purpose |
|------|---------|
| `~/.codex/anygate-launch.config.toml` | Temporary profile for this session |
| `~/.anygate/codex/models-<provider>.json` | Model catalog |
| `~/.anygate/codex/session.json` | Session lock (one CLI session at a time) |

anygate **never edits** `~/.codex/config.toml` for CLI launches. Your personal Codex settings (sandbox, approvals, etc.) stay in that file and still apply.

### Cleanup (CLI)

| Situation | What happens |
|-----------|----------------|
| Normal exit (Codex quits, including Ctrl+C in Codex) | anygate removes overlay files automatically |
| Crash / closed terminal / force-quit | Files may remain; next launch auto-recovers when possible |
| Manual cleanup | `anygate codex --restore` |

You’ll see a **Cleanup** note before launch and a short message after exit.

### What anygate injects (CLI)

| Variable | When | Why |
|----------|------|-----|
| `ANYGATE_CODEX_KEY=proxy-local` | Tier 2 only | Placeholder so Codex hits the local proxy; real key stays in the proxy |
| `OPENAI_API_KEY` (etc.) | Tier 1 OpenAI | Codex calls OpenAI natively |

anygate **strips CI-related env vars** (`CI`, `CODEX_CI`, `GITHUB_ACTIONS`, …) before spawning Codex so IDE terminals don’t accidentally force read-only CI mode.

**Not from anygate:** `CODEX_SANDBOX`, `CODEX_SANDBOX_NETWORK_DISABLED`, etc. — those are set by Codex when it runs shell commands. `ANYGATE_CODEX_KEY` does **not** control sandbox policy.

### Sandbox and network (CLI)

Two layers people confuse:

1. **Codex’s sandbox** — shell commands inside Codex (files, network, approvals). Lives in `~/.codex/config.toml` and Codex CLI flags.
2. **anygate’s proxy** — model API traffic only.

**anygate codex defaults to `danger-full-access`** — the launch profile and spawn args both set it so shell tools (`curl`, `nlm`, npm, MCP CLIs) can reach the network without you passing `-s` every time. Override for one session:

```bash
anygate codex -s workspace-write
```

anygate **does not** edit your personal `~/.codex/config.toml` for CLI launches. To change sandbox for bare `codex` (without anygate), edit that file yourself:

```toml
sandbox = "danger-full-access"
ask_for_approval = "never"

[shell_environment_policy]
inherit = "all"
```

On macOS, profile TOML alone may not be enough; anygate also passes `-s danger-full-access` on spawn ([Codex #10390](https://github.com/openai/codex/issues/10390)).

---

## Codex desktop app (`anygate codex-app`)

### Quick start

```bash
anygate codex-app
```

Pick provider → pick model → Codex **app** opens. **Keep the anygate terminal open** until you’re done (the app always uses the foreground proxy). Press **Ctrl+C** to stop the proxy and restore your previous Codex config.

**Platforms:** macOS and Windows. Linux is not supported (no Codex desktop app).

### anygate flags

| Flag | Purpose |
|------|---------|
| *(none)* | Interactive launch + open app |
| `--restore` | Restore `config.toml` and remove anygate app files |
| `--config` | **Preview only** — print TOML that would be written; no disk writes, no app, no proxy |
| `--help` | Help text |

**`--config` note:** Skips the picker. Uses your last Codex provider/model from prefs (or the first compatible provider). The proxy port shown (`54321`) is a **placeholder**; a real launch uses a random port.

### Files anygate owns (App)

| File | Purpose |
|------|---------|
| `~/.codex/config.toml` | **Patched while session is active** — restored on Ctrl+C or `--restore` |
| `~/.anygate/codex/app-models-<provider>.json` | Model catalog (all routable models for that provider) |
| `~/.anygate/codex/session-app.json` | App session lock |
| `~/.anygate/codex/app-restore-state.json` | Snapshot of your pre-session root keys (for surgical restore) |
| `~/.anygate/codex/backups/config.toml.*.bak` | Rotating file backups before each patch |

CLI files (`anygate-launch.config.toml`, `session.json`, `models-*.json`) are **separate**. Running CLI after app (or vice versa) should not break the other.

### What gets written to `config.toml`

Example:

```toml
model = "claude-sonnet-4-6"
model_provider = "openai"
openai_base_url = "http://127.0.0.1:<random-port>/v1"
model_catalog_json = "/Users/you/.anygate/codex/app-models-anthropic.json"
model_context_window = 1000000
model_auto_compact_token_limit = 700000
```

`model_context_window` tells Codex the model's actual context limit. `model_auto_compact_token_limit` (set to 70% of the limit) tells Codex when to trigger auto-compaction, leaving enough headroom for the compaction request itself to succeed. Both fields are removed on restore.

The app deliberately keeps `model_provider = "openai"` and redirects the built-in provider with `openai_base_url`. Codex records the provider on every local thread and filters its history by provider; using a separate custom provider would hide existing OpenAI/ChatGPT threads while a anygate session is active. No conversations are deleted.

The catalog `display_name` uses human-readable labels (e.g. `Claude Haiku 4.5`).

### Cleanup (App)

| Situation | What to do |
|-----------|--------------|
| Normal end of session | **Ctrl+C** in the anygate terminal → config restored, proxy stopped |
| Codex already running | anygate asks to **restart Codex** so new settings apply; you can decline and reopen manually |
| Crash / killed terminal | Next launch auto-recovers when possible, or `anygate codex-app --restore` |
| Live session still running | `--restore` refuses until you Ctrl+C the other terminal |

### App vs CLI — config safety

| | CLI | App |
|--|-----|-----|
| Touches `~/.codex/config.toml`? | **Never** | Yes, with backup + restore |
| Proxy lifetime | Until Codex CLI exits | Until **Ctrl+C** in anygate terminal |
| Picker every launch? | Yes (prefs pre-highlight last choice) | Yes |

---

## Favorites catalog mode

When you have saved favorites via `anygate models`, both `anygate codex` and `anygate codex-app` will show your starting model + favorites in the mid-session model picker. Zen/Go favorites are included when an OpenCode API key is available.

### Slug policy

- **CLI** (`anygate codex`): slugs are `${providerId}__${modelId}` so models from different providers never collide.
- **App** (`anygate codex-app`): single-provider catalogs use bare model ids; favorites use the same `${providerId}__${modelId}` collision-safe form as the CLI.

### Authentication

For CLI favorites, the launched Codex child gets `OPENAI_API_KEY=proxy-local`, not your real upstream key. For the desktop app, Codex keeps its normal OpenAI login while `openai_base_url` points requests at the local proxy. In both cases, the proxy holds the real upstream credentials.

### Reasoning effort

The reasoning-effort slider in the Codex picker is shown only for models with a resolver-backed controllable reasoning profile. OpenRouter uses provider metadata (`supported_parameters`) when available; generic `@ai-sdk/openai-compatible` providers stay hidden unless anygate has a verified provider rule.

### Proxy warm-up

With 20 favorites spanning many providers, the first request after launch may be slow as the proxy initializes one `LanguageModel` per favorite. This is a known characteristic; subsequent requests are fast.

---

## Provider routing

| Provider | CLI route | App route | Notes |
|----------|-----------|-----------|-------|
| **OpenAI** | Tier 1 direct | Local proxy | `anygate providers auth openai` for ChatGPT OAuth |
| **Anthropic, xAI, Gemini, Nvidia, DeepSeek, …** | Tier 2 proxy | Local proxy | SDK translation path |
| **OpenCode Zen / Go** | Tier 2 proxy | Local proxy | Requires an OpenCode API key |

Add providers with `anygate providers add` or import from OpenCode.

---

## OAuth

Tokens (e.g. xAI, OpenAI OAuth) refresh at **launch only**. Long sessions may return 401 when a token expires. Restart `anygate codex` or `anygate codex-app`.

---

## Reasoning effort

Codex exposes a **reasoning effort** picker when anygate's model catalog includes supported levels. anygate fills `supported_reasoning_levels`, `default_reasoning_level`, and `supports_reasoning_summaries` from the centralized reasoning resolver, using provider metadata first and provider-specific rules second.

**You control effort in Codex's native UI** — anygate does not add its own menu. For `anygate codex-app`, an existing `model_reasoning_effort` in `~/.codex/config.toml` is **preserved** (not deleted on launch).

### Supported models (best-effort)

| Provider npm | Example models | Picker levels | Wire mapping |
|--------------|----------------|---------------|--------------|
| `@ai-sdk/anthropic` | claude-sonnet-4-6, claude-opus-4-6 | low, medium, high | SDK `thinking: adaptive` + `effort` |
| `@ai-sdk/openai` | gpt-5.5, gpt-5.4-codex | low, medium, high, xhigh | `reasoningEffort` on Responses API |
| `@ai-sdk/google` | gemini-2.5-pro, gemini-3-flash | low, medium, high | Gemini 2.5 → token budget; Gemini 3 → `thinkingLevel` |
| `@ai-sdk/mistral` | mistral-large, magistral-* | **high, off only** | `reasoningEffort: high \| none` |
| `@ai-sdk/xai` | grok-* | none, low, medium, high | `reasoningEffort` |
| `@openrouter/ai-sdk-provider` | z-ai/glm-5.2, provider models with `reasoning` in `supported_parameters` | none, minimal, low, medium, high, xhigh | `providerOptions.openrouter.reasoning.effort` |
| `@ai-sdk/openai-compatible` | unknown backends | *(picker hidden)* | no effort sent |

**Partial support:** Mistral only supports on/off — anygate shows `high` and `off`, not low/medium. Gemini 2.5 uses token budgets under the hood; the picker labels are low/medium/high for UX consistency.

**Local providers:** Same heuristics apply. Unrecognized models (e.g. Ollama `llama3:8b`) get an empty picker — best-effort, no v1 guarantee.

**Claude Code / Desktop gateway:** `anygate claude` and `anygate server` map Claude Code's `/effort` (`output_config.effort`) to the same SDK options. Anthropic direct passthrough routes forward effort unchanged.

---

## Troubleshooting

### CLI (`anygate codex`)

| Symptom | Fix |
|---------|-----|
| Provider missing in picker | `anygate providers add` |
| Leftover files after crash | Next launch auto-cleans, or `anygate codex --restore` |
| “Another session running” | Wait or `--restore` |
| Shell tools have no network | Should be default; confirm with `anygate codex --config` (profile has `sandbox = "danger-full-access"`) or pass `-s danger-full-access` |
| Read-only / CI behavior | anygate strips CI vars; try Terminal.app outside IDE |
| `codex` not found | `npm install -g @openai/codex` |

### App (`anygate codex-app`)

| Symptom | Fix |
|---------|-----|
| Existing conversations disappear during a anygate session | Update anygate. Older releases selected a custom `model_provider`, so Codex filtered the sidebar to anygate-only threads. Current releases keep the built-in `openai` provider and preserve normal history visibility. |
| App didn’t open | Open Codex manually once, run `anygate codex-app` again |
| Model errors / disconnected | Keep anygate terminal open (proxy must run) |
| Stuck on anygate settings | `anygate codex-app --restore` |
| `--restore` blocked | Ctrl+C the other anygate codex-app terminal first |
| Wrong config after test | `--restore`; backups in `~/.anygate/codex/backups/` |
| "prompt too long" / session crashes after many turns | The conversation history grew past the model’s context limit. Start a fresh conversation in Codex. anygate now sets `model_auto_compact_token_limit` in config.toml to prevent this going forward — see [Context management](#context-management-and-session-architecture). |
| Trying to continue a large GPT-5.5 session on a different model | Codex sends the full conversation history inline; 1 M-token models reject 2 M-token payloads. anygate trims the oldest messages automatically, but some early context will be lost. Starting fresh is the cleanest option. |
| Model shows as "Custom" in the Codex UI | Expected — Codex labels all external catalog models as "Custom". The correct model is in use. |

### Shared

| Symptom | Fix |
|---------|-----|
| Anthropic key rejected on `providers add` | Update anygate (Bearer vs `x-api-key` fix) |
| Model says anygate forced sandbox | Wrong — check Codex sandbox flags, not `ANYGATE_CODEX_KEY` |

---

## Context management and session architecture

### How Codex handles conversation history

Codex App is a **stateless client**: it sends the full accumulated conversation history with every single request to the proxy. There is no server-side reference system in use — the `previous_response_id` field in the Responses API spec is not implemented in the Codex App binary. Every turn sends all prior turns.

This means:

- Each request grows larger as the conversation continues (~one new message pair per turn).
- A session that ran for hundreds of turns with GPT-5.5 (which OpenAI manages server-side on their infrastructure) cannot be resumed transparently on a different model via anygate — the full local history is sent inline, and 1 M-token models will reject a 2 M-token payload.
- anygate has no way to make Codex adopt a different history-referencing approach. This is a fixed architectural property of the Codex App.

### How anygate protects against context overflow

anygate uses two complementary layers:

**1. Early auto-compaction via config.toml**

At session start, anygate writes two fields into `~/.codex/config.toml`:

```toml
model_context_window = 1000000          # the model's actual limit
model_auto_compact_token_limit = 700000  # 70% of the limit
```

Codex reads `model_auto_compact_token_limit` and triggers its built-in compaction before the conversation reaches that threshold. Compaction at 70% leaves 30% of headroom for the compaction request itself (which includes the full conversation). Without these fields, Codex either never compacts (for unknown models) or compacts too late, causing the compaction request itself to exceed the model limit.

**2. Proxy-level truncation as a last resort**

If a conversation that already exceeds the safety threshold arrives at the proxy (e.g. after switching from a GPT-5.5 session to a 1 M-limit model mid-way through), anygate drops the oldest messages before forwarding — enough to bring the estimated token count below 85% of the model's context window. The session continues in a degraded but functional state rather than crashing.

### "Custom" label in the Codex App model picker

When anygate configures Codex to use an external model via `model_catalog_json` and a custom `openai_base_url`, Codex App displays the model with a **"Custom"** label in the UI (e.g. "Custom · Medium"). This is expected Codex App behavior for any model loaded from a catalog that isn't in Codex's built-in provider list. The actual model anygate selected is in use — the label is cosmetic.

### Background GPT requests from Codex's internal agent

Codex App has an internal agent subsystem that periodically sends background requests using hardcoded OpenAI model IDs (`gpt-5.4`, `gpt-5.4-mini`, `gpt-5.5`), regardless of what model is configured. anygate's proxy silently routes these to the session's starting model. This is intentional — the background agent handles UI state tasks and does not affect your conversation.

---

## See also

- [Codex advanced config](https://developers.openai.com/codex/config-advanced)
- [Codex agent approvals & security](https://developers.openai.com/codex/agent-approvals-security)
- [README — Codex sections](../README.md)
- `anygate codex --help` · `anygate codex-app --help`
