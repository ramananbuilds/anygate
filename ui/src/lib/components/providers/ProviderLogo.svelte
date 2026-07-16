<script lang="ts">
  import { providerVisual } from '../../providers/providerLogos';

  interface Props { id: string; size?: number; }
  let { id, size = 34 }: Props = $props();

  const visual = $derived(providerVisual(id));
  const initial = $derived(id.slice(0, 1).toUpperCase());
</script>

<span class="logo" style="width:{size}px;height:{size}px;background:linear-gradient(135deg,{visual.gradient[0]},{visual.gradient[1]});">
  {#if visual.svg}
    <span class="svg" style="width:{size*0.55}px;height:{size*0.55}px">{@html visual.svg}</span>
  {:else}
    <span class="mono" style="font-size:{size*0.42}px">{initial}</span>
  {/if}
</span>

<style>
  .logo { display: inline-grid; place-items: center; border-radius: 9px; flex-shrink: 0; overflow: hidden; box-shadow: 0 2px 8px oklch(10% 0.02 70 / 0.35); }
  .svg :global(svg) { width: 100%; height: 100%; color: white; }
  .mono { font-family: var(--font-display); font-weight: 800; color: white; }
</style>
