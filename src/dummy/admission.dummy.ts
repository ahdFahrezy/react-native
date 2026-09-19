import { Applicant, VerifyApplicantDTO, VerificationStatus, SubmitApplicationDTO } from '@/types/admission.types';
import { simulateDelay } from './helper';
import { logger } from '@/utils/logger';

const log = logger.createScope('AdmissionDummyApi');

let mockApplicants: Applicant[] = [
  {
    id: 'app_001',
    nisn: '0072938401',
    name: 'Muhammad Farhan Aditya',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Ca27eeKVtQJ3z4pOiEf4bRi3i4QkciumHZvcASZ-9Z33Ce_-K1WCEalWeIxYPNkqrDo_MK7JaIztO14VMhI6OXtGikzjKq0VkQ-f06cc6laBkSft960xUgMkp8V7AN-eifwn-WnUlBPlxg-U-pQ4YjiXbEcb5SwfK0QR6E5v5kB8aW2YyYUp9_YSF3bpV8lG02dNWajvRsS2VvRA9aIE_Jmd5rfHRQCD6A_XCnLvwjvlC9wQcIIe',
    admissionTrack: 'Academic Achievement',
    averageScore: 89.4,
    majorChoice: 'Science 1 (MIPA)',
    documentCount: 4,
    status: 'pending',
    statusLabel: 'Pending Verification',
    submittedAt: 'Today, 08:30 AM',
  },
  {
    id: 'app_002',
    nisn: '0081293812',
    name: 'Siti Aisyah Rahmadani',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzINZyvsVk2by0P6u2y-lHeFBT8G3sqlad8ajtIYtJn6i5jYVUtVh8jGlM7aY4spGgdA9OSOCkUagtUNRmlR6J7lSipzpT51N3A0df3IGziIi42HDvYqs1_gXtruYkjSpfSu9YJ3uZNyQFzGEvPVaQW1RPWp9pCMxA0xwRa_3lWpp4tVDTYhIBmqfneI0rTeOT3hAcwmTmpjXUgfzo8iKz87EhVFtBGRAm2LR_wQrqZh3g1ZDAUEh',
    admissionTrack: 'Regular Zoning (1.2 Km)',
    averageScore: 86.75,
    majorChoice: 'Social Studies 1',
    documentCount: 3,
    status: 'verified',
    statusLabel: 'Documents Complete',
    submittedAt: 'Today, 09:15 AM',
  },
  {
    id: 'app_003',
    nisn: '0074128954',
    name: 'Bagus Satria Pratama',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBryFv5b9ugQgWnGFkFBWjz4wsEGiFThBHTmY5vN2X_o7mcx7Fb4FYd5iH04gl98YnuAxfoTH8lE4fLN_vIF36b_RpFbnk-RczJtRv4bPsIGmMic1tJD4pzE21uQx6Uudzqw2iiNNfcel4q-xNIVUwRqIRZOcnBNtORcqk2ZBye9MBFfIII6er7hg8_hsKn4LerKIMcfF95Sujho_kv5dTYnFNyj8w9lbtptTSH7u-M8ru78Zv6m7GN',
    admissionTrack: 'Affirmation / Student Aid',
    averageScore: 82.1,
    majorChoice: 'Science 2 (MIPA)',
    documentCount: 2,
    status: 'revision_needed',
    statusLabel: 'Revision Needed',
    note: 'Certificate scan is blurry. Re-upload requested.',
    submittedAt: 'Yesterday, 04:20 PM',
  },
  {
    id: 'app_004',
    nisn: '0083920194',
    name: 'Anindya Putri Lestari',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    admissionTrack: 'Academic Achievement',
    averageScore: 91.2,
    majorChoice: 'Science 1 (MIPA)',
    documentCount: 4,
    status: 'verified',
    statusLabel: 'Approved',
    submittedAt: '2 days ago',
  },
];

export class AdmissionDummyApi {
  async getAll(): Promise<Applicant[]> {
    log.info('[DummyAPI] Fetching all admissions applicants');
    await simulateDelay(220);
    return [...mockApplicants];
  }

