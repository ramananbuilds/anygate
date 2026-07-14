<p align="center">
  <img src="assets/banner.png" alt="anygate banner" width="100%">
</p>

# anygate

> Route any model into any coding agent — launch tools, switch providers, and run local API gateways.

[![npm version](https://img.shields.io/npm/v/anygate)](https://www.npmjs.com/package/anygate)
[![npm downloads](https://img.shields.io/npm/dm/anygate)](https://www.npmjs.com/package/anygate)
[![License](https://img.shields.io/npm/l/anygate)](LICENSE)
[![Node](https://img.shields.io/badge/node-18%2B-success)](https://nodejs.org)
[![Platforms](https://img.shields.io/badge/platforms-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)]()

**anygate** is an interactive CLI — and a **visual launcher** — that connects AI coding tools to any provider and runs local API gateways on your machine. It supports **Claude Code**, **Claude Desktop (Cowork + Code)**, the **OpenAI Codex CLI**, the **ChatGPT desktop app in Codex mode (macOS + Windows)**, **Google Gemini CLI**, and experimental **Antigravity CLI / app / IDE** support.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Quick start](#quick-start)
- [Installation](#installation)
- [Supported tools](#supported-tools)
- [Commands](#commands)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Visual launcher](#visual-launcher-anygate-ui)
  - [Launch Claude Code](#launch-claude-code)
  - [Server mode](#server-mode)
  - [OAuth providers](#oauth-providers)
  - [Codex CLI](#codex-cli)
  - [Claude Desktop](#claude-desktop)
  - [ChatGPT / Codex app](#chatgpt--codex-app)
  - [Gemini CLI](#gemini-cli)
  - [Antigravity](#antigravity)
- [How it works](#how-it-works)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Overview

Pick your backend:

- **Your providers** — configure once with `anygate providers` (Groq, Mistral, Nvidia, DeepSeek, custom OpenAI/Anthropic endpoints, and more)
- **OpenCode Zen / Go** — cloud models with your OpenCode API key (optional; add via `anygate providers`)
- **One-time OpenCode import** — bring existing OpenCode provider settings into the registry (`anygate providers import`)
- **Google Vertex AI** — Claude on Vertex via `anygate server --vertex` and local gcloud credentials (no OpenCode key required)

### Prerequisites

- Node.js 18+
- A supported AI coding tool installed (e.g. [Claude Code](https://www.npmjs.com/package/@anthropic-ai/claude-code), [OpenAI Codex](https://www.npmjs.com/package/@openai/codex), or [Google Gemini CLI](https://www.npmjs.com/package/@google/gemini-cli))
- At least one provider configured via `anygate providers add` or `import` — **or** an [OpenCode API key](https://opencode.ai/auth) for Zen/Go cloud backends
- [OpenCode CLI](https://opencode.ai) only if you want **one-time import** from an existing OpenCode setup (optional)
- For **Vertex gateway:** [Google Cloud SDK](https://cloud.google.com/sdk) with `gcloud auth application-default login`, a GCP project with Vertex AI enabled, and Claude partner models enabled in that project
- For **Antigravity CLI / app / IDE:** a Google account is still needed for Antigravity authentication. Do **not** use your main Google account. Use a throwaway or secondary account you can afford to lose.

---

## Features

- **Visual launcher UI:** `anygate ui` opens a browser dashboard — launch any supported tool with a point-and-click model picker. Pick provider and model in the UI; the terminal opens straight to the running session with no second selection step. Manage providers and favorites without leaving the browser.
- **Server tab in the UI:** Run the same API gateway as `anygate server` — favorites-only or specific providers, discovery id masking for Claude Desktop / Cowork, local or network listen mode — from a browser form instead of a terminal wizard. Shows live URLs, the API key, and the full model catalog once started, with a one-click Stop.
- **Native provider registry:** `anygate providers` stores config in `~/.anygate/providers.json` and secrets in the OS keychain — no OpenCode binary required at launch. See **[docs/PROVIDERS.md](docs/PROVIDERS.md)** for a full list of providers and known issues.
- **Provider templates:** Add Groq, Mistral, Together, OpenRouter, and 15+ SDK-backed providers, plus custom OpenAI/Anthropic-compatible endpoints.
- **OpenCode import:** One-time migration from OpenCode (`providers import`); validates API keys and skips placeholders like `anything`.
- **OpenCode Zen / Go:** Optional cloud backends when you have an OpenCode API key.
- **SDK adapter proxy:** Non-Anthropic providers route through the Vercel AI SDK (same packages OpenCode uses), so Claude Code still speaks Anthropic format. Labeled `(via proxy)` in the picker.
- **Favorite models:** Save up to 20 and switch mid-session with Claude Code's `/model` command.
- **Smart model pickers:** Recent models per provider, search for large lists (>25), paginated browse (15 per page).
- **Refresh model lists:** `anygate providers refresh-models` updates cached catalogs per provider.
- **API server:** Run a local gateway on port **17645** for Claude Code, Claude Desktop, or any Anthropic-compatible client.
- **Server wizard:** Filter exposed providers, mask discovery ids for Claude Desktop, optional favorites-only catalog, local vs network listen mode — available in the terminal (`anygate server`) or the `anygate ui` Server tab.
- **Vertex gateway:** Anthropic-compatible Claude on Google Vertex AI using gcloud Application Default Credentials.
- **Antigravity CLI / app / IDE support:** Experimental local Cloud Code gateway for Antigravity's native model picker. Read the account warning before using it.
- **Clean environment isolation:** Strips 17 conflicting env vars (Vertex AI, Bedrock, AWS, Foundry, stale Anthropic config) from the child process only. Never touches `~/.claude/settings.json` (see caveat below).
- **Secure key storage:** Per-provider keys and the OpenCode API key go in the OS credential store (macOS Keychain, Windows Credential Manager, Linux Secret Service) or your shell profile.
- **Cross-platform:** macOS, Windows, Linux (Ubuntu, Fedora, distros with GNOME Keyring or KWallet).
- **Dry run mode:** Walk through the full wizard and preview the launch command without starting anything.
- **Preference memory:** Last provider and model are pre-selected next time.
- **Agent / headless launch:** Boot flags (`--provider`, `--model`), clean NDJSON/JSONL stdout for automated agents, and `anygate --ai` reference — see **[docs/AI-AGENTS.md](docs/AI-AGENTS.md)**.

---

## Quick start

```bash
# 1. Install globally
npm install -g anygate

# 2. Add a provider (or import from OpenCode once)
anygate providers add      # pick a template or custom endpoint

# 3. Launch your tool of choice
anygate claude             # pick provider + model → Claude Code
```

On first `anygate claude` run with an empty registry, an inline wizard walks you through Quick start (Zen), import, or opening `anygate providers`.

Prefer a browser? Run `anygate ui` for the visual launcher.

---

## Installation

To install the CLI globally:

```bash
npm install -g anygate
```

### Upgrading

```bash
npm update -g anygate
```

### Uninstallation

```bash
npm uninstall -g anygate
```

> [!NOTE]
> If you use a Node version manager like **NVM**, make sure you run the uninstall command using the active Node version that was used to install it (e.g., run `nvm use <version>` first).

To fully remove the tool and all its configuration data, delete the configuration directory (`.anygate`) on your operating system:

- **macOS / Linux**:
  ```bash
  rm -rf ~/.anygate
  ```
- **Windows**:
  - In Command Prompt:
    ```cmd
    rmdir /s /q "%USERPROFILE%\.anygate"
    ```
  - In PowerShell:
    ```powershell
    Remove-Item -Recurse -Force "$env:USERPROFILE\.anygate"
    ```

---

## Supported tools

| Tool | Command | Status |
|------|---------|--------|
| **Visual launcher UI** | `anygate ui` | ✅ Supported — browser dashboard for all tools |
| Provider registry | `anygate providers` | ✅ Supported ([guide](docs/PROVIDERS.md)) |
| Claude Code | `anygate claude` | ✅ Supported |
| Favorite models | `anygate models` | ✅ Supported |
| OpenCode API server | `anygate server` | ✅ Supported |
| Vertex API gateway | `anygate server --vertex` | ✅ Supported |
| Claude Desktop (Cowork + Code) | `anygate claude-app` | ✅ Supported macOS + Windows ([guide](docs/CLAUDE_DESKTOP_SETUP.md)) |
| Codex CLI | `anygate codex` | ✅ Supported ([guide](docs/CODEX.md)) |
| ChatGPT desktop app (Codex mode) | `anygate codex-app` (alias `chatgpt`) | ✅ Supported macOS + Windows ([guide](docs/CODEX.md)) |
| Google Gemini CLI | `anygate gemini` | ⚠️ Experimental, model switching is done via `.model` prompt |
| Antigravity CLI | `anygate agy` | ⚠️ Experimental, use a throwaway Google account ([guide](docs/ANTIGRAVITY.md)) |
| Antigravity app | `anygate antigravity` | ⚠️ Experimental macOS + Windows support, use a throwaway Google account ([guide](docs/ANTIGRAVITY.md)) |
| Antigravity IDE | `anygate antigravity-ide` | ⚠️ Experimental macOS + Windows support, use a throwaway Google account ([guide](docs/ANTIGRAVITY.md)) |
| GitHub Copilot OAuth | `anygate providers auth github-copilot` | ✅ Device code flow ([guide](docs/SUBSCRIPTION-OAUTH.md)) |
| xAI SuperGrok OAuth | `anygate providers auth xai-oauth` | ✅ Device code flow ([guide](docs/SUBSCRIPTION-OAUTH.md)) |
| OpenAI ChatGPT OAuth | `anygate providers auth openai-oauth` | ✅ Device code flow ([guide](docs/SUBSCRIPTION-OAUTH.md)) |

---

## Commands

| Command | Description |
|---------|-------------|
| `anygate` | Print help (does not launch Claude Code) |
| `anygate ui` | **Open the visual launcher** — manage providers and launch any tool from a browser UI |
| `anygate claude` | Pick a provider → launch Claude Code |
| `anygate providers` | Add, import, list, remove, and refresh your AI providers |
| `anygate models` | Manage favorite models for mid-session `/model` switching |
| `anygate server` | Foreground API gateway (registry providers + optional Zen/Go) |
| `anygate server --vertex` | Foreground Anthropic-compatible gateway to Claude on Vertex AI |
| `anygate claude-app` | Launch Claude Desktop app with registry providers ([guide](docs/CLAUDE_DESKTOP_SETUP.md)) |
| `anygate codex` | Launch OpenAI Codex CLI with registry providers ([guide](docs/CODEX.md)) |
| `anygate codex-app` (alias `chatgpt`) | Launch ChatGPT desktop app in Codex mode with registry providers ([guide](docs/CODEX.md)) |
| `anygate gemini` | Launch Google Gemini CLI with registry providers |
| `anygate agy` | Launch Antigravity CLI with anygate models ([warning + guide](docs/ANTIGRAVITY.md)) |
| `anygate antigravity` | Launch Antigravity app with anygate models, macOS ([warning + guide](docs/ANTIGRAVITY.md)) |
| `anygate antigravity-ide` | Launch Antigravity IDE with anygate models, macOS ([warning + guide](docs/ANTIGRAVITY.md)) |
| `anygate providers auth <id>` | Authenticate an OAuth provider (GitHub Copilot, xAI, OpenAI) |
| `anygate --ai` | Full agent reference for scripts and automated agents ([guide](docs/AI-AGENTS.md)) |

---

## Configuration

**Provider registry** (no secrets in this file):

```text
~/.anygate/providers.json
```

Manage with `anygate providers`. API keys are stored in the OS keychain (`keyring:provider:<id>`).

**App preferences** — favorites, last provider/model, server settings, optional server password:

```text
~/.anygate/config.json
```

Override the config directory:

```bash
export ANYGATE_HOME="/path/to/your/anygate-home"
```

The OpenCode API key (for Zen/Go) and per-provider keys are stored separately, based on what you chose during setup (Keychain, credential store, or shell profile).

### Credential storage

| Platform | Secure storage | Plaintext fallback |
|----------|---------------|-------------------|
| macOS | Keychain (optional: + `~/.zshrc` auto-load) | Shell profile |
| Windows | Credential Manager | `setx` user env var |
| Linux (desktop) | Secret Service (GNOME Keyring / KWallet) | Shell profile |
| Linux (headless) | n/a | Shell profile |

The key is active in your current session right away, no matter which option you pick. No terminal restart needed.

---

## Usage

### Visual launcher (`anygate ui`)

```bash
anygate ui
```

Opens a browser-based dashboard on a random local port. From the UI you can:

- **Launch any supported tool** — app cards for Claude Code CLI, Codex CLI, Gemini CLI, Antigravity CLI, Antigravity App, Antigravity IDE, Claude Code Desktop, and the ChatGPT Desktop app (Codex mode). Select a provider and model in the card, then click **Launch** — a native terminal opens with the selection pre-wired. No second picker in the terminal.
- **Manage General Favorites** — the sidebar shows your saved favorite models with a slot indicator (Slots used X/20). Favorites launch through all supported agents.
- **Manage Antigravity Favorites** — separate favorites panel for Antigravity sessions.
- **Manage providers** — add providers from templates, delete providers, and refresh model lists inline, all without leaving the browser.
- **Run the Server tab** — configure and start the same gateway as `anygate server` (favorites-only or specific providers, discovery id masking, local/network listen mode) and see the resulting URLs, API key, and model catalog right in the browser. Runs in the same process as the UI, so it stops when you close the dashboard. See [Registry gateway](#registry-gateway-anygate-server) below for what each option does.

Press `Ctrl+C` in the terminal where `anygate ui` is running to shut down the dashboard server (this also stops the gateway if you started it from the Server tab).

### Launch Claude Code

```bash
anygate claude
```

First run: pick a provider from your registry (or complete the inline setup wizard). If you've added OpenCode Zen/Go, those appear alongside registry providers like Groq, Nvidia, or DeepSeek.

#### Favorite models and mid-session switching

Save the models you bounce between:

```bash
anygate models
```

Add up to 20 favorites from Zen, Go, or any OpenCode-configured provider. When you have favorites, `anygate claude` starts a multi-route proxy automatically. Claude Code's `/model` command lists your starting model plus favorites. Switch live, no restart.

No favorites? Launch works like before: single model, no switch menu. `--dry-run` ignores saved favorites so you can preview a single-model launch.

#### `anygate claude` options

| Flag | Description |
|------|-------------|
| `--dry-run` | Run the full wizard but preview the launch command instead of executing |
| `--setup` | Reminder to use `anygate providers` for provider setup |
| `--trace` | Write debug logs to `~/.anygate/logs/` and show errors on exit |
| `--help` | Show command help |
| `--version` | Show version |

```bash
anygate claude --dry-run
anygate claude --setup
anygate claude --trace
```

Claude Code flags and session IDs pass through unchanged:

```bash
anygate claude -c
anygate claude --resume abc-123
anygate claude abc-123
```

**Non-interactive / agent launch** — skip the wizard with boot flags:

```bash
anygate claude --provider groq --model llama-3.3-70b-versatile -p "Summarize README.md"
anygate claude --model zen__deepseek-v4-flash-free -p "task" --output-format stream-json
```

| Flag | Description |
|------|-------------|
| `--provider` | Boot provider id (skip wizard with `--model` or in print mode) |
| `--model` | Boot model id, or slug `provider__model-id` |

For agent integrations, NDJSON streaming, Codex `exec --json`, and sandbox defaults, see **[docs/AI-AGENTS.md](docs/AI-AGENTS.md)** and run `anygate --ai`.

Use `--` when you want every following token passed directly to Claude Code:

```bash
anygate claude -- --print "hello"
anygate claude -- --dangerously-skip-permissions
anygate claude --dry-run -- --print "test"
```

### Server mode

Run anygate as a foreground API gateway on port **17645**:

| Mode | Command | Auth | Models |
|------|---------|------|--------|
| **Registry gateway** | `anygate server` | Per-provider keys in registry (+ OpenCode key for Zen/Go if exposed) | Providers you configured |
| **Vertex gateway** | `anygate server --vertex` | gcloud Application Default Credentials | Claude on Vertex AI |

> **Claude Desktop (Cowork + Code):** For the automated macOS/Windows setup, use `anygate claude-app`. For manual or network setups, see [docs/CLAUDE_DESKTOP_SETUP.md](docs/CLAUDE_DESKTOP_SETUP.md).

#### Registry gateway (`anygate server`)

Works with any providers in your registry. Zen/Go models appear when you have an OpenCode API key and those providers are exposed.

The wizard asks:

| Prompt | What it does |
|--------|--------------|
| **Configure & start** vs **Start with saved settings** | Full wizard or one-step launch from saved server preferences |
| **Exposed providers** | Limit which providers appear in the catalog (Zen, Go, Groq, OpenAI, etc.) |
| **Mask gateway model ids for discovery?** | Recommended **Yes** for Claude Desktop — hides competitor vendor strings in model ids so discovery works |
| **Expose only favorite models?** | Optional cap at your favorites (manage with `anygate models`) |
| **Listen mode** | **Local only** (`127.0.0.1`) or **Network** (`0.0.0.0` + server password) |

The same options are available without a terminal in the [Server tab of `anygate ui`](#visual-launcher-anygate-ui), which also shows the resulting URLs, API key, and model catalog live.

After you configure the server once, start it without prompts:

```bash
anygate server --quick
# same as:
anygate server --saved
```

Any one-run server option also skips the wizard:

| Option | Meaning |
|--------|---------|
| `--listen local\|network` | Override the saved listen mode for this run |
| `--providers all\|favorites\|id1,id2` | Expose all providers, favorites only, or a comma-separated provider id list |
| `--free-only` / `--no-free-only` | Enable or disable the free/free-access model filter for this run |
| `--mask-gateway-ids` / `--no-mask-gateway-ids` | Enable or disable discovery id masking for this run |
| `--password <value>` | One-run password for network mode when you do not want to use a saved password |

Non-interactive shells (scripts, services, CI, pipes) use quick mode automatically. If quick mode resolves to network mode, anygate uses `--password` first, then a saved server password; without either it exits with a clear error instead of prompting.

**Local mode** — point any Anthropic-compatible client at your machine:

```bash
export ANTHROPIC_BASE_URL="http://127.0.0.1:17645/anthropic"
export ANTHROPIC_API_KEY="anything"
```

**Network mode** — other devices on your LAN:

```bash
export ANTHROPIC_BASE_URL="http://<server-ip>:17645/anthropic"
export ANTHROPIC_API_KEY="<server-password>"
```

By default the server password stays in memory only. If you choose to save it, anygate stores it in the OS credential store when available, with `~/.anygate/config.json` as a fallback.

OpenAI-format models also get an OpenAI-compatible endpoint:

```bash
export OPENAI_BASE_URL="http://127.0.0.1:17645/openai/v1"
export OPENAI_API_KEY="anything"
```

Health check:

```bash
curl -s http://127.0.0.1:17645/health
curl -s http://127.0.0.1:17645/anthropic/v1/models | head
```

The spinner reports how many models loaded and how many came from registry providers.

#### Vertex gateway (`anygate server --vertex`)

Anthropic-compatible gateway to Claude on Google Vertex AI. No OpenCode API key required.

**Setup:**

```bash
gcloud auth application-default login
export ANTHROPIC_VERTEX_PROJECT_ID="your-gcp-project"   # or GOOGLE_CLOUD_PROJECT
export GOOGLE_CLOUD_LOCATION="global"                   # optional; default: global
anygate server --vertex
```

**Default models:** `claude-sonnet-4-6`, `claude-opus-4-6`, `claude-haiku-4-5`

**Shorthand aliases** (for Claude Code `/model` and `settings.json`): `sonnet`, `opus`, `haiku`. Append `[1m]` for 1M context on Sonnet and Opus only (Haiku stays 200k).

**Custom catalog:** copy `assets/vertex-models.example.json` to `~/.anygate/vertex-models.json` and edit. Override the config directory with `ANYGATE_HOME`.

When the gateway is running:

```bash
export ANTHROPIC_BASE_URL="http://127.0.0.1:17645/anthropic"
export ANTHROPIC_API_KEY="anything"
```

**Claude Code tip:** When routing through the gateway, unset native Vertex env vars so Claude Code doesn't bypass the proxy:

```bash
unset CLAUDE_CODE_USE_VERTEX ANTHROPIC_VERTEX_PROJECT_ID CLOUD_ML_REGION
```

### OAuth providers

anygate supports OAuth providers that use device-code sign-in, so you can connect an existing subscription without pasting an API key. See **[docs/SUBSCRIPTION-OAUTH.md](docs/SUBSCRIPTION-OAUTH.md)** for setup details.

Device code flows for existing subscriptions:

```bash
anygate providers auth github-copilot   # GitHub Copilot
anygate providers auth openai-oauth     # ChatGPT Plus / Pro
anygate providers auth xai-oauth        # xAI SuperGrok
```

### Codex CLI (`anygate codex`)

Launch [OpenAI Codex CLI](https://developers.openai.com/codex/cli) with registry providers. Requires `npm install -g @openai/codex`.

```bash
anygate providers add    # Anthropic, xAI, OpenAI, etc.
anygate codex            # pick provider + model → Codex TUI
```

anygate writes a **temporary** profile (`~/.codex/anygate-launch.config.toml`) and removes it when Codex exits. After a crash: `anygate codex --restore`.

**Sandbox / network:** `anygate codex` defaults to **`danger-full-access`** (profile + `-s` flag) so shell tools like `curl`, `nlm`, and npm can reach the network. Override for one session:

```bash
anygate codex -s workspace-write
```

Pass Codex flags directly after `anygate codex` — you do **not** need `--` before `-s`. Codex's `--dangerously-bypass-approvals-and-sandbox` also passes through if you need it.

Full details: **[docs/CODEX.md](docs/CODEX.md)** — CLI + desktop app, configs, restore, sandbox, routing.

For agent integration (boot flags, NDJSON, JSONL): **[docs/AI-AGENTS.md](docs/AI-AGENTS.md)** and `anygate --ai`.

### Claude Desktop

Launch **Claude Desktop** (macOS or Windows) with registry providers:

```bash
anygate claude-app
```

This command automates the "Third-Party Inference" (Developer Mode) setup. It temporarily configures Claude Desktop to point at a local gateway, launches the app, and routes traffic to your chosen provider.

- **Keep the terminal open:** The proxy runs in the foreground.
- **Ctrl+C to restore:** When you're done, press `Ctrl+C` in the terminal to automatically restore Claude Desktop to its normal Anthropic cloud mode.
- **Cleanup:** If the terminal crashes, run `anygate claude-app --restore`.

For manual network setups (e.g., remote cloud desktop), you can still use `anygate server`. See the full [Claude Desktop Setup Guide](docs/CLAUDE_DESKTOP_SETUP.md).

### ChatGPT / Codex app (`anygate codex-app`, alias `anygate chatgpt`)

> OpenAI merged the standalone Codex app into the ChatGPT desktop app on 2026-07-09 — it's now named "ChatGPT" on disk (bundle id and config format unchanged) and opens in Codex mode for existing Codex users. `anygate codex-app` and `anygate chatgpt` are the same command.

Launch the **ChatGPT app in Codex mode** (macOS or Windows) with registry providers:

```bash
anygate codex-app
```

Patches `~/.codex/config.toml` with backup; **Ctrl+C** in the anygate terminal asks whether to close ChatGPT Desktop and restore your config (choose "No, keep session running" to decline and keep going). The app keeps Codex's built-in `openai` provider active so existing conversation history remains visible, and routes the selected model through a foreground local proxy. Preview config without writing: `anygate codex-app --config`. Recovery: `anygate codex-app --restore`.

See **[docs/CODEX.md](docs/CODEX.md)** for CLI vs app differences, file ownership, and troubleshooting.

> **Known limitation — MCP tools (Context7, chrome-devtools, etc.) don't work with non-native models.** Codex wraps local `[mcp_servers.*]` tools in a proprietary, undocumented format that only Codex's own ChatGPT backend can dispatch. When routed through anygate (or *any* non-native model provider — this also affects Ollama, OpenRouter, LiteLLM, LM Studio identically), the model can see and call the tools, but Codex's own dispatcher rejects every call with `unsupported call: ...`. This is a confirmed, currently open upstream bug ([openai/codex#20652](https://github.com/openai/codex/issues/20652)) — there is no workaround on anygate's side. MCP tools work normally with Codex's native OpenAI/ChatGPT models. See the [MCP troubleshooting row in docs/CODEX.md](docs/CODEX.md#troubleshooting) for details.

**Reasoning effort:** Capable models show Codex's native reasoning picker (low/medium/high, etc.). anygate maps your choice to each provider's SDK options and preserves existing `model_reasoning_effort` in Codex config. Claude Code `/effort` and the `anygate server` gateway use the same mapping — see the [reasoning section in docs/CODEX.md](docs/CODEX.md#reasoning-effort).

### Gemini CLI (`anygate gemini`)

Launch the [Google Gemini CLI](https://www.npmjs.com/package/@google/gemini-cli) with registry providers.

```bash
anygate gemini
```

Pick provider → pick model → Gemini prompt loop opens. Non-interactive tasks with streaming NDJSON are also fully supported:

```bash
anygate gemini --provider google --model gemini-2.5-flash -p "Review this file" -o stream-json
```

For agent integration (boot flags, NDJSON): **[docs/AI-AGENTS.md](docs/AI-AGENTS.md)** and `anygate --ai`.

### Antigravity

anygate can launch the Antigravity CLI, standalone Antigravity app, and Antigravity IDE through a local Cloud Code gateway. This lets Antigravity's native model picker show anygate models from your configured providers.

```bash
anygate agy
anygate antigravity
anygate antigravity-ide
```

> ⚠️ **Do not use your main Google account with Antigravity support.**
>
> Antigravity still requires Google authentication before it will run. anygate routes Cloud Code generation through your local gateway, but the Antigravity CLI, app, and IDE are still Google software and may contact Google for auth, telemetry, updates, or account checks.
>
> This kind of use is probably not what Google intended, may violate Google's terms of service, and could lead to account restrictions or bans. Use a throwaway Google account, a secondary account, or another account you can afford to lose. A free Google account should be enough for authentication. Seriously, don't risk your real Gmail, Workspace, YouTube, Drive, or business account for this.

Read the full setup and risk notes in **[docs/ANTIGRAVITY.md](docs/ANTIGRAVITY.md)** before launching any Antigravity surface.

---

## How it works

### OpenCode Zen / Go filtering

When OpenCode Zen is in your registry, `subscriptionFilter` controls which Zen models appear (`free` = free tier only; default = all Zen models). Add or change Zen via `anygate providers`.

### Environment isolation

When you launch, anygate builds a clean child environment:

1. Removes 17 conflicting env vars from the child process (Vertex AI, Bedrock, AWS, Foundry, stale Anthropic config)
2. Sets `ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY`, and `ANTHROPIC_MODEL` for the session
3. Passes `--model <selected>` to Claude Code as a backup override

When Claude Code exits (normal exit, Ctrl+C, terminal close), your shell is unchanged. No cleanup step. No restore needed.

**Caveat: Claude Code persists the model.** anygate doesn't edit `~/.claude/settings.json`, but Claude Code saves the model you launched with (via `--model` and `ANTHROPIC_MODEL`). A later bare `claude` launch may still show that model, e.g. `anthropic-opencode-go__deepseek-v4-flash` from a prior anygate session. To get back to a first-party default, run `claude --model sonnet` (or your preferred Claude model), or remove the `"model"` key from `~/.claude/settings.json`. If you used the favorites switch menu, Claude Code may also cache the gateway catalog at `~/.claude/cache/gateway-models.json`. Delete that file if `/model` shows stale entries from a dead proxy.

### Model compatibility

OpenCode exposes models through different API formats. anygate handles them when it can:

| Model format | Examples | How it works | Label |
|---|---|---|---|
| Anthropic native | Claude, Qwen, MiniMax (Go) | Direct connection | *(none)* |
| OpenAI chat completions | DeepSeek, Kimi, MiMo, GLM, Grok, GPT-4o (OpenCode OpenAI provider) | SDK adapter proxy (Vercel AI SDK) | `via proxy` |
| OpenAI Responses API | GPT-5.4+, GPT-5.5, Codex, o-series (OpenCode OpenAI provider only) | Same proxy; SDK picks Responses API | `via proxy` |
| Gemini native | Gemini (OpenCode Google provider) | SDK adapter, Gemini native API | `via proxy` |
| Other SDK providers | Cerebras, Perplexity, Bedrock, Vertex, Together AI, etc. | Whatever `api.npm` OpenCode assigns | `via proxy` |
| Not in cloud wizard | GPT, Gemini on OpenCode Zen/Go | Use an OpenCode-configured provider instead (OpenAI/Google in OpenCode config) | `not yet supported` |

The SDK adapter proxy starts on a random local port for proxy-routed models and stops when Claude Code exits. Each `anygate claude` session gets its own port, so multiple terminals are fine. (`anygate server` uses fixed port `17645`. One server instance per machine.)

### Provider notes

**Mistral (free tier):** Rate limits are tight. Expect HTTP 429 during tool-heavy sessions. Claude Code retries with backoff. That's Mistral throttling, not a proxy bug.

**OpenAI (OpenCode-configured provider):** Configure OpenAI in [OpenCode](https://opencode.ai) with your API key, then pick the OpenAI provider at launch. Newer GPT models use OpenAI's Responses API. The SDK picks `responses` vs `chat` from the model ID. OpenCode catalog IDs can differ from API IDs (e.g. `gpt-5.5-fast` maps to upstream `gpt-5.5`). If you see "model not available", run `anygate claude --trace` and check `~/.anygate/logs/claude-debug.log`.

`CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` is set for direct (non-proxy) routes only. Proxy sessions keep tool-search betas.

### API key storage

anygate uses [`@napi-rs/keyring`](https://www.npmjs.com/package/@napi-rs/keyring) for the OS credential store. On later runs it checks silently. Key found? Wizard skips the prompt.

| Platform | Credential store | Notes |
|----------|-----------------|-------|
| macOS | macOS Keychain | Optional `~/.zshrc` auto-load line for system-wide availability |
| Windows | Windows Credential Manager | `setx` available as plaintext alternative |
| Linux (desktop) | Secret Service API (GNOME Keyring, KWallet) | Needs a running keyring daemon |
| Linux (headless) | Not available | Falls back to shell profile or session-only |

If the native module fails to load, credential store options are skipped and you get shell profile / session-only storage.

---

## Troubleshooting

See **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** for common issues — especially **"Not logged in"** after accidentally choosing **No** on Claude Code's custom API key prompt.

---

## Contributing

Contributions are welcome. Issues and pull requests are welcome on GitHub.

---

## Disclaimer

This project and its creator have **no affiliation** with OpenCode, Anthropic, Claude, Google, GitHub, OpenAI, xAI, or any other vendor named or integrated here. Trademarks belong to their respective owners.

anygate routes inference through services you configure yourself (OpenCode Zen/Go, OpenCode-configured providers, Vertex AI, and gateways you run locally). Use at your own risk.

---

## License

MIT
