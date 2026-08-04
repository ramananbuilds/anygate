import pc from 'picocolors'
import * as p from '@clack/prompts'
import {
  fetchProviderCatalog,
  providersForPicker,
  localProvidersToServerModels,
} from '../../registry/provider-catalog.js'
import { resolveLocalProviderApiKey } from '../../../src/storage/credentials.js'
import { CredentialUnavailableError } from '../../../src/shared/errors.js'
import { loadPreferences, savePreferences } from '../../../src/storage/config.js'
import { resolveApiKey, readFromCredentialStore } from '../../../src/config/env.js'
import { resolveOrCollectApiKey } from '../../apps/shared/key-setup.js'
import { pickCodexProvider, pickCodexModel } from '../codex/prompts.js'
import { resolveBootSelection } from '../codex/favorites-launch.js'
import { codexCompatibleProviders, routableModelsForProvider } from '../codex/routing.js'
import { providersForTarget } from '../../apps/shared/target-compatibility.js'
import { navOption } from '../../apps/shared/ui.js'
import { startServer, type ServerHandle } from '../../../src/gateway/server/router.js'
import {
  createGatewayModelCatalog,
  type ServerModelInfo,
} from '../../../src/gateway/server/models.js'
import { BACKENDS } from '../../../src/config/constants.js'
import { filterServerModelsByFavorites } from '../../../src/gateway/server/catalog-filter.js'
import { writeAnygateIConfig, getClaudeDesktopHome } from './desktop-app.js'
import { getProxyDebugLogPath } from '../../apps/shared/trace-log.js'
import {
  readSessionLock,
  recoverSession,
  hasStaleSession,
  writeSessionLock,
  setupExitCleanup,
  cleanupSession,
  backupMetaJson,
  isConcurrentLiveSession,
  waitForShutdown,
} from './desktop-session.js'
import {
  launchOrRestartClaudeApp,
  claudeAppSupported,
  isClaudeAppRunning,
  quitClaudeAppGracefully,
} from './desktop-launch.js'
import type { LocalProvider, LocalProviderModel, FavoriteModel } from '../../../src/types/index.js'
import {
  buildCloudCodeProxyRoute,
  startCloudCodeCatalogBackend,
  type CloudCodeBackend,
} from '../shared/cloud-code-backend.js'
import type { ProxyRoute } from '../../../src/gateway/proxy/anthropic-proxy.js'

export function claudeAppHelpText(): string {
  return `${pc.bold('anygate claude-app')} — launch Claude Desktop app in 3P mode with your registry providers

${pc.bold('Usage:')}
  anygate claude-app [options]
  anygate claude-app --trace
  anygate claude-app --restore
  anygate claude-app --help
  anygate claude-app --version

${pc.bold('Options:')}
  --trace      Write proxy debug logs to ~/.anygate/logs/
  --restore    Restore Claude Desktop config after an interrupted app session
  --help       Show this command help
  --version    Show version

${pc.bold('Description:')}
  Picks a provider and model from ~/.anygate/providers.json, patches Claude Desktop config
  (with backup + restore on Ctrl+C), starts a local Responses proxy, and opens
  the Claude Desktop app. Keep this terminal open while using Claude.

${pc.bold('Platforms:')}
  macOS and Windows. Linux is not supported.

${pc.bold('Cleanup:')}
  Ctrl+C stops the proxy and restores your previous Claude config.
  After a crash: anygate claude-app --restore
`
}

function providerForClaudePicker(provider: LocalProvider): LocalProvider {
  return { ...provider, models: routableModelsForProvider(provider, 'claude-app') }
}

export function modelToServerModelInfo(
  model: LocalProviderModel,
  provider: LocalProvider,
  overrides: Partial<ServerModelInfo> = {}
): ServerModelInfo {
  return {
    id: model.id,
    name: model.name,
    isFree: model.isFree ?? false,
    brand: model.brand ?? '',
    providerLabel: provider.name,
    providerId: provider.id,
    sourceBackend: provider.id,
    modelFormat: model.modelFormat,
    upstreamModelId: model.upstreamModelId,
    cost: model.cost,
    baseUrl: model.baseUrl,
    completionsUrl: model.completionsUrl,
    npm: model.npm,
    apiBaseUrl: model.apiBaseUrl,
    apiKey: provider.apiKey,
    authType: provider.authType,
    oauthAccountId: provider.oauthAccountId,
    contextWindow: model.contextWindow,
    supportedParameters: model.supportedParameters,
    reasoning: model.reasoning,
    interleavedReasoningField: model.interleavedReasoningField,
    headers: provider.headers,
    ...overrides,
  }
}

