import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
      <div className='text-center'>
        <div className='text-6xl mb-4'>🔍</div>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>
          Page Not Found
        </h1>
        <p className='text-gray-600 mb-8 max-w-md'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105'
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
