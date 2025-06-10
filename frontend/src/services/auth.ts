import { api } from '../lib/api';
import type { ApiUser } from '../types/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userType: 'applicant' | 'employer';
  // Applicant fields
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  introduction?: string;
  // Employer fields
  name?: string;
  address?: string;
  category?: string;
  websiteUrl?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    userType: 'applicant' | 'employer';
  };
}

// Login user
export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', loginData);

  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

// Register user
export const register = async (
  registerData: RegisterRequest
): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', registerData);

  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

// Get current user profile
export const getCurrentUser = async (): Promise<ApiUser> => {
  const { data } = await api.get('/auth/me');
  return data;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
