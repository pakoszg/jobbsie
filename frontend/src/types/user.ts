// Legacy User interface for components
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  jobPreferences: string[];
  memberSince: string;
}

// API User interface matching backend response
export interface ApiUser {
  id: string;
  email: string;
  userType: 'applicant' | 'employer';
  profile?: ApplicantProfile | EmployerProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicantProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  introduction?: string;
  avatar?: string;
  location?: string;
  jobPreferences?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  name: string;
  address: string;
  category: string;
  websiteUrl?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
