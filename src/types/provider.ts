import type { LocalProviderModel } from './model.js'
import type { ProviderTemplate } from '../registry/templates/provider-templates.js'

export interface LocalProvider {
  id: string
  name: string
  apiKey: string
  authType?: 'api' | 'oauth' | 'none'
  oauthAccountId?: string
  providerData?: Record<string, unknown>
  headers?: Record<string, string>
  models: LocalProviderModel[]
  inRegistry?: boolean
  template?: ProviderTemplate
}
