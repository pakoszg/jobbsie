import { useState, useEffect } from 'react';
import { JobCard } from './components/JobCard';
import { Header } from './components/Header';
import { UserProfile } from './components/UserProfile';
import { EditProfile } from './components/EditProfile';
import { LikedJobs } from './components/LikedJobs';
import { LoginPage } from './components/LoginPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useJobs } from './hooks/useJobs';
import { useCurrentUser, useLogout } from './hooks/useAuth';
import { isAuthenticated } from './services/auth';
import type { Job } from './types/job';
import type { ApplicantProfile, EmployerProfile } from './types/user';

function App() {
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
  const [isAuthenticated_, setIsAuthenticated] = useState(isAuthenticated());

  // Auth hooks
  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const logoutMutation = useLogout();

  // Fetch jobs from API (only for swipe mode and if authenticated)
  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useJobs(
    currentView === 'swipe' && isAuthenticated_
      ? { expired: false, limit: 50 }
      : {}
  );
  const jobs = jobsData?.jobs || [];

  // Check authentication status on app load
  useEffect(() => {
    setIsAuthenticated(isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setIsAuthenticated(false);
    // Reset app state
    setCurrentJobIndex(0);
    setLikedJobs([]);
    setDislikedJobs([]);
    setShowProfile(false);
    setShowEditProfile(false);
    setShowLikedJobs(false);
  };

  const handleLike = () => {
    if (currentJobIndex < jobs.length) {
      setLikedJobs([...likedJobs, jobs[currentJobIndex]]);
      setShowFeedback('like');
      setTimeout(() => {
        setShowFeedback(null);
        setCurrentJobIndex(currentJobIndex + 1);
      }, 800);
    }
  };

  const handleDislike = () => {
    if (currentJobIndex < jobs.length) {
      setDislikedJobs([...dislikedJobs, jobs[currentJobIndex]]);
      setShowFeedback('dislike');
      setTimeout(() => {
        setShowFeedback(null);
        setCurrentJobIndex(currentJobIndex + 1);
      }, 800);
    }
  };

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

  const handleSettingsClick = () => {
    handleLogout();
  };

  // Show login page if not authenticated
  if (!isAuthenticated_) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show loading spinner while fetching user data
  if (userLoading) {
    return (
      <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  // Show error if user data failed to load
  if (userError || !currentUser) {
    return (
      <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <ErrorMessage
          message='Failed to load user data. Please try logging in again.'
          onRetry={handleLogout}
        />
      </div>
    );
  }

  const currentJob = jobs[currentJobIndex];

  // Create a user object compatible with the existing components
  const user = {
    id: parseInt(currentUser.id),
    name:
      currentUser.userType === 'applicant'
        ? `${(currentUser.profile as ApplicantProfile)?.firstName || ''} ${
            (currentUser.profile as ApplicantProfile)?.lastName || ''
          }`.trim()
        : (currentUser.profile as EmployerProfile)?.name || currentUser.email,
    email: currentUser.email,
    avatar: currentUser.profile?.avatar,
    location:
      currentUser.userType === 'employer'
        ? (currentUser.profile as EmployerProfile)?.address
        : (currentUser.profile as ApplicantProfile)?.location || 'Unknown',
    jobPreferences:
      currentUser.userType === 'applicant'
        ? (currentUser.profile as ApplicantProfile)?.jobPreferences || []
        : [],
    memberSince: new Date(
      currentUser.createdAt || Date.now()
    ).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  };

  return (
    <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-hidden'>
      {/* Header - Fixed height */}
      <div className='flex-shrink-0'>
        <Header
          user={user}
          likedCount={likedJobs.length}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onLikedJobsClick={handleLikedJobsClick}
          onJobPreferencesClick={handleJobPreferencesClick}
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

              <div className='w-full h-full max-h-full overflow-hidden'>
                <JobCard
                  job={currentJob}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              </div>
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
                You've gone through all available jobs.
              </p>
              <button
                onClick={() => {
                  setCurrentJobIndex(0);
                  setLikedJobs([]);
                  setDislikedJobs([]);
                  refetch();
                }}
                className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base'
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        user={user}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfile
        user={user}
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSavePreferences}
      />

      {/* Liked Jobs Modal */}
      <LikedJobs
        likedJobs={likedJobs}
        isOpen={showLikedJobs}
        onClose={() => setShowLikedJobs(false)}
      />
    </div>
  );
}

export default App;
