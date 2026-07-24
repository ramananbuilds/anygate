<script lang="ts">
  import type { EnrichedModel } from '../../stores/providers.svelte';
  import { Badge } from '../primitives';

  interface Props { model: EnrichedModel; }
  let { model }: Props = $props();
</script>

<span class="group">
  {#if model.isFree}<Badge tone="success">Free</Badge>{/if}
  {#if model.freeLabel && !model.isFree}<Badge tone="warning">{model.freeLabel}</Badge>{/if}
  <Badge tone={model.format === 'anthropic' ? 'accent' : model.format === 'unsupported' ? 'error' : 'neutral'}>{model.format}</Badge>
  {#if model.inputTypes?.includes('image')}<Badge tone="accent">vision</Badge>{/if}
  {#if model.reasoning}<Badge tone="accent">reasoning</Badge>{/if}
</span>

<style>.group { display: inline-flex; gap: 5px; flex-wrap: wrap; }</style>
