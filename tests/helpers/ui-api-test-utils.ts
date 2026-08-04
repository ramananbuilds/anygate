import type { ServerResponse } from 'node:http'
import { Readable } from 'node:stream'
import { EventEmitter } from 'node:events'

export function createMockRequest(method: string, url: string, body?: string): any {
  const req = Readable.from(body ? [Buffer.from(body)] : [])
  Object.assign(req, { method, url, headers: {} })
  return req
}

export function createMockResponse() {
  const result = { data: '', code: 200, headers: {} as Record<string, string>, ended: false }
  // A real ServerResponse is an EventEmitter and exposes `writableEnded`;
  // streaming handlers (SSE) rely on both for lifecycle and cleanup.
  const emitter = new EventEmitter()
  const res: Partial<ServerResponse> & EventEmitter = Object.assign(emitter, {
    writeHead(statusCode: number, headers?: any) {
      result.code = statusCode
      if (headers) {
        for (const [name, value] of Object.entries(headers)) {
          result.headers[name.toLowerCase()] = String(value)
        }
      }
      return this as any
    },
    setHeader(name: string, value: any) {
      result.headers[name.toLowerCase()] = String(value)
      return this as any
    },
    getHeader(name: string) {
      return result.headers[name.toLowerCase()]
    },
    write(chunk: any) {
      result.data += chunk.toString()
      return true
    },
    end(chunk?: any) {
      if (chunk) result.data += chunk.toString()
      result.ended = true
      return this as any
    },
  })
  Object.defineProperty(res, 'writableEnded', {
    get: () => result.ended,
    configurable: true,
  })
  return { res: res as unknown as ServerResponse, result }
}
