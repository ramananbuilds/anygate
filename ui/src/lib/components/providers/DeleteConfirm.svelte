<script lang="ts">
  import type { EnrichedProvider } from '../../stores/providers.svelte';
  import { Modal, Button } from '../primitives';

  interface Props { provider: EnrichedProvider | null; onclose: () => void; onconfirm: (p: EnrichedProvider) => void; }
  let { provider, onclose, onconfirm }: Props = $props();
</script>

<Modal open={!!provider} title="Delete provider" {onclose}>
  <p style="color:var(--text-2);font-size:13.5px;line-height:1.6">
    Remove <strong style="color:var(--text-1)">{provider?.name}</strong> and all {provider?.modelCount ?? 0} of its models from anygate? This clears stored credentials.
  </p>
  <div class="row" style="margin-top:20px;justify-content:flex-end;gap:8px">
    <Button variant="ghost" onclick={onclose}>Cancel</Button>
    <Button variant="danger" onclick={() => provider && onconfirm(provider)}>Delete</Button>
  </div>
</Modal>
