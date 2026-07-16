import '../app.css';
import { mount } from 'svelte';
import App from './App.svelte';

try {
  mount(App, {
    target: document.getElementById('app')!,
  });
} catch (error) {
  // Surface mount-time errors visibly instead of a blank page (dev aid).
  console.error('Runtime error during mount:', error);
  const el = document.getElementById('app');
  const msg = error instanceof Error ? error.stack || error.message : String(error);
  if (el) {
    el.innerHTML = `<pre style="color:#ff8a8a;background:#161616;padding:24px;margin:0;white-space:pre-wrap;font:13px ui-monospace,monospace;max-height:100vh;overflow:auto">MOUNT ERROR:\n\n${msg.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))}</pre>`;
  }
}
