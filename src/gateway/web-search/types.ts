// Types for gateway-side web search (free, works on non-Anthropic upstreams).

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface SearchOptions {
  maxResults?: number;
  allowedDomains?: string[];
  blockedDomains?: string[];
}

export type WebSearchProviderId = 'duckduckgo' | 'searxng' | 'brave' | 'tavily';

export interface WebSearchConfig {
  enabled: boolean;
  provider: WebSearchProviderId;
  searxngUrl?: string;
  apiKey?: string;
  maxResults: number;
}
