<script lang="ts">
  import { health, loadHealth } from '../../stores/health.svelte';
  import { Badge, Button, Spinner } from '../primitives';

  // App.svelte performs the initial load; only fetch here if that hasn't
  // happened yet (e.g. this panel is mounted in isolation).
  $effect(() => {
    if (!health.report && !health.loading && !health.error) void loadHealth();
  });

  const failing = $derived(health.report?.checks?.filter((c) => !c.ok) ?? []);
</script>

<div class="panel">
  <div class="row">
    <h3>System Health</h3>
    {#if health.loading}
      <Spinner inline size={16} />
    {:else if health.error}
      <Badge tone="error">Unavailable</Badge>
    {:else if health.report?.ok && failing.length === 0}
      <Badge tone="success">All checks passed</Badge>
    {:else if health.report?.ok}
      <Badge tone="warning">{failing.length} warning{failing.length === 1 ? '' : 's'}</Badge>
    {:else if health.report}
      <Badge tone="error">Critical</Badge>
    {/if}
  </div>

  {#if health.error}
    <div class="note error">Couldn’t reach the health endpoint ({health.error}). Diagnostics are unavailable — no values are shown rather than guessed.</div>
  {/if}

  {#if health.report?.checks?.length}
    <div class="checks">
      {#each health.report.checks as c (c.id)}
        <div class="check">
          <span class="mark" class:ok={c.ok} class:bad={!c.ok} aria-hidden="true">{c.ok ? '✓' : '✗'}</span>
          <span class="k">
            {c.label}
            {#if !c.ok && c.critical}<span class="crit">critical</span>{/if}
          </span>
          <span class="v" title={c.detail}>{c.detail}</span>
        </div>
      {/each}
    </div>
  {/if}

  {#if health.report?.note}<div class="note">{health.report.note}</div>{/if}

  <div class="actions">
    <Button size="sm" variant="ghost" onclick={() => loadHealth()}>Re-check</Button>
  </div>
</div>

<style>
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  h3 { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text-1); }
  .note { font-size: 12.5px; color: var(--text-3); background: var(--surface-2); padding: 9px 12px; border-radius: var(--radius-sm); margin-bottom: 12px; }
  .note.error { color: var(--error); background: var(--error-bg); }
  .checks { display: flex; flex-direction: column; gap: 10px; }
  .check { display: grid; grid-template-columns: 16px minmax(0, 1fr) minmax(0, 1.3fr); align-items: baseline; gap: 10px; font-size: 13px; }
  .mark { font-size: 12px; line-height: 1; }
  .mark.ok { color: var(--success); }
  .mark.bad { color: var(--error); }
  .k { color: var(--text-2); display: flex; align-items: center; gap: 7px; min-width: 0; }
  .crit { font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--error); background: var(--error-bg); padding: 2px 6px; border-radius: var(--radius-xs); }
  .v { color: var(--text-1); font-family: ui-monospace, monospace; font-size: 11.5px; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .actions { margin-top: 14px; }
</style>
