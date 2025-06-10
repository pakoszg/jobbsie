import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('userType')
      .isIn(['applicant', 'employer'])
      .withMessage('User type must be applicant or employer'),
    body('firstName')
      .if(body('userType').equals('applicant'))
      .notEmpty()
      .withMessage('First name is required for applicants'),
    body('lastName')
      .if(body('userType').equals('applicant'))
      .notEmpty()
      .withMessage('Last name is required for applicants'),
    body('name')
      .if(body('userType').equals('employer'))
      .notEmpty()
      .withMessage('Company name is required for employers'),
    body('address')
      .if(body('userType').equals('employer'))
      .notEmpty()
      .withMessage('Address is required for employers'),
    body('category')
      .if(body('userType').equals('employer'))
      .notEmpty()
      .withMessage('Category is required for employers'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        email,
        password,
        userType,
        firstName,
        lastName,
        name,
        address,
        category,
        websiteUrl,
        phoneNumber,
        introduction,
      } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user with associated profile
      let user;
      if (userType === 'applicant') {
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            applicant: {
              create: {
                firstName,
                lastName,
                phoneNumber,
                introduction,
              },
            },
          },
          include: {
            applicant: true,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            employer: {
              create: {
                name,
                address,
                category,
                websiteUrl,
              },
            },
          },
          include: {
            employer: true,
          },
        });
      }

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

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          userType,
          profile:
            userType === 'applicant'
              ? (user as any).applicant
              : (user as any).employer,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

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
