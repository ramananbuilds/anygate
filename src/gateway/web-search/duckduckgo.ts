// Keyless DuckDuckGo web search (free, no API key). Unofficial HTML scrape —
// best-effort default. May break if DuckDuckGo changes its markup; prefer
// SearXNG (searxng.ts) for a reliable free backend the user runs themselves.

import type { SearchOptions, SearchResult } from './types.js';

const DDG_HTML_URL = 'https://html.duckduckgo.com/html/';

function decodeDdgUrl(href: string): string {
  try {
    const url = new URL(href, DDG_HTML_URL);
    const uddg = url.searchParams.get('uddg');
    if (uddg) return decodeURIComponent(uddg);
    return url.href;
  } catch {
    return href;
  }
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseDdgHtml(html: string, max: number): SearchResult[] {
  const results: SearchResult[] = [];
  const linkRe = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html)) !== null && results.length < max) {
    const href = decodeDdgUrl(m[1]);
    const title = stripHtml(m[2]);
    const after = html.slice(m.index + m[0].length);
    const snipMatch = after.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);
    const snippet = snipMatch ? stripHtml(snipMatch[1]) : '';
    if (title && href) results.push({ title, url: href, snippet });
  }
  return results;
}

export async function searchDuckDuckGo(query: string, opts?: SearchOptions): Promise<SearchResult[]> {
  const max = opts?.maxResults ?? 5;
  const body = new URLSearchParams({ q: query }).toString();
  const res = await fetch(DDG_HTML_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    },
    body,
  });
  if (!res.ok) throw new Error(`DuckDuckGo search failed: ${res.status}`);
  const html = await res.text();
  return parseDdgHtml(html, max);
}
