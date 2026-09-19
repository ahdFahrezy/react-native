import { HealthRawResponse } from '@/types/health.types';
import { simulateDelay } from './helper';
import { logger } from '@/utils/logger';

const log = logger.createScope('HealthDummyAPI');

export class HealthDummyApi {
  async fetchHealth(): Promise<{ data: HealthRawResponse; responseTimeMs: number; endpoint: string }> {
    log.info('[DummyAPI] Fetching system health status...');
    const startTime = Date.now();
    await simulateDelay(60);
    const responseTimeMs = Date.now() - startTime;

    const data: HealthRawResponse = {
      url: 'https://dummy-api.internal/health',
      origin: '127.0.0.1',
      headers: {
        Host: 'dummy-api.internal',
        'User-Agent': 'Expo/57.0 (DummyClient)',
        Accept: 'application/json',
      },
    };

    log.info(`[DummyAPI] System healthy (latency: ${responseTimeMs}ms)`);
    return {
      data,
      responseTimeMs,
      endpoint: 'https://dummy-api.internal/health',
    };
  }
}

export const healthDummyApi = new HealthDummyApi();
