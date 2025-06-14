import { api } from '../lib/api';
import type {
  CreateJobRequest,
  JobResponse,
  JobsListResponse,
} from '../types/job';

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

export interface UpdateJobRequest extends Partial<CreateJobRequest> {}

// Get all jobs with optional filtering
export const getJobs = async (): Promise<JobsListResponse> => {
  const { data } = await api.get(`/jobs/employer`);
  return data;
};

// Get one job at a time for applicant
export const getApplicantJob = async (id: string): Promise<JobResponse> => {
  const { data } = await api.get(`/jobs/applicant/${id}`);
  return data;
};

// Get a single job by ID
export const getJob = async (id: string): Promise<JobResponse> => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

// Create a new job posting (requires authentication)
export const createJob = async (
  jobData: CreateJobRequest
): Promise<{ message: string; job: JobResponse }> => {
  const { data } = await api.post('/jobs', jobData);
  return data;
};

// Update a job posting (requires authentication)
export const updateJob = async (
  id: string,
  jobData: UpdateJobRequest
): Promise<JobResponse> => {
  const { data } = await api.put(`/jobs/${id}`, jobData);
  return data.job;
};

// Delete a job posting (requires authentication)
export const deleteJob = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};
