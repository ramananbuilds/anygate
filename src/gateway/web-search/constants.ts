// Environment variable names + defaults for gateway-side web search.

export const WEB_SEARCH_ENV = {
  enabled: 'ANYGATE_WEB_SEARCH',
  provider: 'ANYGATE_WEB_SEARCH_PROVIDER',
  searxngUrl: 'ANYGATE_SEARXNG_URL',
  apiKey: 'ANYGATE_SEARCH_API_KEY',
  maxResults: 'ANYGATE_WEB_SEARCH_MAX_RESULTS',
} as const;

export const DEFAULT_MAX_RESULTS = 5;

/** Max SDK steps so a gateway-executed web search can run and the model can answer. */
export const MAX_WEB_SEARCH_STEPS = 5;
