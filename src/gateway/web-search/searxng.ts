// SearXNG web search (free, self-hosted). Reliable when the user runs a local
// instance: `docker run -p 8080:8080 searxng/searxng` then set
// ANYGATE_SEARXNG_URL=http://localhost:8080.

import type { SearchOptions, SearchResult } from './types.js';

interface SearXNGEntry {
  title?: string;
  url?: string;
  content?: string;
}

export async function searchSearXNG(query: string, baseUrl: string, opts?: SearchOptions): Promise<SearchResult[]> {
  const max = opts?.maxResults ?? 5;
  const url = new URL('/search', baseUrl.replace(/\/+$/, ''));
  url.searchParams.set('format', 'json');
  url.searchParams.set('q', query);

  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`SearXNG search failed: ${res.status}`);
  const data = (await res.json()) as SearXNGEntry[];
  return (Array.isArray(data) ? data : [])
    .filter((r) => r.url && r.title)
    .slice(0, max)
    .map((r) => ({ title: r.title ?? '', url: r.url ?? '', snippet: r.content ?? '' }));
}
