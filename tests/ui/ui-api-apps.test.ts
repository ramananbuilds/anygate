import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { handleUiApiRequest } from '../../src/ui/api.js'
import { createMockRequest, createMockResponse } from '../helpers/ui-api-test-utils.js'

// Mock child_process exec
const mockExec = vi.fn()
vi.mock('node:child_process', () => ({
  exec: (cmd: string, cb: any) => mockExec(cmd, cb),
}))

// Mock native-launcher to isolate endpoint testing
vi.mock('../../src/apps/shared/native-launcher.js', () => ({
  getSupportedApps: () => [
    {
      id: 'claude',
      name: 'Claude Code CLI',
      type: 'cli',
      installed: true,
      path: '/bin/claude',
      gatewayCommand: 'claude',
      launchCommand: 'mock-launch',
    },
  ],
  detectApp: (id: string) => {
    if (id === 'claude') return { installed: true, path: '/bin/claude' }
    return { installed: false, path: null }
  },
  getSupportedApp: (id: string) => {
    if (id === 'claude') {
      return {
        id: 'claude',
        name: 'Claude Code CLI',
        type: 'cli',
        detectId: 'claude',
        gatewayCommand: 'claude',
      }
    }
    return undefined
  },
  getGatewayLaunchCommand: (
    appId: string,
    options: {
      providerId?: string
      modelId?: string
      modelIds?: string[]
      cwd?: string
      trace?: boolean
    }
  ) => {
    const args = [appId]
    if (options.trace) args.push('--trace')
    if (options.providerId && options.modelIds?.length) {
      args.push('--provider', options.providerId, '--model', options.modelIds.join(','))
    } else if (options.providerId && options.modelId) {
      args.push('--provider', options.providerId, '--model', options.modelId)
    }
    if (options.cwd) args.push('--cwd', options.cwd)
    return `anygate ${args.join(' ')}`
  },
}))

describe('UI API Apps endpoints', () => {
  let tempHome: string
  let previousGatewayHome: string | undefined

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'anygate-ui-api-test-'))
    previousGatewayHome = process.env['ANYGATE_HOME']
    process.env['ANYGATE_HOME'] = join(tempHome, 'gateway-home')
  })

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true })
    if (previousGatewayHome === undefined) delete process.env['ANYGATE_HOME']
    else process.env['ANYGATE_HOME'] = previousGatewayHome
  })

  it('handles GET /api/apps', async () => {
    const req = createMockRequest('GET', '/api/apps')
    const mockRes = createMockResponse()

    handleUiApiRequest(req, mockRes.res)

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 50))

    console.log('GET /api/apps status code:', mockRes.result.code)
    console.log('GET /api/apps raw response:', mockRes.result.data)

    const response = JSON.parse(mockRes.result.data)
    expect(response.apps).toHaveLength(1)
    expect(response.apps[0].id).toBe('claude')
  })

  it('handles POST /api/apps/launch with a model', async () => {
    const req = createMockRequest(
      'POST',
      '/api/apps/launch',
      JSON.stringify({
        appId: 'claude',
        providerId: 'google',
        modelId: 'gemini-2.5-pro',
        cwd: process.cwd(),
      })
    )
    const mockRes = createMockResponse()

    handleUiApiRequest(req, mockRes.res)

    await new Promise(resolve => setTimeout(resolve, 50))

    console.log('POST /api/apps/launch status code:', mockRes.result.code)
    console.log('POST /api/apps/launch raw response:', mockRes.result.data)

    expect(mockRes.result.code).toBe(200)
    const response = JSON.parse(mockRes.result.data)
    expect(response.ok).toBe(true)
    expect(response.command).toContain('anygate claude')
    expect(response.command).toContain('--provider google')
    expect(response.command).toContain('--model gemini-2.5-pro')
    expect(response.command).toContain(`--cwd ${process.cwd()}`)
    expect(mockExec).toHaveBeenCalled()
  })

  it('passes trace through to launched tools when UI tracing is enabled', async () => {
    const req = createMockRequest(
      'POST',
      '/api/apps/launch',
      JSON.stringify({
        appId: 'claude',
        providerId: 'google',
        modelId: 'gemini-2.5-pro',
      })
    )
    const mockRes = createMockResponse()

    handleUiApiRequest(req, mockRes.res, { trace: true })

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mockRes.result.code).toBe(200)
    const response = JSON.parse(mockRes.result.data)
    expect(response.command).toContain('anygate claude --trace')
  })

  it('forwards modelIds as a comma-joined custom catalog launch', async () => {
    const req = createMockRequest(
      'POST',
      '/api/apps/launch',
      JSON.stringify({
        appId: 'claude',
        providerId: 'groq',
        modelIds: ['llama-3.3-70b', ' mixtral-8x7b ', 'llama-3.3-70b'],
      })
    )
    const mockRes = createMockResponse()

    handleUiApiRequest(req, mockRes.res)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mockRes.result.code).toBe(200)
    const response = JSON.parse(mockRes.result.data)
    expect(response.command).toContain('--provider groq')
    expect(response.command).toContain('--model llama-3.3-70b,mixtral-8x7b')
    expect(mockExec).toHaveBeenCalled()
  })

  it('rejects invalid modelIds launch combinations', async () => {
    const cases: Array<{ body: Record<string, unknown>; error: string }> = [
      { body: { appId: 'claude', modelIds: ['a'] }, error: 'providerId is required' },
      {
        body: { appId: 'claude', providerId: 'groq', modelIds: ['a'], modelId: 'b' },
        error: 'only one of modelId, modelIds, allModels',
      },
      {
        body: { appId: 'claude', providerId: 'groq', modelIds: ['a'], allModels: true },
        error: 'only one of modelId, modelIds, allModels',
      },
      {
        body: { appId: 'claude', providerId: 'groq', modelIds: 'nope' },
        error: 'modelIds must be an array',
      },
      {
        body: { appId: 'claude', providerId: 'groq', modelIds: ['  '] },
        error: 'at least one model id',
      },
    ]
    for (const { body, error } of cases) {
      const req = createMockRequest('POST', '/api/apps/launch', JSON.stringify(body))
      const mockRes = createMockResponse()
      handleUiApiRequest(req, mockRes.res)
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(mockRes.result.code).toBe(400)
      expect(JSON.parse(mockRes.result.data).error).toContain(error)
    }
  })
})
