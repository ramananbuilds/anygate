// src/commands/claude.ts — anygate claude command
import pc from 'picocolors';
import * as p from '@clack/prompts';
import { findClaudeBinary, launchClaude } from '../agents/shared/launch.js';
import { resolveApiKey, detectConflicts, buildChildEnv, readGlobalOpencodeCredential } from '../core/env.js';
import { claudeCodeClientModelId } from '../agents/shared/context-model-id.js';
import { resolveOrCollectApiKey } from '../agents/shared/key-setup.js';
import { needsFirstRunSetup, runFirstRunWizard } from '../agents/shared/first-run.js';
import { MAX_MODEL_CATALOG } from '../core/constants.js';
import { startProxy, startProxyCatalog } from '../gateway/anthropic-proxy.js';
import type { ProxyHandle, ProxyRoute } from '../gateway/anthropic-proxy.js';
import {
  buildCatalogRoutes,
  makeRouteResolver,
} from '../providers/provider-catalog.js';
import type { ModelFormat } from '../core/types.js';
import { loadPreferences, savePreferences, recordLaunchSelection } from '../core/config.js';
import { pickLocalModel, browseAllModels } from '../agents/shared/prompts.js';
import { fetchProviderCatalog, providersForPicker, providersForPickerWithTemplates } from '../providers/provider-catalog.js';
import { resolveLocalProviderApiKey } from '../core/credentials.js';
import { BACKENDS, VERSION } from '../core/constants.js';
import { checkForUpdates, formatUpdateNotification } from '../agents/shared/update-check.js';
import type { ParsedArgs, ModelInfo, FavoriteModel, LocalProvider, LocalProviderModel } from '../core/types.js';
import { addFavorite, removeFavorite, isFavorite } from '../agents/claude/favorites.js';
import {
  browseByProviderChoice,
  buildGlobalFavoriteIndex,
  pickGlobalFavoriteModel,
} from '../agents/claude/favorites-picker.js';
import { favoriteProviderDisplayName } from '../agents/claude/favorites-provider-display.js';
import { resolveFirstAvailableFavorite } from '../agents/shared/favorites-resolver.js';
import { prepareClaudeTraceLog, printTraceLog } from '../agents/shared/trace-log.js';
import { ANTIGRAVITY_BASE_URLS } from '../oauth/antigravity-oauth.js';
import { providersForTarget } from '../agents/shared/target-compatibility.js';
import { refreshModelsDevCacheAsync } from '../registry/models-dev.js';
import { setAgentStdoutMode, isAgentStdoutMode } from '../core/agent-io.js';
import {
  findProviderAndModel,
  normalizeClaudeAgentArgs,
  planLaunchWizard,
  wantsCleanAgentStdout,
} from '../agents/shared/launch-target.js';
import { gateIntro, gateOutro, providerSelectOption, fmtModel, fmtEnabledStar, formatModelLabel, printAsciiBanner } from '../agents/shared/ui.js';
import {
  listAddableTemplates,
  getTemplateById,
  type ProviderTemplate,
  runTemplateAddFlow,
} from '../providers/command.js';

const STARTER_CLAUDE_FLAGS = new Set(['--dry-run', '--setup', '--trace', '--help', '-h', '--version', '-v']);
const GATEWAY_LAUNCH_FLAGS = new Set(['--provider', '--model']);

