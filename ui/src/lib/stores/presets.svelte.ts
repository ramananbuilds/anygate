// Presets store (launch presets). Backed by localStorage until /api/presets ships.
import * as api from '../api/endpoints';
import type { Preset } from '../api/types';
import { toast } from './ui.svelte';

export const presets = $state<{
  list: Preset[];
  loading: boolean;
}>({ list: [], loading: false });

export async function loadPresets(): Promise<void> {
  presets.loading = true;
  try {
    presets.list = await api.getPresets();
  } finally {
    presets.loading = false;
  }
}

export async function savePreset(p: Omit<Preset, 'id'> & { id?: string }): Promise<void> {
  const id = p.id ?? `preset-${Date.now()}`;
  const existing = presets.list.findIndex(x => x.id === id);
  const next = [...presets.list];
  const entry: Preset = { ...p, id };
  if (existing >= 0) next[existing] = entry; else next.push(entry);
  presets.list = next;
  await api.savePresets(next);
  toast('Preset saved', 'success');
}

export async function deletePreset(id: string): Promise<void> {
  presets.list = presets.list.filter(p => p.id !== id);
  await api.savePresets(presets.list);
}
