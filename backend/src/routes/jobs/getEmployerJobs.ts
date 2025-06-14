import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import type { JobsListResponse, JobResponse } from '../../types/job';

// @route   GET /api/jobs/employer
// @desc    Get all employer's job postings
// @access  Private (Employer only)
const getEmployerJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await prisma.jobPosting.findMany({
      where: {
        employer_id: req.user?.profile?.id,
        is_deleted: false,
      },
      include: {
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
    });

    // Transform jobs to match shared JobResponse type
    const transformedJobs: JobResponse[] = jobs.map((job) => ({
      id: job.id,
      createdAt: job.created_at.toISOString(),
      updatedAt: job.updated_at.toISOString(),
      title: job.title,
      jobName: job.job_name,
      description: job.description,
      hourlySalaryRange: job.hourly_salary_range,
      expiryDate: job.expiry_date.toISOString().split('T')[0]!,
      jobCategory: job.job_category,
    }));

    const response: JobsListResponse = {
      jobs: transformedJobs,
    };

    res.json(response);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getEmployerJobs;
