// Provider logo + palette data. Falls back to a generated monogram when no
// inline SVG is available. Keys are lowercased provider ids.
export interface ProviderVisual {
  // Optional inline SVG markup (Simple Icons style, 24x24 viewBox, currentColor).
  svg?: string;
  // Two-stop gradient for the logo tile background.
  gradient: [string, string];
}

const PALETTES: Record<string, [string, string]> = {
  anthropic: ['#d97757', '#b3543a'],
  openai: ['#10a37f', '#0d8268'],
  google: ['#4285f4', '#34a853'],
  gemini: ['#4285f4', '#a855f7'],
  xai: ['#ae1fym', '#1a1a1a'],
  openrouter: ['#f1553a', '#c43e26'],
  deepseek: ['#4d6bfe', '#3457d5'],
  ollama: ['#e6e6e6', '#b0b0b0'],
  kilocode: ['#7c5cff', '#5b3fd6'],
  mistral: ['#fa520f', '#d23c00'],
  meta: ['#0668e1', '#0a4fb0'],
  qwen: ['#615ced', '#4633c4'],
  default: ['#e0a44a', '#b5822f'],
};

const INLINE_SVGS: Record<string, string> = {
  anthropic: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v3.2l6.5-3.75a1 1 0 0 1 1.5.87V11l3.5-2.02a1 1 0 0 1 1 1.73L21.5 13l3.5 2.02a1 1 0 0 1-1 1.73L20 14.98V22a1 1 0 0 1-1.5.87L12 19.12V23a1 1 0 0 1-2 0v-3.88L3.5 22.87A1 1 0 0 1 2 22v-7.02L-1.5 17a1 1 0 0 1-1-1.73L2.5 13l-3.5-2.02a1 1 0 0 1 1-1.73L4 9.98V2a1 1 0 0 1 1.5-.87L12 4.8V3a1 1 0 0 1 1-1z" transform="translate(1 1)"/></svg>',
  openai: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a4 4 0 0 0-.7-2.3l.1-.1a3.7 3.7 0 0 0-5.2-5.2l-.1.1A4 4 0 0 0 12 2l-.1.1A3.7 3.7 0 0 0 7.1 4.7l-.1-.1a3.7 3.7 0 0 0-5.2 5.2l.1.1A4 4 0 0 0 2 12l-.1.1A3.7 3.7 0 0 0 4.7 16.9l.1-.1A4 4 0 0 0 12 22l.1-.1A3.7 3.7 0 0 0 16.9 19.3l.1.1a3.7 3.7 0 0 0 5.2-5.2l-.1-.1A4 4 0 0 0 22 12zM12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/></svg>',
  google: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 11v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9l3 2.3c1.7-1.6 2.8-4 2.8-6.9 0-.7-.1-1.3-.2-1.9zM6.5 13.5a4.5 4.5 0 0 1 0-3l-3-2.3a8 8 0 0 0 0 7.6zM12 6.2c1.5 0 2.8.5 3.8 1.5l2.9-2.9A8 8 0 0 0 3.5 8.7l3 2.3A4.5 4.5 0 0 1 12 6.2z"/></svg>',
};

export function providerVisual(id: string): ProviderVisual {
  const key = id.toLowerCase();
  return {
    svg: INLINE_SVGS[key],
    gradient: PALETTES[key] ?? PALETTES.default,
  };
}

// App icons — reuse the same monogram/svg approach.
export function appIcon(id: string): ProviderVisual {
  return providerVisual(id);
}
