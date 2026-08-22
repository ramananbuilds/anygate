<script lang="ts">
  import { providers, refreshAll } from '../lib/stores/providers.svelte';
  import type { EnrichedProvider } from '../lib/stores/providers.svelte';
  import { groupProviders, isConnected, type ProviderSectionId } from '../lib/providers/grouping';
  import ProviderTile from '../lib/components/providers/ProviderTile.svelte';
  import ProviderSection from '../lib/components/providers/ProviderSection.svelte';
  import ProviderForm from '../lib/components/providers/ProviderForm.svelte';
  import DeleteConfirm from '../lib/components/providers/DeleteConfirm.svelte';
  import { Button, Spinner, EmptyState } from '../lib/components/primitives';
  import { deleteProvider, saveKey, startOAuth, getOAuthStatus, refreshProvider } from '../lib/api/endpoints';
  import { toast } from '../lib/stores/ui.svelte';

  let formOpen = $state(false);
  let formPreset = $state<'openai' | 'anthropic' | null>(null);
  let delTarget = $state<EnrichedProvider | null>(null);
  let oauthTarget = $state<EnrichedProvider | null>(null);
  let oauthUrl = $state('');
  let oauthCode = $state('');
  let oauthPoll = $state<ReturnType<typeof setInterval> | null>(null);

  // Per-tile connectivity test state (driven by section "Test All" buttons)
  let testState = $state<Map<string, { testing: boolean; result: 'ok' | 'fail' | null }>>(new Map());
  let testingSection = $state<ProviderSectionId | null>(null);

  const groups = $derived(groupProviders(providers.list));

  function openCustomForm(kind: 'openai' | 'anthropic') {
    formPreset = kind;
    formOpen = true;
  }

  async function runTestAll(sectionId: ProviderSectionId, bucket: EnrichedProvider[]) {
    if (testingSection) return;
    testingSection = sectionId;
    const targets = bucket.filter((p) => isConnected(p));
    for (const p of targets) {
      testState.set(p.id, { testing: true, result: null });
      try {
        const r = await refreshProvider(p.id);
        testState.set(p.id, { testing: false, result: r.ok ? 'ok' : 'fail' });
      } catch {
        testState.set(p.id, { testing: false, result: 'fail' });
      }
      await new Promise((res) => setTimeout(res, 300));
    }
    testingSection = null;
  }

  async function onDelete(p: EnrichedProvider) {
    try { const r = await deleteProvider(p.id); if (r.ok) toast(`Deleted ${p.name}`, 'success'); else toast(r.error ? String(r.error) : 'Delete failed', 'error'); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), 'error'); }
    delTarget = null;
    await refreshAll();
  }

  async function onConfigure(p: EnrichedProvider) {
    if (p.authType === 'oauth') return onOAuth(p);
    const key = prompt(`API key for ${p.name}:`);
    if (!key) return;
    try { const r = await saveKey(p.id, key); if (r.ok) { toast('Key saved', 'success'); await refreshAll(); } else toast('Save failed', 'error'); }
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
      <p class="sub">Connect model providers via API key or OAuth. Click an unconnected card to configure it.</p>
    </div>
    <div class="acts">
      <Button variant="ghost" onclick={() => refreshAll()}>Refresh all</Button>
    </div>
  </div>

  {#if providers.loading}
    <Spinner label="Loading providers…" />
  {:else if providers.error}
    <EmptyState title="Could not load providers" icon="M12 8v5M12 17h.01">{providers.error}</EmptyState>
  {:else if providers.list.length === 0}
    <EmptyState title="No providers yet" icon="M12 11h8M4 11h4M4 19h16">Add a custom endpoint to start browsing models.</EmptyState>
  {:else}
    <ProviderSection title="Custom Providers (OpenAI/Anthropic Compatible)" count={groups.custom.length}>
      {#snippet action()}
        <Button size="sm" onclick={() => openCustomForm('anthropic')}>+ Add Anthropic Compatible</Button>
        <Button size="sm" variant="ghost" onclick={() => openCustomForm('openai')}>+ Add OpenAI Compatible</Button>
      {/snippet}
      {#if groups.custom.length === 0}
        <div class="custom-empty">
          <EmptyState title="" icon="M13 2v6h6M9 22v-6H3">
            No custom providers — use the buttons above to add OpenAI/Anthropic compatible endpoints.
          </EmptyState>
        </div>
      {:else}
        {#each groups.custom as p (p.id)}
          <ProviderTile provider={p} onDelete={(pp) => (delTarget = pp)} />
        {/each}
      {/if}
    </ProviderSection>

    {#if groups.oauth.length > 0}
      <ProviderSection title="OAuth Providers" count={groups.oauth.length}>
        {#snippet action()}
          <Button size="sm" variant="ghost" disabled={testingSection !== null} onclick={() => runTestAll('oauth', groups.oauth)}>▷ Test All</Button>
        {/snippet}
        {#each groups.oauth as p (p.id)}
          {@const t = testState.get(p.id)}
          <ProviderTile provider={p} testing={t?.testing} testResult={t?.result} onConfigure={() => onConfigure(p)} onDelete={(pp) => (delTarget = pp)} />
        {/each}
      </ProviderSection>
    {/if}

    {#if groups.free.length > 0}
      <ProviderSection title="Free Tier Providers" count={groups.free.length}>
        {#snippet action()}
          <Button size="sm" variant="ghost" disabled={testingSection !== null} onclick={() => runTestAll('free', groups.free)}>▷ Test All</Button>
        {/snippet}
        {#each groups.free as p (p.id)}
          {@const t = testState.get(p.id)}
          <ProviderTile provider={p} testing={t?.testing} testResult={t?.result} onConfigure={() => onConfigure(p)} onDelete={(pp) => (delTarget = pp)} />
        {/each}
      </ProviderSection>
    {/if}

    {#if groups.apikey.length > 0}
      <ProviderSection title="API Key Providers" count={groups.apikey.length}>
        {#snippet action()}
          <Button size="sm" variant="ghost" disabled={testingSection !== null} onclick={() => runTestAll('apikey', groups.apikey)}>▷ Test All</Button>
        {/snippet}
        {#each groups.apikey as p (p.id)}
          {@const t = testState.get(p.id)}
          <ProviderTile provider={p} testing={t?.testing} testResult={t?.result} onConfigure={() => onConfigure(p)} onDelete={(pp) => (delTarget = pp)} />
        {/each}
      </ProviderSection>
    {/if}
  {/if}
</div>

<ProviderForm open={formOpen} presetKind={formPreset} onclose={() => formOpen = false} onadded={() => refreshAll()} />
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
  .custom-empty { border: 1.5px dashed var(--border); border-radius: var(--radius); padding: 18px 12px; }
  .backdrop { position: fixed; inset: 0; z-index: 50; background: oklch(10% 0.01 70 / 0.6); display: grid; place-items: center; }
  .modal { width: 420px; max-width: 90vw; padding: 22px; border-radius: var(--radius); background: var(--surface); display: flex; flex-direction: column; gap: 12px; }
  .modal h3 { font-family: var(--font-display); font-size: 16px; }
  .code { font-size: 13px; color: var(--text-2); }
  .note { font-size: 12px; color: var(--text-3); }
</style>
