<script lang="ts">
  import { health, loadHealth } from '../../stores/health.svelte';
  import { Badge, Button, Spinner } from '../primitives';

  let checked = $state(false);

  $effect(() => { if (!checked) { void loadHealth(); checked = true; } });
</script>

<div class="panel">
  <div class="row">
    <h3>Connection Health</h3>
    {#if health.loading}<Spinner inline size={16} />{:else if health.available}<Badge tone="success">OK</Badge>{:else}<Badge tone="warning">Limited</Badge>{/if}
  </div>

  {#if !health.available && !health.loading}
    <div class="note">Health check needs a newer anygate. Showing degraded diagnostics until the backend implements <code>/api/health</code>.</div>
  {/if}

  {#if health.report}
    <div class="checks">
      <div class="check">
        <span class="k">Keychain / credential store</span>
        <span class="v">{health.report.keychain?.available ? 'Available' : 'Unavailable'}</span>
      </div>
      <div class="check">
        <span class="k">Port 17645</span>
        <span class="v">{health.report.port17645Available ? 'Free' : 'In use'}</span>
      </div>
      <div class="check">
        <span class="k">Conflicting env vars</span>
        <span class="v">{health.report.conflictingEnvVars?.length ? health.report.conflictingEnvVars.join(', ') : 'None'}</span>
      </div>
    </div>
    {#if health.report.note}<div class="note">{health.report.note}</div>{/if}
  {/if}

  <div class="actions"><Button size="sm" variant="ghost" onclick={() => loadHealth()}>Re-check</Button></div>
</div>

<style>
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  h3 { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text-1); }
  .note { font-size: 12.5px; color: var(--text-3); background: var(--surface-2); padding: 9px 12px; border-radius: var(--radius-sm); margin-bottom: 12px; }
  .note code { font-family: ui-monospace, monospace; color: var(--accent); }
  .checks { display: flex; flex-direction: column; gap: 9px; }
  .check { display: flex; justify-content: space-between; font-size: 13px; }
  .k { color: var(--text-2); }
  .v { color: var(--text-1); font-family: ui-monospace, monospace; font-size: 12px; }
  .actions { margin-top: 14px; }
</style>
