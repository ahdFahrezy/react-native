import { admissionRepository, IAdmissionRepository } from '@/repositories/admissionRepository';
import { Applicant } from '@/types/admission.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('FetchApplicantListService');

export class FetchApplicantListService {
  constructor(private readonly repo: IAdmissionRepository = admissionRepository) {}

  async execute(): Promise<Applicant[]> {
    log.info('Fetching applicant admissions list...');
    const list = await this.repo.getAll();
    log.info(`Successfully fetched ${list.length} applicants`);
    return list;
  }
}

export const fetchApplicantListService = new FetchApplicantListService();
