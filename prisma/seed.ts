import { PrismaClient, UserRole, ProductStatus } from '@prisma/client';

declare module 'bcrypt';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: UserRole.CUSTOMER,
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
      status: ProductStatus.IN_STOCK,
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
      status: ProductStatus.IN_STOCK,
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