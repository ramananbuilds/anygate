<script lang="ts">
  import type { ServerStatusPayload } from '../../api/types';
  import { Badge } from '../primitives';

  interface Props { status: ServerStatusPayload | null; }
  let { status }: Props = $props();
</script>

{#if status?.running}
  <Badge tone="success">Running · {status.listenMode === 'network' ? 'Network' : 'Local'}</Badge>
  {#if status.models}<Badge tone="neutral">{status.models.length} models</Badge>{/if}
{:else}
  <Badge tone="neutral">Stopped</Badge>
{/if}
