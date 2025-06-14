import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../LoadingSpinner';
import { CreateJobSchema, type CreateJobRequest } from '../../types/job';
import { useCategories } from '../../hooks/useCategories';

interface CreateJobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: CreateJobRequest) => void;
  isLoading?: boolean;
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateJobRequest>({
    title: '',
    description: '',
    jobName: '',
    hourlySalaryRange: '',
    expiryDate: '',
    jobCategoryId: '',
  });

  const [errors, setErrors] = useState<Partial<CreateJobRequest>>({});

  // Fetch job categories from API
  const { data: jobCategories = [], isLoading: categoriesLoading } =
    useCategories();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CreateJobRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const validation = CreateJobSchema.safeParse(formData);

    if (!validation.success) {
      const newErrors: Partial<CreateJobRequest> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateJobRequest;
        newErrors[field] = issue.message;
      });

      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      jobName: '',
      hourlySalaryRange: '',
      expiryDate: '',
      jobCategoryId: '',
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Create Job Posting
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <XMarkIcon className='h-6 w-6 text-gray-500' />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto p-6 space-y-6'
        >
          {/* Job Title */}
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Job Title
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g., Senior React Developer'
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-600'>{errors.title}</p>
            )}
          </div>

          {/* Job Name */}
          <div>
            <label
              htmlFor='jobName'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Job Name
            </label>
            <input
              type='text'
              id='jobName'
              name='jobName'
              value={formData.jobName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.jobName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g., React Developer'
            />
            {errors.jobName && (
              <p className='mt-1 text-sm text-red-600'>{errors.jobName}</p>
            )}
          </div>

          {/* Job Category */}
          <div>
            <label
              htmlFor='jobCategoryId'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Job Category
            </label>
            <select
              id='jobCategoryId'
              name='jobCategoryId'
              value={formData.jobCategoryId}
              onChange={handleInputChange}
              disabled={categoriesLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.jobCategoryId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>
                {categoriesLoading
                  ? 'Loading categories...'
                  : 'Select a category'}
              </option>
              {jobCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.jobCategoryId && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.jobCategoryId}
              </p>
            )}
          </div>

          {/* Salary Range */}
          <div>
            <label
              htmlFor='hourlySalaryRange'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Hourly Salary Range
            </label>
            <input
              type='text'
              id='hourlySalaryRange'
              name='hourlySalaryRange'
              value={formData.hourlySalaryRange}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.hourlySalaryRange ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g., $60-90/hour'
            />
            {errors.hourlySalaryRange && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.hourlySalaryRange}
              </p>
            )}
          </div>

          {/* Expiry Date */}
          <div>
            <label
              htmlFor='expiryDate'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Application Deadline
            </label>
            <input
              type='date'
              id='expiryDate'
              name='expiryDate'
              value={formData.expiryDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.expiryDate && (
              <p className='mt-1 text-sm text-red-600'>{errors.expiryDate}</p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Job Description
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Provide a detailed description of the job responsibilities, requirements, and qualifications...'
            />
            <div className='flex justify-between items-center mt-1'>
              {errors.description && (
                <p className='text-sm text-red-600'>{errors.description}</p>
              )}
              <p className='text-sm text-gray-500 ml-auto'>
                {formData.description.length}/1000 characters
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={handleReset}
            className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium'
          >
            Reset
          </button>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2'
          >
            {isLoading && <LoadingSpinner size='small' />}
            <span>{isLoading ? 'Creating...' : 'Create Job'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
