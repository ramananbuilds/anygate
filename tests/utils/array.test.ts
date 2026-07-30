import { describe, expect, it } from 'vitest'
import { dedupeArray, dedupeByKey, chunkArray } from '../../src/utils/array.js'

describe('dedupeArray', () => {
  it('removes duplicate strings', () => {
    expect(dedupeArray(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c'])
  })

  it('removes duplicate numbers', () => {
    expect(dedupeArray([1, 2, 1, 3, 2, 4])).toEqual([1, 2, 3, 4])
  })

  it('returns empty array for empty input', () => {
    expect(dedupeArray([])).toEqual([])
  })

  it('returns same-length array when no duplicates', () => {
    expect(dedupeArray(['a', 'b', 'c'])).toHaveLength(3)
  })

  it('preserves first occurrence order', () => {
    expect(dedupeArray(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c'])
  })

  it('handles objects by reference equality', () => {
    const obj = { id: 1 }
    expect(dedupeArray([obj, obj, { id: 1 }])).toHaveLength(2)
  })
})

describe('dedupeByKey', () => {
  it('deduplicates by key function', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'a-dup' }, // same id → dropped
    ]
    const result = dedupeByKey(items, item => String(item.id))
    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe('a') // first occurrence wins
  })

  it('preserves first-occurrence order', () => {
    const items = [
      { id: 'b', v: 2 },
      { id: 'a', v: 1 },
      { id: 'b', v: 3 },
      { id: 'c', v: 4 },
    ]
    const result = dedupeByKey(items, item => item.id)
    expect(result.map(r => r.id)).toEqual(['b', 'a', 'c'])
  })

  it('caps to max when provided', () => {
    const items = ['a', 'b', 'c', 'd', 'e']
    expect(dedupeByKey(items, s => s, 3)).toEqual(['a', 'b', 'c'])
  })

  it('returns empty array for empty input', () => {
    expect(dedupeByKey([], _ => '')).toEqual([])
  })

  it('returns all items when no duplicates', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(dedupeByKey(items, item => String(item.id))).toHaveLength(3)
  })

  it('handles composite keys', () => {
    const items = [
      { provider: 'openai', model: 'gpt-4' },
      { provider: 'openai', model: 'gpt-4' },
      { provider: 'openai', model: 'gpt-3.5' },
    ]
    const result = dedupeByKey(items, item => `${item.provider}::${item.model}`)
    expect(result).toHaveLength(2)
  })
})

describe('chunkArray', () => {
  it('chunks array into equal parts', () => {
    expect(chunkArray([1, 2, 3, 4, 5, 6], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
  })

  it('handles remainder in last chunk', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('returns single chunk when chunk size exceeds array length', () => {
    expect(chunkArray([1, 2, 3], 10)).toEqual([[1, 2, 3]])
  })

  it('returns empty array of chunks for empty input', () => {
    expect(chunkArray([], 3)).toEqual([])
  })

  it('handles chunkSize of 1', () => {
    expect(chunkArray([1, 2, 3], 1)).toEqual([[1], [2], [3]])
  })

  it('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5]
    chunkArray(original, 2)
    expect(original).toEqual([1, 2, 3, 4, 5])
  })
})
