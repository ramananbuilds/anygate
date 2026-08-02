export type StarterCommand =
  | 'root'
  | 'claude'
  | 'claude-app'
  | 'codex'
  | 'codex-app'
  | 'server'
  | 'models'
  | 'providers'
  | 'gemini'
  | 'agy'
  | 'antigravity'
  | 'antigravity-ide'
  | 'ui'
  | 'doctor'
  | 'completions'
  | 'update'

export interface ConflictInfo {
  name: string
  value: string
}

export interface ParsedArgs {
  command: StarterCommand
  backend?: 'zen' | 'go'
  model?: string
  provider?: string
  help?: boolean
  version?: boolean
  showHelp?: boolean
  showVersion?: boolean
  setup?: boolean
  trace?: boolean
  dryRun?: boolean
  restore?: boolean
  favorites?: boolean
  favoritesAgy?: boolean
  yes?: boolean
  noAuth?: boolean
  listen?: 'local' | 'network'
  password?: string
  cwd?: string
  wait?: boolean
  positionalModel?: string
  childArgs?: string[]
  claudeArgs: string[]
  launchProvider?: string
  launchModel?: string
  vertex?: boolean
  completionsShell?: string
  serverQuick?: boolean
  serverListenMode?: 'local' | 'network'
  serverProvidersMode?: 'all' | 'favorites' | 'specific'
  serverProviderIds?: string[]
  serverFreeOnly?: boolean
  serverMaskGatewayIds?: boolean
  serverPassword?: string
  error?: string
  showAi?: boolean
  aiInstall?: boolean
  aiInstallForce?: boolean
  force?: boolean
  validateProvider?: string
  validateSubcommand?: boolean
}

export interface FavoriteModel {
  providerId: string
  modelId: string
}

export interface UserPreferences {
  lastBackend?: 'zen' | 'go'
  lastModel?: string
  lastProvider?: string
  lastCodexProvider?: string
  lastCodexModel?: string
  lastGeminiProvider?: string
  lastGeminiModel?: string
  lastAntigravityProvider?: string
  lastAntigravityModel?: string
  recentModelsByProvider?: Record<string, string[]>
  favoriteModels?: FavoriteModel[]
  antigravityCliFavoriteModels?: FavoriteModel[]
  antigravityCliFavoritesHintShown?: boolean
  subscriptionTier?: 'free' | 'go' | 'both'
  recentLaunchFolders?: string[]
  serverExposedProviders?: string[]
  serverMaskGatewayIds?: boolean
  serverFavoritesOnly?: boolean
  savedServerPassword?: string
  appPathOverrides?: Record<string, string>
  server?: {
    exposedProviders?: string[]
    maskGatewayIds?: boolean
    favoritesOnly?: boolean
    password?: string
    savedPassword?: string
    freeModelsOnly?: boolean
    listenMode?: 'local' | 'network'
  }
}
