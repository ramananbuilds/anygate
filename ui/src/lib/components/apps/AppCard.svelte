<script lang="ts">
  import type { UiApp } from '../../api/types';
  import ProviderLogo from '../providers/ProviderLogo.svelte';
  import { Badge, Button } from '../primitives';

  interface Props {
    app: UiApp;
    favCount?: number;
    onlaunch: (a: UiApp) => void;
    onsetpath: (a: UiApp) => void;
  }
  let { app, favCount = 0, onlaunch, onsetpath }: Props = $props();
</script>

<div class="card">
  <div class="head">
    <div class="logo" class:dim={!app.installed}>
      <ProviderLogo id={app.id} size={38} />
    </div>
    <div class="meta">
      <div class="name">{app.name}</div>
      <div class="sub">{app.type === 'cli' ? 'CLI' : 'Desktop app'}</div>
    </div>
    {#if app.installed}
      <Badge tone="success">Installed</Badge>
    {:else}
      <Badge tone="warning">Not installed</Badge>
    {/if}
  </div>

  {#if app.path}
    <div class="path" title={app.path}>{app.path}</div>
  {/if}

  {#if favCount > 0}
    <div class="favs">
      <span class="star">★</span>
      <span>{favCount} favorite{favCount === 1 ? '' : 's'} ready</span>
    </div>
  {/if}

  {#if !app.installed}
    <div class="install">
      {#if app.installUrl}
        <a class="install-link" href={app.installUrl} target="_blank" rel="noopener noreferrer">Get {app.name} →</a>
      {:else if app.installHint}
        <code class="cmd">{app.installHint}</code>
        <button class="copy" type="button" onclick={() => navigator.clipboard?.writeText(app.installHint ?? '')}>Copy</button>
      {/if}
    </div>
  {/if}

  <div class="actions">
    <Button size="sm" variant="ghost" onclick={() => onsetpath(app)}>Path</Button>
    <Button size="sm" variant="primary" disabled={!app.installed} onclick={() => onlaunch(app)}>
      {favCount > 0 ? 'Launch with favorites' : 'Launch'}
    </Button>
  </div>
</div>

<style>
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
    overflow: hidden;
    transition: border-color var(--dur-sm) var(--ease), transform var(--dur-sm) var(--ease), box-shadow var(--dur-sm) var(--ease);
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
    opacity: 0;
    transition: opacity var(--dur-md) var(--ease);
  }
  .card:hover {
    border-color: var(--border-bright);
    transform: translateY(-2px);
    box-shadow: 0 12px 30px -16px var(--accent-glow);
  }
  .card:hover::before { opacity: 1; }
  .head { display: flex; align-items: center; gap: 12px; }
  .logo {
    display: flex; align-items: center; justify-content: center;
    width: 46px; height: 46px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }
  .logo.dim { opacity: 0.5; }
  .meta { flex: 1; }
  .name { font-weight: 600; font-size: 15px; color: var(--text-1); }
  .sub { font-size: 12px; color: var(--text-3); }
  .path { font-size: 11.5px; color: var(--text-3); background: var(--surface-2); padding: 5px 9px; border-radius: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .favs {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: var(--text-2);
    padding: 7px 10px;
    background: var(--accent-muted);
    border: 1px solid var(--border-glow);
    border-radius: var(--radius-xs);
  }
  .star { color: var(--accent); font-size: 13px; }
  .install { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .cmd { font-family: var(--font-mono, ui-monospace, monospace); font-size: 11.5px; color: var(--text-2); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 9px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
  .copy { font-size: 11px; font-weight: 600; color: var(--accent); background: none; border: none; cursor: pointer; padding: 2px 4px; }
  .copy:hover { text-decoration: underline; }
  .install-link { font-size: 12.5px; font-weight: 600; color: var(--accent); text-decoration: none; }
  .install-link:hover { text-decoration: underline; }
  .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: auto; }
</style>
