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

describe('ServerPanel model picker', () => {
  const src = readFileSync(PANEL, 'utf8')

  it('puts the start/stop button in the panel header', () => {
    expect(src).toMatch(/class="head-actions"[\s\S]*?onclick=\{doStart\}/)
    // The button used to live in a trailing action row, below the fold.
    expect(src).not.toMatch(/class="actions"/)
  })

  it('sends the picked models to the backend on start', () => {
    expect(src).toMatch(/exposedModels,/)
  })

  it('lists each provider’s models under that provider', () => {
    expect(src).toMatch(/visibleModels\(p\) as m/)
    expect(src).toMatch(/toggleModel\(p, m\.id\)/)
  })

  it('refuses to start when nothing would be served', () => {
    expect(src).toMatch(/servedCount === 0/)
  })

  it('keeps the original provider selector', () => {
    // The provider chips are the panel's primary control: a rewrite replaced
    // them with a vertical list, which is not what the panel is supposed to
    // look like.
    expect(src).toMatch(/class="prov-grid"/)
    expect(src).toMatch(/class="prov" class:on=\{isSelected\(p\.id\)\}/)
    expect(src).toMatch(/class="prov-name"/)
    expect(src).toMatch(/class="prov-count"/)
  })

  it('renders the model lists below the provider selector, in provider order', () => {
    const grid = src.indexOf('class="prov-grid"')
    const lists = src.indexOf('class="prov-models"')
    expect(grid).toBeGreaterThan(-1)
    expect(lists).toBeGreaterThan(grid)
    // The lists iterate the selected providers, so they follow the selection.
    expect(src).toMatch(/\{#each selectedProviderList as p \(p\.id\)\}/)
  })

  it('offers a favorites filter over the model lists', () => {
    expect(src).toMatch(/modelFilter === 'favorites'/)
    expect(src).toMatch(/Favorites · \{filterCounts\.favorites\}/)
    // Favorite models are marked in the list.
    expect(src).toMatch(/isFavorite\(p, m\)/)
  })

  it('applies the favorites filter to the served count', () => {
    expect(src).toMatch(/favorites: favoritesOnly \? favorites\.general : undefined/)
  })

  it('opens the providers that hold matches when a filter is picked', () => {
    // A filter that hides most models would otherwise leave the matches
    // buried in collapsed provider blocks.
    expect(src).toMatch(/function setFilter\(filter: ModelFilter\)/)
    expect(src).toMatch(
      /openProviders = selectedProviderList\.filter\(p => visibleModels\(p\)\.length > 0\)/
    )
    // The filter buttons go through setFilter, not a bare state assignment.
    expect(src).toMatch(/onclick=\{\(\) => setFilter\('favorites'\)\}/)
    expect(src).not.toMatch(/onclick=\{\(\) => modelFilter = 'favorites'\}/)
  })

  it('shows how many models match in a collapsed provider header', () => {
    expect(src).toMatch(/\{#if modelFilter !== 'all'\}[\s\S]*?visibleModels\(p\)\.length\} shown/)
  })

  it('reveals the providers that match a search', () => {
    expect(src).toMatch(/function onQuery\(value: string\)/)
    expect(src).toMatch(/oninput=\{onQuery\}/)
  })
})
