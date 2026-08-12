"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Create Review (Protected)
router.post('/', auth_1.authenticate, async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const review = await prisma_1.default.review.create({
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
    }
    catch (error) {
        next(error);
    }
});
// Get Reviews for a Specific Product
router.get('/product/:productId', async (req, res, next) => {
    try {
        const rawProductId = req.params.productId;
        const productId = Array.isArray(rawProductId) ? rawProductId[0] : rawProductId;
        const reviews = await prisma_1.default.review.findMany({
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
    }
    catch (error) {
        next(error);
    }
});
// Get Review By ID
router.get('/:id', async (req, res, next) => {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const review = await prisma_1.default.review.findFirst({
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
    }
    catch (error) {
        next(error);
    }
});
// Soft Delete Review (Protected)
router.delete('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        await prisma_1.default.review.update({
            where: { id },
            data: { isDeleted: true },
        });
        res.json({
            success: true,
            message: 'Review soft-deleted successfully',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=review.routes.js.map