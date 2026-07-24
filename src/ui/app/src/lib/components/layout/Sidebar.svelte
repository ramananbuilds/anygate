<script lang="ts">
  import { router, navigate, type RouteId } from '../../stores/router.svelte';

  const items: { id: RouteId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10' },
    { id: 'providers', label: 'Providers & Keys', icon: 'M3 11h18v11H3zM7 11V7a5 5 0 0 1 10 0v4' },
    { id: 'models', label: 'Models', icon: 'M4 6h16M4 12h16M4 18h16' },
    { id: 'apps', label: 'Apps & Launch', icon: 'M2 3h20v14H2zM8 21h8M12 17v4' },
    { id: 'server', label: 'Server', icon: 'M12 2v6M6 8a8 8 0 1 0 12 0' },
    { id: 'tester', label: 'Model Tester', icon: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 12l5-3' },
    { id: 'settings', label: 'Settings', icon: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 12h2M19 12h2' },
  ];

  const version = __APP_VERSION__;
</script>

<aside class="sidebar">
  <div class="brand">
    <div class="monogram">a</div>
    <div class="brand-meta">
      <div class="brand-name">anygate</div>
      <div class="brand-byline">ramananbuilds</div>
    </div>
  </div>

  <div class="version-row">
    <span class="version">v{version}</span>
    <span class="health-dot" title="Health check available"></span>
  </div>

  <nav class="nav" aria-label="Sections">
    {#each items as item (item.id)}
      <button
        class="nav-item"
        class:active={router.route === item.id}
        aria-current={router.route === item.id ? 'page' : undefined}
        onclick={() => navigate(item.id)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d={item.icon} />
        </svg>
        <span>{item.label}</span>
      </button>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 18px 14px;
    position: sticky;
    top: 0;
    height: 100dvh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .sidebar::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom, var(--accent-dim), transparent 60%);
    opacity: 0.4;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 4px 6px 14px;
  }
  .monogram {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 19px;
    color: var(--accent);
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border);
  }
  .brand-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 16px;
    color: var(--text-1);
  }
  .brand-byline {
    font-size: 11px;
    color: var(--text-3);
  }
  .version-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px 14px;
  }
  .version {
    font-size: 12px;
    color: var(--text-3);
  }
  .health-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 8px var(--success);
  }
  .nav {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 4px;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 11px;
    border-radius: var(--radius-sm);
    color: var(--text-2);
    font-size: 13.5px;
    font-weight: 500;
    text-align: left;
    width: 100%;
    transition: background var(--dur-sm) var(--ease), color var(--dur-sm) var(--ease);
  }
  .nav-item:hover {
    background: var(--surface-hover);
    color: var(--text-1);
  }
  .nav-item.active {
    background: var(--accent-muted);
    color: var(--accent);
  }
  .nav-item svg {
    flex-shrink: 0;
  }
</style>
