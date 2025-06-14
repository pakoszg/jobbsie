import { useState } from 'react';
import { EmployerHeader } from './EmployerHeader';
import { UserProfile } from '../UserProfile';
import { CreateJobForm } from './CreateJobForm';

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useCreateJob, useGetJobs } from '../../hooks/useJobs';
import type { ApiUser } from '../../types';
import type { CreateJobRequest } from '../../types/job';
import { JobList } from './JobList';

interface EmployerDashboardProps {
  currentUser: ApiUser;
  onLogout: () => void;
}

export function EmployerDashboard({
  currentUser,
  onLogout,
}: EmployerDashboardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'expired'>(
    'active'
  );

  const { data: jobs, isLoading, error, refetch } = useGetJobs();
  const createJobMutation = useCreateJob();

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleCreateJobClick = () => {
    setShowCreateJob(true);
  };

  const handleJobsClick = () => {
    // Could scroll to jobs section or show jobs modal
    console.log('Show jobs');
  };

  const handleCreateJob = (jobData: CreateJobRequest) => {
    createJobMutation.mutate(jobData, {
      onSuccess: () => {
        setShowCreateJob(false);
        // Optionally show a success toast/notification here
      },
      onError: (error) => {
        console.error('Failed to create job:', error);
        // Optionally show an error toast/notification here
      },
    });
  };

  return (
    <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-hidden'>
      {/* Header - Fixed height */}
      <div className='flex-shrink-0'>
        <EmployerHeader
          user={currentUser}
          onProfileClick={handleProfileClick}
          onCreateJobClick={handleCreateJobClick}
          onJobsClick={handleJobsClick}
          onLogout={onLogout}
        />
      </div>

      {/* Main Content Area - Takes remaining space */}
      <div className='flex-1 flex flex-col min-h-0 px-4 py-3 sm:py-4 md:py-5 lg:py-6'>
        {/* Welcome Message - Fixed height */}
        <div className='flex-shrink-0 text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6'>
          <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-1'>
            Welcome back, {currentUser?.employer?.name}! 👋
          </h2>
          <p className='text-gray-600 text-sm sm:text-base md:text-lg'>
            Manage your job postings and find great candidates
          </p>
        </div>

        {/* Stats Cards */}
        <div className='flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Active Jobs</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {
                    jobs?.jobs?.filter((j) => {
                      const expiryDate = new Date(j.expiryDate);
                      return expiryDate > new Date();
                    }).length
                  }
                </p>
              </div>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Applications
                </p>
                <p className='text-2xl font-bold text-gray-900'>0</p>
              </div>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <EyeIcon className='w-5 h-5 text-blue-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Views</p>
                <p className='text-2xl font-bold text-gray-900'>0</p>
              </div>
              <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                <EyeIcon className='w-5 h-5 text-purple-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Job Management Section */}
        <div className='flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-0'>
          {/* Tabs */}
          <div className='flex-shrink-0 border-b border-gray-200'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex space-x-1'>
                {[
                  { key: 'active', label: 'Active Jobs' },
                  { key: 'draft', label: 'Drafts' },
                  { key: 'expired', label: 'Expired' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as typeof activeTab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreateJobClick}
                className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium'
              >
                <PlusIcon className='h-4 w-4' />
                <span>Create Job</span>
              </button>
            </div>
          </div>

          {/* Job List */}
          <JobList
            jobs={jobs?.jobs || []}
            activeTab={activeTab}
            handleCreateJobClick={handleCreateJobClick}
          />
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        user={currentUser}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Create Job Modal */}
      <CreateJobForm
        isOpen={showCreateJob}
        onClose={() => setShowCreateJob(false)}
        onSubmit={handleCreateJob}
        isLoading={createJobMutation.isPending}
      />
    </div>
  );
}
