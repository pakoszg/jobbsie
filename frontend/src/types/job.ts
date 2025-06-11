import { z } from 'zod';

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

// ZOD schema for creating a job posting
export const CreateJobSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required')
    .max(100, 'Job title must be less than 100 characters'),

  jobName: z
    .string()
    .min(1, 'Job name is required')
    .max(50, 'Job name must be less than 50 characters'),

  description: z
    .string()
    .min(50, 'Job description must be at least 50 characters')
    .max(2000, 'Job description must be less than 2000 characters'),

  hourlySalaryRange: z.string().min(1, 'Hourly salary range is required'),

  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .refine((date: string) => {
      const expiryDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expiryDate > today;
    }, 'Expiry date must be in the future'),

  jobCategoryId: z.string().min(1, 'Job category is required'),
});

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
  totalPages: number;
  currentPage: number;
  total: number;
}
