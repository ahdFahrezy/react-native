export type VerificationStatus = 'pending' | 'verified' | 'revision_needed';
export type AdmissionTrack = 'zonasi' | 'prestasi' | 'afirmasi';
export type MajorChoice = 'mipa' | 'ips' | 'bahasa';

export interface Applicant {
  id: string;
  nisn: string;
  name: string;
  avatarUrl: string;
  admissionTrack: string;
  averageScore: number;
  majorChoice: string;
  documentCount: number;
  status: VerificationStatus;
  statusLabel: string;
  note?: string;
  submittedAt: string;
  gender?: 'M' | 'F';
  birthPlace?: string;
  birthDate?: string;
  previousSchool?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  distanceKm?: number;
}

export interface VerifyApplicantDTO {
  applicantId: string;
  status: VerificationStatus;
  note?: string;
}

export interface SubmitApplicationDTO {
  name: string;
  nisn: string;
  gender: 'M' | 'F';
  birthPlace: string;
  birthDate: string;
  previousSchool: string;
  admissionTrack: AdmissionTrack;
  majorChoice: MajorChoice;
  parentName: string;
  parentPhone: string;
  address: string;
  distanceKm?: number;
  avatarUrl?: string;
  documentCount?: number;
  averageScore?: number;
}

