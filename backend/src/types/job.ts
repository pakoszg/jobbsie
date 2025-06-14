// Re-export Prisma types for shared use
export type { JobPosting, JobCategory, Employer } from '@prisma/client';

// Job response type with included relations (what comes back from API)
export interface JobResponse {
  id: string;
  title: string;
  jobName: string;
  description: string;
  hourlySalaryRange: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  employer: {
    id: string;
    name: string;
    country: string;
    city: string;
    website_url?: string | null;
  };
  jobCategory: {
    id: string;
    name: string;
    category: string;
  };
}

// Jobs list response
export interface JobsListResponse {
  jobs: JobResponse[];
}
