<script lang="ts">
  import type { EnrichedModel } from '../../stores/providers.svelte';

  interface FilterState { provider: string; format: string; free: string; reasoning: string; query: string; sort: 'ctx' | 'cost' | 'name'; }
  interface Props { providers: { id: string; name: string }[]; value: FilterState; onchange?: (v: FilterState) => void; }
  let { providers, value = $bindable(), onchange }: Props = $props();

  function set<K extends keyof FilterState>(k: K, v: FilterState[K]) { value = { ...value, [k]: v }; onchange?.(value); }
</script>

<div class="filters">
  <input class="q" placeholder="Search models…" value={value.query} oninput={(e) => set('query', (e.currentTarget as HTMLInputElement).value)} />
  <select class="s" value={value.provider} onchange={(e) => set('provider', (e.currentTarget as HTMLSelectElement).value)}>
    <option value="">All providers</option>
    {#each providers as p}<option value={p.id}>{p.name}</option>{/each}
  </select>
  <select class="s" value={value.format} onchange={(e) => set('format', (e.currentTarget as HTMLSelectElement).value)}>
    <option value="">Any format</option>
    <option value="anthropic">anthropic</option>
    <option value="openai">openai</option>
    <option value="unsupported">unsupported</option>
  </select>
  <select class="s" value={value.free} onchange={(e) => set('free', (e.currentTarget as HTMLSelectElement).value)}>
    <option value="">Free & paid</option>
    <option value="free">Free only</option>
    <option value="paid">Paid only</option>
  </select>
  <select class="s" value={value.reasoning} onchange={(e) => set('reasoning', (e.currentTarget as HTMLSelectElement).value)}>
    <option value="">Any reasoning</option>
    <option value="yes">Reasoning</option>
    <option value="no">No reasoning</option>
  </select>
  <select class="s" value={value.sort} onchange={(e) => set('sort', (e.currentTarget as HTMLSelectElement).value as FilterState['sort'])}>
    <option value="ctx">Sort: context</option>
    <option value="cost">Sort: cost</option>
    <option value="name">Sort: name</option>
  </select>
</div>

<style>
  .filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .q { flex: 1; min-width: 180px; padding: 9px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-1); font-size: 13.5px; }
  .q:focus { outline: none; border-color: var(--accent); }
  .s { padding: 9px 11px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-1); font-size: 13px; cursor: pointer; }
  .s:focus { outline: none; border-color: var(--accent); }
</style>
