import { chmodSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { VERSION } from '../config/constants.js'
import { getAppHome } from '../config/paths.js'

export const UPDATE_CHECK_TTL_MS = 24 * 60 * 60 * 1000
export const UPDATE_CHECK_TIMEOUT_MS = 2_000
export const UPDATE_COMMAND = 'npm install -g anygate@latest'

const REGISTRY_URL = 'https://registry.npmjs.org/anygate/latest'
const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/

interface ParsedVersion {
  core: [number, number, number]
  prerelease: string[]
}

interface UpdateCache {
  latestVersion: string
  checkedAt: number
}

export interface UpdateStatus {
  currentVersion: string
  latestVersion: string | null
  updateAvailable: boolean
}

interface UpdateCheckOptions {
  fetchImpl?: typeof fetch
  now?: number
  timeoutMs?: number
}

function parseVersion(version: string): ParsedVersion | null {
  const match = SEMVER_PATTERN.exec(version)
  if (!match) return null
  return {
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4]?.split('.') ?? [],
  }
}

function comparePrerelease(current: string[], latest: string[]): number {
  if (current.length === 0 || latest.length === 0) {
    if (current.length === latest.length) return 0
    return current.length === 0 ? -1 : 1
  }

  const length = Math.max(current.length, latest.length)
  for (let i = 0; i < length; i++) {
    const currentPart = current[i]
    const latestPart = latest[i]
    if (currentPart === undefined) return 1
    if (latestPart === undefined) return -1
    if (currentPart === latestPart) continue

    const currentNum = Number(currentPart)
    const latestNum = Number(latestPart)
    const currentIsNum = !Number.isNaN(currentNum)
    const latestIsNum = !Number.isNaN(latestNum)

    if (currentIsNum && latestIsNum) return currentNum - latestNum
    if (currentIsNum !== latestIsNum) return currentIsNum ? 1 : -1
    return currentPart.localeCompare(latestPart)
  }

  return 0
}

export function isNewerVersion(current: string, latest: string): boolean {
  const parsedCurrent = parseVersion(current)
  const parsedLatest = parseVersion(latest)

  if (!parsedCurrent || !parsedLatest) {
    return false
  }

  for (let i = 0; i < 3; i++) {
    const currentPart = parsedCurrent.core[i]!
    const latestPart = parsedLatest.core[i]!
    if (latestPart > currentPart) return true
    if (latestPart < currentPart) return false
  }

  return comparePrerelease(parsedCurrent.prerelease, parsedLatest.prerelease) < 0
}

function getCachePath(): string {
  return join(getAppHome(), 'update-check.json')
}

function readCache(): UpdateCache | null {
  try {
    const raw = readFileSync(getCachePath(), 'utf8')
    const parsed = JSON.parse(raw) as Partial<UpdateCache>
    if (
      typeof parsed?.latestVersion === 'string' &&
      typeof parsed?.checkedAt === 'number' &&
      Number.isFinite(parsed.checkedAt)
    ) {
      return {
        latestVersion: parsed.latestVersion,
        checkedAt: parsed.checkedAt,
      }
    }
  } catch {
    // Ignore invalid or missing cache.
  }
  return null
}

function writeCache(cache: UpdateCache): void {
  const cachePath = getCachePath()
  const dir = getAppHome()
  const tmpPath = `${cachePath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`

  try {
    mkdirSync(dir, { recursive: true, mode: 0o700 })
    writeFileSync(tmpPath, JSON.stringify(cache, null, 2), { encoding: 'utf8', mode: 0o600 })
    try {
      chmodSync(tmpPath, 0o600)
    } catch {
      // Ignore on platforms without chmod semantics.
    }
    renameSync(tmpPath, cachePath)
  } catch {
    try {
      unlinkSync(tmpPath)
    } catch {
      // Ignore cleanup failures.
    }
  }
}

export async function fetchLatestNpmVersion(
  options: UpdateCheckOptions = {}
): Promise<string | null> {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch
  if (typeof fetchImpl !== 'function') return null

  const controller = new AbortController()
  const timeoutMs = options.timeoutMs ?? UPDATE_CHECK_TIMEOUT_MS
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchImpl(REGISTRY_URL, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })

    if (!response.ok) return null
    const body = (await response.json()) as { version?: unknown }
    if (typeof body?.version === 'string' && parseVersion(body.version)) {
      return body.version
    }
  } catch {
    // Suppress network and timeout errors.
  } finally {
    clearTimeout(timeoutId)
  }

  return null
}

export async function checkForUpdates(options: UpdateCheckOptions = {}): Promise<UpdateStatus> {
  const now = options.now ?? Date.now()
  const cached = readCache()

  if (cached && now - cached.checkedAt < UPDATE_CHECK_TTL_MS) {
    return {
      currentVersion: VERSION,
      latestVersion: cached.latestVersion,
      updateAvailable: isNewerVersion(VERSION, cached.latestVersion),
    }
  }

  const latest = await fetchLatestNpmVersion(options)
  if (latest) {
    writeCache({ latestVersion: latest, checkedAt: now })
    return {
      currentVersion: VERSION,
      latestVersion: latest,
      updateAvailable: isNewerVersion(VERSION, latest),
    }
  }

  if (cached) {
    return {
      currentVersion: VERSION,
      latestVersion: cached.latestVersion,
      updateAvailable: isNewerVersion(VERSION, cached.latestVersion),
    }
  }

  return {
    currentVersion: VERSION,
    latestVersion: null,
    updateAvailable: false,
  }
}
