<script lang="ts">
  import { theme, toggleTheme } from '../lib/stores/theme.svelte';
  import { config, setTier, type SubscriptionTier } from '../lib/stores/config.svelte';
  import { presets, loadPresets, savePreset, deletePreset } from '../lib/stores/presets.svelte';
  import { providers } from '../lib/stores/providers.svelte';
  import { favorites } from '../lib/stores/favorites.svelte';
  import { exportConfig, importConfig, computeDryRun } from '../lib/api/endpoints';
  import { Card, Button, Select, Toggle, Input, Modal, Spinner, Badge, EmptyState } from '../lib/components/primitives';
  import { toast } from '../lib/stores/ui.svelte';
  import type { Preset } from '../lib/api/types';

  let exportOpen = $state(false);
  let exportText = $state('');
  let importOpen = $state(false);
  let importText = $state('');

  const tierOptions = [
    { value: 'free', label: 'Free' },
    { value: 'zen', label: 'Zen' },
    { value: 'go', label: 'Go' },
    { value: 'both', label: 'Both' },
  ];

  function openExport() { exportConfig().then(t => { exportText = t; exportOpen = true; }).catch(e => toast(String(e), 'error')); }
  async function doImport() {
    try { await importConfig(importText); toast('Config imported', 'success'); importOpen = false; await loadPresets(); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), 'error'); }
  }
  function downloadExport() {
    const blob = new Blob([exportText], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'anygate-config.json'; a.click();
  }

  // Preset form
  let presetForm = $state(false);
  let pApp = $state('');
  let pProvider = $state('');
  let pModel = $state('');
  let pLabel = $state('');

  function dryRunPreview(p: Preset): string {
    const prov = providers.list.find(x => x.id === p.providerId);
    const m = prov?.enrichedModels.find(x => x.id === p.modelId);
    if (!prov || !m) return '—';
    const env = computeDryRun({ provider: prov, modelId: m.id, contextWindow: m.contextWindow });
    return env.env.map(e => `${e.key}=${e.masked ? '•••' : e.value}`).join('\n');
  }
</script>

<div class="page">
  <div class="head"><h2>Settings</h2><p class="sub">Theme, subscription tier, launch presets, and portable config backup.</p></div>

  <div class="cols">
    <div class="stack">
      <Card padding="20px">
        <h3>Appearance</h3>
        <div class="line">
          <span>Theme</span>
          <Button size="sm" variant="ghost" onclick={toggleTheme}>{theme.value === 'dark' ? 'Dark' : 'Light'} · toggle</Button>
        </div>
      </Card>

      <Card padding="20px">
        <h3>Subscription tier</h3>
        <div class="line">
          <span>Backend selection for wizards</span>
          <Select value={config.tier} options={tierOptions} onchange={(v) => setTier(v as SubscriptionTier)} />
        </div>
        {#if config.anygateHome}<div class="kv"><span>ANYGATE_HOME</span><code>{config.anygateHome}</code></div>{/if}
      </Card>

      <Card padding="20px">
        <h3>Config backup</h3>
        <p class="muted">Export favorites to a portable JSON file and re-import on another machine.</p>
        <div class="acts">
          <Button size="sm" variant="subtle" onclick={openExport}>Export favorites</Button>
          <Button size="sm" variant="ghost" onclick={() => importOpen = true}>Import</Button>
        </div>
      </Card>
    </div>

    <div class="stack">
      <Card padding="20px">
        <div class="sec-head"><h3>Launch presets</h3><Button size="sm" onclick={() => { presetForm = true; pApp=''; pProvider=''; pModel=''; pLabel=''; }}>New</Button></div>
        {#if presets.list.length === 0}
          <EmptyState title="No presets" icon="M12 5v14M5 12h14">Save an app + provider + model combo for one-click launch.</EmptyState>
        {:else}
          {#each presets.list as p (p.id)}
            <div class="preset">
              <div class="pmeta">
                <span class="pname">{p.label ?? p.appId}</span>
                <span class="psub">{p.providerId}{p.modelId ? ' · ' + p.modelId : ''}{p.folder ? ' · ' + p.folder : ''}</span>
              </div>
              <div class="pacts">
                <Button size="sm" variant="ghost" onclick={() => navigator.clipboard.writeText(dryRunPreview(p))}>Dry run</Button>
                <Button size="sm" variant="ghost" onclick={() => deletePreset(p.id)}>Delete</Button>
              </div>
            </div>
            <pre class="dryrun">{dryRunPreview(p)}</pre>
          {/each}
        {/if}
      </Card>
    </div>
  </div>
</div>

{#if exportOpen}
  <Modal open={exportOpen} title="Export favorites" onclose={() => exportOpen = false}>
    <textarea class="ta" readonly value={exportText}></textarea>
    <div class="row" style="margin-top:14px;justify-content:flex-end;gap:8px">
      <Button variant="ghost" onclick={() => exportOpen = false}>Close</Button>
      <Button onclick={downloadExport}>Download</Button>
    </div>
  </Modal>
{/if}

{#if importOpen}
  <Modal open={importOpen} title="Import config" onclose={() => importOpen = false}>
    <p class="muted">Paste an anygate config JSON (from Export favorites).</p>
    <textarea class="ta" bind:value={importText} placeholder="Paste JSON here"></textarea>
    <div class="row" style="margin-top:14px;justify-content:flex-end;gap:8px">
      <Button variant="ghost" onclick={() => importOpen = false}>Cancel</Button>
      <Button onclick={doImport}>Import</Button>
    </div>
  </Modal>
{/if}

{#if presetForm}
  <Modal open={presetForm} title="New preset" onclose={() => presetForm = false}>
    <span class="lbl">Label</span>
    <Input bind:value={pLabel} placeholder="My daily setup" />
    <span class="lbl" style="margin-top:12px">App</span>
    <Select bind:value={pApp} options={[{ value: '', label: '—' }, ...providers.list.length ? [{ value: 'claude', label: 'Claude' }, { value: 'codex', label: 'Codex' }, { value: 'antigravity', label: 'Antigravity' }] : []]} />
    <span class="lbl" style="margin-top:12px">Provider</span>
    <Select bind:value={pProvider} options={[{ value: '', label: '—' }, ...providers.list.map(p => ({ value: p.id, label: p.name }))]} />
    {#if pProvider}
      <span class="lbl" style="margin-top:12px">Model</span>
      <Select bind:value={pModel} options={[{ value: '', label: '—' }, ...(providers.list.find(p => p.id === pProvider)?.enrichedModels ?? []).map(m => ({ value: m.id, label: m.name ?? m.id }))]} />
    {/if}
    <div class="row" style="margin-top:18px;justify-content:flex-end;gap:8px">
      <Button variant="ghost" onclick={() => presetForm = false}>Cancel</Button>
      <Button disabled={!pApp || !pLabel} onclick={async () => { await savePreset({ appId: pApp, providerId: pProvider || undefined, modelId: pModel || undefined, label: pLabel }); presetForm = false; }}>Save</Button>
    </div>
  </Modal>
{/if}

<style>
  .head { margin-bottom: 18px; }
  h2 { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-1); }
  .sub { font-size: 13px; color: var(--text-3); margin-top: 4px; }
  h3 { font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-bottom: 12px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  .stack { display: flex; flex-direction: column; gap: 14px; }
  .line { display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; color: var(--text-2); gap: 12px; }
  .kv { display: flex; gap: 10px; margin-top: 12px; font-size: 12px; }
  .kv code { font-family: ui-monospace, monospace; color: var(--accent); background: var(--surface-2); padding: 3px 7px; border-radius: 5px; }
  .muted { font-size: 12.5px; color: var(--text-3); margin-bottom: 14px; line-height: 1.5; }
  .acts { display: flex; gap: 8px; }
  .sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .preset { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .pname { font-size: 13.5px; font-weight: 600; color: var(--text-1); display: block; }
  .psub { font-size: 11.5px; color: var(--text-3); }
  .pacts { display: flex; gap: 6px; }
  .dryrun { font-family: ui-monospace, monospace; font-size: 11px; color: var(--text-2); background: var(--surface-2); padding: 8px 10px; border-radius: 6px; white-space: pre-wrap; margin-bottom: 10px; }
  .ta { width: 100%; min-height: 160px; padding: 10px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-1); font-family: ui-monospace, monospace; font-size: 12px; resize: vertical; }
  .ta:focus { outline: none; border-color: var(--accent); }
  .lbl { display: block; font-size: 12.5px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; }
  .row { display: flex; }
  @media (max-width: 920px) { .cols { grid-template-columns: 1fr; } }
</style>
