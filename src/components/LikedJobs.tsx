import React from 'react';
import {
  XMarkIcon,
  HeartIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import type { Job } from '../types/job';

interface LikedJobsProps {
  likedJobs: Job[];
  isOpen: boolean;
  onClose: () => void;
}

export const LikedJobs: React.FC<LikedJobsProps> = ({
  likedJobs,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='relative bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white flex-shrink-0'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>

          <div className='text-center'>
            <div className='flex items-center justify-center space-x-3 mb-2'>
              <HeartIcon className='h-8 w-8 text-white' />
              <h2 className='text-2xl md:text-3xl font-bold'>Liked Jobs</h2>
            </div>
            <p className='text-white/80'>
              {likedJobs.length === 0
                ? "You haven't liked any jobs yet"
                : `${likedJobs.length} job${
                    likedJobs.length === 1 ? '' : 's'
                  } saved`}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {likedJobs.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>💝</div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                No liked jobs yet
              </h3>
              <p className='text-gray-600'>
                Start swiping and like some jobs to see them here!
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {likedJobs.map((job) => (
                <div
                  key={job.id}
                  className='bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200'
                >
                  <div className='flex space-x-4'>
                    {/* Job Image */}
                    <div className='flex-shrink-0'>
                      <img
                        src={job.image}
                        alt={job.title}
                        className='w-16 h-16 rounded-lg object-cover'
                      />
                    </div>

                    {/* Job Details */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-semibold text-gray-800 line-clamp-1 mb-1'>
                        {job.title}
                      </h3>
                      <p className='text-sm font-medium text-indigo-600 mb-2'>
                        {job.company}
                      </p>

                      <div className='flex flex-wrap gap-2 mb-3'>
                        <div className='flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full'>
                          <MapPinIcon className='h-3 w-3 mr-1 flex-shrink-0' />
                          <span>{job.location}</span>
                        </div>
                        <div className='flex items-center text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full'>
                          <CurrencyDollarIcon className='h-3 w-3 mr-1 flex-shrink-0' />
                          <span>{job.rate}</span>
                        </div>
                      </div>

                      <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className='mt-4 pt-3 border-t border-gray-100'>
                    <button className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm'>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {likedJobs.length > 0 && (
          <div className='border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0'>
            <div className='text-center'>
              <p className='text-sm text-gray-600 mb-3'>
                Ready to apply? Export your liked jobs or contact employers
                directly.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <button className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors'>
                  Export List
                </button>
                <button className='px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200'>
                  Apply to Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
