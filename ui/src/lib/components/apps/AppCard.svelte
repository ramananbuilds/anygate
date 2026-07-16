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
  .actions { display: flex; gap: 8px; justify-content: flex-end; }
</style>
