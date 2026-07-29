export interface ModelSchema {
  id: string
  name: string
  contextWindow?: number
}

export interface ProviderSchema {
  id: string
  name: string
  authType: 'api' | 'oauth' | 'none'
  models: ModelSchema[]
}
