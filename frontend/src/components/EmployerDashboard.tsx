import { useState } from 'react';
import { EmployerHeader } from './EmployerHeader';
import { UserProfile } from './UserProfile';
import { CreateJobForm } from './CreateJobForm';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useCreateJob } from '../hooks/useJobs';
import type { ApiUser } from '../types/user';
import type { CreateJobRequest } from '../services/jobs';

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

  const createJobMutation = useCreateJob();

  // Mock job data (in real implementation, fetch from API)
  const mockJobs: Array<{
    id: string;
    title: string;
    jobName: string;
    description: string;
    hourlySalaryRange: string;
    expiryDate: string;
    status: 'active' | 'draft' | 'expired';
    applicants: number;
    views: number;
    createdAt: string;
  }> = [
    {
      id: '1',
      title: 'Senior React Developer',
      jobName: 'React Developer',
      description:
        'Looking for an experienced React developer to join our team...',
      hourlySalaryRange: '$60-90/hour',
      expiryDate: '2024-12-31',
      status: 'active',
      applicants: 15,
      views: 234,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'UI/UX Designer',
      jobName: 'UI Designer',
      description: 'We are seeking a creative UI/UX designer...',
      hourlySalaryRange: '$45-65/hour',
      expiryDate: '2024-11-30',
      status: 'active',
      applicants: 8,
      views: 156,
      createdAt: '2024-01-10',
    },
  ];

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
    // In real implementation, this would call the API
    console.log('Creating job:', jobData);
    // createJobMutation.mutate(jobData);
    setShowCreateJob(false);
  };

  // Create a user object compatible with the existing components
  const user = {
    id: parseInt(currentUser.id),
    name: currentUser.employer?.name || currentUser.email,
    email: currentUser.email,
    avatar: undefined, // No avatar field in current schema
    location: currentUser.employer?.address || 'Unknown',
    jobPreferences: [], // Not applicable for employers
    memberSince: new Date(
      currentUser.created_at || Date.now()
    ).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  };

  const filteredJobs = mockJobs.filter((job) => {
    if (activeTab === 'active') return job.status === 'active';
    if (activeTab === 'draft') return job.status === 'draft';
    if (activeTab === 'expired') return job.status === 'expired';
    return true;
  });

  return (
    <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-hidden'>
      {/* Header - Fixed height */}
      <div className='flex-shrink-0'>
        <EmployerHeader
          user={user}
          onProfileClick={handleProfileClick}
          onCreateJobClick={handleCreateJobClick}
          onJobsClick={handleJobsClick}
        />
      </div>

      {/* Main Content Area - Takes remaining space */}
      <div className='flex-1 flex flex-col min-h-0 px-4 py-3 sm:py-4 md:py-5 lg:py-6'>
        {/* Welcome Message - Fixed height */}
        <div className='flex-shrink-0 text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6'>
          <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-1'>
            Welcome back, {user.name.split(' ')[0]}! 👋
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
                  {mockJobs.filter((j) => j.status === 'active').length}
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
                <p className='text-2xl font-bold text-gray-900'>
                  {mockJobs.reduce((sum, job) => sum + job.applicants, 0)}
                </p>
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
                <p className='text-2xl font-bold text-gray-900'>
                  {mockJobs.reduce((sum, job) => sum + job.views, 0)}
                </p>
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
                          <span>{job.hourlySalaryRange}</span>
                          <span>•</span>
                          <span>{job.applicants} applications</span>
                          <span>•</span>
                          <span>{job.views} views</span>
                          <span>•</span>
                          <span>
                            Expires{' '}
                            {new Date(job.expiryDate).toLocaleDateString()}
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
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        user={user}
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
