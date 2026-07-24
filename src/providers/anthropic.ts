export interface AnthropicProviderOptions {
  apiKey?: string;
  baseURL?: string;
}

export function createAnthropicProvider(options: AnthropicProviderOptions = {}) {
  return {
    id: 'anthropic',
    name: 'Anthropic',
    npm: '@ai-sdk/anthropic',
    baseURL: options.baseURL ?? 'https://api.anthropic.com/v1',
    apiKey: options.apiKey,
  };
}
