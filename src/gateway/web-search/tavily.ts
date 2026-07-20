// Tavily Search API (paid; optional upgrade). Set ANYGATE_SEARCH_API_KEY.

import type { SearchOptions, SearchResult } from './types.js';

interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
}

export async function searchTavily(query: string, apiKey: string, opts?: SearchOptions): Promise<SearchResult[]> {
  const max = opts?.maxResults ?? 5;
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      query,
      max_results: max,
      include_domains: opts?.allowedDomains,
      exclude_domains: opts?.blockedDomains,
    }),
  });
  if (!res.ok) throw new Error(`Tavily search failed: ${res.status}`);
  const data = (await res.json()) as { results?: TavilyResult[] };
  return (data.results ?? [])
    .filter((r) => r.url && r.title)
    .slice(0, max)
    .map((r) => ({ title: r.title ?? '', url: r.url ?? '', snippet: r.content ?? '' }));
}
