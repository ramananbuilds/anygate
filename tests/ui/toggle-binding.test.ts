import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

// Regression coverage for the Toggle primitive.
//
// Toggle declared `checked` as $bindable but its click handler only called
// onchange(!checked) — it never assigned `checked`. A $bindable prop only
// propagates to the parent when the child assigns it, so every consumer using
// `bind:checked` (Favorites only, Free models only, Mask gateway IDs, Save
// password) was inert: clicking did nothing at all. Only the one consumer
// passing an explicit onchange (Network mode) worked, which is exactly the
// symptom that was reported.

const TOGGLE = 'src/ui/app/src/lib/components/primitives/Toggle.svelte'
const PANEL = 'src/ui/app/src/lib/components/server/ServerPanel.svelte'

describe('Toggle primitive', () => {
  const src = readFileSync(TOGGLE, 'utf8')

  it('assigns the bindable prop so bind:checked propagates', () => {
    expect(src).toMatch(/checked = !checked/)
  })

  it('still notifies via onchange, with the new value', () => {
    expect(src).toMatch(/onchange\?\.\(checked\)/)
  })

  it('does not fire onchange without assigning (the original bug)', () => {
    expect(src).not.toMatch(/onclick=\{\(\) => onchange\?\.\(!checked\)\}/)
  })
})

describe('ServerPanel toggle state', () => {
  const src = readFileSync(PANEL, 'utf8')

  it('does not re-sync saved config on every status refresh', () => {
    // The unguarded form `$effect(() => { if (status) sync(); })` overwrote
    // in-progress edits every time a status update arrived.
    expect(src).not.toMatch(/\$effect\(\(\) => \{ if \(status\) sync\(\); \}\)/)
    expect(src).toMatch(/syncedKey/)
  })

  it('sends all three filter flags when starting', () => {
    expect(src).toMatch(/favoritesOnly,/)
    expect(src).toMatch(/freeModelsOnly,/)
    expect(src).toMatch(/maskGatewayIds,/)
  })

  it('no longer hardcodes exposedProviders to null', () => {
    expect(src).not.toMatch(/exposedProviders: null/)
    expect(src).toMatch(/exposedProviders: selectedProviders/)
  })
})
