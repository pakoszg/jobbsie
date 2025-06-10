interface NavigationProps {
  currentView: 'swipe' | 'browse';
  onViewChange: (view: 'swipe' | 'browse') => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  return (
    <div className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <h1 className='text-xl font-bold text-gray-800'>Jobbsie</h1>
          </div>

          <div className='flex space-x-1 bg-gray-100 rounded-lg p-1'>
            <button
              onClick={() => onViewChange('swipe')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'swipe'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💚 Swipe Mode
            </button>
            <button
              onClick={() => onViewChange('browse')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'browse'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Browse Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
