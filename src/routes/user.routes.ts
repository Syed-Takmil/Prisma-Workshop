import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

// Get Logged-in User Profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error?.message || error,
    });
  }
});

// Get All Users (Admin Only)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Role check for Admin authorization
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin access required',
      });
    }

    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error?.message || error,
    });
  }
});

export default router;