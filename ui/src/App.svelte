<script lang="ts">
  import { onMount } from 'svelte';
  import { startRouter } from './lib/stores/router.svelte';
  import { toggleCommand, ui } from './lib/stores/ui.svelte';
  import { loadProviders } from './lib/stores/providers.svelte';
  import { loadFavorites } from './lib/stores/favorites.svelte';
  import { loadApps } from './lib/stores/apps.svelte';
  import { loadConfig } from './lib/stores/config.svelte';
  import { loadPresets } from './lib/stores/presets.svelte';
  import { router } from './lib/stores/router.svelte';
  import Sidebar from './lib/components/layout/Sidebar.svelte';
  import Topbar from './lib/components/layout/Topbar.svelte';
  import Toaster from './lib/components/Toaster.svelte';
  import CommandPalette from './lib/components/CommandPalette.svelte';
  import { closeCommand } from './lib/stores/ui.svelte';
  let cmdQuery = $state('');
  import Dashboard from './routes/Dashboard.svelte';
  import Providers from './routes/Providers.svelte';
  import Models from './routes/Models.svelte';
  import Apps from './routes/Apps.svelte';
  import Server from './routes/Server.svelte';
  import Settings from './routes/Settings.svelte';

  function onKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toggleCommand(); }
  }

  onMount(() => {
    startRouter();
    window.addEventListener('keydown', onKey);
    void loadProviders();
    void loadFavorites();
    void loadApps();
    void loadConfig();
    void loadPresets();
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

<div class="app-shell">
  <Sidebar />
  <div class="main">
    <Topbar />
    <main class="content">
      {#if router.route === 'dashboard'}<Dashboard />{/if}
      {#if router.route === 'providers'}<Providers />{/if}
      {#if router.route === 'models'}<Models />{/if}
      {#if router.route === 'apps'}<Apps />{/if}
      {#if router.route === 'server'}<Server />{/if}
      {#if router.route === 'settings'}<Settings />{/if}
    </main>
  </div>
</div>

<Toaster />
{#if ui.commandOpen}
  <CommandPalette query={cmdQuery} onclose={closeCommand} />
{/if}

<style>
  .app-shell { display: grid; grid-template-columns: var(--sidebar-w) 1fr; min-height: 100dvh; }
  .main { display: flex; flex-direction: column; min-width: 0; }
  .content { padding: 26px 30px 60px; max-width: 1180px; width: 100%; }
  @media (max-width: 760px) {
    .app-shell { grid-template-columns: 1fr; }
    .content { padding: 18px 16px 50px; }
  }
</style>
