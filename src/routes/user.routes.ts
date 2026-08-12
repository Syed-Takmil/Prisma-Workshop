


// src/routes/user.routes.ts
// @ts-ignore
import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

// Get Logged-in User Profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  res.json({ success: true, message: 'User profile retrieved', data: user });
});

// Get All Users (Admin)
router.get('/', authenticate, async (_req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json({ success: true, message: 'Users retrieved successfully', data: users });
});

export default router;