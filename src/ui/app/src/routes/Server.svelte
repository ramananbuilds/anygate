<script lang="ts">
  import { server, loadStatus } from '../lib/stores/server.svelte';
  import ServerPanel from '../lib/components/server/ServerPanel.svelte';
  import { Card, Spinner } from '../lib/components/primitives';
  import { onMount } from 'svelte';

  // Live tracking is owned by App.svelte for the whole session; this route only
  // forces one fresh read on entry so the panel never shows a stale payload.
  onMount(() => {
    void loadStatus();
  });
</script>

<div class="page">
  <div class="head">
    <h2>Server Gateway</h2>
    <p class="sub">Run a local OpenAI / Anthropic-compatible server exposing your anygate models to any tool.</p>
  </div>

  {#if server.loading && !server.status}
    <Spinner label="Reading server status…" />
  {:else}
    <ServerPanel onneedsmodels={() => (location.hash = '#/providers')} />
  {/if}

  {#if server.error}
    <Card padding="16px"><p style="color:var(--error);font-size:13px">{server.error}</p></Card>
  {/if}
</div>

<style>
  .head { margin-bottom: 18px; }
  h2 { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-1); }
  .sub { font-size: 13px; color: var(--text-3); margin-top: 4px; max-width: 480px; }
</style>
