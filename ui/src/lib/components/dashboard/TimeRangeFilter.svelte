<script lang="ts">
  import type { RangeId } from '../../api/analytics';
  interface Props {
    value: RangeId;
    onchange?: (r: RangeId) => void;
  }
  let { value = $bindable('all'), onchange }: Props = $props();

  const options: { id: RangeId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: '30d', label: '30d' },
    { id: '7d', label: '7d' },
  ];
</script>

<div class="seg" role="group" aria-label="Time range">
  {#each options as o (o.id)}
    <button
      class="opt"
      class:active={value === o.id}
      aria-pressed={value === o.id}
      onclick={() => {
        value = o.id;
        onchange?.(o.id);
      }}>{o.label}</button
    >
  {/each}
</div>

<style>
  .seg {
    display: inline-flex;
    gap: 2px;
    padding: 3px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }
  .opt {
    padding: 6px 14px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-2);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background var(--dur-sm) var(--ease), color var(--dur-sm) var(--ease);
  }
  .opt:hover {
    color: var(--text-1);
  }
  .opt.active {
    background: var(--accent-muted);
    color: var(--accent);
  }
</style>
