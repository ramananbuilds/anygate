// Hash-based client router. Route = one of the top-level sections.
export type RouteId = 'dashboard' | 'providers' | 'models' | 'apps' | 'server' | 'settings';

const ROUTES: RouteId[] = ['dashboard', 'providers', 'models', 'apps', 'server', 'settings'];

function currentFromHash(): RouteId {
  const h = typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '';
  return (ROUTES.includes(h as RouteId) ? (h as RouteId) : 'dashboard');
}

export const router = $state<{ route: RouteId }>({ route: currentFromHash() });

export function navigate(route: RouteId): void {
  if (typeof window !== 'undefined') {
    window.location.hash = `/${route}`;
  }
}

export function startRouter(): void {
  const onHash = () => {
    router.route = currentFromHash();
  };
  window.addEventListener('hashchange', onHash);
  onHash();
}
