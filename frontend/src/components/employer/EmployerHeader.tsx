import React, { useState } from 'react';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import type { ApiUser } from '../../types';

interface EmployerHeaderProps {
  user: ApiUser;
  onProfileClick: () => void;
  onCreateJobClick: () => void;
  onJobsClick: () => void;
  onLogout: () => void;
}

export const EmployerHeader: React.FC<EmployerHeaderProps> = ({
  user,
  onProfileClick,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Get display name based on user type
  const getDisplayName = () => {
    if (user.userType === 'employer' && user.employer) {
      return user.employer.name;
    }
    if (user.userType === 'applicant' && user.applicant) {
      return `${user.applicant.first_name} ${user.applicant.last_name}`.trim();
    }
    return user.email; // Fallback to email
  };

  const displayName = getDisplayName();
  const firstName = displayName.split(' ')[0];

  const handleProfileClick = () => {
    setShowDropdown(false);
    onProfileClick();
  };

  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
  };

  return (
    <header className='bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50'>
      <div className='max-w-md mx-auto md:max-w-4xl lg:max-w-6xl xl:max-w-7xl px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Left side - Menu */}
          <div className='flex items-center space-x-4'>
            <button className='p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden'>
              <Bars3Icon className='h-6 w-6 text-gray-600' />
            </button>
          </div>

          {/* Center - Logo and Brand */}
          <div className='flex items-center space-x-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>J</span>
            </div>
            <h1 className='text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:text-xl'>
              Jobbsie
            </h1>
          </div>

          {/* Right side - Employer actions */}
          <div className='flex items-center space-x-2 md:space-x-3'>
            {/* Notifications */}
            <button className='p-2 rounded-lg hover:bg-gray-100 transition-colors relative'>
              <BellIcon className='h-5 w-5 text-gray-600' />
              <div className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></div>
            </button>

            {/* User Avatar and Name with Dropdown */}
            <div className='relative'>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className='flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <UserCircleIcon className='h-8 w-8 text-gray-400' />
                <span className='hidden md:block text-sm font-medium text-gray-700'>
                  {firstName}
                </span>
                <ChevronDownIcon className='h-4 w-4 text-gray-500' />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
                  <button
                    onClick={handleProfileClick}
                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2'
                  >
                    <UserCircleIcon className='h-4 w-4' />
                    <span>View Profile</span>
                  </button>
                  <hr className='my-1 border-gray-200' />
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2'
                  >
                    <ArrowRightOnRectangleIcon className='h-4 w-4' />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Backdrop to close dropdown */}
              {showDropdown && (
                <div
                  className='fixed inset-0 z-40'
                  onClick={() => setShowDropdown(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
