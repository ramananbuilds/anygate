#!/usr/bin/env node
// Extract one release's section from CHANGELOG.md, for the GitHub Release body.
//
// Usage: node scripts/changelog-notes.mjs v0.6.0   (a leading "v" is optional)
//
// This lives in a file rather than inline in the workflow on purpose. The
// previous `node -e "...new RegExp('##\\s+' + v + ...)..."` one-liner was
// double-escaped: in the double-quoted shell string `\\s` collapsed to `\s`,
// which JavaScript then read as a literal `s`, so the pattern was `##s+0.5.11`
// and never matched. The failure was silent — the workflow fell back to the
// commit message — so every release shipped without its changelog notes.
//
// No regex here: section boundaries are found by scanning lines, so version
// numbers containing `.` need no escaping and nothing depends on shell quoting.

import { readFileSync } from 'node:fs'

/** Lines of the `## <version> ...` section for `version`, or [] if absent. */
function extractSection(changelog, version) {
  const lines = changelog.split('\n')
  const isHeading = line => line.startsWith('## ') || /^#\s/.test(line)
  // A heading matches when its first whitespace-delimited token after "## "
  // is exactly the version, so "## 0.6.0 (2026-08-03)" matches 0.6.0 but
  // "## 0.6.0-rc1" does not.
  const start = lines.findIndex(
    line => line.startsWith('## ') && line.slice(3).trim().split(/\s+/)[0] === version
  )
  if (start === -1) return []

  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    if (isHeading(lines[i])) {
      end = i
      break
    }
  }
  return lines.slice(start, end)
}

const version = (process.argv[2] ?? '').replace(/^v/, '')
if (!version) {
  console.error('usage: changelog-notes.mjs <version>')
  process.exit(2)
}

const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8')
const section = extractSection(changelog, version).join('\n').trim()

// Exit non-zero when the section is missing so the caller can fall back
// deliberately instead of silently publishing empty notes.
if (!section) {
  console.error(`No CHANGELOG.md section found for ${version}`)
  process.exit(1)
}
console.log(section)
