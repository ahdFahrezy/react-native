import { healthRepository, IHealthRepository } from '@/repositories/healthRepository';
import { HealthCheckResult, HealthStatus } from '@/types/health.types';

export class HealthService {
  constructor(private readonly repo: IHealthRepository = healthRepository) {}

  /**
   * Menjalankan health check sistem dan memproses business logic:
   * 1. Mengukur latency
   * 2. Menilai kesehatan server (healthy vs degraded) berdasarkan threshold
   * 3. Memformat output untuk presentation layer
   */
  async checkSystemHealth(): Promise<HealthCheckResult> {
    try {
      const { responseTimeMs, endpoint } = await this.repo.fetchHealth();

      // Aturan Bisnis: jika latency > 1500ms, sistem dikategorikan 'degraded'
      let status: HealthStatus = 'healthy';
      let message = 'All systems operational';

      if (responseTimeMs > 1500) {
        status = 'degraded';
        message = 'High response latency detected';
      }

      return {
        status,
        message,
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: responseTimeMs,
        endpoint,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reach server';
      return {
        status: 'down',
        message: errorMessage,
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: 0,
        endpoint: 'Endpoint unreachable',
      };
    }
  }
}

export const healthService = new HealthService();
