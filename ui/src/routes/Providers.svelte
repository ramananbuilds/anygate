<script lang="ts">
  import { providers, refreshAll, refreshProviderModels } from '../lib/stores/providers.svelte';
  import type { EnrichedProvider } from '../lib/stores/providers.svelte';
  import ProviderCard from '../lib/components/providers/ProviderCard.svelte';
  import ProviderForm from '../lib/components/providers/ProviderForm.svelte';
  import DeleteConfirm from '../lib/components/providers/DeleteConfirm.svelte';
  import { Button, Spinner, EmptyState } from '../lib/components/primitives';
  import { deleteProvider, saveKey, startOAuth, getOAuthStatus } from '../lib/api/endpoints';
  import { toast } from '../lib/stores/ui.svelte';

  let formOpen = $state(false);
  let delTarget = $state<EnrichedProvider | null>(null);
  let oauthTarget = $state<EnrichedProvider | null>(null);
  let oauthUrl = $state('');
  let oauthCode = $state('');
  let oauthPoll = $state<ReturnType<typeof setInterval> | null>(null);

  async function onDelete(p: EnrichedProvider) {
    try { const r = await deleteProvider(p.id); if (r.ok) toast(`Deleted ${p.name}`, 'success'); else toast(r.error ? String(r.error) : 'Delete failed', 'error'); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), 'error'); }
    delTarget = null;
    await refreshAll();
  }

  async function onAddKey(p: EnrichedProvider) {
    const key = prompt(`API key for ${p.name}:`);
    if (!key) return;
    try { const r = await saveKey(p.id, key); if (r.ok) { toast('Key saved', 'success'); await refreshProviderModels(p.id); } else toast('Save failed', 'error'); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), 'error'); }
  }

  async function onOAuth(p: EnrichedProvider) {
    oauthTarget = p;
    try {
      const r = await startOAuth(p.id);
      oauthUrl = r.authUrl ?? r.url;
      oauthCode = r.userCode ?? '';
      if (r.sessionId) {
        oauthPoll = setInterval(async () => {
          const st = await getOAuthStatus(r.sessionId);
          if (st.status !== 'pending') {
            if (oauthPoll) clearInterval(oauthPoll);
            if (st.status === 'done') { toast(`${p.name} connected`, 'success'); oauthTarget = null; await refreshAll(); }
            else toast(st.error ?? 'OAuth failed', 'error');
          }
        }, 2000);
      }
      if (r.pkce && oauthUrl) window.open(oauthUrl, '_blank');
    } catch (e) { toast(e instanceof Error ? e.message : String(e), 'error'); }
  }
</script>

<div class="page">
  <div class="head">
    <div>
      <h2>Providers & Keys</h2>
      <p class="sub">Connect model providers via API key or OAuth. Refresh to pull the latest model list.</p>
    </div>
    <div class="acts">
      <Button variant="ghost" onclick={() => refreshAll()}>Refresh all</Button>
      <Button onclick={() => formOpen = true}>+ Add provider</Button>
    </div>
  </div>

  {#if providers.loading}
    <Spinner label="Loading providers…" />
  {:else if providers.error}
    <EmptyState title="Could not load providers" icon="M12 8v5M12 17h.01">{providers.error}</EmptyState>
  {:else if providers.list.length === 0}
    <EmptyState title="No providers yet" icon="M12 11h8M4 11h4M4 19h16">Add a provider to start browsing models.</EmptyState>
  {:else}
    <div class="grid">
      {#each providers.list as p (p.id)}
        <ProviderCard provider={p} onAddKey={onAddKey} onDelete={(pp) => delTarget = pp} onOAuth={onOAuth} />
      {/each}
    </div>
  {/if}
</div>

<ProviderForm open={formOpen} onclose={() => formOpen = false} onadded={() => refreshAll()} />
<DeleteConfirm provider={delTarget} onclose={() => delTarget = null} onconfirm={onDelete} />

{#if oauthTarget}
  <div class="backdrop" role="presentation" onclick={() => oauthTarget = null} onkeydown={(e) => { if (e.key === 'Escape') oauthTarget = null; }}>
    <div class="modal glass" role="dialog" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <h3>Sign in to {oauthTarget.name}</h3>
      {#if oauthCode}<p class="code">Enter code: <strong>{oauthCode}</strong></p>{/if}
      {#if oauthUrl}<Button onclick={() => window.open(oauthUrl, '_blank')}>Open sign-in page</Button>{/if}
      <p class="note">This window will close automatically once authentication completes.</p>
      <Button variant="ghost" onclick={() => oauthTarget = null}>Close</Button>
    </div>
  </div>
{/if}

<style>
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 20px; }
  h2 { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-1); }
  .sub { font-size: 13px; color: var(--text-3); margin-top: 4px; max-width: 460px; }
  .acts { display: flex; gap: 8px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }
  .backdrop { position: fixed; inset: 0; z-index: 50; background: oklch(10% 0.01 70 / 0.6); display: grid; place-items: center; }
  .modal { width: 420px; max-width: 90vw; padding: 22px; border-radius: var(--radius); background: var(--surface); display: flex; flex-direction: column; gap: 12px; }
  .modal h3 { font-family: var(--font-display); font-size: 16px; }
  .code { font-size: 13px; color: var(--text-2); }
  .note { font-size: 12px; color: var(--text-3); }
</style>
