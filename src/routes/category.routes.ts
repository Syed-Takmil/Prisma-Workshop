import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

const normalizeIdParam = (id: string | string[] | undefined): string | undefined =>
  Array.isArray(id) ? id[0] : id;

// Create Category (Protected)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: { name, description },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category', error });
  }
});

// Get All Active Categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isDeleted: false },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve categories', error });
  }
});

// Get Category By ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = normalizeIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false },
      include: { products: { where: { isDeleted: false } } },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve category', error });
  }
});

// Update Category (Protected)
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = normalizeIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }
    const { name, description } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name, description },
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category', error });
  }
});

// Soft Delete Category (Protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = normalizeIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({
      success: true,
      message: 'Category soft-deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error });
  }
});

export default router;