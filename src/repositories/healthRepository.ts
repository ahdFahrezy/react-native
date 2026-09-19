import { apiClient } from '@/api/apiClient';
import { healthDummyApi, USE_DUMMY_API } from '@/dummy';
import { HealthRawResponse } from '@/types/health.types';

export interface IHealthRepository {
  fetchHealth(): Promise<{ data: HealthRawResponse; responseTimeMs: number; endpoint: string }>;
}

export class HealthRepository implements IHealthRepository {
  /**
   * Fetches server status data from API endpoint or dummy mock.
   * Abstracts data source (remote network vs dummy cache).
   */
  async fetchHealth(): Promise<{ data: HealthRawResponse; responseTimeMs: number; endpoint: string }> {
    if (USE_DUMMY_API) {
      return healthDummyApi.fetchHealth();
    }

    const endpoint = '/get';
    const startTime = Date.now();

    const data = await apiClient.get<HealthRawResponse>(endpoint);
    const responseTimeMs = Date.now() - startTime;

    return {
      data,
      responseTimeMs,
      endpoint: `${apiClient.getBaseUrl()}${endpoint}`,
    };
  }
}

export const healthRepository = new HealthRepository();
