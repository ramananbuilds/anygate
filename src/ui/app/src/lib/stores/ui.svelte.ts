// Global UI state: toasts + command palette open state.


export interface Toast {
  id: number;
  message: string;
  kind: 'info' | 'success' | 'error';
  timeout?: ReturnType<typeof setTimeout>;
}

export const ui = $state<{
  toasts: Toast[];
  commandOpen: boolean;
  loadingRoutes: Set<string>;
}>({
  toasts: [],
  commandOpen: false,
  loadingRoutes: new Set(),
});

let toastSeq = 0;

export function toast(message: string, kind: Toast['kind'] = 'info', ttlMs = 4000): void {
  const id = ++toastSeq;
  const t: Toast = { id, message, kind };
  ui.toasts = [...ui.toasts, t];
  t.timeout = setTimeout(() => dismissToast(id), ttlMs);
}

export function dismissToast(id: number): void {
  const t = ui.toasts.find(x => x.id === id);
  if (t?.timeout) clearTimeout(t.timeout);
  ui.toasts = ui.toasts.filter(x => x.id !== id);
}

export function openCommand(): void {
  ui.commandOpen = true;
}
export function closeCommand(): void {
  ui.commandOpen = false;
}
export function toggleCommand(): void {
  ui.commandOpen = !ui.commandOpen;
}
