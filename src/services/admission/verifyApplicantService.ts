import { admissionRepository, IAdmissionRepository } from '@/repositories/admissionRepository';
import { Applicant, VerifyApplicantDTO } from '@/types/admission.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('VerifyApplicantService');

export class VerifyApplicantService {
  constructor(private readonly repo: IAdmissionRepository = admissionRepository) {}

  async execute(payload: VerifyApplicantDTO): Promise<Applicant> {
    if (!payload.applicantId) {
      throw new Error('Applicant ID is required for verification.');
    }
    log.info(`Executing verification for applicant: ${payload.applicantId}`, payload);
    const result = await this.repo.verify(payload);
    log.info(`Applicant ${payload.applicantId} status updated to: ${result.status}`);
    return result;
  }
}

export const verifyApplicantService = new VerifyApplicantService();
