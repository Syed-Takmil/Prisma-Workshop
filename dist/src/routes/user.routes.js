"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
// @ts-ignore
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Get Logged-in User Profile
router.get('/me', auth_1.authenticate, async (req, res) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: req.user?.id },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json({ success: true, message: 'User profile retrieved', data: user });
});
// Get All Users (Admin)
router.get('/', auth_1.authenticate, async (_req, res) => {
    const users = await prisma_1.default.user.findMany({
        where: { isDeleted: false },
        select: { id: true, name: true, email: true, role: true },
    });
    res.json({ success: true, message: 'Users retrieved successfully', data: users });
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map