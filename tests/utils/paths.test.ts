import { describe, expect, it } from 'vitest'
import { normalize, resolve, sep } from 'node:path'
import { normalizePath, resolveAbsolutePath } from '../../src/utils/paths.js'

describe('normalizePath', () => {
  it('normalizes redundant separators', () => {
    expect(normalizePath(`a${sep}${sep}b`)).toBe(`a${sep}b`)
  })

  it('normalizes current directory references', () => {
    expect(normalizePath(`a${sep}.${sep}b`)).toBe(`a${sep}b`)
  })

  it('normalizes parent directory references', () => {
    expect(normalizePath(`a${sep}b${sep}..${sep}c`)).toBe(`a${sep}c`)
  })

  it('handles simple paths', () => {
    expect(normalizePath('hello')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(normalizePath('')).toBe(normalize(''))
  })

  it('matches node:path normalize', () => {
    expect(normalizePath('a/b/../c')).toBe(normalize('a/b/../c'))
  })
})

describe('resolveAbsolutePath', () => {
  it('resolves relative paths against cwd', () => {
    const result = resolveAbsolutePath('test', 'file.txt')
    expect(result).toBe(resolve('test', 'file.txt'))
    expect(result.endsWith(`test${sep}file.txt`)).toBe(true)
  })

  it('resolves multiple path segments', () => {
    const result = resolveAbsolutePath('a', 'b', 'c.txt')
    expect(result).toBe(resolve('a', 'b', 'c.txt'))
  })

  it('handles a single absolute path', () => {
    const absPath = resolve('/absolute', 'path')
    expect(resolveAbsolutePath(absPath)).toBe(absPath)
  })

  it('handles empty string segment', () => {
    const result = resolveAbsolutePath('base', '', 'file.txt')
    expect(result).toBe(resolve('base', '', 'file.txt'))
  })
})
