import { useState, useEffect, useCallback } from 'react';
import { fetchApplicantListService } from '@/services/admission/fetchApplicantListService';
import { verifyApplicantService } from '@/services/admission/verifyApplicantService';
import { submitApplicationService } from '@/services/admission/submitApplicationService';
import { Applicant, VerifyApplicantDTO, SubmitApplicationDTO } from '@/types/admission.types';

export function useAdmissions(autoFetch = true) {
  const [data, setData] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchApplicantListService.execute();
      setData(items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyApplicant = useCallback(async (payload: VerifyApplicantDTO) => {
    const updated = await verifyApplicantService.execute(payload);
    setData((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    return updated;
  }, []);

  const submitApplication = useCallback(async (payload: SubmitApplicationDTO) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await submitApplicationService.execute(payload);
      setData((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit application';
      setError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchApplicants();
    }
  }, [autoFetch, fetchApplicants]);

  return {
    data,
    loading,
    submitting,
    error,
    refetch: fetchApplicants,
    verifyApplicant,
    submitApplication,
  };
}

