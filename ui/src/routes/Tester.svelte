<script lang="ts">
  import { providers, type EnrichedModel } from '../lib/stores/providers.svelte';
  import { testModel } from '../lib/api/endpoints';
  import type { UiModelTestResult } from '../lib/api/types';
  import { Button, Select, Spinner, Card, EmptyState, Badge } from '../lib/components/primitives';
  import { toast } from '../lib/stores/ui.svelte';

  let providerId = $state('');
  let modelId = $state('');
  let prompt = $state('Reply with a single word: pong');

  let running = $state(false);
  let result = $state<UiModelTestResult | null>(null);
  let errorMsg = $state<string | null>(null);

  const providerOptions = $derived(
    providers.list
      .filter(p => (p.enrichedModels?.length ?? 0) > 0)
      .map(p => ({ value: p.id, label: p.name })),
  );

  const selectedProvider = $derived(providers.list.find(p => p.id === providerId));

  // Only testable formats (anthropic/openai) in the picker.
  function isTestable(m: EnrichedModel): boolean {
    return m.format === 'anthropic' || m.format === 'openai';
  }

  const testableModels = $derived((selectedProvider?.enrichedModels ?? []).filter(isTestable));
  const testableModelOptions = $derived(
    testableModels.map(m => ({
      value: m.id,
      label: `${m.name ?? m.id}${m.contextWindow ? ` · ${Math.round(m.contextWindow / 1000)}k` : ''}`,
    })),
  );

  // Keep selection valid when provider changes.
  $effect(() => {
    if (providerId && selectedProvider) {
      const ok = testableModels.some(m => m.id === modelId);
      if (!ok) modelId = '';
    } else {
      modelId = '';
    }
  });

  const canRun = $derived(!!providerId && !!modelId && !running);

  async function runTest() {
    if (!canRun) return;
    running = true;
    result = null;
    errorMsg = null;
    try {
      const res = await testModel({ providerId, modelId, prompt });
      result = res;
      if (!res.ok) {
        toast(res.error ?? 'Test failed', 'error');
      } else {
        toast(`Test passed · ${res.ttftMs}ms TTFT`, 'success');
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : String(err);
      toast('Network error', 'error');
    } finally {
      running = false;
    }
  }

  function fmt(ms: number | null): string {
    if (ms === null || ms === undefined) return '—';
    if (ms < 1000) return `${ms} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  }

  // TTFT gauge fill (0..100%) — 0ms = full ring, 3000ms+ = empty.
  const ttftPct = $derived(
    result && result.ttftMs !== null
      ? Math.max(0, Math.min(100, 100 - (result.ttftMs / 3000) * 100))
      : 0,
  );
</script>

<div class="page">
  <div class="head">
    <div>
      <h2>Model Tester</h2>
      <p class="sub">
        Pick a provider and model, then fire a live request at its real endpoint.
        Measures connection time, time-to-first-token, and total latency.
      </p>
    </div>
    <Badge>server-side · live</Badge>
  </div>

  <div class="grid">
    <!-- Control panel -->
    <Card padding="22px" class="panel">
      <h3 class="panel-title">Test configuration</h3>

      <label class="field">
        <span class="field-label">Provider</span>
        {#if providers.loading}
          <div class="muted">Loading providers…</div>
        {:else if providerOptions.length === 0}
          <div class="muted">No providers configured.</div>
        {:else}
          <Select
            bind:value={providerId}
            options={providerOptions}
            disabled={running}
            id="tester-provider"
          />
        {/if}
      </label>

      <label class="field">
        <span class="field-label">Model</span>
        {#if !providerId}
          <div class="muted">Select a provider first.</div>
        {:else if testableModelOptions.length === 0}
          <div class="muted">This provider has no directly-testable (OpenAI/Anthropic) models.</div>
        {:else}
          <Select
            bind:value={modelId}
            options={testableModelOptions}
            disabled={running}
            id="tester-model"
          />
        {/if}
      </label>

      <label class="field">
        <span class="field-label">Prompt</span>
        <textarea
          class="prompt"
          bind:value={prompt}
          rows="3"
          placeholder="What to send to the model…"
          disabled={running}
          id="tester-prompt"
        ></textarea>
      </label>

      <div class="run">
        <Button variant="primary" size="lg" disabled={!canRun} onclick={runTest}>
          {#if running}
            <Spinner label="" /> Testing…
          {:else}
            Run test
          {/if}
        </Button>
      </div>
    </Card>

    <!-- Results -->
    <div class="results">
      {#if running}
        <Card padding="28px" class="result-card live">
          <div class="live-pulse"></div>
          <p class="live-text">Probing <strong>{modelId}</strong>…</p>
          <p class="muted">Connecting to upstream endpoint.</p>
        </Card>
      {:else if result && result.ok}
        <Card padding="24px" class="result-card pass">
          <div class="result-head">
            <span class="status-dot ok"></span>
            <span class="status-text ok">Endpoint responds</span>
            <Badge>{result.format}</Badge>
          </div>

          <div class="metrics">
            <div class="metric gauge">
              <svg viewBox="0 0 120 120" class="gauge-svg">
                <circle class="gauge-bg" cx="60" cy="60" r="52" />
                <circle
                  class="gauge-fg"
                  cx="60" cy="60" r="52"
                  style="stroke-dashoffset: {329.9 - (329.9 * ttftPct) / 100}"
                />
              </svg>
              <div class="gauge-center">
                <span class="gauge-value">{result.ttftMs ?? '—'}</span>
                <span class="gauge-unit">ms TTFT</span>
              </div>
              <span class="metric-label">Time to first token</span>
            </div>

            <div class="metric">
              <span class="metric-value mono">{fmt(result.connectMs)}</span>
              <span class="metric-label">Connect</span>
            </div>
            <div class="metric">
              <span class="metric-value mono">{fmt(result.totalMs)}</span>
              <span class="metric-label">Total round-trip</span>
            </div>
            <div class="metric">
              <span class="metric-value mono">{result.tokensPerSec ?? '—'}</span>
              <span class="metric-label">Tokens / sec</span>
            </div>
            <div class="metric">
              <span class="metric-value mono">{result.tokens}</span>
              <span class="metric-label">Streamed chunks</span>
            </div>
            <div class="metric">
              <span class="metric-value mono" class:warn={result.streamStability === 'intermittent'}>
                {result.streamStability}
              </span>
              <span class="metric-label">Stream stability</span>
            </div>
          </div>

          {#if result.sample}
            <div class="sample">
              <span class="sample-label">Sample response</span>
              <pre class="sample-body">{result.sample}</pre>
            </div>
          {/if}
        </Card>
      {:else if result && !result.ok}
        <Card padding="24px" class="result-card fail">
          <div class="result-head">
            <span class="status-dot no"></span>
            <span class="status-text no">Endpoint did not respond correctly</span>
          </div>
          <p class="fail-error">{result.error}</p>
          {#if result.errorHint}
            <p class="fail-hint">↳ {result.errorHint}</p>
          {/if}
          {#if result.connectMs !== null}
            <div class="mini-metrics">
              <span>connect {fmt(result.connectMs)}</span>
              <span>total {fmt(result.totalMs)}</span>
            </div>
          {/if}
        </Card>
      {:else if errorMsg}
        <Card padding="24px" class="result-card fail">
          <div class="result-head">
            <span class="status-dot no"></span>
            <span class="status-text no">Request error</span>
          </div>
          <p class="fail-error">{errorMsg}</p>
        </Card>
      {:else}
        <EmptyState
          title="No test run yet"
          icon="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 12l5-3"
        >
          Select a provider + model and hit <strong>Run test</strong> to measure live latency.
        </EmptyState>
      {/if}
    </div>
  </div>
</div>

<style>
  .page { max-width: 1080px; }
  .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
  h2 { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-1); }
  .sub { font-size: 13px; color: var(--text-3); margin-top: 4px; max-width: 640px; line-height: 1.55; }
  .grid { display: grid; grid-template-columns: 360px 1fr; gap: 18px; align-items: start; }
  @media (max-width: 880px) { .grid { grid-template-columns: 1fr; } }

  :global(.panel) { display: flex; flex-direction: column; gap: 16px; }
  .panel-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--text-1); }

  .field { display: flex; flex-direction: column; gap: 7px; }
  .field-label { font-size: 12px; font-weight: 600; color: var(--text-2); letter-spacing: 0.02em; text-transform: uppercase; }
  .muted { font-size: 13px; color: var(--text-3); padding: 9px 0; }

  .prompt {
    width: 100%; resize: vertical; padding: 10px 12px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); color: var(--text-1);
    font-size: 13.5px; font-family: var(--font-body); line-height: 1.5;
    transition: border-color var(--dur-sm) var(--ease), background var(--dur-sm) var(--ease);
  }
  .prompt:focus { outline: none; border-color: var(--accent); background: var(--surface-2); }

  :global(.run) { margin-top: 4px; justify-content: center; }

  .results { min-height: 260px; }
  :global(.result-card) { position: relative; overflow: hidden; }
  :global(.result-card.pass) { border-color: color-mix(in oklch, var(--success) 35%, var(--border)); }
  :global(.result-card.fail) { border-color: color-mix(in oklch, var(--error) 40%, var(--border)); }

  .result-head { display: flex; align-items: center; gap: 9px; margin-bottom: 18px; }
  .status-dot { width: 9px; height: 9px; border-radius: 50%; }
  .status-dot.ok { background: var(--success); box-shadow: 0 0 10px var(--success); }
  .status-dot.no { background: var(--error); box-shadow: 0 0 10px var(--error); }
  .status-text { font-weight: 600; font-size: 14px; }
  .status-text.ok { color: var(--success); }
  .status-text.no { color: var(--error); }

  .metrics {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  }
  @media (max-width: 560px) { .metrics { grid-template-columns: repeat(2, 1fr); } }

  .metric {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 14px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .metric-value { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--text-1); }
  .metric-value.mono { font-family: ui-monospace, 'Fira Code', 'SF Mono', Menlo, monospace; }
  .metric-value.warn { color: var(--warning); }
  .metric-label { font-size: 11.5px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.03em; }

  .gauge {
    grid-row: span 1; align-items: center; text-align: center; position: relative;
    background: transparent; border: none; padding: 0;
  }
  .gauge-svg { width: 120px; height: 120px; transform: rotate(-90deg); }
  .gauge-bg { fill: none; stroke: var(--surface-2); stroke-width: 10; }
  .gauge-fg {
    fill: none; stroke: var(--accent); stroke-width: 10; stroke-linecap: round;
    stroke-dasharray: 329.9; stroke-dashoffset: 329.9;
    transition: stroke-dashoffset var(--dur-lg) var(--ease);
    filter: drop-shadow(0 0 6px var(--accent-glow));
  }
  .gauge-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -64%);
    display: flex; flex-direction: column; align-items: center;
  }
  .gauge-value { font-family: ui-monospace, 'Fira Code', monospace; font-size: 26px; font-weight: 700; color: var(--text-1); }
  .gauge-unit { font-size: 10px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; }

  .sample { margin-top: 18px; }
  .sample-label { font-size: 11.5px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.03em; }
  .sample-body {
    margin-top: 6px; padding: 12px; border-radius: var(--radius-sm);
    background: var(--bg); border: 1px solid var(--border);
    font-family: ui-monospace, 'Fira Code', monospace; font-size: 12.5px;
    color: var(--text-2); white-space: pre-wrap; word-break: break-word; max-height: 160px; overflow-y: auto;
  }

  .fail-error { font-size: 14px; color: var(--text-1); font-weight: 500; }
  .fail-hint { font-size: 12.5px; color: var(--text-3); margin-top: 6px; line-height: 1.5; }
  .mini-metrics { display: flex; gap: 14px; margin-top: 14px; font-family: ui-monospace, monospace; font-size: 12px; color: var(--text-2); }

  .live-pulse {
    width: 14px; height: 14px; border-radius: 50%; background: var(--accent);
    box-shadow: 0 0 0 0 var(--accent-glow); animation: pulse 1.4s infinite;
    margin-bottom: 14px;
  }
  .live-text { font-size: 15px; font-weight: 600; color: var(--text-1); }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 var(--accent-glow); }
    70% { box-shadow: 0 0 0 14px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
  }
  @media (prefers-reduced-motion: reduce) {
    .live-pulse { animation: none; }
    .gauge-fg { transition: none; }
  }
</style>
