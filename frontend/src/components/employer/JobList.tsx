import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { JobResponse } from '../../types/job';

export const JobList = ({
  jobs,
  activeTab,
  handleCreateJobClick,
}: {
  jobs: JobResponse[];
  activeTab: 'active' | 'draft' | 'expired';
  handleCreateJobClick: () => void;
}) => {
  return (
    <div className='flex-1 overflow-y-auto p-4'>
      {jobs.length === 0 ? (
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <PlusIcon className='h-8 w-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No {activeTab} jobs yet
          </h3>
          <p className='text-gray-500 mb-4'>
            {activeTab === 'active'
              ? 'Create your first job posting to start finding candidates.'
              : `You don't have any ${activeTab} jobs at the moment.`}
          </p>
          {activeTab === 'active' && (
            <button
              onClick={handleCreateJobClick}
              className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              Create Your First Job
            </button>
          )}
        </div>
      ) : (
        <div className='space-y-4'>
          {jobs.map((job) => (
            <div
              key={job.id}
              className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                    {job.title}
                  </h3>
                  <p className='text-gray-600 mb-2 line-clamp-2'>
                    {job.description}
                  </p>
                  <div className='flex items-center space-x-4 text-sm text-gray-500'>
                    <span>{job.hourlySalaryRange}</span>
                    <span>•</span>
                    <span>
                      Expires {new Date(job.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className='flex items-center space-x-2 ml-4'>
                  <button className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'>
                    <EyeIcon className='h-4 w-4' />
                  </button>
                  <button className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors'>
                    <PencilIcon className='h-4 w-4' />
                  </button>
                  <button className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
                    <TrashIcon className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
