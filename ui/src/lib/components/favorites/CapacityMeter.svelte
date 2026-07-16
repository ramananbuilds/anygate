<script lang="ts">
  interface Props { used: number; max: number; label?: string; }
  let { used, max, label = '' }: Props = $props();
  const pct = $derived(Math.min(100, Math.round((used / max) * 100)));
  const full = $derived(used >= max);
</script>

<div class="meter">
  <div class="top"><span>{label}</span><span class="n">{used}/{max}</span></div>
  <div class="track"><div class="fill" class:full style="width:{pct}%"></div></div>
</div>

<style>
  .meter { font-size: 12px; color: var(--text-2); }
  .top { display: flex; justify-content: space-between; margin-bottom: 5px; }
  .n { color: var(--text-3); }
  .track { height: 6px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .fill { height: 100%; border-radius: 999px; background: var(--accent); transition: width var(--dur-md) var(--ease); }
  .fill.full { background: var(--warning); }
</style>
