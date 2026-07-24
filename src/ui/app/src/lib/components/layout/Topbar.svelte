<script lang="ts">
  import { router } from '../../stores/router.svelte';
  import { theme, toggleTheme } from '../../stores/theme.svelte';
  import { openCommand } from '../../stores/ui.svelte';
  import { IconButton } from '../primitives';

  const TITLES: Record<string, string> = {
    dashboard: 'Dashboard',
    providers: 'Providers & Keys',
    models: 'Models',
    apps: 'Apps & Launch',
    server: 'Server Gateway',
    tester: 'Model Tester',
    settings: 'Settings',
  };
  const title = $derived(TITLES[router.route] ?? 'anygate');
</script>

<header class="topbar glass">
  <div class="title">
    <h1>{title}</h1>
  </div>
  <div class="actions">
    <button class="cmdk" onclick={openCommand} title="Command palette (⌘K)">
      <span class="kbd">⌘K</span> Search
    </button>
    <IconButton title={theme.value === 'dark' ? 'Switch to light' : 'Switch to dark'} onclick={toggleTheme}>
      {#if theme.value === 'dark'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>
      {/if}
    </IconButton>
  </div>
</header>

<style>
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 26px; border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky; top: 0; z-index: 20;
  }
  .title h1 { font-family: var(--font-display); font-size: 19px; font-weight: 700; color: var(--text-1); }
  .actions { display: flex; align-items: center; gap: 10px; }
  .cmdk {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 7px 12px; border-radius: var(--radius-sm);
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text-2); font-size: 13px; cursor: pointer;
    transition: border-color var(--dur-sm) var(--ease), color var(--dur-sm) var(--ease);
  }
  .cmdk:hover { border-color: var(--border-bright); color: var(--text-1); }
  .kbd { font-size: 11px; padding: 1px 6px; border-radius: 4px; background: var(--surface-2); color: var(--text-3); border: 1px solid var(--border); }
</style>
