import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  login,
  register,
  getCurrentUser,
  logout,
  isAuthenticated,
} from '../services/auth';

// Query keys for auth-related queries
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUser,
    enabled: isAuthenticated(), // Only run if user is authenticated
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false, // Don't retry on auth errors
  });
};

// Hook to login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Cache user data after successful login
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: () => {
      // Clear any cached user data on login error
      queryClient.removeQueries({ queryKey: authKeys.user() });
    },
  });
};

// Hook to register
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Cache user data after successful registration
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: () => {
      // Clear any cached user data on registration error
      queryClient.removeQueries({ queryKey: authKeys.user() });
    },
  });
};

// Hook to logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
};
