// Favorites store (general ≤20, Antigravity CLI ≤6). Backed by /api/config.
import * as api from '../api/endpoints';
import type { FavoriteModel } from '../api/types';
import { toast } from './ui.svelte';

const GENERAL_MAX = 20;
const AGY_MAX = 6;

export interface FavoritesState {
  general: FavoriteModel[];
  agy: FavoriteModel[];
  loading: boolean;
  error: string | null;
}

export const favorites = $state<FavoritesState>({ general: [], agy: [], loading: false, error: null });

export async function loadFavorites(): Promise<void> {
  favorites.loading = true;
  try {
    const cfg = await api.getConfig();
    favorites.general = cfg.favoriteModels ?? [];
    favorites.agy = cfg.antigravityCliFavoriteModels ?? [];
  } catch (err) {
    favorites.error = err instanceof Error ? err.message : String(err);
  } finally {
    favorites.loading = false;
  }
}

async function persist(): Promise<void> {
  await api.saveConfig({ favoriteModels: favorites.general, antigravityCliFavoriteModels: favorites.agy });
}

export function isFavorite(providerId: string, modelId: string, agy = false): boolean {
  const list = agy ? favorites.agy : favorites.general;
  return list.some(f => f.providerId === providerId && f.modelId === modelId);
}

export async function addFavorite(fav: FavoriteModel, agy = false): Promise<boolean> {
  const list = agy ? favorites.agy : favorites.general;
  const max = agy ? AGY_MAX : GENERAL_MAX;
  if (isFavorite(fav.providerId, fav.modelId, agy)) return true;
  if (list.length >= max) {
    toast(`Favorite limit reached (${max})`, 'error');
    return false;
  }
  if (agy) favorites.agy = [...favorites.agy, fav];
  else favorites.general = [...favorites.general, fav];
  await persist();
  return true;
}

export async function removeFavorite(providerId: string, modelId: string, agy = false): Promise<void> {
  if (agy) favorites.agy = favorites.agy.filter(f => !(f.providerId === providerId && f.modelId === modelId));
  else favorites.general = favorites.general.filter(f => !(f.providerId === providerId && f.modelId === modelId));
  await persist();
}

export async function reorder(list: FavoriteModel[], agy = false): Promise<void> {
  if (agy) favorites.agy = list;
  else favorites.general = list;
  await persist();
}
