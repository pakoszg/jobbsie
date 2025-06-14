import { useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useUpdateJob, useRemoveJob } from '../../hooks/useJobs';
import type { JobResponse } from '../../types/job';
import { CreateJobForm } from './CreateJobForm';

interface JobListProps {
  jobs: JobResponse[];
  activeTab: 'active' | 'draft' | 'expired';
  handleCreateJobClick: () => void;
}

export function JobList({
  jobs,
  activeTab,
  handleCreateJobClick,
}: JobListProps) {
  const [editingJob, setEditingJob] = useState<JobResponse | null>(null);
  const updateJobMutation = useUpdateJob();
  const removeJobMutation = useRemoveJob();

  const handleUpdateJob = (jobData: any) => {
    if (!editingJob) return;

    updateJobMutation.mutate(
      { id: editingJob.id, data: jobData },
      {
        onSuccess: () => {
          setEditingJob(null);
        },
      }
    );
  };

  const handleRemoveJob = (id: string) => {
    if (window.confirm('Are you sure you want to remove this job?')) {
      removeJobMutation.mutate(id);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const expiryDate = new Date(job.expiryDate);
    const now = new Date();

    switch (activeTab) {
      case 'active':
        return expiryDate > now;
      case 'expired':
        return expiryDate <= now;
      case 'draft':
        return false; // Implement draft logic when needed
      default:
        return true;
    }
  });

  return (
    <div className='flex-1 overflow-y-auto p-4'>
      {filteredJobs.length === 0 ? (
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
          {filteredJobs.map((job) => (
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
                    <span>
                      {job.hourlySalaryRange.min} - {job.hourlySalaryRange.max}{' '}
                      /hr
                    </span>
                    <span>•</span>
                    <span>
                      Expires {new Date(job.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className='flex items-center space-x-2 ml-4'>
                  <button
                    onClick={() => setEditingJob(job)}
                    className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                  >
                    <PencilIcon className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleRemoveJob(job.id)}
                    className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                  >
                    <TrashIcon className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <CreateJobForm
          isOpen={true}
          onClose={() => setEditingJob(null)}
          onSubmit={handleUpdateJob}
          isLoading={updateJobMutation.isPending}
          initialData={editingJob}
        />
      )}
    </div>
  );
}
