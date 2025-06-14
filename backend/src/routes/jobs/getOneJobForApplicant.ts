import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import type { JobResponse } from '../../types/job';

// @route   GET /api/jobs/applicant/:id
// @desc    Get a single job posting
// @access  Public
const getOneJobForApplicant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        employer: true,
        job_category: true,
      },
    });

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Transform job to match shared JobResponse type
    const jobResponse: JobResponse = {
      id: job.id,
      title: job.title,
      jobName: job.job_name,
      description: job.description,
      hourlySalaryRange: job.hourly_salary_range,
      expiryDate: job.expiry_date.toISOString().split('T')[0]!,
      createdAt: job.created_at.toISOString(),
      updatedAt: job.updated_at.toISOString(),
      jobCategory: job.job_category,
    };

    res.json(jobResponse);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getOneJobForApplicant;
