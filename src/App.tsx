import React, { useState } from 'react';
import { JobCard } from './components/JobCard';
import { Header } from './components/Header';
import { UserProfile } from './components/UserProfile';
import { EditProfile } from './components/EditProfile';
import { jobs } from './data/jobs';
import { currentUser } from './data/user';
import type { Job } from './types/job';
import type { User } from './types/user';

function App() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<Job[]>([]);
  const [showFeedback, setShowFeedback] = useState<'like' | 'dislike' | null>(
    null
  );
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState<User>(currentUser);

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

  const handleEditProfile = () => {
    setShowProfile(false);
    setShowEditProfile(true);
  };

  const handleSavePreferences = (preferences: string[]) => {
    setUser((prev) => ({
      ...prev,
      jobPreferences: preferences,
    }));
  };

  const handleSettingsClick = () => {
    // Handle settings click - could open settings modal
    console.log('Settings clicked');
  };

  const currentJob = jobs[currentJobIndex];

  return (
    <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-hidden'>
      {/* Header - Fixed height */}
      <div className='flex-shrink-0'>
        <Header
          user={user}
          likedCount={likedJobs.length}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
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
          {currentJob ? (
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
        onEditProfile={handleEditProfile}
        likedCount={likedJobs.length}
        dislikedCount={dislikedJobs.length}
      />

      {/* Edit Profile Modal */}
      <EditProfile
        user={user}
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSavePreferences}
      />
    </div>
  );
}

export default App;
