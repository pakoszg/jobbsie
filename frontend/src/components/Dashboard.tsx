import { useCurrentUser, useLogout } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ApplicantDashboard } from './ApplicantDashboard';
import { EmployerDashboard } from './EmployerDashboard';

export function Dashboard() {
  const navigate = useNavigate();

  // Auth hooks
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  console.log({ currentUser });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/login');
  };

  // Show loading spinner while fetching user data
  if (userLoading) {
    return (
      <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  // Show error if user data failed to load
  if (!currentUser) {
    return (
      <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <ErrorMessage
          message='Failed to load user data. Please try logging in again.'
          onRetry={handleLogout}
        />
      </div>
    );
  }

  // Route to appropriate dashboard based on user type
  if (currentUser.userType === 'employer') {
    return (
      <EmployerDashboard currentUser={currentUser} onLogout={handleLogout} />
    );
  } else {
    return (
      <ApplicantDashboard currentUser={currentUser} onLogout={handleLogout} />
    );
  }
}
