import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

// ZOD schema for creating a job posting (duplicated here to avoid path issues)
const CreateJobSchema = z.object({
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

type CreateJobRequest = z.infer<typeof CreateJobSchema>;

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Employer only)
router.post(
  '/',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body using ZOD
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

      const jobData = validationResult.data;

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

      // Transform the response to match the frontend expectations
      const jobResponse = {
        id: newJob.id,
        title: newJob.title,
        jobName: newJob.job_name,
        description: newJob.description,
        hourlySalaryRange: newJob.hourly_salary_range,
        expiryDate: newJob.expiry_date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        createdAt: newJob.created_at.toISOString(),
        updatedAt: newJob.updated_at.toISOString(),
        employer: newJob.employer,
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
  }
);

// @route   GET /api/jobs
// @desc    Get all job postings with filtering
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      category,
      search,
      expired = 'false',
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const includeExpired = expired === 'true';

    // Build where clause
    const where: any = {};

    if (!includeExpired) {
      where.expiry_date = {
        gte: new Date(),
      };
    }

    if (category) {
      where.job_category = {
        category: category as string,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { job_name: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Get jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        skip,
        take: limitNumber,
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
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.jobPosting.count({ where }),
    ]);

    // Transform jobs to match frontend expectations
    const transformedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      jobName: job.job_name,
      description: job.description,
      hourlySalaryRange: job.hourly_salary_range,
      expiryDate: job.expiry_date.toISOString().split('T')[0],
      createdAt: job.created_at.toISOString(),
      updatedAt: job.updated_at.toISOString(),
      employer: job.employer,
      jobCategory: job.job_category,
    }));

    const totalPages = Math.ceil(total / limitNumber);

    res.json({
      jobs: transformedJobs,
      totalPages,
      currentPage: pageNumber,
      total,
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get a single job posting
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            website_url: true,
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

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Transform job to match frontend expectations
    const jobResponse = {
      id: job.id,
      title: job.title,
      jobName: job.job_name,
      description: job.description,
      hourlySalaryRange: job.hourly_salary_range,
      expiryDate: job.expiry_date.toISOString().split('T')[0],
      createdAt: job.created_at.toISOString(),
      updatedAt: job.updated_at.toISOString(),
      employer: job.employer,
      jobCategory: job.job_category,
    };

    res.json(jobResponse);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
