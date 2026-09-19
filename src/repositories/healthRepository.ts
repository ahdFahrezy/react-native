import { apiClient } from '@/api/apiClient';
import { HealthRawResponse } from '@/types/health.types';

export interface IHealthRepository {
  fetchHealth(): Promise<{ data: HealthRawResponse; responseTimeMs: number; endpoint: string }>;
}

export class HealthRepository implements IHealthRepository {
  /**
   * Mengambil data status server dari endpoint API.
   * Repository mengabstraksi sumber data (remote network vs cache).
   */
  async fetchHealth(): Promise<{ data: HealthRawResponse; responseTimeMs: number; endpoint: string }> {
    const endpoint = '/get'; // Standar query endpoint di httpbin (bisa diganti '/health' untuk server kustom)
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

// Export singleton instance untuk kemudahan pakai di Service
export const healthRepository = new HealthRepository();
