import { describe, expect, it } from 'vitest'
import { truncateString, slugify } from '../../src/utils/string.js'

describe('truncateString', () => {
  it('returns short strings unchanged', () => {
    expect(truncateString('hello', 10)).toBe('hello')
  })

  it('returns string when length equals maxLength', () => {
    expect(truncateString('hello', 5)).toBe('hello')
  })

  it('truncates long strings with ellipsis', () => {
    expect(truncateString('hello world', 8)).toBe('hello...')
  })

  it('truncates to maxLength including ellipsis', () => {
    const result = truncateString('hello world', 8)
    expect(result).toHaveLength(8)
  })

  it('handles empty string', () => {
    expect(truncateString('', 5)).toBe('')
  })

  it('handles truncation to 3 characters', () => {
    expect(truncateString('abcdef', 3)).toBe('...')
  })

  it('truncates to maxLength characters for short strings', () => {
    expect(truncateString('hello world', 7)).toBe('hell...')
  })
})

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('HELLO')).toBe('hello')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('hello!@#$world')).toBe('hello-world')
  })

  it('handles multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })

  it('handles leading and trailing spaces', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('handles mixed case with spaces', () => {
    expect(slugify('Hello World Foo')).toBe('hello-world-foo')
  })

  it('handles numbers', () => {
    expect(slugify('model 4o')).toBe('model-4o')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles string with only special characters', () => {
    expect(slugify('!!!')).toBe('')
  })

  it('handles underscores', () => {
    expect(slugify('hello_world')).toBe('hello-world')
  })
})
