export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  jobPreferences: string[];
  memberSince: string;
}
