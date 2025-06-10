import type { User } from '../types/user';

export const currentUser: User = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  location: 'San Francisco, CA',
  jobPreferences: ['Service Industry', 'Hospitality', 'Food & Beverage'],
  memberSince: 'January 2024',
};
