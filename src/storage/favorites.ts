import type { FavoriteModel } from '../types/index.js'
import { loadPreferences, savePreferences } from './config.js'

export function getFavoriteModels(): FavoriteModel[] {
  return loadPreferences().favoriteModels ?? []
}

export function setFavoriteModels(models: FavoriteModel[]): void {
  const prefs = loadPreferences()
  prefs.favoriteModels = models
  savePreferences(prefs)
}
