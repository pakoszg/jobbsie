import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          applicant: true,
          employer: true,
        },
      });

      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      // Determine user type
      const userType = user.applicant ? 'applicant' : 'employer';

      // Generate JWT token
      const payload = {
        user: {
          id: user.id,
          userType,
        },
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        } as jwt.SignOptions
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          userType,
          profile: userType === 'applicant' ? user.applicant : user.employer,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get(
  '/me',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      // Get fresh user data from database
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          applicant: true,
          employer: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userType = user.applicant ? 'applicant' : 'employer';

      res.json({
        id: user.id,
        email: user.email,
        userType,
        profile: userType === 'applicant' ? user.applicant : user.employer,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
