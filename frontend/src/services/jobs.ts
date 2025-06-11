import { api } from '../lib/api';
import type { Job } from '../types';

export interface JobsResponse {
  jobs: Job[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface JobsFilters {
  page?: number;
  limit?: number;
  category?: string;
  hourlySalaryMin?: number;
  hourlySalaryMax?: number;
  employer?: string;
  search?: string;
  expired?: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  jobName: string;
  hourlySalaryRange: string;
  expiryDate: string;
  jobCategoryId: string;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {}

// Get all jobs with optional filtering
export const getJobs = async (
  filters: JobsFilters = {}
): Promise<JobsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const { data } = await api.get(`/jobs?${params.toString()}`);
  return data;
};

// Get a single job by ID
export const getJob = async (id: string): Promise<Job> => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

// Create a new job posting (requires authentication)
export const createJob = async (
  jobData: CreateJobRequest
): Promise<{ message: string; job: Job }> => {
  const { data } = await api.post('/jobs', jobData);
  return data;
};

// Update a job posting (requires authentication)
export const updateJob = async (
  id: string,
  jobData: UpdateJobRequest
): Promise<Job> => {
  const { data } = await api.put(`/jobs/${id}`, jobData);
  return data.job;
};

// Delete a job posting (requires authentication)
export const deleteJob = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};
