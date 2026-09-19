export type HealthStatus = 'healthy' | 'degraded' | 'down';

export interface HealthRawResponse {
  status?: string;
  message?: string;
  timestamp?: string | number;
  version?: string;
  uptime?: number;
  [key: string]: unknown;
}

export interface HealthCheckResult {
  status: HealthStatus;
  message: string;
  timestamp: string;
  latencyMs: number;
  endpoint: string;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
}
