import type { LocalProvider } from './provider.js';

export interface RegistryStore {
  version: number;
  providers: LocalProvider[];
}

export interface ProviderAuthInfo {
  providerId: string;
  authenticated: boolean;
  authType: 'api' | 'oauth' | 'none';
}
