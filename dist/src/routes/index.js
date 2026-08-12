"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const user_routes_1 = __importDefault(require("./user.routes")); // 1. Import user routes
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/categories', category_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/reviews', review_routes_1.default);
router.use('/users', user_routes_1.default); // 2. Mount user routes
exports.default = router;
//# sourceMappingURL=index.js.map