export async function handleClaudeCommand(parsed: ParsedArgs): Promise<number> {
  const { dryRun, setup, trace, launchProvider, launchModel } = parsed;
  const claudeArgs = normalizeClaudeAgentArgs(parsed.claudeArgs);
  const agentStdout = wantsCleanAgentStdout('claude', claudeArgs);
  setAgentStdoutMode(agentStdout);

  // Prerequisite: claude binary
  const claudePath = findClaudeBinary();
  if (!claudePath) {
    console.error(pc.red('\nError: claude binary not found on PATH.\n'));
    console.error('Install Claude Code:');
    console.error('  npm install -g @anthropic-ai/claude-code\n');
    return 1;
  }

  const prefs = dryRun ? {} as ReturnType<typeof loadPreferences> : loadPreferences();
  const conflicts = detectConflicts();

  const favorites = dryRun ? [] : (prefs.favoriteModels ?? []);
  const launchPlan = planLaunchWizard({
    explicit: { providerId: launchProvider, modelId: launchModel },
    childArgs: claudeArgs,
    agent: 'claude',
    prefs,
  });
  if (launchPlan.error) {
    console.error(pc.red(`\nError: ${launchPlan.error}\n`));
    return 1;
  }
  const switchMenuActive = favorites.length > 0 && !launchPlan.skip;

  if (!agentStdout) gateIntro('Claude Code');

  if (setup && !dryRun && !agentStdout) {
    p.log.info('Provider setup now lives in anygate providers — opening that next is recommended.');
  }

  if (!dryRun && await needsFirstRunSetup()) {
    const firstRun = await runFirstRunWizard(trace);
    if (firstRun === 'cancel') return 0;
  }

  let catalog: Awaited<ReturnType<typeof fetchProviderCatalog>>;
  if (agentStdout) {
    try {
      catalog = await fetchProviderCatalog();
    } catch (err) {
      console.error(pc.red(String(err instanceof Error ? err.message : err)));
      return 1;
    }
  } else {
    const catalogSpinner = p.spinner();
    catalogSpinner.start('Loading your providers...');
    try {
      catalog = await fetchProviderCatalog();
    } catch (err) {
      catalogSpinner.stop('');
      console.error(pc.red(String(err instanceof Error ? err.message : err)));
      return 1;
    }
    catalogSpinner.stop('');
  }

  // Use providersForPickerWithTemplates to show both configured and available providers
  const allProvidersWithTemplates = await providersForPickerWithTemplates('claude');
  const allProviders = providersForTarget(allProvidersWithTemplates, 'claude');
  if (allProviders.length === 0) {
    p.log.warn('No providers available.');
    p.log.info(pc.dim('Run anygate providers add or import to get started.'));
    return 0;
  }

  // Separate configured providers from templates for UI hints
  const configuredProviders = allProviders.filter(p => p.inRegistry);
  const templateProviders = allProviders.filter(p => !p.inRegistry);

  const providerOptions = allProviders.map(lp => {
    const baseOption = providerSelectOption(lp);
    if (!lp.inRegistry) {
      return {
        ...baseOption,
        label: `+ ${baseOption.label}`, // Prefix with + to indicate available but not configured
        hint: `${baseOption.hint || ''} (available, not configured)`,
      };
    }
    return baseOption;
  });

  if (switchMenuActive) {
    providerOptions.unshift({
      value: '__favorites__',
      label: '⭐ Favorites Catalog',
      hint: `${favorites.length} saved favorites`,
    });
  }

  const initialProvider =
    prefs.lastProvider && providerOptions.some(o => o.value === prefs.lastProvider)
      ? prefs.lastProvider
      : providerOptions[0]!.value;

  let activeProvider: LocalProvider;
  let selectedModel: LocalProviderModel;

  if (launchPlan.skip && launchPlan.target) {
    const resolved = findProviderAndModel(allProviders, launchPlan.target);
    if (!resolved) {
      p.log.error(
        `Provider/model not found: ${launchPlan.target.providerId} / ${launchPlan.target.modelId}`,
      );
      return 1;
    }
    activeProvider = resolved.provider;
    selectedModel = resolved.model;
    if (!agentStdout) {
      p.log.step(`Using ${selectedModel.name || selectedModel.id} (${activeProvider.name})`);
    }
    if (!dryRun) recordLaunchSelection('claude', activeProvider.id, selectedModel.id, prefs);
  } else {
    let currentInitialProvider = initialProvider;
    while (true) {
      const chosen = await p.select<string>({
        message: 'Which provider?',
        options: providerOptions,
        initialValue: currentInitialProvider,
      });

      if (p.isCancel(chosen)) {
        p.cancel('Cancelled.');
        return 0;
      }

      const providerChoice = chosen as string;

      if (providerChoice === '__favorites__') {
        const available: Array<{ provider: LocalProvider; model: LocalProviderModel }> = [];
        for (const fav of favorites) {
          const prov = allProviders.find(lp => lp.id === fav.providerId);
          const mod = prov?.models.find(m => m.id === fav.modelId);
          if (prov && mod) available.push({ provider: prov, model: mod });
        }
        if (available.length === 0) {
          p.log.warn('No saved favorites are currently available.');
          return 0;
        }
        const favOptions = available.map((f, i) => ({
          value: String(i),
          label: `${f.model.name || f.model.id} — ${f.provider.name}`,
          hint: f.model.id,
        }));
        const pickedIdx = await p.select<string>({
          message: 'Starting model?',
          options: favOptions,
          initialValue: '0',
        });
        if (p.isCancel(pickedIdx)) { p.cancel('Cancelled.'); return 0; }
        const sel = available[Number(pickedIdx)]!;
        activeProvider = sel.provider;
        selectedModel = sel.model;
        if (!dryRun) recordLaunchSelection('claude', activeProvider.id, selectedModel.id, prefs);
        break;
      } else {
        const selectedProvider = allProviders.find(lp => lp.id === providerChoice)!;

        // If the selected provider is not in the registry (it's a template), run the add flow first
        if (!selectedProvider.inRegistry) {
          p.log.info(`Adding ${selectedProvider.name}...`);
          const template = getTemplateById(selectedProvider.id);
          if (!template) {
            p.log.error(`Template not found for ${selectedProvider.id}`);
            continue;
          }
          // Run the add provider flow
          const addResult = await runTemplateAddFlow(template);
          if (addResult === 0) {
            // Reload providers after adding
            const refreshedProviders = providersForTarget(
              await providersForPickerWithTemplates('claude'),
              'claude'
            );
            const newProvider = refreshedProviders.find(p => p.id === selectedProvider.id);
            if (newProvider) {
              activeProvider = newProvider;
            } else {
              p.log.error(`Failed to reload provider after adding`);
              continue;
            }
          } else {
            continue;
          }
        } else {
          activeProvider = selectedProvider;
        }

        const pickedModelResult = await pickLocalModel(activeProvider, conflicts, prefs);
        if (pickedModelResult === 'back') {
          currentInitialProvider = activeProvider.id;
          continue;
        }
        if (!pickedModelResult) return 0;
        selectedModel = pickedModelResult;

        if (!dryRun) recordLaunchSelection('claude', activeProvider.id, selectedModel.id, prefs);
        break;
      }
    }
  }

  const localProviders = catalog.length > 0 ? catalog : null;
  if (switchMenuActive) {
    const resolveRoute = makeRouteResolver(
      localProviders,
    );
    const startingRoute = resolveRoute(activeProvider.id, selectedModel.id) ?? null;
    if (!startingRoute) {
      p.log.error('Could not resolve a proxy route for the selected model.');
      return 1;
    }
    const { routes: catalogRoutes, droppedFavorites } = buildCatalogRoutes(startingRoute, favorites, resolveRoute);
    if (droppedFavorites.length > 0) {
      p.log.warn(
        `Skipping ${droppedFavorites.length} favorite${droppedFavorites.length === 1 ? '' : 's'} `
        + 'that are no longer available in /model',
      );
    }

    if (dryRun) {
      const endpoint = selectedModel.baseUrl ?? selectedModel.completionsUrl ?? '(unknown)';
      console.log('');
      console.log(pc.bold(pc.cyan('  DRY RUN — would execute (switch-menu mode):')));
      console.log('');
      console.log(`  ${pc.bold('Provider:')}      ${activeProvider.name}`);
      console.log(`  ${pc.bold('Starting model:')} ${selectedModel.id}`);
      console.log(`  ${pc.bold('Endpoint:')}      ${endpoint}`);
      console.log(`  ${pc.bold('/model catalog:')} ${catalogRoutes.length} model(s)`);
      catalogRoutes.forEach(r => console.log(`    ${pc.dim(r.displayName)}`));
      console.log('');
      console.log(pc.dim('  (dry run complete — Claude Code was NOT launched)'));
      console.log('');
      return 0;
    }

    return launchClaudeViaCatalog(
      catalogRoutes,
      startingRoute,
      selectedModel.contextWindow,
      trace ?? false,
      claudeArgs,
    );
  }

  // ── Single-model path ──

  if (dryRun) {
    const formatDesc = selectedModel.modelFormat === 'anthropic'
      ? 'direct passthrough'
      : 'via SDK adapter proxy';
    const endpoint = selectedModel.modelFormat === 'anthropic'
      ? (selectedModel.baseUrl ?? '(unknown)')
      : (selectedModel.npm ?? 'SDK');
    console.log('');
    console.log(pc.bold(pc.cyan('  DRY RUN — would execute:')));
    console.log('');
    console.log(`  ${pc.bold('Provider:')}  ${activeProvider.name}`);
    console.log(`  ${pc.bold('Model:')}     ${selectedModel.id}`);
    console.log(`  ${pc.bold('Format:')}    ${selectedModel.modelFormat} (${formatDesc})`);
    console.log(`  ${pc.bold(selectedModel.modelFormat === 'anthropic' ? 'Endpoint:' : 'SDK npm:')} ${endpoint}`);
    console.log(`  ${pc.bold('Key:')}       ${activeProvider.name} provider key`);
    console.log('');
    console.log(pc.dim('  (dry run complete — Claude Code was NOT launched)'));
    console.log('');
    return 0;
  }

  const launchApiKey = await resolveLocalProviderApiKey(activeProvider);
  if (!launchApiKey?.trim()) {
    p.log.error(
      `No credential found for ${activeProvider.name}. Add a key with anygate providers or set OPENCODE_API_KEY.`,
    );
    return 1;
  }

  let proxyHandle: ProxyHandle | null = null;
  let childEnv: NodeJS.ProcessEnv;

  const isAntigravityOAuth = activeProvider.id === 'antigravity' && activeProvider.authType === 'oauth';
  const isOAuthAnthropic = selectedModel.modelFormat === 'anthropic' && activeProvider.authType === 'oauth' && !isAntigravityOAuth;

  if (isAntigravityOAuth) {
    // Antigravity OAuth — proxy translates Anthropic → Cloud Code Assist format.
    try {
      proxyHandle = await startProxy(
        ANTIGRAVITY_BASE_URLS[0],
        selectedModel.id,
        trace ?? false,
        selectedModel.contextWindow,
        {
          providerId: activeProvider.id,
          authType: 'oauth',
          providerData: activeProvider.providerData,
          modelFormat: 'cloud-code',
          app: 'Antigravity',
        },
        launchApiKey,
      );
      if (!isAgentStdoutMode()) p.log.info(`Cloud Code proxy started on port ${proxyHandle.port}`);
    } catch (err) {
      p.log.error(`Failed to start Cloud Code proxy: ${err instanceof Error ? err.message : String(err)}`);
      return 1;
    }
    childEnv = buildChildEnv(
      `http://127.0.0.1:${proxyHandle.port}`,
      selectedModel.id,
      proxyHandle.token,
      proxyHandle.port,
      selectedModel.contextWindow,
    );
  } else if (isOAuthAnthropic) {
    // Claude Code OAuth — proxy injects compatibility metadata and Bearer auth.
    try {
      proxyHandle = await startProxy(
        selectedModel.baseUrl ?? 'https://api.anthropic.com',
        selectedModel.id,
        trace ?? false,
        selectedModel.contextWindow,
        {
          providerId: activeProvider.id,
          authType: 'oauth',
          oauthAccountId: activeProvider.oauthAccountId,
          providerData: activeProvider.providerData,
          modelFormat: 'anthropic',
          app: 'Claude',
        },
        launchApiKey,
      );
      if (!isAgentStdoutMode()) p.log.info(`OAuth proxy started on port ${proxyHandle.port}`);
    } catch (err) {
      p.log.error(`Failed to start OAuth proxy: ${err instanceof Error ? err.message : String(err)}`);
      return 1;
    }
    childEnv = buildChildEnv(
      `http://127.0.0.1:${proxyHandle.port}`,
      selectedModel.id,
      proxyHandle.token,
      proxyHandle.port,
      selectedModel.contextWindow,
    );
  } else if (selectedModel.modelFormat === 'anthropic') {
    childEnv = buildChildEnv(
      selectedModel.baseUrl!,
      selectedModel.id,
      launchApiKey,
      undefined,
      selectedModel.contextWindow,
    );
  } else {
    try {
      proxyHandle = await startProxy(
        selectedModel.completionsUrl ?? '',
        selectedModel.id,
        trace ?? false,
        selectedModel.contextWindow,
        {
          npm: selectedModel.npm,
          baseURL: selectedModel.apiBaseUrl,
          upstreamModelId: selectedModel.upstreamModelId,
          providerId: activeProvider.id,
          authType: activeProvider.authType,
          oauthAccountId: activeProvider.oauthAccountId,
          supportedParameters: selectedModel.supportedParameters,
          reasoning: selectedModel.reasoning,
          interleavedReasoningField: selectedModel.interleavedReasoningField,
          useResponsesLite: selectedModel.useResponsesLite,
          preferWebSockets: selectedModel.preferWebSockets,
          app: 'Claude',
        },
        launchApiKey,
      );
      if (!isAgentStdoutMode()) {
        p.log.info(
          `SDK adapter proxy started on port ${proxyHandle.port}` +
          (selectedModel.npm ? pc.dim(` (${selectedModel.npm})`) : ''),
        );
      }
    } catch (err) {
      p.log.error(`Failed to start SDK adapter proxy: ${err instanceof Error ? err.message : String(err)}`);
      return 1;
    }
    childEnv = buildChildEnv(
      `http://127.0.0.1:${proxyHandle.port}`,
      selectedModel.id,
      proxyHandle.token,
      proxyHandle.port,
      selectedModel.contextWindow,
    );
  }

  if (selectedModel.modelFormat === 'anthropic' && !isOAuthAnthropic) {
    childEnv['CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS'] = '1';
  }

  const debugLogPath = prepareClaudeTraceLog();
  const traceArgs = trace ? ['--debug-file', debugLogPath] : [];
  if (trace) p.log.info(`Debug log: ${debugLogPath}`);

  const exitCode = await launchClaude(
    childEnv,
    claudeCodeClientModelId(selectedModel.id, selectedModel.contextWindow),
    [...traceArgs, ...claudeArgs],
  );
  proxyHandle?.close();
  if (trace) printTraceLog(debugLogPath);
  return exitCode;
}

