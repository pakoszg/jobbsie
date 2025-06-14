import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createJob } from '../services/jobs';

// Hook to get jobs with filters
export const useGetJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => getJobs(),
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
