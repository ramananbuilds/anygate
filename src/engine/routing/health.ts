export interface ProviderHealthStatus {
  providerId: string;
  healthy: boolean;
  latencyMs?: number;
  lastChecked: number;
  error?: string;
}

const healthMap = new Map<string, ProviderHealthStatus>();

export function updateProviderHealth(status: ProviderHealthStatus): void {
  healthMap.set(status.providerId, status);
}

export function getProviderHealth(providerId: string): ProviderHealthStatus | undefined {
  return healthMap.get(providerId);
}

export function isProviderHealthy(providerId: string): boolean {
  const status = healthMap.get(providerId);
  return status ? status.healthy : true;
}
