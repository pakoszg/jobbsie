import React from 'react';
import {
  XMarkIcon,
  MapPinIcon,
  EnvelopeIcon,
  CalendarIcon,
  PencilIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import type { ApiUser } from '../types';

interface UserProfileProps {
  user: ApiUser;
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Get display information based on user type
  const getDisplayInfo = () => {
    if (user.userType === 'applicant' && user.applicant) {
      const fullName =
        `${user.applicant.first_name} ${user.applicant.last_name}`.trim();
      return {
        name: fullName,
        title: 'Job Seeker',
        location: 'Unknown', // Could add location field to applicant schema
        phone: user.applicant.phone_number,
        introduction: user.applicant.introduction,
        initials: fullName
          ? fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
          : user.email.charAt(0).toUpperCase(),
      };
    }

    if (user.userType === 'employer' && user.employer) {
      return {
        name: user.employer.name,
        title: 'Employer',
        location: `${user.employer.city}, ${user.employer.country}`,
        phone: null,
        introduction: null,
        initials: user.employer.name.charAt(0).toUpperCase(),
      };
    }

    // Fallback
    return {
      name: user.email,
      title: 'User',
      location: 'Unknown',
      phone: null,
      introduction: null,
      initials: user.email.charAt(0).toUpperCase(),
    };
  };

  const displayInfo = getDisplayInfo();

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
              <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center'>
                <span className='text-2xl md:text-3xl font-bold'>
                  {displayInfo.initials}
                </span>
              </div>
              <button className='absolute -bottom-1 -right-1 p-1 bg-white rounded-full text-gray-600 hover:bg-gray-100 transition-colors'>
                <PencilIcon className='h-4 w-4' />
              </button>
            </div>
            <div className='text-center md:text-left'>
              <h2 className='text-2xl md:text-3xl font-bold'>
                {displayInfo.name}
              </h2>
              <p className='text-white/80 text-sm md:text-base'>
                {displayInfo.title}
              </p>
              <p className='text-white/70 text-sm mt-1'>
                {displayInfo.location}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8 space-y-6 md:space-y-8'>
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
              {displayInfo.phone && (
                <div className='flex items-center space-x-3 text-gray-600'>
                  <PhoneIcon className='h-5 w-5 flex-shrink-0' />
                  <span>{displayInfo.phone}</span>
                </div>
              )}
              <div className='flex items-center space-x-3 text-gray-600'>
                <MapPinIcon className='h-5 w-5 flex-shrink-0' />
                <span>{displayInfo.location}</span>
              </div>
              <div className='flex items-center space-x-3 text-gray-600'>
                <CalendarIcon className='h-5 w-5 flex-shrink-0' />
                <span>
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Introduction section for applicants */}
          {displayInfo.introduction && (
            <div className='space-y-4'>
              <h3 className='text-lg md:text-xl font-semibold text-gray-800'>
                Introduction
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {displayInfo.introduction}
              </p>
            </div>
          )}

          {/* Employer specific info */}
          {user.userType === 'employer' && user.employer && (
            <div className='space-y-4'>
              <h3 className='text-lg md:text-xl font-semibold text-gray-800'>
                Company Information
              </h3>
              <div className='space-y-3'>
                <div className='flex items-start space-x-3 text-gray-600'>
                  <span className='font-medium'>Category:</span>
                  <span>{user.employer.category}</span>
                </div>
                <div className='flex items-start space-x-3 text-gray-600'>
                  <span className='font-medium'>Address:</span>
                  <span>
                    {user.employer.address}, {user.employer.postal_code}
                  </span>
                </div>
                {user.employer.website_url && (
                  <div className='flex items-start space-x-3 text-gray-600'>
                    <span className='font-medium'>Website:</span>
                    <a
                      href={user.employer.website_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-700 underline'
                    >
                      {user.employer.website_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className='pt-4'>
            <button className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 md:py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200'>
              Edit Personal Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