export async function runClaudeAppCommand(
  args: string[],
  boot?: { launchProvider?: string; launchModel?: string; launchAllModels?: boolean }
): Promise<number> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(claudeAppHelpText())
    return 0
  }

  if (args.includes('--restore')) {
    recoverSession()
    console.log('Restored Claude Desktop anygate config.')
    return 0
  }

  const trace = args.includes('--trace')
  const useFavoritesCatalog = args.includes('--favorites')
  const debugLogPath = trace ? getProxyDebugLogPath() : undefined
  if (trace) console.log(`Debug log: ${debugLogPath}`)

  try {
    claudeAppSupported()
  } catch (err) {
    console.error(pc.red(String(err instanceof Error ? err.message : err)))
    return 1
  }

  const isTty = Boolean(process.stdin.isTTY)
  if (!isTty) {
    console.error(pc.red('anygate claude-app requires an interactive terminal.'))
    return 1
  }

  if (isConcurrentLiveSession()) {
    console.error(pc.yellow(`Another anygate claude-app session may be running.`))
    console.error('Stop it with Ctrl+C in that terminal.')
    return 1
  }

  if (hasStaleSession()) {
    p.log.warn('Recovered from an interrupted claude-app session.')
    recoverSession()
  }

  const catalogSpinner = p.spinner()
  catalogSpinner.start('Loading your providers...')
  let catalog
  try {
    catalog = await fetchProviderCatalog({ agent: 'codex-app' })
  } catch (err) {
    catalogSpinner.stop('')
    console.error(pc.red(String(err instanceof Error ? err.message : err)))
    return 1
  }
  catalogSpinner.stop('')

  const compatible = codexCompatibleProviders(providersForPicker(catalog), 'claude-app')
  if (compatible.length === 0) {
    p.log.warn('No compatible providers in your registry.')
    return 0
  }

  const prefs = loadPreferences()
  const favorites = prefs.favoriteModels ?? []
  const hasFavorites = favorites.length > 0
  const launchAllModels = Boolean(boot?.launchAllModels || boot?.launchModel === 'All')

  let activeProvider: LocalProvider | null = null
  let selectedModel: any = null
  let useFavorites = false
  let useProviderAll = false

  if (boot?.launchProvider && launchAllModels) {
    const foundProvider = compatible.find(lp => lp.id === boot.launchProvider)
    if (!foundProvider) {
      p.log.error(`Provider not found: ${boot.launchProvider}`)
      return 1
    }
    activeProvider = foundProvider
    selectedModel = activeProvider.models[0]!
    useProviderAll = true
  } else if (boot?.launchProvider && boot?.launchModel) {
    const bootSelection = resolveBootSelection(
      compatible,
      boot.launchProvider,
      boot.launchModel,
      providerForClaudePicker
    )
    if ('error' in bootSelection) {
      p.log.error(bootSelection.error)
      return 1
    }
    activeProvider = bootSelection.provider
    selectedModel = bootSelection.model
  } else if (useFavoritesCatalog && hasFavorites) {
    // Non-interactive favorites launch: skip the provider/model picker and go
    // straight into the multi-route catalog so the app's model switcher shows
    // every favorite. Triggered by `anygate claude-app --favorites` (e.g. from the UI).
    useFavorites = true
  } else {
    const pickedProvider = await pickCodexProvider(
      compatible,
      prefs,
      hasFavorites,
      undefined,
      'Claude'
    )
    if (!pickedProvider) return 0

    if (pickedProvider === '__favorites__') {
      useFavorites = true
    } else {
      while (true) {
        const pickedProvider = await pickCodexProvider(
          compatible,
          prefs,
          hasFavorites,
          undefined,
          'Claude'
        )
        if (!pickedProvider) return 0

        if (pickedProvider === '__favorites__') {
          useFavorites = true
          break
        } else {
          activeProvider = providerForClaudePicker(pickedProvider)

          const modelModeChoice = await p.select<string>({
            message: `Launch mode for ${activeProvider.name}?`,
            options: [
              {
                value: 'specific',
                label: 'One model',
                hint: 'Pick a specific model',
              },
              {
                value: 'all',
                label: `All models (${activeProvider.models.length})`,
                hint: 'Every model from this provider in the model picker',
              },
              navOption('__back__', '← Back', 'Choose a different provider'),
            ],
          })
          if (p.isCancel(modelModeChoice) || modelModeChoice === '__back__') continue

          if (modelModeChoice === 'all') {
            useProviderAll = true
            selectedModel = activeProvider.models[0]!
            break
          }

          const pickedModel = await pickCodexModel(activeProvider, prefs)
          if (!pickedModel) return 0
          selectedModel = pickedModel
          break
        }
      }
    }
  }

  if (activeProvider) {
    const apiKey = await resolveLocalProviderApiKey(activeProvider)
    if (!apiKey) {
      p.log.error(new CredentialUnavailableError(activeProvider.id).userMessage)
      return 1
    }

    activeProvider.apiKey = apiKey
  }

  let serverModels: ServerModelInfo[] = []
  let cloudCodeBackend: CloudCodeBackend | null = null
  let cloudCodeFavBackend: CloudCodeBackend | null = null

  if (useFavorites) {
    // Identify cloud-code favorites from the already-fetched catalog
    const antigravityProvider = catalog.find((lp: LocalProvider) => lp.id === 'antigravity')
    const cloudCodeFavoriteModels = favorites
      .map((fav: FavoriteModel) => {
        if (fav.providerId !== 'antigravity') return null
        const model = antigravityProvider?.models.find(
          (m: LocalProviderModel) => m.id === fav.modelId
        )
        return model?.modelFormat === 'cloud-code' ? model : null
      })
      .filter((m): m is import('../../types/index.js').LocalProviderModel => m !== null)

    const regularFavorites = favorites.filter(
      fav =>
        !cloudCodeFavoriteModels.some(m => m.id === fav.modelId && fav.providerId === 'antigravity')
    )

    // Start cloud-code backend if any cloud-code favorites
    let cloudCodeServerModels: ServerModelInfo[] = []

    if (cloudCodeFavoriteModels.length > 0 && antigravityProvider?.apiKey) {
      const cloudRoutes: ProxyRoute[] = cloudCodeFavoriteModels.map(model =>
        buildCloudCodeProxyRoute(
          model,
          antigravityProvider.apiKey,
          (antigravityProvider.providerData ?? {}) as Record<string, unknown>
        )
      )
      const startingAlias = cloudRoutes[0]!.aliasId
      cloudCodeFavBackend = await startCloudCodeCatalogBackend(cloudRoutes, startingAlias, trace)
      const favBackend = cloudCodeFavBackend
      cloudCodeServerModels = cloudCodeFavoriteModels.map(model =>
        modelToServerModelInfo(model, antigravityProvider, {
          isFree: false,
          providerId: 'antigravity',
          sourceBackend: 'antigravity',
          modelFormat: 'anthropic' as const,
          cost: undefined,
          baseUrl: `http://127.0.0.1:${favBackend.port}`,
          completionsUrl: undefined,
          npm: undefined,
          apiBaseUrl: undefined,
          apiKey: favBackend.token,
          authType: undefined,
          oauthAccountId: undefined,
          headers: undefined,
        })
      )
    }

    // Load remaining (non-cloud-code) favorites via the same catalog/agent used by
    // the picker (claude-app), NOT the server agent — the server target drops some
    // model formats and can normalize provider ids differently, which silently
    // shrinks the favorites catalog to a single model.
    const regularLocalProviders = providersForTarget(catalog, 'claude-app')
    const regularAllModels: ServerModelInfo[] = regularLocalProviders.flatMap(provider =>
      localProvidersToServerModels([provider])
    )
    const regularServerModels = filterServerModelsByFavorites(regularAllModels, regularFavorites)
    serverModels = [...cloudCodeServerModels, ...regularServerModels]

    // Drop duplicate (providerId, id) entries — some registries list a model
    // twice, which would otherwise surface as a repeated discovery id and can
    // make the client picker collapse to fewer rows than expected.
    const seen = new Set<string>()
    serverModels = serverModels.filter(m => {
      const key = `${m.providerId}:${m.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  } else if (useProviderAll) {
    // All models from the selected provider — build server models for every
    // routable model, routing cloud-code models through a backend proxy.
    const routableProvider = providersForTarget(catalog, 'claude-app').find(
      lp => lp.id === activeProvider!.id
    )
    const allServerModels = localProvidersToServerModels(
      routableProvider ? [routableProvider] : [activeProvider!]
    )
    const cloudCodeIndices = allServerModels
      .map((m, i) => (m.modelFormat === 'cloud-code' ? i : -1))
      .filter(i => i >= 0)

    if (cloudCodeIndices.length > 0 && activeProvider!.apiKey) {
      const providerData = (activeProvider!.providerData ?? {}) as Record<string, unknown>
      const cloudCodeModels = cloudCodeIndices.map(i => allServerModels[i]!)
      const cloudRoutes = cloudCodeModels.map(model =>
        buildCloudCodeProxyRoute(
          { id: model.id, name: model.name, modelFormat: 'cloud-code' } as LocalProviderModel,
          activeProvider!.apiKey,
          providerData
        )
      )
      const startingAlias = cloudRoutes[0]!.aliasId
      cloudCodeBackend = await startCloudCodeCatalogBackend(
        cloudRoutes,
        startingAlias,
        trace,
        'claude-desktop'
      )
      const backend = cloudCodeBackend
      for (let idx of cloudCodeIndices) {
        const m = allServerModels[idx]!
        allServerModels[idx] = {
          ...m,
          modelFormat: 'anthropic',
          baseUrl: `http://127.0.0.1:${backend.port}`,
          apiBaseUrl: undefined,
          apiKey: backend.token,
          completionsUrl: undefined,
          authType: undefined,
          oauthAccountId: undefined,
          headers: undefined,
        }
      }
    }

    // Drop duplicate (providerId, id) entries
    const seen = new Set<string>()
    serverModels = allServerModels.filter(m => {
      const key = `${m.providerId}:${m.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  } else if (selectedModel.modelFormat === 'cloud-code') {
    const providerData = (activeProvider!.providerData ?? {}) as Record<string, unknown>
    const cloudRoute = buildCloudCodeProxyRoute(selectedModel, activeProvider!.apiKey, providerData)
    cloudCodeBackend = await startCloudCodeCatalogBackend([cloudRoute], cloudRoute.aliasId, trace)
    serverModels = [
      modelToServerModelInfo(selectedModel, activeProvider!, {
        modelFormat: 'anthropic',
        baseUrl: `http://127.0.0.1:${cloudCodeBackend.port}`,
        completionsUrl: undefined,
        npm: undefined,
        apiBaseUrl: undefined,
        apiKey: cloudCodeBackend.token,
        authType: undefined,
        oauthAccountId: undefined,
        headers: undefined,
      }),
    ]
  } else {
    serverModels = [modelToServerModelInfo(selectedModel, activeProvider!)]
  }

  let proxyHandle: ServerHandle | null = null
  let sessionActive = false
  let uuid = ''

  try {
    backupMetaJson()

    proxyHandle = await startServer({
      host: '127.0.0.1',
      port: 0, // random port
      apiKey: 'dummy',
      serverPassword: null,
      catalog: createGatewayModelCatalog(serverModels, { maskGatewayIds: true }),
      backends: BACKENDS,
      gateway: { maskGatewayIds: true },
      debugLogPath,
      // Claude Desktop embeds the gateway router rather than running
      // `anygate server`, so attribute its traffic to the app, not 'gateway'.
      app: 'claude-desktop',
    })

    uuid = writeAnygateIConfig(proxyHandle.port)

    writeSessionLock({
      pid: process.pid,
      startedAt: new Date().toISOString(),
      uuid,
      proxyPort: proxyHandle.port,
    })
    sessionActive = true
    setupExitCleanup(uuid)

    if (!useFavorites) {
      const prevRecent = prefs.recentModelsByProvider?.[activeProvider!.id] ?? []
      const updatedRecent = [
        selectedModel.id,
        ...prevRecent.filter((id: string) => id !== selectedModel.id),
      ].slice(0, 3)
      savePreferences({
        lastCodexProvider: activeProvider!.id,
        lastCodexModel: selectedModel.id,
        recentModelsByProvider: {
          ...prefs.recentModelsByProvider,
          [activeProvider!.id]: updatedRecent,
        },
      })
    }

    console.log(`\n${pc.green('✔')} Proxy started on port ${proxyHandle.port}`)

    try {
      await launchOrRestartClaudeApp()
    } catch (err) {
      p.log.warn(String(err instanceof Error ? err.message : err))
    }

    console.log(`\n${pc.bold('Claude Desktop 3P Mode Active')}`)
    if (useFavorites) {
      console.log(`${pc.dim('Catalog:')}  Favorite models only`)
    } else if (useProviderAll) {
      console.log(
        `${pc.dim('Catalog:')}  All ${activeProvider!.name} models (${serverModels.length})`
      )
    } else {
      console.log(`${pc.dim('Model:')}    ${selectedModel.id}`)
      console.log(`${pc.dim('Provider:')} ${activeProvider!.name}`)
    }
    console.log(`${pc.cyan('Press Ctrl+C to stop and restore config.')}`)

    await waitForShutdown()
    console.log('')

    // We do cleanup before prompting so that Claude gets restored ASAP
    // and if the user hits Ctrl+C again during the prompt, it's already restored.
    cleanupSession(uuid)
    sessionActive = false
    if (cloudCodeBackend) cloudCodeBackend.handle.close()
    if (cloudCodeFavBackend) cloudCodeFavBackend.handle.close()

    if (isClaudeAppRunning()) {
      const shouldClose = await p.confirm({ message: 'Claude Desktop is still running. Close it?' })
      if (shouldClose && !p.isCancel(shouldClose)) {
        quitClaudeAppGracefully()
      }
    }
    return 0
  } catch (err) {
    if (proxyHandle) await proxyHandle.close()
    if (sessionActive && uuid) {
      cleanupSession(uuid)
    }
    if (cloudCodeBackend) cloudCodeBackend.handle.close()
    if (cloudCodeFavBackend) cloudCodeFavBackend.handle.close()
    return 1
  }
}
