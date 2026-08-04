// Launch presets, persisted server-side via /api/presets so they survive
// browser changes and stay visible to the CLI.
import * as api from '../api/endpoints'
import type { Preset } from '../api/types'
import { toast } from './ui.svelte'

export const presets = $state<{
  list: Preset[]
  loading: boolean
  error: string | null
}>({ list: [], loading: false, error: null })

export async function loadPresets(): Promise<void> {
  presets.loading = true
  presets.error = null
  try {
    presets.list = await api.getPresets()
  } catch (err) {
    presets.error = err instanceof Error ? err.message : String(err)
  } finally {
    presets.loading = false
  }
}

/**
 * Write `next` to the backend, rolling the in-memory list back if the request
 * fails so the UI never claims a preset was saved when it wasn't.
 */
async function commit(next: Preset[], successMessage?: string): Promise<boolean> {
  const previous = presets.list
  presets.list = next
  try {
    await api.savePresets(next)
    if (successMessage) toast(successMessage, 'success')
    return true
  } catch (err) {
    presets.list = previous
    toast(
      err instanceof Error ? `Couldn't save preset: ${err.message}` : "Couldn't save preset",
      'error'
    )
    return false
  }
}

export async function savePreset(p: Omit<Preset, 'id'> & { id?: string }): Promise<void> {
  const id = p.id ?? `preset-${Date.now()}`
  const entry: Preset = { ...p, id }
  const existing = presets.list.findIndex(x => x.id === id)
  const next = [...presets.list]
  if (existing >= 0) next[existing] = entry
  else next.push(entry)
  await commit(next, 'Preset saved')
}

export async function deletePreset(id: string): Promise<void> {
  await commit(
    presets.list.filter(p => p.id !== id),
    'Preset deleted'
  )
}
