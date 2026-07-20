// Gateway-side web search dispatcher. Free by default (keyless DuckDuckGo);
// optional free upgrade via self-hosted SearXNG; paid Brave/Tavily supported.

import type { SearchOptions, SearchResult, WebSearchConfig, WebSearchProviderId } from './types.js';
import { WEB_SEARCH_ENV, DEFAULT_MAX_RESULTS } from './constants.js';
import { searchDuckDuckGo } from './duckduckgo.js';
import { searchSearXNG } from './searxng.js';
import { searchBrave } from './brave.js';
import { searchTavily } from './tavily.js';

const PROVIDERS: WebSearchProviderId[] = ['duckduckgo', 'searxng', 'brave', 'tavily'];

export function resolveWebSearchConfig(env: NodeJS.ProcessEnv = process.env): WebSearchConfig {
  const enabled = (env[WEB_SEARCH_ENV.enabled] ?? 'on').toLowerCase() !== 'off';
  const providerRaw = (env[WEB_SEARCH_ENV.provider] ?? 'duckduckgo').toLowerCase();
  const provider = (PROVIDERS as string[]).includes(providerRaw)
    ? (providerRaw as WebSearchProviderId)
    : 'duckduckgo';
  const maxRaw = parseInt(env[WEB_SEARCH_ENV.maxResults] ?? '', 10);
  const maxResults = Number.isFinite(maxRaw) && maxRaw > 0 ? maxRaw : DEFAULT_MAX_RESULTS;
  return {
    enabled,
    provider,
    searxngUrl: env[WEB_SEARCH_ENV.searxngUrl] || undefined,
    apiKey: env[WEB_SEARCH_ENV.apiKey] || undefined,
    maxResults,
  };
}

export async function searchWeb(
  query: string,
  opts?: SearchOptions,
  config?: WebSearchConfig,
): Promise<SearchResult[]> {
  const cfg = config ?? resolveWebSearchConfig();
  if (!cfg.enabled) return [];
  const searchOpts: SearchOptions = { maxResults: cfg.maxResults, ...opts };
  switch (cfg.provider) {
    case 'searxng':
      if (!cfg.searxngUrl) throw new Error('ANYGATE_SEARXNG_URL is required for the searxng web search provider');
      return searchSearXNG(query, cfg.searxngUrl, searchOpts);
    case 'brave':
      if (!cfg.apiKey) throw new Error('ANYGATE_SEARCH_API_KEY is required for the brave web search provider');
      return searchBrave(query, cfg.apiKey, searchOpts);
    case 'tavily':
      if (!cfg.apiKey) throw new Error('ANYGATE_SEARCH_API_KEY is required for the tavily web search provider');
      return searchTavily(query, cfg.apiKey, searchOpts);
    case 'duckduckgo':
    default:
      return searchDuckDuckGo(query, searchOpts);
  }
}

export function formatSearchResults(results: SearchResult[]): string {
  if (!results.length) return 'No web search results were found.';
  const lines = results.map((r, i) => `${i + 1}. ${r.title}\n   URL: ${r.url}\n   ${r.snippet}`);
  return `Web search results:\n${lines.join('\n')}`;
}
