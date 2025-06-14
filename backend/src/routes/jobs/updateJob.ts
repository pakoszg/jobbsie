import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { CreateJobSchema, CreateJobRequest } from '../../schemas/job';
import type { JobResponse } from '../../types/job';

const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

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

    // Check if job exists and belongs to the employer
    const existingJob = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!existingJob) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (existingJob.employer_id !== req.user?.profile?.id) {
      res.status(403).json({ message: 'Not authorized to update this job' });
      return;
    }

    const updatedJob = await prisma.jobPosting.update({
      where: { id },
      data: {
        title: jobData.title,
        job_name: jobData.jobName,
        description: jobData.description,
        hourly_salary_range: jobData.hourlySalaryRange,
        expiry_date: new Date(jobData.expiryDate),
        job_category_id: jobData.jobCategoryId,
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
    });

    // Transform the response to match the shared JobResponse type
    const jobResponse: JobResponse = {
      id: updatedJob.id,
      title: updatedJob.title,
      jobName: updatedJob.job_name,
      description: updatedJob.description,
      hourlySalaryRange: updatedJob.hourly_salary_range,
      expiryDate: updatedJob.expiry_date.toISOString().split('T')[0]!,
      createdAt: updatedJob.created_at.toISOString(),
      updatedAt: updatedJob.updated_at.toISOString(),
      jobCategory: updatedJob.job_category,
    };

    res.json({
      message: 'Job posting updated successfully',
      job: jobResponse,
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default updateJob;
