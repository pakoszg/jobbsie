import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import {
  authenticateToken,
  requireEmployer,
  optionalAuth,
} from '../middleware/auth';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with optional filtering
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      hourlySalaryMin,
      hourlySalaryMax,
      employer,
      search,
      expired = false,
    } = req.query;

    // Build filter object
    const where: any = {};

    // Filter out expired jobs by default
    if (expired === 'false' || !expired) {
      where.expiryDate = {
        gte: new Date(),
      };
    }

    if (category) {
      where.jobCategory = {
        category: category as string,
      };
    }

    if (employer) {
      where.employer = {
        name: {
          contains: employer as string,
          mode: 'insensitive',
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { jobName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.jobPosting.findMany({
      where,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        jobCategory: true,
        _count: {
          select: {
            likedJobs: true,
            discardedJobs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    const total = await prisma.jobPosting.count({ where });

    res.json({
      jobs,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id: req.params.id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            category: true,
            address: true,
            websiteUrl: true,
          },
        },
        jobCategory: true,
        _count: {
          select: {
            likedJobs: true,
            discardedJobs: true,
          },
        },
      },
    });

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Employer only)
router.post(
  '/',
  authenticateToken,
  requireEmployer,
  [
    body('title').notEmpty().withMessage('Job title is required'),
    body('description').notEmpty().withMessage('Job description is required'),
    body('jobName').notEmpty().withMessage('Job name is required'),
    body('hourlySalaryRange')
      .notEmpty()
      .withMessage('Hourly salary range is required'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
    body('jobCategoryId').notEmpty().withMessage('Job category ID is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        title,
        description,
        jobName,
        hourlySalaryRange,
        expiryDate,
        jobCategoryId,
      } = req.body;

      // Get employer ID from authenticated user
      if (!req.user || !req.user.profile) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const employerId = req.user.profile.id;

      // Verify job category exists
      const jobCategory = await prisma.jobCategory.findUnique({
        where: { id: jobCategoryId },
      });

      if (!jobCategory) {
        res.status(404).json({ message: 'Job category not found' });
        return;
      }

      const job = await prisma.jobPosting.create({
        data: {
          title,
          description,
          jobName,
          hourlySalaryRange,
          expiryDate: new Date(expiryDate),
          employerId,
          jobCategoryId,
        },
        include: {
          employer: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          jobCategory: true,
        },
      });

      res.status(201).json({
        message: 'Job created successfully',
        job,
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/jobs/:id
// @desc    Update a job posting
// @access  Private (would require auth middleware)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      jobName,
      hourlySalaryRange,
      expiryDate,
      jobCategoryId,
    } = req.body;

    const job = await prisma.jobPosting.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(jobName && { jobName }),
        ...(hourlySalaryRange && { hourlySalaryRange }),
        ...(expiryDate && { expiryDate: new Date(expiryDate) }),
        ...(jobCategoryId && { jobCategoryId }),
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        jobCategory: true,
      },
    });

    res.json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    console.error('Update job error:', error);
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job posting
// @access  Private (would require auth middleware)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.jobPosting.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/like
// @desc    Like a job
// @access  Private
router.post('/:id/like', async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicantId } = req.body;

    if (!applicantId) {
      res.status(400).json({ message: 'Applicant ID is required' });
      return;
    }

    const jobId = req.params.id;
    if (!jobId) {
      res.status(400).json({ message: 'Job ID is required' });
      return;
    }

    // Check if job exists
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if already liked
    const existingLike = await prisma.likedJob.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId,
        },
      },
    });

    if (existingLike) {
      res.status(400).json({ message: 'Job already liked' });
      return;
    }

    // Remove from discarded if exists
    await prisma.discardedJob.deleteMany({
      where: {
        jobId,
        applicantId,
      },
    });

    // Add to liked
    await prisma.likedJob.create({
      data: {
        jobId,
        applicantId,
      },
    });

    res.json({ message: 'Job liked successfully' });
  } catch (error) {
    console.error('Like job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/discard
// @desc    Discard a job
// @access  Private
router.post(
  '/:id/discard',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { applicantId } = req.body;

      if (!applicantId) {
        res.status(400).json({ message: 'Applicant ID is required' });
        return;
      }

      const jobId = req.params.id;
      if (!jobId) {
        res.status(400).json({ message: 'Job ID is required' });
        return;
      }

      // Check if job exists
      const job = await prisma.jobPosting.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        res.status(404).json({ message: 'Job not found' });
        return;
      }

      // Check if already discarded
      const existingDiscard = await prisma.discardedJob.findUnique({
        where: {
          jobId_applicantId: {
            jobId,
            applicantId,
          },
        },
      });

      if (existingDiscard) {
        res.status(400).json({ message: 'Job already discarded' });
        return;
      }

      // Remove from liked if exists
      await prisma.likedJob.deleteMany({
        where: {
          jobId,
          applicantId,
        },
      });

      // Add to discarded
      await prisma.discardedJob.create({
        data: {
          jobId,
          applicantId,
        },
      });

      res.json({ message: 'Job discarded successfully' });
    } catch (error) {
      console.error('Discard job error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
