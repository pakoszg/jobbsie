import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  type JobsFilters,
  type UpdateJobRequest,
} from '../services/jobs';

// Query keys for job-related queries
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: JobsFilters) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

// Hook to get jobs with filters
export const useJobs = (filters: JobsFilters = {}) => {
  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => getJobs(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get a single job by ID
export const useJob = (id: string) => {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => getJob(id),
    enabled: !!id, // Only run query if id exists
  });
};

// Hook to create a new job
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};

// Hook to update a job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobRequest }) =>
      updateJob(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch jobs list and specific job detail
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
    },
  });
};

// Hook to delete a job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: (_, id) => {
      // Remove the job from cache and invalidate lists
      queryClient.removeQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};
