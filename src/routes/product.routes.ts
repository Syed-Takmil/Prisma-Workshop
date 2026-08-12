import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

// Create Product (Protected)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, stock, categoryId, status } = req.body;
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryId,
        sellerId,
        status,
      },
      include: {
        category: true,
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error });
  }
});

// Get All Active Products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error });
  }
});

// Get Product By ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: true,
        seller: { select: { id: true, name: true, email: true } },
        reviews: {
          where: { isDeleted: false },
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error });
  }
});

// Update Product (Protected)
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rawId = (req as any).params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const updateData = req.body;

    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock, 10);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error });
  }
});

// Soft Delete Product (Protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({
      success: true,
      message: 'Product soft-deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error });
  }
});

export default router;
