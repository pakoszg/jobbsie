import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Public
router.get('/profile/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        applicant: true,
        employer: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userType = user.applicant ? 'applicant' : 'employer';
    const profile = user.applicant || user.employer;

    return res.json({
      id: user.id,
      email: user.email,
      userType,
      profile,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  authenticateToken,
  [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please include a valid email'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        email,
        firstName,
        lastName,
        phoneNumber,
        introduction,
        name,
        address,
        category,
        websiteUrl,
      } = req.body;

      // Use authenticated user
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userId = req.user.id;

      // Get user to determine type
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          applicant: true,
          employer: true,
        },
      });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userType = existingUser.applicant ? 'applicant' : 'employer';

      // Update user email if provided
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(email && { email }),
        },
        include: {
          applicant: true,
          employer: true,
        },
      });

      // Update profile based on user type
      if (userType === 'applicant' && existingUser.applicant) {
        await prisma.applicant.update({
          where: { id: existingUser.applicant.id },
          data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(phoneNumber && { phoneNumber }),
            ...(introduction && { introduction }),
          },
        });
      } else if (userType === 'employer' && existingUser.employer) {
        await prisma.employer.update({
          where: { id: existingUser.employer.id },
          data: {
            ...(name && { name }),
            ...(address && { address }),
            ...(category && { category }),
            ...(websiteUrl && { websiteUrl }),
          },
        });
      }

      // Fetch updated user data
      const finalUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          applicant: true,
          employer: true,
        },
      });

      return res.json({
        message: 'Profile updated successfully',
        user: {
          id: finalUser!.id,
          email: finalUser!.email,
          userType,
          profile:
            userType === 'applicant'
              ? finalUser!.applicant
              : finalUser!.employer,
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        applicant: true,
        employer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      userType: user.applicant ? 'applicant' : 'employer',
      profile: user.applicant || user.employer,
      createdAt: user.createdAt,
    }));

    return res.json(formattedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/applicants/:id/liked-jobs
// @desc    Get liked jobs for an applicant
// @access  Private
router.get(
  '/applicants/:id/liked-jobs',
  async (req: Request, res: Response) => {
    try {
      const likedJobs = await prisma.likedJob.findMany({
        where: { applicantId: req.params.id },
        include: {
          jobPosting: {
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
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json(likedJobs.map((like) => like.jobPosting));
    } catch (error) {
      console.error('Get liked jobs error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/users/applicants/:id/docs
// @desc    Get documents for an applicant
// @access  Private
router.get('/applicants/:id/docs', async (req: Request, res: Response) => {
  try {
    const docs = await prisma.doc.findMany({
      where: { applicantId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(docs);
  } catch (error) {
    console.error('Get docs error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
