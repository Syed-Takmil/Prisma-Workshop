// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import reviewRoutes from './review.routes';
import userRoutes from './user.routes'; // 1. Import user routes

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes); // 2. Mount user routes

export default router;