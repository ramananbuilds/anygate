// Theme store: persists to localStorage, toggles [data-theme] on <html>.

type Theme = 'dark' | 'light';

function initial(): Theme {
  if (typeof localStorage === 'undefined') return 'dark';
  const saved = localStorage.getItem('anygate-theme');
  return saved === 'light' ? 'light' : 'dark';
}

export const theme = $state<{ value: Theme }>({ value: initial() });

function apply(t: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', t);
}

if (typeof document !== 'undefined') {
  apply(theme.value);
}

export function toggleTheme(): void {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('anygate-theme', theme.value);
  }
  apply(theme.value);
}
