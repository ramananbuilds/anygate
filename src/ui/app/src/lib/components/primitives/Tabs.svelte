<script lang="ts">
  interface Props { tabs: { id: string; label: string }[]; active: string; onchange?: (id: string) => void; }
  let { tabs, active = $bindable(''), onchange }: Props = $props();
</script>

<div class="tabs" role="tablist">
  {#each tabs as t (t.id)}
    <button class="tab" class:active={active === t.id} role="tab" aria-selected={active === t.id} onclick={() => { active = t.id; onchange?.(t.id); }}>{t.label}</button>
  {/each}
</div>

<style>
  .tabs { display: inline-flex; gap: 2px; padding: 3px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); }
  .tab { padding: 6px 14px; border-radius: 7px; font-size: 13px; font-weight: 500; color: var(--text-2); background: transparent; border: none; cursor: pointer; transition: background var(--dur-sm) var(--ease), color var(--dur-sm) var(--ease); }
  .tab:hover { color: var(--text-1); }
  .tab.active { background: var(--accent-muted); color: var(--accent); }
</style>
