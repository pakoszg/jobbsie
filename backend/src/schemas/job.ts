import { z } from 'zod';

// Shared ZOD schema for creating a job posting
export const CreateJobSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required')
    .max(100, 'Job title must be less than 100 characters'),

  jobName: z
    .string()
    .min(1, 'Job name is required')
    .max(50, 'Job name must be less than 50 characters'),

  description: z
    .string()
    .min(50, 'Job description must be at least 50 characters')
    .max(2000, 'Job description must be less than 2000 characters'),

  hourlySalaryRange: z
    .string()
    .min(1, 'Hourly salary range is required')
    .regex(/^\$\d+-\d+\/hour$/, 'Salary range must be in format: $XX-XX/hour'),

  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .refine((date: string) => {
      const expiryDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expiryDate > today;
    }, 'Expiry date must be in the future'),

  jobCategoryId: z
    .string()
    .min(1, 'Job category is required')
    .uuid('Invalid job category ID'),
});

// TypeScript type derived from ZOD schema
export type CreateJobRequest = z.infer<typeof CreateJobSchema>;
