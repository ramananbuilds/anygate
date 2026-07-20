import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchSearXNG } from '../../src/gateway/web-search/searxng.js';

describe('searchSearXNG', () => {
  it('requests JSON format and maps results, skipping entries without url/title', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        { title: 'Keep Me', url: 'https://keep.example.com', content: 'good content' },
        { title: 'No Url', content: 'should be dropped' },
        { url: 'https://notitle.example.com', content: 'also dropped' },
        { title: 'Keep Too', url: 'https://keep2.example.com', content: 'more' },
      ],
    });
    vi.stubGlobal('fetch', fetchMock);

    const results = await searchSearXNG('query', 'http://localhost:8080');

    const [url] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('http://localhost:8080/search');
    expect(String(url)).toContain('format=json');
    expect(String(url)).toContain('q=query');
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({ title: 'Keep Me', url: 'https://keep.example.com', snippet: 'good content' });
    expect(results[1].title).toBe('Keep Too');
  });

  it('respects maxResults', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [
          { title: 'a', url: 'https://a.com', content: 'x' },
          { title: 'b', url: 'https://b.com', content: 'y' },
          { title: 'c', url: 'https://c.com', content: 'z' },
        ],
      }),
    );
    const results = await searchSearXNG('q', 'http://localhost:8080', { maxResults: 2 });
    expect(results).toHaveLength(2);
  });

  it('throws on non-ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
    await expect(searchSearXNG('q', 'http://localhost:8080')).rejects.toThrow(/500/);
  });
});
