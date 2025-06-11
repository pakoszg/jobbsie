import { useState } from 'react';
import { Header } from './Header';
import { UserProfile } from './UserProfile';
import { EditProfile } from './EditProfile';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useJobs } from '../hooks/useJobs';
import type { Job, ApiUser } from '../types';

interface ApplicantDashboardProps {
  currentUser: ApiUser;
  onLogout: () => void;
}

export function ApplicantDashboard({
  currentUser,
  onLogout,
}: ApplicantDashboardProps) {
  const [currentView, setCurrentView] = useState<'swipe' | 'browse'>('swipe');
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<Job[]>([]);
  const [showFeedback, setShowFeedback] = useState<'like' | 'dislike' | null>(
    null
  );
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLikedJobs, setShowLikedJobs] = useState(false);

  // Fetch jobs from API (only for swipe mode)
  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useJobs(currentView === 'swipe' ? { expired: false, limit: 50 } : {});
  const jobs = jobsData?.jobs || [];

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleJobPreferencesClick = () => {
    setShowEditProfile(true);
  };

  const handleLikedJobsClick = () => {
    setShowLikedJobs(true);
  };

  const handleSavePreferences = (preferences: string[]) => {
    // This would typically update the user preferences via an API call
    console.log('Saving preferences:', preferences);
  };

  const currentJob = jobs[currentJobIndex];

  // Get display name for welcome message
  const getDisplayName = () => {
    if (currentUser.userType === 'applicant' && currentUser.applicant) {
      return `${currentUser.applicant.first_name} ${currentUser.applicant.last_name}`.trim();
    }
    if (currentUser.userType === 'employer' && currentUser.employer) {
      return currentUser.employer.name;
    }
    return currentUser.email; // Fallback to email
  };

  const displayName = getDisplayName();
  const firstName = displayName.split(' ')[0];

  return (
    <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-hidden'>
      {/* Header - Fixed height */}
      <div className='flex-shrink-0'>
        <Header
          user={currentUser}
          likedCount={likedJobs.length}
          onProfileClick={handleProfileClick}
          onLikedJobsClick={handleLikedJobsClick}
          onJobPreferencesClick={handleJobPreferencesClick}
          onLogout={onLogout}
        />
      </div>

      {/* Main Content Area - Takes remaining space */}
      <div className='flex-1 flex flex-col min-h-0 px-4 py-3 sm:py-4 md:py-5 lg:py-6'>
        {/* Welcome Message - Fixed height */}
        <div className='flex-shrink-0 text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6'>
          <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-1'>
            Welcome back, {firstName}! 👋
          </h2>
          <p className='text-gray-600 text-sm sm:text-base md:text-lg'>
            Find your perfect job match
          </p>
        </div>

        {/* Job Card Container - Takes remaining space */}
        <div className='flex-1 flex items-center justify-center min-h-0'>
          {isLoading ? (
            <LoadingSpinner size='large' className='py-16' />
          ) : error ? (
            <ErrorMessage
              message='Failed to load jobs. Please check your connection and try again.'
              onRetry={() => refetch()}
            />
          ) : currentJob ? (
            <div className='relative w-full h-full max-h-full flex items-center justify-center'>
              {/* Feedback Animation */}
              {showFeedback && (
                <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/90 rounded-2xl'>
                  <div
                    className={`text-4xl sm:text-5xl md:text-6xl animate-bounce ${
                      showFeedback === 'like'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {showFeedback === 'like' ? '💚' : '💔'}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6'>
              <div className='text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4'>
                🎉
              </div>
              <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4'>
                All done!
              </h2>
              <p className='text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base'>
                You've gone through all available jobs. Please check back later
                soon for more jobs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        user={currentUser}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfile
        user={currentUser}
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSavePreferences}
      />
    </div>
  );
}
