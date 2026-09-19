import { useState, useEffect, useCallback } from 'react';
import { healthService } from '@/services/healthService';
import { HealthCheckResult } from '@/types/health.types';

export function useHealth(autoFetch = true) {
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await healthService.checkSystemHealth();
      setResult(res);
      if (res.status === 'down') {
        setError(res.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error during health check';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      checkHealth();
    }
  }, [autoFetch, checkHealth]);

  return {
    result,
    loading,
    error,
    refetch: checkHealth,
  };
}
