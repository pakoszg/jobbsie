import React from 'react';
import type { Job } from '../types/job';
import {
  HeartIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/solid';

interface JobCardProps {
  job: Job;
  onLike: () => void;
  onDislike: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onLike, onDislike }) => {
  // Transform API job data to match component expectations
  const company = job.employer?.name || job.company || 'Unknown Company';
  const location = job.employer?.address || job.location || 'Remote';
  const rate = job.hourlySalaryRange || job.rate || 'Competitive';
  const imageUrl =
    job.image ||
    `https://via.placeholder.com/400x300?text=${encodeURIComponent(company)}`;

  return (
    <div className='relative p-4 bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 shadow-2xl w-full max-w-5xl h-full max-h-full mx-auto overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 -translate-y-6 translate-x-6'></div>
      <div className='absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full opacity-30 translate-y-4 -translate-x-4'></div>

      <div className='relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 border border-gray-100 h-full flex flex-col'>
        <div className='flex flex-col lg:flex-row h-full min-h-0'>
          {/* Content Section */}
          <div className='flex-1 p-5 lg:p-6 flex flex-col justify-between min-w-0 min-h-0 order-2 lg:order-1'>
            <div className='space-y-4 flex-1 min-h-0 overflow-hidden'>
              <div className='flex-shrink-0'>
                <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 leading-tight line-clamp-2'>
                  {job.title}
                </h2>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-semibold text-indigo-600 mb-3 line-clamp-1'>
                  {company}
                </h3>
              </div>

              <div className='flex flex-wrap items-center gap-3 flex-shrink-0'>
                <div className='flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-full'>
                  <MapPinIcon className='h-4 w-4 mr-2 flex-shrink-0' />
                  <span className='text-sm font-medium whitespace-nowrap'>
                    {location}
                  </span>
                </div>
                <div className='flex items-center text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-full'>
                  <CurrencyDollarIcon className='h-4 w-4 mr-2 flex-shrink-0' />
                  <span className='text-sm font-medium whitespace-nowrap'>
                    {rate}
                  </span>
                </div>
              </div>

              <div className='flex-1 min-h-0 overflow-hidden'>
                <p className='text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-4 lg:line-clamp-5'>
                  {job.description}
                </p>
              </div>
            </div>

            {/* Action Buttons - Consistently positioned */}
            <div className='flex justify-center lg:justify-start space-x-4 pt-4 mt-4 flex-shrink-0 border-t lg:border-t-0 border-gray-100'>
              <button
                onClick={onDislike}
                className='group p-3 lg:p-5 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-200 transform hover:scale-110 border-2 border-red-200 hover:border-red-300'
                aria-label='Dislike job'
              >
                <XMarkIcon className='h-7 w-7 lg:h-10 lg:w-10 text-red-500 group-hover:text-red-600' />
              </button>
              <button
                onClick={onLike}
                className='group p-3 lg:p-5 rounded-full bg-green-50 hover:bg-green-100 transition-colors duration-200 transform hover:scale-110 border-2 border-green-200 hover:border-green-300'
                aria-label='Like job'
              >
                <HeartIcon className='h-7 w-7 lg:h-10 lg:w-10 text-green-500 group-hover:text-green-600' />
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className='relative w-full lg:w-80 h-48 sm:h-52 lg:h-full flex-shrink-0 order-1 lg:order-2'>
            <img
              src={imageUrl}
              alt={job.title}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />

            {/* Floating badge */}
            <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full'>
              <span className='text-xs font-semibold text-gray-700'>
                #{job.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
