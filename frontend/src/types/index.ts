// Import Prisma types first
import type {
  User,
  Applicant,
  Employer,
  JobPosting,
  JobCategory,
} from '../../../node_modules/@prisma/client';

// Re-export all Prisma types
export type {
  User,
  Applicant,
  Employer,
  JobPosting,
  JobCategory,
  Doc,
  ApplicantLikedJob,
  ApplicantDiscardedJob,
  EmployerLikedApplicant,
  EmployerDiscardedApplicant,
} from '../../../node_modules/@prisma/client';

// Utility types for API responses
export type ApiUser = User & {
  userType: 'applicant' | 'employer';
  applicant: Applicant | null;
  employer: Employer | null;
};

// Job with relations for frontend components
export type JobWithRelations = JobPosting & {
  employer: Employer;
  job_category: JobCategory;
  _count?: {
    liked_jobs: number;
    discarded_jobs: number;
  };
};

// Legacy compatibility types for existing components that might still use old interface names
export type Job = JobWithRelations;

// UI User type for components that need legacy User interface structure
export interface UIUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  jobPreferences: string[];
  memberSince: string;
}

// Re-export original User type as PrismaUser for clarity
export type PrismaUser = User;
