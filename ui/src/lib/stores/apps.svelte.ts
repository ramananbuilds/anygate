// Apps store: supported apps, install detection, launch folder, recent folders.
import * as api from '../api/endpoints';
import { loadRecentFolders, pushRecentFolder } from '../api/mock';
import type { UiApp } from '../api/types';
import { toast } from './ui.svelte';

export const apps = $state<{
  list: UiApp[];
  recentFolders: string[];
  loading: boolean;
  error: string | null;
}>({ list: [], recentFolders: [], loading: false, error: null });

export async function loadApps(): Promise<void> {
  apps.loading = true;
  try {
    const res = await api.getApps();
    apps.list = res.apps;
    apps.recentFolders = res.recentLaunchFolders ?? loadRecentFolders();
  } catch (err) {
    apps.error = err instanceof Error ? err.message : String(err);
  } finally {
    apps.loading = false;
  }
}

export async function setPath(appId: string, path: string | null): Promise<void> {
  const res = await api.setAppPath(appId, path);
  if (res.ok) {
    apps.list = res.apps;
    toast(path ? 'Path saved' : 'Path cleared', 'success');
  }
}

export async function launch(opts: { appId: string; favorites?: boolean; providerId?: string; modelId?: string; cwd?: string }): Promise<void> {
  try {
    const res = await api.launchApp(opts);
    if (opts.cwd) apps.recentFolders = pushRecentFolder(opts.cwd);
    toast(`Launched ${opts.appId}`, 'success');
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error');
  }
}

export async function browseFolder(): Promise<string | null> {
  const res = await api.browseFolder();
  if (res.ok && !res.canceled && res.path) return res.path;
  return null;
}
