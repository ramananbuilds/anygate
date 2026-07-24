import { getFavoriteModels, setFavoriteModels } from '../storage/favorites.js';
import type { FavoriteModel } from '../types/index.js';

export function listFavorites(): FavoriteModel[] {
  return getFavoriteModels();
}

export function addFavorite(model: FavoriteModel): void {
  const current = getFavoriteModels();
  if (!current.some(f => f.providerId === model.providerId && f.modelId === model.modelId)) {
    setFavoriteModels([...current, model]);
  }
}

export function removeFavorite(providerId: string, modelId: string): void {
  const current = getFavoriteModels();
  setFavoriteModels(current.filter(f => !(f.providerId === providerId && f.modelId === modelId)));
}
