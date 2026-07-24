import { isProviderHealthy, getProviderHealth, updateProviderHealth } from '../engine/routing/health.js';

export function checkProviderHealth(providerId: string) {
  const status = getProviderHealth(providerId);
  if (!status) return { healthy: true, status: 'unknown' };
  return status;
}

export { isProviderHealthy, updateProviderHealth };
