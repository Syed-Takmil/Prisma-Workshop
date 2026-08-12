"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Create Product (Protected)
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { title, description, price, stock, categoryId, status } = req.body;
        const sellerId = req.user?.id;
        if (!sellerId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const product = await prisma_1.default.product.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create product', error });
    }
});
// Get All Active Products
router.get('/', async (_req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error });
    }
});
// Get Product By ID
router.get('/:id', async (req, res) => {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const product = await prisma_1.default.product.findFirst({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch product', error });
    }
});
// Update Product (Protected)
router.patch('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const updateData = req.body;
        if (updateData.price)
            updateData.price = parseFloat(updateData.price);
        if (updateData.stock)
            updateData.stock = parseInt(updateData.stock, 10);
        const product = await prisma_1.default.product.update({
            where: { id },
            data: updateData,
        });
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update product', error });
    }
});
// Soft Delete Product (Protected)
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        await prisma_1.default.product.update({
            where: { id },
            data: { isDeleted: true },
        });
        res.json({
            success: true,
            message: 'Product soft-deleted successfully',
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product', error });
    }
});
exports.default = router;
//# sourceMappingURL=product.routes.js.map