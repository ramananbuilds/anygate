// src/commands/server.ts — anygate server command
import type { ParsedArgs } from '../core/types.js';
import { runServerCommand } from '../gateway/server.js';
import { VERSION } from '../core/constants.js';

const SERVER_HELP_TEXT = `
anygate server — OpenCode/Registry API Gateway

Usage:
  anygate server
  anygate server --quick
  anygate server --listen network --password <password>
  anygate server --vertex
  anygate server --help
  anygate server --version

Options:
  --quick, --saved             Start immediately from saved/default settings
  --listen local|network       One-run listen mode override
  --providers all|favorites|id1,id2
                               One-run provider catalog override
  --free-only, --no-free-only  One-run free-model filter override
  --mask-gateway-ids           Mask provider names in Anthropic model ids
  --no-mask-gateway-ids        Keep provider names in Anthropic model ids
  --password <value>           One-run network-mode server password
  --vertex                     Use Claude on Google Vertex AI

Behavior:
  Default: interactive wizard for exposed providers, discovery id masking (for
  Claude Desktop / Cowork), optional favorites-only catalog, then listen mode.
  Quick mode skips prompts and uses saved settings. Any one-run option also
  starts without prompts. Non-interactive stdin uses quick mode automatically.
  Network quick mode requires a saved password or --password.
  --vertex: Anthropic-compatible gateway to Claude on Google Vertex AI using
  local gcloud Application Default Credentials (no OpenCode API key).
  Binds to port 17645. Network mode asks for a server password.
  Network (Tailscale):
    Anthropic:  http://169.254.83.107:17645/anthropic
    OpenAI:     http://169.254.83.107:17645/openai/v1
  Network (Wi-Fi):
    Anthropic:  http://10.246.192.168:17645/anthropic
    OpenAI:     http://10.246.192.168:17645/openai/v1
  API key: use anything locally; use the server password in network mode.

Vertex env:
  ANTHROPIC_VERTEX_PROJECT_ID or GOOGLE_CLOUD_PROJECT — your GCP project
  GOOGLE_CLOUD_LOCATION or CLOUD_ML_REGION — region (default: global)
  Optional catalog: ~/.anygate/vertex-models.json (see assets/vertex-models.example.json)

Endpoints:
  Anthropic-compatible:  ANTHROPIC_BASE_URL=http://127.0.0.1:17645/anthropic
  OpenAI-compatible:     OPENAI_BASE_URL=http://127.0.0.1:17645/openai/v1
  API key: use anything locally; use the server password in network mode.
`;

export async function handleServerCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(SERVER_HELP_TEXT);
    return 0;
  }
  return runServerCommand({
    vertex: parsed.vertex,
    quick: parsed.serverQuick,
    listenMode: parsed.serverListenMode,
    providersMode: parsed.serverProvidersMode,
    providerIds: parsed.serverProviderIds,
    freeOnly: parsed.serverFreeOnly,
    maskGatewayIds: parsed.serverMaskGatewayIds,
    password: parsed.serverPassword,
  });
}