#!/usr/bin/env node
// Regenerates the Simple Icons block inside
// src/ui/app/src/lib/providers/providerLogos.ts between the BEGIN/END markers.
//
// Usage: node scripts/fetch-simple-icons.mjs
// Requires Node >= 18 (global fetch). No npm dependencies.

import { readFile, writeFile } from 'node:fs/promises'

const VERSION = '13'
const CDN = `https://cdn.jsdelivr.net/npm/simple-icons@${VERSION}/icons`
const TARGET = new URL('../src/ui/app/src/lib/providers/providerLogos.ts', import.meta.url)

export const BEGIN_MARKER = `// BEGIN GENERATED SIMPLE ICONS (simple-icons@${VERSION}) — regenerate: node scripts/fetch-simple-icons.mjs`
export const END_MARKER = '// END GENERATED SIMPLE ICONS'

const INLINE_SVGS_ANCHOR = 'const INLINE_SVGS: Record<string, string> = {'

// provider-id (lowercase) -> simple-icons slug
// Slug availability differs across simple-icons versions (brands get renamed/removed).
// SLUGS pins v13; V16_OVERRIDES fetches ids that only exist in v16+ from that version.
const SLUGS = {
  anthropic: 'anthropic',
  openai: 'openai',
  google: 'google',
  gemini: 'googlegemini',
  xai: null, // no official slug in v13 or v16 — monogram fallback
  openrouter: 'openrouter',
  deepseek: 'deepseek',
  ollama: 'ollama',
  mistral: 'mistralai', // v13: 404 under 'mistral'; exists as 'mistralai' in v16+
  nvidia: 'nvidia',
  groq: null, // removed from simple-icons (trademark) — monogram fallback
  perplexity: 'perplexity',
  togetherai: null, // removed in v16 — monogram fallback
  cerebras: null, // removed — monogram fallback
  cohere: null, // removed — monogram fallback
  fireworks: 'fireworksai',
  'github-copilot': 'githubcopilot',
  azure: 'microsoftazure',
  bedrock: 'amazonwebservices',
  vertex: 'googlecloud',
  sambanova: 'sambanova',
  venice: 'venice',
  ovh: 'ovh',
  scaleway: 'scaleway',
  lmstudio: 'lmstudio',
  cloudflare: 'cloudflare',
}

// Ids whose slug only resolves against a NEWER simple-icons release.
const V16_OVERRIDES = {
  openrouter: 'openrouter',
  deepseek: 'deepseek',
  mistral: 'mistralai',
  lmstudio: 'lmstudio',
}

async function fetchIconPath(slug, version = VERSION) {
  const res = await fetch(
    `https://cdn.jsdelivr.net/npm/simple-icons@${version}/icons/${slug}.svg`,
    {
      signal: AbortSignal.timeout(15000),
    }
  )
  if (!res.ok) return null // missing slug -> skip silently
  const svg = await res.text()
  const m = svg.match(/\sd="([^"]+)"/)
  if (!m) return null
  return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="${m[1]}"/></svg>`
}

function buildBlock(entries) {
  const lines = [BEGIN_MARKER]
  if (entries.length === 0) {
    lines.push('// TODO: no icons fetched yet — run: node scripts/fetch-simple-icons.mjs')
  } else {
    for (const [id, svg] of entries) {
      lines.push(`  '${id}': '${svg}',`)
    }
  }
  lines.push(END_MARKER)
  return lines.join('\n')
}

function inject(content, block) {
  const beginAt = content.indexOf(BEGIN_MARKER)
  const endAt = content.indexOf(END_MARKER)
  if (beginAt !== -1 && endAt !== -1) {
    // Idempotent re-run: replace whatever sits between the markers.
    return content.slice(0, beginAt) + block + content.slice(endAt + END_MARKER.length)
  }
  if (!content.includes(INLINE_SVGS_ANCHOR)) {
    throw new Error(`anchor not found in ${TARGET.pathname}: ${INLINE_SVGS_ANCHOR}`)
  }
  // First run: create markers at the top of INLINE_SVGS (directly after PALETTES),
  // keeping the hand-drawn entries below as overrides (later keys win).
  const anchorAt = content.indexOf(INLINE_SVGS_ANCHOR) + INLINE_SVGS_ANCHOR.length
  return content.slice(0, anchorAt) + '\n' + block + content.slice(anchorAt)
}

async function main() {
  const ids = Object.keys(SLUGS)
  const jobs = ids.map(id => {
    const slug = SLUGS[id]
    if (slug === null) return Promise.resolve([id, null]) // documented fallback, not a failure
    if (V16_OVERRIDES[id]) {
      // these slugs only resolve against newer simple-icons releases
      return fetchIconPath(V16_OVERRIDES[id], '16').then(svg => [id, svg])
    }
    return fetchIconPath(slug).then(svg => [id, svg])
  })
  const results = await Promise.allSettled(jobs)

  const entries = []
  let skipped = 0
  let networkFailures = 0
  ids.forEach((id, i) => {
    const r = results[i]
    if (r.status === 'fulfilled' && r.value[1]) {
      entries.push(r.value)
    } else if (r.status === 'rejected') {
      networkFailures++
      skipped++
    } else {
      skipped++ // 404 / no path attribute / null slug
    }
  })

  const source = await readFile(TARGET, 'utf8')
  const updated = inject(source, buildBlock(entries))
  await writeFile(TARGET, updated, 'utf8')

  if (networkFailures > 0) {
    console.error(
      `WARNING: ${networkFailures} fetch(es) failed due to network errors (not 404s); ` +
        `${entries.length} icons written.`
    )
  }
  console.log(`added ${entries.length} icons, skipped ${skipped} (missing slugs)`)
  process.exitCode = entries.length === 0 && networkFailures >= ids.length ? 1 : 0
}

main()
