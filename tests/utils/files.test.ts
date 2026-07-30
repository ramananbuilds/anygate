import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ensureFileDirectory, writeJsonFileSync } from '../../src/utils/files.js'

describe('ensureFileDirectory', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = join(tmpdir(), `anygate-files-test-${Date.now()}`)
    mkdirSync(tempDir, { recursive: true })
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('creates nested directories that do not exist', () => {
    const nestedPath = join(tempDir, 'a', 'b', 'c', 'file.json')
    ensureFileDirectory(nestedPath)
    expect(existsSync(join(nestedPath, '..'))).toBe(true)
    expect(existsSync(join(tempDir, 'a', 'b', 'c'))).toBe(true)
  })

  it('does not throw when directory already exists', () => {
    const existingPath = join(tempDir, 'exists', 'file.json')
    mkdirSync(join(tempDir, 'exists'), { recursive: true })
    expect(() => ensureFileDirectory(existingPath)).not.toThrow()
  })

  it('handles paths without a directory component', () => {
    expect(() => ensureFileDirectory('file.json')).not.toThrow()
  })
})

describe('writeJsonFileSync', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = join(tmpdir(), `anygate-writejson-test-${Date.now()}`)
    mkdirSync(tempDir, { recursive: true })
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('writes JSON data to a file', () => {
    const filePath = join(tempDir, 'data.json')
    writeJsonFileSync(filePath, { name: 'test', value: 42 })

    const content = readFileSync(filePath, 'utf8')
    expect(JSON.parse(content)).toEqual({ name: 'test', value: 42 })
  })

  it('creates parent directories if needed', () => {
    const filePath = join(tempDir, 'deep', 'nested', 'dir', 'data.json')
    writeJsonFileSync(filePath, { ok: true })
    expect(existsSync(filePath)).toBe(true)
  })

  it('writes valid JSON with indentation', () => {
    const filePath = join(tempDir, 'pretty.json')
    writeJsonFileSync(filePath, { a: 1, b: 2 })

    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('  "a": 1')
    expect(content).toContain('  "b": 2')
  })

  it('handles complex nested objects', () => {
    const filePath = join(tempDir, 'complex.json')
    const data = { items: [{ id: 1, tags: ['a', 'b'] }], meta: { count: 1 } }
    writeJsonFileSync(filePath, data)

    const content = JSON.parse(readFileSync(filePath, 'utf8'))
    expect(content).toEqual(data)
  })
})
