import React from 'react';
import {
  XMarkIcon,
  MapPinIcon,
  EnvelopeIcon,
  CalendarIcon,
  BriefcaseIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import type { User } from '../types/user';

interface UserProfileProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  likedCount: number;
  dislikedCount: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isOpen,
  onClose,
  onEditProfile,
  likedCount,
  dislikedCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8 text-white rounded-t-2xl'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>

          <div className='flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6'>
            <div className='relative'>
              <img
                src={user.avatar}
                alt={user.name}
                className='w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white/30'
              />
              <button className='absolute -bottom-1 -right-1 p-1 bg-white rounded-full text-gray-600 hover:bg-gray-100 transition-colors'>
                <PencilIcon className='h-4 w-4' />
              </button>
            </div>
            <div className='text-center md:text-left'>
              <h2 className='text-2xl md:text-3xl font-bold'>{user.name}</h2>
              <p className='text-white/80 text-sm md:text-base'>Job Seeker</p>
              <p className='text-white/70 text-sm mt-1'>{user.location}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8 space-y-6 md:space-y-8'>
          <div className='grid md:grid-cols-2 gap-6 md:gap-8'>
            {/* Contact Info */}
            <div className='space-y-4'>
              <h3 className='text-lg md:text-xl font-semibold text-gray-800'>
                Contact Information
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3 text-gray-600'>
                  <EnvelopeIcon className='h-5 w-5 flex-shrink-0' />
                  <span className='break-all'>{user.email}</span>
                </div>
                <div className='flex items-center space-x-3 text-gray-600'>
                  <MapPinIcon className='h-5 w-5 flex-shrink-0' />
                  <span>{user.location}</span>
                </div>
                <div className='flex items-center space-x-3 text-gray-600'>
                  <CalendarIcon className='h-5 w-5 flex-shrink-0' />
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Job Preferences */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <BriefcaseIcon className='h-5 w-5 text-gray-600' />
                <h3 className='text-lg md:text-xl font-semibold text-gray-800'>
                  Job Preferences
                </h3>
              </div>
              <div className='flex flex-wrap gap-2'>
                {user.jobPreferences.map((preference, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium'
                  >
                    {preference}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className='space-y-4'>
            <h3 className='text-lg md:text-xl font-semibold text-gray-800'>
              Activity
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='bg-green-50 p-4 md:p-6 rounded-xl text-center'>
                <div className='text-2xl md:text-3xl font-bold text-green-600'>
                  {likedCount}
                </div>
                <div className='text-sm md:text-base text-green-700'>
                  Jobs Liked
                </div>
              </div>
              <div className='bg-red-50 p-4 md:p-6 rounded-xl text-center'>
                <div className='text-2xl md:text-3xl font-bold text-red-600'>
                  {dislikedCount}
                </div>
                <div className='text-sm md:text-base text-red-700'>
                  Jobs Passed
                </div>
              </div>
              <div className='bg-blue-50 p-4 md:p-6 rounded-xl text-center'>
                <div className='text-2xl md:text-3xl font-bold text-blue-600'>
                  {Math.floor(
                    (likedCount / (likedCount + dislikedCount || 1)) * 100
                  )}
                  %
                </div>
                <div className='text-sm md:text-base text-blue-700'>
                  Match Rate
                </div>
              </div>
              <div className='bg-purple-50 p-4 md:p-6 rounded-xl text-center'>
                <div className='text-2xl md:text-3xl font-bold text-purple-600'>
                  {likedCount + dislikedCount}
                </div>
                <div className='text-sm md:text-base text-purple-700'>
                  Total Views
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='grid md:grid-cols-2 gap-3 pt-4'>
            <button
              onClick={onEditProfile}
              className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 md:py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200'
            >
              Edit Profile
            </button>
            <button className='w-full border border-gray-300 text-gray-700 py-3 md:py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors'>
              View Liked Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
