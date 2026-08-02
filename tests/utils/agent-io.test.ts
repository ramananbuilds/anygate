import { afterEach, describe, expect, it } from 'vitest'
import { isAgentStdoutMode, setAgentStdoutMode } from '../../src/utils/agent-io.js'

describe('agent stdout mode', () => {
  afterEach(() => {
    setAgentStdoutMode(false)
  })

  it('defaults to false', () => {
    setAgentStdoutMode(false)
    expect(isAgentStdoutMode()).toBe(false)
  })

  it('can be enabled', () => {
    setAgentStdoutMode(true)
    expect(isAgentStdoutMode()).toBe(true)
  })

  it('can be disabled after being enabled', () => {
    setAgentStdoutMode(true)
    setAgentStdoutMode(false)
    expect(isAgentStdoutMode()).toBe(false)
  })

  it('persists state across calls', () => {
    setAgentStdoutMode(true)
    expect(isAgentStdoutMode()).toBe(true)
    expect(isAgentStdoutMode()).toBe(true)
  })
})
