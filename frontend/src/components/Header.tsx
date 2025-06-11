import React from 'react';
import {
  Bars3Icon,
  BellIcon,
  HeartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  likedCount: number;
  onProfileClick: () => void;
  onLikedJobsClick: () => void;
  onJobPreferencesClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  likedCount,
  onProfileClick,
  onLikedJobsClick,
  onJobPreferencesClick,
}) => {
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

          {/* Right side - User actions */}
          <div className='flex items-center space-x-2 md:space-x-3'>
            {/* Job Preferences */}
            <button
              onClick={onJobPreferencesClick}
              className='px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 hover:text-gray-900'
              title='Job Preferences'
            >
              Job Preferences
            </button>

            {/* Liked jobs indicator */}
            <button
              onClick={onLikedJobsClick}
              className='relative hover:bg-gray-100 rounded-lg transition-colors p-1'
              title='Liked Jobs'
            >
              <div className='flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full md:px-3 md:py-2'>
                <HeartIcon className='h-4 w-4 text-green-500' />
                <span className='text-sm font-semibold text-green-600 md:text-base'>
                  {likedCount}
                </span>
                <span className='hidden md:inline text-sm text-green-600'>
                  Liked
                </span>
              </div>
            </button>

            {/* Notifications */}
            <button className='p-2 rounded-lg hover:bg-gray-100 transition-colors relative'>
              <BellIcon className='h-5 w-5 text-gray-600' />
              <div className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></div>
            </button>

            {/* User Avatar and Name */}
            <button
              onClick={onProfileClick}
              className='flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <UserCircleIcon className='h-8 w-8 text-gray-400' />
              <span className='hidden md:block text-sm font-medium text-gray-700'>
                {user.email}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