  async getById(id: string): Promise<Applicant> {
    log.info(`[DummyAPI] Fetching applicant by id: ${id}`);
    await simulateDelay(150);
    const item = mockApplicants.find((a) => a.id === id);
    if (!item) {
      throw new Error('Applicant not found');
    }
    return item;
  }

  async verify(payload: VerifyApplicantDTO): Promise<Applicant> {
    log.info('[DummyAPI] Verifying applicant', payload);
    await simulateDelay(280);
    const index = mockApplicants.findIndex((a) => a.id === payload.applicantId);
    if (index === -1) {
      throw new Error('Applicant not found');
    }

    const updated: Applicant = {
      ...mockApplicants[index],
      status: payload.status,
      statusLabel:
        payload.status === 'verified'
          ? 'Verified & Approved'
          : payload.status === 'revision_needed'
          ? 'Revision Needed'
          : 'Pending Verification',
      note: payload.note || mockApplicants[index].note,
    };

    mockApplicants[index] = updated;
    return updated;
  }

  async submitApplication(payload: SubmitApplicationDTO): Promise<Applicant> {
    log.info('[DummyAPI] Submitting new PPDB application', payload.name);
    await simulateDelay(350);

    const trackLabel =
      payload.admissionTrack === 'zonasi'
        ? `Zoning Track (${payload.distanceKm ?? 1.5} Km)`
        : payload.admissionTrack === 'prestasi'
        ? 'Academic Achievement'
        : 'Affirmation / Student Aid';

    const majorLabel =
      payload.majorChoice === 'mipa'
        ? 'Mathematics & Natural Sciences (MIPA)'
        : payload.majorChoice === 'ips'
        ? 'Social Studies (IPS)'
        : 'Languages & Culture';

    const newApplicant: Applicant = {
      id: `app_${Date.now().toString(36)}`,
      nisn: payload.nisn,
      name: payload.name,
      avatarUrl:
        payload.avatarUrl ||
        (payload.gender === 'F'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzINZyvsVk2by0P6u2y-lHeFBT8G3sqlad8ajtIYtJn6i5jYVUtVh8jGlM7aY4spGgdA9OSOCkUagtUNRmlR6J7lSipzpT51N3A0df3IGziIi42HDvYqs1_gXtruYkjSpfSu9YJ3uZNyQFzGEvPVaQW1RPWp9pCMxA0xwRa_3lWpp4tVDTYhIBmqfneI0rTeOT3hAcwmTmpjXUgfzo8iKz87EhVFtBGRAm2LR_wQrqZh3g1ZDAUEh'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Ca27eeKVtQJ3z4pOiEf4bRi3i4QkciumHZvcASZ-9Z33Ce_-K1WCEalWeIxYPNkqrDo_MK7JaIztO14VMhI6OXtGikzjKq0VkQ-f06cc6laBkSft960xUgMkp8V7AN-eifwn-WnUlBPlxg-U-pQ4YjiXbEcb5SwfK0QR6E5v5kB8aW2YyYUp9_YSF3bpV8lG02dNWajvRsS2VvRA9aIE_Jmd5rfHRQCD6A_XCnLvwjvlC9wQcIIe'),
      admissionTrack: trackLabel,
      averageScore: payload.averageScore || 88.5,
      majorChoice: majorLabel,
      documentCount: payload.documentCount || 3,
      status: 'pending',
      statusLabel: 'Pending Verification',
      submittedAt: 'Just now',
      gender: payload.gender,
      birthPlace: payload.birthPlace,
      birthDate: payload.birthDate,
      previousSchool: payload.previousSchool,
      parentName: payload.parentName,
      parentPhone: payload.parentPhone,
      address: payload.address,
      distanceKm: payload.distanceKm,
    };

    // Prepend to top of list so it is immediately visible in admin dashboard
    mockApplicants = [newApplicant, ...mockApplicants];
    log.info(`[DummyAPI] Application successfully registered with ID: ${newApplicant.id}`);
    return newApplicant;
  }
}

export const admissionDummyApi = new AdmissionDummyApi();
