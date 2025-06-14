import { Request, Response } from 'express';
import { prisma } from '../../config/database';

const removeJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingJob = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!existingJob) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (existingJob.employer_id !== req.user?.profile?.id) {
      res.status(403).json({ message: 'Not authorized to remove this job' });
      return;
    }

    await prisma.jobPosting.update({
      where: { id },
      data: {
        is_deleted: true,
      },
    });

    res.json({
      message: 'Job posting removed successfully',
    });
  } catch (error) {
    console.error('Remove job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default removeJob;
