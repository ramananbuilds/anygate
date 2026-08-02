export function dedupeArray<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

/**
 * Deduplicates items by a key function, preserving first-occurrence order.
 * Optionally caps the result to `max` items.
 *
 * Used by both `buildFavoritesList` (favorites-resolver) and
 * `buildCatalogRoutes` (provider-catalog) to avoid duplicating the
 * "dedup + cap" pattern.
 */
export function dedupeByKey<T>(items: T[], keyFn: (item: T) => string, max?: number): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of items) {
    const key = keyFn(item)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
    if (max !== undefined && out.length >= max) break
  }
  return out
}

export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}
