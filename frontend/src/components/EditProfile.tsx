import React, { useState } from 'react';
import {
  XMarkIcon,
  ChevronLeftIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { User } from '../types';

interface EditProfileProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: string[]) => void;
}

interface JobCategory {
  emoji: string;
  title: string;
  jobs: string[];
}

const jobCategories: JobCategory[] = [
  {
    emoji: '🏨',
    title: 'Hospitality & Tourism',
    jobs: [
      'Hotel Receptionist',
      'Housekeeper / Room Attendant',
      'Concierge',
      'Tour Guide',
      'Resort Activities Coordinator',
    ],
  },
  {
    emoji: '🍽',
    title: 'Food & Beverage',
    jobs: [
      'Waiter/Waitress',
      'Bartender',
      'Barista',
      'Line Cook / Prep Cook',
      'Dishwasher',
      'Restaurant Host/Hostess',
    ],
  },
  {
    emoji: '🎪',
    title: 'Events & Entertainment',
    jobs: [
      'Festival Worker',
      'Event Staff / Usher',
      'Stagehand',
      'Ticketing Attendant',
      'Set-Up / Break-Down Crew',
    ],
  },
  {
    emoji: '🛍',
    title: 'Retail & Sales',
    jobs: [
      'Store Assistant',
      'Cashier',
      'Merchandiser',
      'Stockroom Associate',
      'Sales Representative',
    ],
  },
  {
    emoji: '🚚',
    title: 'Logistics & Delivery',
    jobs: [
      'Delivery Driver / Rider',
      'Warehouse Picker/Packer',
      'Courier',
      'Inventory Associate',
      'Forklift Operator',
    ],
  },
  {
    emoji: '🧹',
    title: 'Cleaning & Maintenance',
    jobs: [
      'Cleaner / Janitor',
      'Housekeeper (Private or Hotel)',
      'Groundskeeper',
      'Laundry Attendant',
      'Maintenance Assistant',
    ],
  },
  {
    emoji: '🧑‍⚕️',
    title: 'Personal Care & Wellness',
    jobs: [
      'Spa Attendant',
      'Massage Therapist',
      'Hairdresser / Barber',
      'Fitness Trainer',
      'Nail Technician',
    ],
  },
  {
    emoji: '🧑‍💼',
    title: 'Administrative & Front Desk',
    jobs: [
      'Office Assistant',
      'Front Desk Clerk',
      'Call Center Agent',
      'Data Entry Clerk',
      'Receptionist',
    ],
  },
  {
    emoji: '🚨',
    title: 'Security & Safety',
    jobs: [
      'Security Guard',
      'Event Security',
      'Night Watch',
      'Lifeguard',
      'Door Staff',
    ],
  },
];

export const EditProfile: React.FC<EditProfileProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'Hotel Receptionist',
  ]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryTitle)
        ? prev.filter((cat) => cat !== categoryTitle)
        : [...prev, categoryTitle]
    );
  };

  const toggleCategorySelection = (category: JobCategory) => {
    const categoryJobs = category.jobs;
    const allSelected = categoryJobs.every((job) =>
      selectedPreferences.includes(job)
    );

    if (allSelected) {
      // Deselect all jobs in this category
      setSelectedPreferences((prev) =>
        prev.filter((pref) => !categoryJobs.includes(pref))
      );
    } else {
      // Select all jobs in this category
      setSelectedPreferences((prev) => [
        ...prev.filter((pref) => !categoryJobs.includes(pref)),
        ...categoryJobs,
      ]);
    }
  };

  const toggleJobSelection = (job: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(job) ? prev.filter((pref) => pref !== job) : [...prev, job]
    );
  };

  const handleSave = () => {
    onSave(selectedPreferences);
    onClose();
  };

  const getCategoryProgress = (category: JobCategory) => {
    const selectedInCategory = category.jobs.filter((job) =>
      selectedPreferences.includes(job)
    ).length;
    const totalInCategory = category.jobs.length;
    return { selected: selectedInCategory, total: totalInCategory };
  };

  const isCategoryFullySelected = (category: JobCategory) => {
    return category.jobs.every((job) => selectedPreferences.includes(job));
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white flex-shrink-0'>
          <button
            onClick={onClose}
            className='absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 transition-colors'
          >
            <ChevronLeftIcon className='h-6 w-6' />
          </button>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>

          <div className='text-center'>
            <h2 className='text-2xl md:text-3xl font-bold mb-2'>
              Edit Job Preferences
            </h2>
            <p className='text-white/80'>
              Select the job types you're interested in
            </p>
            <div className='mt-3 text-sm text-white/70'>
              {selectedPreferences.length} preferences selected
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='space-y-4'>
            {jobCategories.map((category) => {
              const { selected, total } = getCategoryProgress(category);
              const isExpanded = expandedCategories.includes(category.title);
              const isFullySelected = isCategoryFullySelected(category);

              return (
                <div
                  key={category.title}
                  className='border border-gray-200 rounded-xl overflow-hidden'
                >
                  {/* Category Header */}
                  <div className='bg-gray-50 p-4 border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                      <button
                        onClick={() => toggleCategory(category.title)}
                        className='flex items-center space-x-3 text-left flex-1 hover:text-blue-600 transition-colors'
                      >
                        <span className='text-2xl'>{category.emoji}</span>
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold text-gray-800'>
                            {category.title}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {selected} of {total} selected
                          </p>
                        </div>
                      </button>

                      <div className='flex items-center space-x-3'>
                        {/* Select All Toggle */}
                        <button
                          onClick={() => toggleCategorySelection(category)}
                          className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-all ${
                            isFullySelected
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : selected > 0
                              ? 'bg-blue-100 border-blue-300'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          {isFullySelected && <CheckIcon className='h-4 w-4' />}
                          {selected > 0 && !isFullySelected && (
                            <div className='w-2 h-2 bg-blue-500 rounded'></div>
                          )}
                        </button>

                        {/* Expand/Collapse */}
                        <button
                          onClick={() => toggleCategory(category.title)}
                          className='text-gray-400 hover:text-gray-600 transition-colors'
                        >
                          <ChevronLeftIcon
                            className={`h-5 w-5 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Category Jobs */}
                  {isExpanded && (
                    <div className='p-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {category.jobs.map((job) => (
                          <label
                            key={job}
                            onClick={() => toggleJobSelection(job)}
                            className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all ${
                                selectedPreferences.includes(job)
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'border-gray-300 hover:border-blue-300'
                              }`}
                            >
                              {selectedPreferences.includes(job) && (
                                <CheckIcon className='h-3 w-3' />
                              )}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                selectedPreferences.includes(job)
                                  ? 'text-blue-700'
                                  : 'text-gray-700'
                              }`}
                            >
                              {job}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className='border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={onClose}
              className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200'
            >
              Save Preferences ({selectedPreferences.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
