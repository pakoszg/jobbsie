import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userType: 'applicant' | 'employer';
        email: string;
        profile: any;
      };
    }
  }
}

interface JwtPayload {
  user: {
    id: string;
    userType: 'applicant' | 'employer';
  };
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    if (!token) {
      res.status(401).json({
        message: 'Access denied. No token provided.',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.user.id },
      include: {
        applicant: true,
        employer: true,
      },
    });

    if (!user) {
      res.status(401).json({
        message: 'Token is valid but user not found.',
      });
      return;
    }

    // Add user to request object
    req.user = {
      id: user.id,
      userType: decoded.user.userType,
      email: user.email,
      profile:
        decoded.user.userType === 'applicant' ? user.applicant : user.employer,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      message: 'Token is not valid.',
    });
  }
};

// Middleware to check if user is an employer
export const requireEmployer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      message: 'Authentication required.',
    });
    return;
  }

  if (req.user.userType !== 'employer') {
    res.status(403).json({
      message: 'Access denied. Employer role required.',
    });
    return;
  }

  next();
};

// Middleware to check if user is an applicant
export const requireApplicant = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      message: 'Authentication required.',
    });
    return;
  }

  if (req.user.userType !== 'applicant') {
    res.status(403).json({
      message: 'Access denied. Applicant role required.',
    });
    return;
  }

  next();
};

// Optional auth middleware - doesn't fail if no token provided
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    if (!token) {
      // No token provided, continue without user
      next();
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.user.id },
      include: {
        applicant: true,
        employer: true,
      },
    });

    if (user) {
      req.user = {
        id: user.id,
        userType: decoded.user.userType,
        email: user.email,
        profile:
          decoded.user.userType === 'applicant'
            ? user.applicant
            : user.employer,
      };
    }

    next();
  } catch (error) {
    // Invalid token, but continue without user
    next();
  }
};
