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
