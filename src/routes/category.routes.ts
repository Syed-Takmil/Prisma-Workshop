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

    // Fix 1: Explicit validation for missing/empty name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required and must be a non-empty string',
      });
    }

    // Fix 2: Prevent unhandled Prisma unique constraint crash
    const existingCategory = await prisma.category.findUnique({
      where: { name: name.trim() },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error?.message || error,
    });
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

    return res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error?.message || error,
    });
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

    return res.json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve category',
      error: error?.message || error,
    });
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

    // Check if category exists before updating
    const existingCategory = await prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description }),
      },
    });

    return res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error?.message || error,
    });
  }
});

// Soft Delete Category (Protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = normalizeIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const existingCategory = await prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });

    return res.json({
      success: true,
      message: 'Category soft-deleted successfully',
      data: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error?.message || error,
    });
  }
});

export default router;