import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

// Create Review (Protected)
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { rating, comment, productId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        productId,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, title: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

// Get Reviews for a Specific Product
router.get('/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawProductId = req.params.productId;
    const productId = Array.isArray(rawProductId) ? rawProductId[0] : rawProductId;

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isDeleted: false,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'Product reviews retrieved successfully',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

// Get Review By ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    const review = await prisma.review.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, title: true } },
      },
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review retrieved successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

// Soft Delete Review (Protected)
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    await prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({
      success: true,
      message: 'Review soft-deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

export default router;