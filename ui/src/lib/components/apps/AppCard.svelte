<script lang="ts">
  import type { UiApp } from '../../api/types';
  import ProviderLogo from '../providers/ProviderLogo.svelte';
  import { Badge, Button } from '../primitives';

  interface Props { app: UiApp; onlaunch: (a: UiApp) => void; onsetpath: (a: UiApp) => void; }
  let { app, onlaunch, onsetpath }: Props = $props();
</script>

<div class="card">
  <div class="head">
    <ProviderLogo id={app.id} size={36} />
    <div class="meta">
      <div class="name">{app.name}</div>
      <div class="sub">{app.type === 'cli' ? 'CLI' : 'Desktop app'}</div>
    </div>
    {#if app.installed}<Badge tone="success">Installed</Badge>{:else}<Badge tone="warning">Not installed</Badge>{/if}
  </div>

  {#if app.path}<div class="path" title={app.path}>{app.path}</div>{/if}

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
    <Button size="sm" variant="primary" disabled={!app.installed} onclick={() => onlaunch(app)}>Launch</Button>
  </div>
</div>

<style>
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .card:hover { border-color: var(--border-bright); }
  .head { display: flex; align-items: center; gap: 12px; }
  .meta { flex: 1; }
  .name { font-weight: 600; font-size: 14.5px; color: var(--text-1); }
  .sub { font-size: 12px; color: var(--text-3); }
  .path { font-size: 11.5px; color: var(--text-3); background: var(--surface-2); padding: 5px 9px; border-radius: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .install { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .cmd { font-family: var(--font-mono, ui-monospace, monospace); font-size: 11.5px; color: var(--text-2); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 9px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
  .copy { font-size: 11px; font-weight: 600; color: var(--accent); background: none; border: none; cursor: pointer; padding: 2px 4px; }
  .copy:hover { text-decoration: underline; }
  .install-link { font-size: 12.5px; font-weight: 600; color: var(--accent); text-decoration: none; }
  .install-link:hover { text-decoration: underline; }
  .actions { display: flex; gap: 8px; justify-content: flex-end; }
</style>
