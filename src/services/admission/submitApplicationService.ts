import { admissionRepository, IAdmissionRepository } from '@/repositories/admissionRepository';
import { Applicant, SubmitApplicationDTO } from '@/types/admission.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('SubmitApplicationService');

export class SubmitApplicationService {
  constructor(private readonly repo: IAdmissionRepository = admissionRepository) {}

  async execute(payload: SubmitApplicationDTO): Promise<Applicant> {
    log.info(`Executing PPDB application submission for: ${payload.name}`);

    if (!payload.name || payload.name.trim().length === 0) {
      throw new Error('Student full name is required.');
    }

    if (!payload.nisn || payload.nisn.trim().length !== 10) {
      throw new Error('Valid 10-digit NISN is required.');
    }

    if (!payload.parentName || payload.parentName.trim().length === 0) {
      throw new Error('Parent or guardian name is required.');
    }

    if (!payload.parentPhone || payload.parentPhone.trim().length === 0) {
      throw new Error('Contact phone number is required.');
    }

    const result = await this.repo.submitApplication(payload);
    log.info(`Application submitted successfully with ID: ${result.id}`);
    return result;
  }
}

export const submitApplicationService = new SubmitApplicationService();
