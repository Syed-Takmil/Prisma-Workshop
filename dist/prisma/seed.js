"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding...');
    // 1. Clean existing data (Optional)
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    // 2. Hash default password
    const hashedPassword = await bcrypt.hash('password123', 10);
    // 3. Create Admin & Customer Users
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: client_1.UserRole.ADMIN,
        },
    });
    const customer = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword,
            role: client_1.UserRole.CUSTOMER,
        },
    });
    console.log(`Users created: Admin (${admin.email}), Customer (${customer.email})`);
    // 4. Create Categories
    const electronics = await prisma.category.create({
        data: {
            name: 'Electronics',
            description: 'Gadgets, devices, and accessories',
        },
    });
    const clothing = await prisma.category.create({
        data: {
            name: 'Clothing',
            description: 'Apparel, footwear, and fashion',
        },
    });
    console.log('Categories created: Electronics, Clothing');
    // 5. Create Sample Products
    const product1 = await prisma.product.create({
        data: {
            title: 'Wireless Mechanical Keyboard',
            description: 'Compact RGB mechanical keyboard with tactile switches.',
            price: 89.99,
            stock: 25,
            status: client_1.ProductStatus.IN_STOCK,
            categoryId: electronics.id,
            sellerId: admin.id,
        },
    });
    const product2 = await prisma.product.create({
        data: {
            title: 'Cotton Hoodie',
            description: 'Comfortable premium cotton pullover hoodie.',
            price: 45.00,
            stock: 50,
            status: client_1.ProductStatus.IN_STOCK,
            categoryId: clothing.id,
            sellerId: admin.id,
        },
    });
    console.log(`Products created: ${product1.title}, ${product2.title}`);
    // 6. Create Sample Review
    await prisma.review.create({
        data: {
            rating: 5,
            comment: 'Excellent keyboard! Fast connection and great build quality.',
            userId: customer.id,
            productId: product1.id,
        },
    });
    console.log('Review created successfully.');
    console.log('Seeding finished.');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map