import { randomBytes, createHash } from 'node:crypto'

export function generateRandomHex(bytes = 16): string {
  return randomBytes(bytes).toString('hex')
}

export function hashString(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}
