import { z } from 'zod';
// Import shared schema from backend
import { CreateJobSchema } from '../../../backend/src/schemas/job';

export interface Job {
  id: string;
  title: string;
  jobName: string;
  description: string;
  hourlySalaryRange: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  employerId: string;
  jobCategoryId: string;
  employer: {
    id: string;
    name: string;
    category: string;
    address?: string;
    websiteUrl?: string;
  };
  jobCategory: {
    id: string;
    category: string;
  };
  _count?: {
    likedJobs: number;
    discardedJobs: number;
  };
  // Legacy fields for compatibility with existing components
  company?: string;
  location?: string;
  rate?: string;
  image?: string;
}

// Re-export the shared schema
export { CreateJobSchema };

// TypeScript type derived from ZOD schema
export type CreateJobRequest = z.infer<typeof CreateJobSchema>;

// Job response type (what comes back from API)
export interface JobResponse {
  id: string;
  title: string;
  jobName: string;
  description: string;
  hourlySalaryRange: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  employerId: string;
  jobCategoryId: string;
  employer: {
    id: string;
    name: string;
    country: string;
    city: string;
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
