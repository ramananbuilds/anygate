// Brave Search API (paid; optional upgrade). Set ANYGATE_SEARCH_API_KEY.

import type { SearchOptions, SearchResult } from './types.js';

interface BraveResult {
  title?: string;
  url?: string;
  description?: string;
}

export async function searchBrave(query: string, apiKey: string, opts?: SearchOptions): Promise<SearchResult[]> {
  const max = opts?.maxResults ?? 5;
  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', String(max));
  if (opts?.allowedDomains?.length) url.searchParams.set('site', opts.allowedDomains.join(','));

  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'X-Subscription-Token': apiKey },
  });
  if (!res.ok) throw new Error(`Brave search failed: ${res.status}`);
  const data = (await res.json()) as { web?: { results?: BraveResult[] } };
  return (data.web?.results ?? [])
    .filter((r) => r.url && r.title)
    .slice(0, max)
    .map((r) => ({ title: r.title ?? '', url: r.url ?? '', snippet: r.description ?? '' }));
}
