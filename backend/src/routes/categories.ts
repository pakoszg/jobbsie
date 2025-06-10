import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all job categories
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.jobCategory.findMany({
      include: {
        _count: {
          select: {
            jobPostings: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await prisma.jobCategory.findUnique({
      where: { id: req.params.id },
      include: {
        jobPostings: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/categories
// @desc    Create a new job category
// @access  Private (Admin only)
router.post(
  '/',
  [
    body('category').notEmpty().withMessage('Category key is required'),
    body('name').notEmpty().withMessage('Category name is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { category, name } = req.body;

      // Check if category already exists
      const existingCategory = await prisma.jobCategory.findUnique({
        where: { category },
      });

      if (existingCategory) {
        res.status(400).json({ message: 'Category already exists' });
        return;
      }

      const newCategory = await prisma.jobCategory.create({
        data: {
          category,
          name,
        },
      });

      res.status(201).json({
        message: 'Category created successfully',
        category: newCategory,
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/categories/:id
// @desc    Update a job category
// @access  Private (Admin only)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, name } = req.body;

    const updatedCategory = await prisma.jobCategory.update({
      where: { id: req.params.id },
      data: {
        ...(category && { category }),
        ...(name && { name }),
      },
    });

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a job category
// @access  Private (Admin only)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if category has associated job postings
    const category = await prisma.jobCategory.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: {
            jobPostings: true,
          },
        },
      },
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    if (category._count.jobPostings > 0) {
      res.status(400).json({
        message: 'Cannot delete category with associated job postings',
      });
      return;
    }

    await prisma.jobCategory.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
