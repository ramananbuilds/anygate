export interface GatewayRoute {
  providerId: string;
  modelId: string;
  target: string;
  url: string;
}

export interface GatewayServerConfig {
  port: number;
  host: string;
  authSecret?: string;
  exposedProviders?: string[];
}
