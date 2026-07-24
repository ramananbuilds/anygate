<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props { children: Snippet; padding?: string; hover?: boolean; onclick?: () => void; class?: string; }
  let { children, padding = '18px', hover = false, onclick, class: cls = '' }: Props = $props();
</script>

<div class="card glass {cls}" class:hover style="padding:{padding}" {onclick} role={onclick ? 'button' : undefined}>
  {@render children()}
</div>

<style>
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    transition: border-color var(--dur-sm) var(--ease), transform var(--dur-sm) var(--ease);
  }
  .card.hover:hover { border-color: var(--border-bright); transform: translateY(-1px); }
</style>
