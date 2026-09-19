import { apiClient } from '@/api/apiClient';
import { admissionDummyApi, USE_DUMMY_API } from '@/dummy';
import { Applicant, VerifyApplicantDTO, SubmitApplicationDTO } from '@/types/admission.types';

export interface IAdmissionRepository {
  getAll(): Promise<Applicant[]>;
  getById(id: string): Promise<Applicant>;
  verify(payload: VerifyApplicantDTO): Promise<Applicant>;
  submitApplication(payload: SubmitApplicationDTO): Promise<Applicant>;
}

export class AdmissionRepository implements IAdmissionRepository {
  async getAll(): Promise<Applicant[]> {
    if (USE_DUMMY_API) {
      return admissionDummyApi.getAll();
    }
    return apiClient.get<Applicant[]>('/admissions/applicants');
  }

  async getById(id: string): Promise<Applicant> {
    if (USE_DUMMY_API) {
      return admissionDummyApi.getById(id);
    }
    return apiClient.get<Applicant>(`/admissions/applicants/${id}`);
  }

  async verify(payload: VerifyApplicantDTO): Promise<Applicant> {
    if (USE_DUMMY_API) {
      return admissionDummyApi.verify(payload);
    }
    return apiClient.post<Applicant>(`/admissions/applicants/${payload.applicantId}/verify`, payload);
  }

  async submitApplication(payload: SubmitApplicationDTO): Promise<Applicant> {
    if (USE_DUMMY_API) {
      return admissionDummyApi.submitApplication(payload);
    }
    return apiClient.post<Applicant>('/admissions/applicants', payload);
  }
}

export const admissionRepository = new AdmissionRepository();

