import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateJobSchema, type CreateJobRequest } from '../../types/job';
import type { JobResponse } from '../../types/job';
import { useCategories } from '../../hooks/useCategories';

interface CreateJobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobRequest) => void;
  isLoading: boolean;
  initialData?: JobResponse;
}

// Extended form type to include temporary fields
interface FormData extends CreateJobRequest {
  minSalary?: number;
  maxSalary?: number;
}

export function CreateJobForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: CreateJobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(CreateJobSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          jobName: initialData.jobName,
          description: initialData.description,
          hourlySalaryRange: initialData.hourlySalaryRange,
          expiryDate: initialData.expiryDate,
          jobCategoryId: initialData.jobCategory.id,
          // Parse initial salary range
          minSalary: parseInt(
            initialData.hourlySalaryRange.match(/\$(\d+)/)?.[1] || '0'
          ),
          maxSalary: parseInt(
            initialData.hourlySalaryRange.match(/-(\d+)/)?.[1] || '0'
          ),
        }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  // Watch min and max salary values
  const minSalary = watch('minSalary');
  const maxSalary = watch('maxSalary');

  // Update hourlySalaryRange when min or max changes
  const updateHourlySalaryRange = (min: number, max: number) => {
    setValue('hourlySalaryRange', `$${min}-${max}/hour`);
  };

  // Fetch job categories from API
  const { data: jobCategories = [], isLoading: categoriesLoading } =
    useCategories();

  return (
    <Dialog open={isOpen} onClose={handleClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />

      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg'>
          <div className='flex items-center justify-between p-6 border-b'>
            <Dialog.Title className='text-xl font-semibold text-gray-900'>
              {initialData ? 'Edit Job' : 'Create New Job'}
            </Dialog.Title>
            <button
              onClick={handleClose}
              className='text-gray-400 hover:text-gray-500'
            >
              <XMarkIcon className='h-6 w-6' />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='p-6'>
            <div className='space-y-6'>
              <div>
                <label
                  htmlFor='title'
                  className='block text-sm font-medium text-gray-700'
                >
                  Job Title
                </label>
                <input
                  type='text'
                  id='title'
                  {...register('title')}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                {errors.title && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='jobName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Job Name
                </label>
                <input
                  type='text'
                  id='jobName'
                  {...register('jobName')}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                {errors.jobName && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.jobName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  rows={4}
                  {...register('description')}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                {errors.description && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='minSalary'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Min Hourly Rate
                  </label>
                  <input
                    type='number'
                    id='minSalary'
                    {...register('minSalary', {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const min = parseInt(e.target.value);
                        if (min && maxSalary) {
                          updateHourlySalaryRange(min, maxSalary);
                        }
                      },
                    })}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label
                    htmlFor='maxSalary'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Max Hourly Rate
                  </label>
                  <input
                    type='number'
                    id='maxSalary'
                    {...register('maxSalary', {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const max = parseInt(e.target.value);
                        if (max && minSalary) {
                          updateHourlySalaryRange(minSalary, max);
                        }
                      },
                    })}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
              </div>
              {errors.hourlySalaryRange && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.hourlySalaryRange.message}
                </p>
              )}

              <div>
                <label
                  htmlFor='expiryDate'
                  className='block text-sm font-medium text-gray-700'
                >
                  Expiry Date
                </label>
                <input
                  type='date'
                  id='expiryDate'
                  {...register('expiryDate')}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                {errors.expiryDate && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='jobCategoryId'
                  className='block text-sm font-medium text-gray-700'
                >
                  Job Category
                </label>
                <select
                  id='jobCategoryId'
                  {...register('jobCategoryId')}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                >
                  <option value=''>Select a category</option>
                  {jobCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.jobCategoryId && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.jobCategoryId.message}
                  </p>
                )}
              </div>
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <button
                type='button'
                onClick={handleClose}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isLoading}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50'
              >
                {isLoading
                  ? 'Saving...'
                  : initialData
                  ? 'Update Job'
                  : 'Create Job'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
