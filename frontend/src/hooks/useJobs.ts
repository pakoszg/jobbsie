import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createJob, getApplicantJob } from '../services/jobs';
import { api } from '../lib/api';
import type { CreateJobRequest, JobResponse } from '../types/job';

// Hook to get jobs with filters
export const useGetJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => getJobs(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetApplicantJob = (id: string) => {
  return useQuery({
    queryKey: ['applicant-jobs', id],
    queryFn: () => getApplicantJob(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to create a new job
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateJobRequest;
    }) => {
      const response = await api.put<{ message: string; job: JobResponse }>(
        `/jobs/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useRemoveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    mutationFn: async (id: string) => {
      const response = await api.post<{ message: string }>(
        `/jobs/remove/${id}`
      );
      return response.data;
    },
  });
};
