import { api } from '../lib/api';

export interface JobCategory {
  id: string;
  category: string;
  name: string;
  created_at: string;
  updated_at: string;
  _count?: {
    job_postings: number;
  };
}

// Get all job categories
export const getCategories = async (): Promise<JobCategory[]> => {
  const { data } = await api.get('/categories');
  return data;
};

// Get a single category by ID
export const getCategory = async (id: string): Promise<JobCategory> => {
  const { data } = await api.get(`/categories/${id}`);
  return data;
};
