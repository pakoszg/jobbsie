import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

import { prisma } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { Applicant, Employer } from '../../../node_modules/.prisma/client';

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        created_at: true,
        applicant: true,
        employer: true,
      },
    });

    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      ...users,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/createApplicant
// @desc    Create a new applicant
// @access  Public
router.post('/createApplicant', async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, phone_number, introduction } =
    req.body;

  try {
    const applicant = await prisma.applicant.create({
      data: {
        first_name,
        last_name,
        phone_number,
        introduction,
      },
    });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        applicant_id: applicant?.id,
      },
    });

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        userType: 'applicant',
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      } as jwt.SignOptions
    );

    return res.json({
      message: 'Applicant created successfully',
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ message: 'Create applicant error' });
  }
});

router.post('/createEmployer', async (req: Request, res: Response) => {
  const {
    email,
    password,
    name,
    country,
    city,
    address,
    postal_code,
    category,
    website_url,
  } = req.body;

  try {
    const employer = await prisma.employer.create({
      data: {
        name,
        country,
        city,
        address,
        postal_code,
        category,
        website_url,
      },
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        employer_id: employer?.id,
      },
    });

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        userType: 'employer',
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      } as jwt.SignOptions
    );

    return res.json({
      message: 'Employer created successfully',
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ message: 'Create employer error' });
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
            ...(firstName && { first_name: firstName }),
            ...(lastName && { last_name: lastName }),
            ...(phoneNumber && { phone_number: phoneNumber }),
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
            ...(websiteUrl && { website_url: websiteUrl }),
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
        created_at: true,
        applicant: true,
        employer: true,
      },
      orderBy: { created_at: 'desc' },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      userType: user.applicant ? 'applicant' : 'employer',
      profile: user.applicant || user.employer,
      created_at: user.created_at,
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
      const liked_jobs = await prisma.likedJob.findMany({
        where: { applicant_id: req.params.id },
        include: {
          job_posting: {
            include: {
              employer: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                },
              },
              job_category: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      return res.json(liked_jobs.map((like) => like.job_posting));
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
      where: { applicant_id: req.params.id },
      orderBy: { created_at: 'desc' },
    });

    return res.json(docs);
  } catch (error) {
    console.error('Get docs error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
