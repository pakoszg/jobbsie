import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { CreateJobSchema, CreateJobRequest } from '../../schemas/job';
import type { JobResponse } from '../../types/job';

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Employer only)
const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body using shared ZOD schema
    const validationResult = CreateJobSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    const jobData: CreateJobRequest = validationResult.data;

    // Check if user is authenticated and is an employer
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Get user with employer data
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { employer: true },
    });

    if (!user || !user.employer) {
      res
        .status(403)
        .json({ message: 'Only employers can create job postings' });
      return;
    }

    // Verify job category exists
    const jobCategory = await prisma.jobCategory.findUnique({
      where: { id: jobData.jobCategoryId },
    });

    if (!jobCategory) {
      res.status(400).json({ message: 'Invalid job category' });
      return;
    }

    // Create the job posting
    const newJob = await prisma.jobPosting.create({
      data: {
        title: jobData.title,
        job_name: jobData.jobName,
        description: jobData.description,
        hourly_salary_range: jobData.hourlySalaryRange,
        expiry_date: new Date(jobData.expiryDate),
        employer_id: user.employer.id,
        job_category_id: jobData.jobCategoryId,
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
          },
        },
        job_category: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    // Transform the response to match the shared JobResponse type
    const jobResponse: JobResponse = {
      id: newJob.id,
      title: newJob.title,
      jobName: newJob.job_name,
      description: newJob.description,
      hourlySalaryRange: newJob.hourly_salary_range,
      expiryDate: newJob.expiry_date.toISOString().split('T')[0]!, // Format as YYYY-MM-DD
      createdAt: newJob.created_at.toISOString(),
      updatedAt: newJob.updated_at.toISOString(),
      jobCategory: newJob.job_category,
    };

    res.status(201).json({
      message: 'Job posting created successfully',
      job: jobResponse,
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default createJob;
