<script lang="ts">
  import type { UiTemplate } from '../../api/types';
  import { Input, Button, Modal } from '../primitives';
  import { getTemplates, addProvider, addCustomProvider } from '../../api/endpoints';
  import { toast } from '../../stores/ui.svelte';

  interface Props { open: boolean; onclose: () => void; onadded: () => void; }
  let { open, onclose, onadded }: Props = $props();

  let templates = $state<UiTemplate[]>([]);
  let loading = $state(false);
  let selected = $state<string | null>(null);
  let apiKey = $state('');
  let baseUrl = $state('');
  let displayName = $state('');
  let headersText = $state('');
  let busy = $state(false);

  // Parse "Name: value" lines into a headers object. Blank lines and lines
  // without a colon are ignored. Used by endpoints that gate on client
  // identity (e.g. a required User-Agent).
  function parseHeaders(text: string): Record<string, string> {
    const out: Record<string, string> = {};
    for (const line of text.split('\n')) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const name = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (name && value) out[name] = value;
    }
    return out;
  }

  async function load() {
    loading = true;
    try { templates = (await getTemplates()).templates; } catch (e) { toast(String(e), 'error'); }
    loading = false;
  }

  $effect(() => { if (open) { void load(); selected = null; apiKey = ''; baseUrl = ''; displayName = ''; headersText = ''; } });

  const current = $derived(templates.find(t => t.id === selected));
  const customOpenai = $derived(selected === '__custom_openai__');
  const customAnthropic = $derived(selected === '__custom_anthropic__');

  async function submit() {
    if (!selected) return;
    busy = true;
    try {
      let res: { ok: boolean; error?: string; hint?: string; name?: string };
      if (customOpenai || customAnthropic) {
        const headers = parseHeaders(headersText);
        res = await addCustomProvider({
          kind: customOpenai ? 'openai' : 'anthropic',
          displayName,
          baseUrl,
          apiKey,
          ...(Object.keys(headers).length > 0 ? { headers } : {}),
        });
      } else {
        res = await addProvider(selected!, apiKey || undefined, baseUrl || undefined);
      }
      if (res.ok) { toast(`Added ${res.name ?? selected}`, 'success'); onadded(); onclose(); }
      else toast(res.error ?? 'Failed to add provider', 'error');
    } catch (e) { toast(e instanceof Error ? e.message : String(e), 'error'); }
    busy = false;
  }
</script>

<Modal {open} title="Add provider" {onclose}>
  {#if loading}
    <p style="color:var(--text-3)">Loading templates…</p>
  {:else}
    <span class="lbl">Provider</span>
    <select class="sel" bind:value={selected}>
      <option value={null}>Select a provider…</option>
      {#each templates as t (t.id)}<option value={t.id}>{t.name}{t.anonymousFreeModels ? ' (free)' : ''}{t.subscriptionRisk ? ' ⚠' : ''}</option>{/each}
    </select>

    {#if current && current.authType === 'api' && !current.apiKeyOptional && !customOpenai && !customAnthropic}
      <span class="lbl" style="margin-top:14px">API key</span>
      <Input bind:value={apiKey} placeholder={current.apiKeyOptional ? 'optional' : 'Paste your key'} />
      {#if current.signupUrl}
        <a class="hint-link" href={current.signupUrl} target="_blank" rel="noopener noreferrer">Get an API key →</a>
      {/if}
      {#if current.signupNote}
        <span class="signup-note">{current.signupNote}</span>
      {/if}
    {/if}

    {#if current?.urlPrompt}
      <span class="lbl" style="margin-top:14px">{current.urlPrompt}</span>
      <Input bind:value={baseUrl} placeholder={current.defaultBaseUrl ?? 'https://'} />
    {/if}

    {#if customOpenai || customAnthropic}
      <span class="lbl" style="margin-top:14px">Display name</span>
      <Input bind:value={displayName} placeholder="My endpoint" />
      <span class="lbl" style="margin-top:14px">Base URL</span>
      <Input bind:value={baseUrl} placeholder="https://" />
      <span class="lbl" style="margin-top:14px">API key <span style="color:var(--text-3)">(optional)</span></span>
      <Input bind:value={apiKey} />
      <span class="lbl" style="margin-top:14px">Custom headers <span style="color:var(--text-3)">(optional)</span></span>
      <textarea
        class="hdrs"
        bind:value={headersText}
        rows="3"
        placeholder="One per line, e.g.&#10;User-Agent: claude-cli/1.0.0 (external, cli)&#10;x-app: cli"
      ></textarea>
      <span class="hint-txt">Some endpoints only accept requests from a recognized client. Add headers like <code>User-Agent</code> here if the provider requires them.</span>
    {/if}

    <div class="row" style="margin-top:20px;justify-content:flex-end;gap:8px">
      <Button variant="ghost" onclick={onclose}>Cancel</Button>
      <Button disabled={!selected || busy} onclick={submit}>{busy ? 'Adding…' : 'Add provider'}</Button>
    </div>
  {/if}
</Modal>

<style>
  .lbl { display: block; font-size: 12.5px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; }
  .sel { width: 100%; padding: 9px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-1); font-size: 13.5px; }
  .row { display: flex; }
  .hint-link { display: inline-block; margin-top: 7px; font-size: 12.5px; font-weight: 600; color: var(--accent); text-decoration: none; }
  .hint-link:hover { text-decoration: underline; }
  .hdrs { width: 100%; padding: 9px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-1); font-size: 13px; font-family: var(--font-mono, monospace); resize: vertical; box-sizing: border-box; }
  .hint-txt { display: block; margin-top: 7px; font-size: 12px; color: var(--text-3); line-height: 1.4; }
  .hint-txt code { font-size: 11.5px; background: var(--surface); padding: 1px 4px; border-radius: 4px; }
  .signup-note { display: block; margin-top: 5px; font-size: 12px; color: var(--text-3); line-height: 1.4; }
</style>
