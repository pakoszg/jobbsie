import { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { JobCard } from './JobCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
import type { JobsFilters } from '../../services/jobs';

export const JobsPage = () => {
  const [filters, setFilters] = useState<JobsFilters>({
    page: 1,
    limit: 10,
    expired: false,
  });

  const { data, isLoading, error, refetch, isFetching } = useJobs(filters);

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSalaryFilter = (min?: number, max?: number) => {
    setFilters((prev) => ({
      ...prev,
      hourlySalaryMin: min,
      hourlySalaryMax: max,
      page: 1,
    }));
  };

  if (isLoading && !data) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message='Failed to load jobs. Please try again.'
        onRetry={() => refetch()}
      />
    );
  }

  const jobs = data?.jobs || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Search and Filter Controls */}
      <div className='mb-8 bg-white rounded-lg shadow-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>
          Find Your Perfect Job
        </h1>

        {/* Search Bar */}
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search jobs...'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Category
            </label>
            <select
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value=''>All Categories</option>
              <option value='technology'>Technology</option>
              <option value='healthcare'>Healthcare</option>
              <option value='finance'>Finance</option>
              <option value='education'>Education</option>
              <option value='retail'>Retail</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Min Hourly Rate
            </label>
            <input
              type='number'
              placeholder='$0'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              onChange={(e) =>
                handleSalaryFilter(
                  Number(e.target.value) || undefined,
                  filters.hourlySalaryMax
                )
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Max Hourly Rate
            </label>
            <input
              type='number'
              placeholder='$999'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              onChange={(e) =>
                handleSalaryFilter(
                  filters.hourlySalaryMin,
                  Number(e.target.value) || undefined
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Loading overlay for refetching */}
      {isFetching && data && (
        <div className='text-center mb-4'>
          <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700'>
            <LoadingSpinner size='small' className='mr-2' />
            Updating results...
          </div>
        </div>
      )}

      {/* Results */}
      <div className='mb-6'>
        <p className='text-gray-600'>
          Found {data?.total || 0} jobs{' '}
          {filters.search && `for "${filters.search}"`}
        </p>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-4xl mb-4'>🔍</div>
          <h3 className='text-xl font-semibold text-gray-800 mb-2'>
            No jobs found
          </h3>
          <p className='text-gray-600'>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {jobs.map((job) => (
            <div key={job.id} className='h-96'>
              <JobCard
                job={job}
                onLike={() => console.log('Liked job:', job.id)}
                onDislike={() => console.log('Disliked job:', job.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center space-x-2'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
          >
            Previous
          </button>

          <div className='flex space-x-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && <span className='px-2'>...</span>}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
