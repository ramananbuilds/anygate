export type RoutingStrategy = 'direct' | 'round-robin' | 'lowest-latency' | 'failover';

export interface StrategyConfig {
  strategy: RoutingStrategy;
  fallbackProviders?: string[];
}
