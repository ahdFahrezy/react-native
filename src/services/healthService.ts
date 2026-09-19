import { healthRepository, IHealthRepository } from '@/repositories/healthRepository';
import { HealthCheckResult, HealthStatus } from '@/types/health.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('CheckHealthService');

/**
 * Single-action service to evaluate system health.
 * Follows the 1 service = 1 function/action rule.
 */
export class CheckHealthService {
  constructor(private readonly repo: IHealthRepository = healthRepository) {}

  /**
   * Primary action method for the service.
   */
  async execute(): Promise<HealthCheckResult> {
    try {
      log.info('Starting system health evaluation...');
      const { responseTimeMs, endpoint } = await this.repo.fetchHealth();

      // Business Rule: if latency > 1500ms, mark as degraded
      let status: HealthStatus = 'healthy';
      let message = 'All systems operational';

      if (responseTimeMs > 1500) {
        status = 'degraded';
        message = 'High response latency detected';
        log.warn(`Degraded condition detected: latency ${responseTimeMs}ms`);
      } else {
        log.info(`System healthy: latency ${responseTimeMs}ms`);
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
      log.error(`System health check failed: ${errorMessage}`, error);
      return {
        status: 'down',
        message: errorMessage,
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: 0,
        endpoint: 'Endpoint unreachable',
      };
    }
  }

  // Alias for backward compatibility
  checkSystemHealth(): Promise<HealthCheckResult> {
    return this.execute();
  }
}

export const checkHealthService = new CheckHealthService();
export const healthService = checkHealthService;
