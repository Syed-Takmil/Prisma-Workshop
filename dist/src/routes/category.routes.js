"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const normalizeIdParam = (id) => Array.isArray(id) ? id[0] : id;
// Create Category (Protected)
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await prisma_1.default.category.create({
            data: { name, description },
        });
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create category', error });
    }
});
// Get All Active Categories
router.get('/', async (_req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve categories', error });
    }
});
// Get Category By ID
router.get('/:id', async (req, res) => {
    try {
        const id = normalizeIdParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Invalid category id' });
        }
        const category = await prisma_1.default.category.findFirst({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve category', error });
    }
});
// Update Category (Protected)
router.patch('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const id = normalizeIdParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Invalid category id' });
        }
        const { name, description } = req.body;
        const category = await prisma_1.default.category.update({
            where: { id },
            data: { name, description },
        });
        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update category', error });
    }
});
// Soft Delete Category (Protected)
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const id = normalizeIdParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Invalid category id' });
        }
        await prisma_1.default.category.update({
            where: { id },
            data: { isDeleted: true },
        });
        res.json({
            success: true,
            message: 'Category soft-deleted successfully',
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete category', error });
    }
});
exports.default = router;
//# sourceMappingURL=category.routes.js.map