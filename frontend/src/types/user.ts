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
  created_at: string;
  updated_at: string;
  applicant_id: string | null;
  employer_id: string | null;
  userType: 'applicant' | 'employer';
  applicant: Applicant | null;
  employer: Employer | null;
}

export interface Applicant {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  introduction?: string;
}

export interface Employer {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  website_url?: string;
  category: string;
}
