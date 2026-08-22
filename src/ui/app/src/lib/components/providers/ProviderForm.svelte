<script lang="ts">
  import type { UiTemplate } from '../../api/types';
  import { Input, Button, Modal, Spinner } from '../primitives';
  import { getTemplates, addProvider, addCustomProvider, getOAuthStatus } from '../../api/endpoints';
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

  let oauthSessionId = $state<string | null>(null);
  let oauthUrl = $state<string>('');
  let oauthUserCode = $state<string>('');
  let oauthPolling = $state(false);
  let oauthDone = $state(false);
  let oauthError = $state<string>('');
  let pollHandle: ReturnType<typeof setInterval> | null = null;

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

  function clearOAuth() {
    if (pollHandle) { clearInterval(pollHandle); pollHandle = null; }
    oauthSessionId = null;
    oauthUrl = ''
    oauthUserCode = ''
    oauthPolling = false
    oauthDone = false
    oauthError = ''
  }

  async function load() {
    loading = true;
    try { templates = (await getTemplates()).templates; } catch (e) { toast(String(e), 'error'); }
    loading = false;
  }

  $effect(() => {
    if (open) {
      void load()
      selected = null
      apiKey = ''
      baseUrl = ''
      displayName = ''
      headersText = ''
      busy = false
      clearOAuth()
    }
  });

  const current = $derived(templates.find(t => t.id === selected));
  const customOpenai = $derived(selected === '__custom_openai__');
  const customAnthropic = $derived(selected === '__custom_anthropic__');
  const isOAuth = $derived(current?.authType === 'oauth' && !customOpenai && !customAnthropic);

  async function startOAuthPoll(sessionId: string) {
    oauthPolling = true
    pollHandle = setInterval(async () => {
      try {
        const st = await getOAuthStatus(sessionId)
        if (st.status !== 'pending') {
          if (pollHandle) clearInterval(pollHandle)
          pollHandle = null
          oauthPolling = false
          if (st.status === 'done') {
            oauthDone = true
            toast(`${current?.name ?? 'Provider'} connected`, 'success')
            setTimeout(() => { onadded(); onclose(); }, 800)
          } else {
            oauthError = st.error ?? 'OAuth sign-in failed'
          }
        }
      } catch {
        if (pollHandle) clearInterval(pollHandle)
        pollHandle = null
        oauthPolling = false
      }
    }, 2000)
  }

  async function submit() {
    if (!selected) return;
    busy = true;
    try {
      let res: { ok: boolean; error?: string; hint?: string; name?: string; oauth?: boolean; sessionId?: string; url?: string; userCode?: string; authUrl?: string; pkce?: boolean };
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

      if (res.oauth) {
        oauthUrl = res.url ?? res.authUrl ?? ''
        oauthUserCode = res.userCode ?? ''
        if (res.sessionId) {
          oauthSessionId = res.sessionId
          const urlToOpen = res.url ?? res.authUrl ?? ''
          if (urlToOpen) window.open(urlToOpen, '_blank', 'noopener,noreferrer')
          startOAuthPoll(res.sessionId)
        } else if (res.error) {
          toast(res.error, 'error')
          busy = false
        }
      } else if (res.ok) {
        toast(`Added ${res.name ?? selected}`, 'success')
        onadded()
        onclose()
      } else {
        toast(res.error ?? 'Failed to add provider', 'error')
      }
    } catch (e) { toast(e instanceof Error ? e.message : String(e), 'error'); }
    if (!oauthSessionId) busy = false;
  }
</script>

<Modal {open} title="Add provider" {onclose}>
  {#if loading}
    <p style="color:var(--text-3)">Loading templates…</p>
  {:else if oauthDone}
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 0">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <p style="color:var(--text-1);font-weight:600">Signed in successfully</p>
    </div>
  {:else if oauthError}
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 0">
      <p style="color:var(--red);font-weight:600">Sign-in failed</p>
      <p style="color:var(--text-3);font-size:13px">{oauthError}</p>
      <Button variant="ghost" onclick={() => { clearOAuth(); busy = false; }}>Try again</Button>
    </div>
  {:else if oauthSessionId}
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:16px 0">
      <Spinner label={oauthPolling ? 'Waiting for sign-in…' : 'Starting sign-in…'} />
      {#if oauthUserCode}
        <p style="color:var(--text-3);font-size:13px;text-align:center">
          Enter code: <strong style="color:var(--text-1)">{oauthUserCode}</strong>
        </p>
      {/if}
      <p style="color:var(--text-3);font-size:12px">Complete sign-in in the opened tab. This window updates automatically.</p>
    </div>
  {:else}
    <span class="lbl">Provider</span>
    <select class="sel" bind:value={selected}>
      <option value={null}>Select a provider…</option>
      {#each templates as t (t.id)}<option value={t.id}>{t.name}{t.anonymousFreeModels ? ' (free)' : ''}{t.subscriptionRisk ? ' ⚠' : ''}</option>{/each}
    </select>

    {#if current && current.authType === 'api' && !customOpenai && !customAnthropic}
      <span class="lbl" style="margin-top:14px">API key{#if current.apiKeyOptional} <span style="color:var(--text-3)">(optional)</span>{/if}</span>
      <Input bind:value={apiKey} placeholder={current.apiKeyOptional ? 'Leave blank for a local server without auth' : 'Paste your key'} />
      {#if current.signupUrl}
        <a class="hint-link" href={current.signupUrl} target="_blank" rel="noopener noreferrer">Get an API key →</a>
      {/if}
      {#if current.signupNote}
        <span class="signup-note">{current.signupNote}</span>
      {/if}
    {/if}

    {#if isOAuth}
      <span class="hint-txt" style="margin-top:14px">
        Click <strong>Add provider</strong> to sign in with {current?.name}.
      </span>
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
      <Button disabled={!selected || busy} onclick={submit}>{isOAuth ? 'Sign in' : busy ? 'Adding…' : 'Add provider'}</Button>
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
