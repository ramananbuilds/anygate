import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseDdgHtml, searchDuckDuckGo } from '../../src/gateway/web-search/duckduckgo.js';

const FIXTURE = `
<div class="results">
  <div class="result">
    <a class="result__a" href="/redirect?uddg=https%3A%2F%2Fnews.example.com%2Farticle">Big News Headline</a>
    <a class="result__snippet">A summary of the breaking news from example.</a>
  </div>
  <div class="result">
    <a class="result__a" href="/redirect?uddg=https%3A%2F%2Fblog.test.org%2Fpost">Another Story</a>
    <a class="result__snippet">Some other snippet text here.</a>
  </div>
</div>
`;

describe('parseDdgHtml', () => {
  it('extracts title, decoded url, and snippet from result blocks', () => {
    const results = parseDdgHtml(FIXTURE, 5);
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      title: 'Big News Headline',
      url: 'https://news.example.com/article',
      snippet: 'A summary of the breaking news from example.',
    });
    expect(results[1]).toEqual({
      title: 'Another Story',
      url: 'https://blog.test.org/post',
      snippet: 'Some other snippet text here.',
    });
  });

  it('respects the max result count', () => {
    expect(parseDdgHtml(FIXTURE, 1)).toHaveLength(1);
  });

  it('decodes HTML entities in titles and snippets', () => {
    const html = `<a class="result__a" href="/redirect?uddg=https%3A%2F%2Fx.com">Tom &amp; Jerry</a><a class="result__snippet">A &lt;tag&gt; &amp; more</a>`;
    const [r] = parseDdgHtml(html, 5);
    expect(r.title).toBe('Tom & Jerry');
    expect(r.snippet).toBe('A <tag> & more');
  });
});

describe('searchDuckDuckGo', () => {
  it('POSTs to the HTML endpoint and returns parsed results', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => FIXTURE });
    vi.stubGlobal('fetch', fetchMock);

    const results = await searchDuckDuckGo('latest news', { maxResults: 5 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://html.duckduckgo.com/html/');
    expect(init.method).toBe('POST');
    expect(String(init.body)).toContain('q=latest+news');
    expect(results).toHaveLength(2);
    expect(results[0].url).toBe('https://news.example.com/article');
  });

  it('throws on non-ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503, text: async () => '' }));
    await expect(searchDuckDuckGo('x')).rejects.toThrow(/503/);
  });
});