async function launchClaudeViaCatalog(
  catalogRoutes: ProxyRoute[],
  startingRoute: ProxyRoute,
  contextWindow: number | undefined,
  trace: boolean,
  claudeArgs: string[],
): Promise<number> {
  let proxyHandle: ProxyHandle;
  try {
    proxyHandle = await startProxyCatalog(catalogRoutes, startingRoute.aliasId, trace);
    p.log.info(
      `Switch menu active — proxy on port ${proxyHandle.port} ` +
      pc.dim(`(${catalogRoutes.length} model${catalogRoutes.length !== 1 ? 's' : ''} in /model)`),
    );
  } catch (err) {
    p.log.error(`Failed to start proxy: ${err instanceof Error ? err.message : String(err)}`);
    return 1;
  }

  const childEnv = buildChildEnv(
    `http://127.0.0.1:${proxyHandle.port}`,
    startingRoute.aliasId,
    proxyHandle.token,
    proxyHandle.port,
    contextWindow,
    true,
  );

  const debugLogPath = prepareClaudeTraceLog();
  const traceArgs = trace ? ['--debug-file', debugLogPath] : [];
  if (trace) p.log.info(`Debug log: ${debugLogPath}`);

  const exitCode = await launchClaude(
    childEnv,
    claudeCodeClientModelId(startingRoute.aliasId, contextWindow),
    [...traceArgs, ...claudeArgs],
  );
  proxyHandle.close();
  if (trace) printTraceLog(debugLogPath);
  return exitCode;
}