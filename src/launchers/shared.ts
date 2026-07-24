export interface BaseLaunchOptions {
  cwd?: string;
  env?: Record<string, string>;
  args?: string[];
  detached?: boolean;
}

export interface LaunchProcessResult {
  pid?: number;
  success: boolean;
  error?: string;
}
