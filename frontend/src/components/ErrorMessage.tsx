interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = '',
}: ErrorMessageProps) => {
  return (
    <div className={`text-center py-8 px-4 ${className}`}>
      <div className='text-4xl mb-4'>😕</div>
      <h3 className='text-lg font-semibold text-gray-800 mb-2'>Oops!</h3>
      <p className='text-gray-600 mb-4'>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200'
        >
          Try Again
        </button>
      )}
    </div>
  );
};
