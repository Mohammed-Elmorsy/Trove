import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description:
        'Latest electronic devices, gadgets, and accessories for tech enthusiasts.',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description:
        'Trendy clothing, accessories, and footwear for every style and occasion.',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
    },
    {
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      description:
        'Everything you need to make your home comfortable and functional.',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    },
    {
      name: 'Sports',
      slug: 'sports',
      description:
        'Sports equipment, fitness gear, and outdoor recreation essentials.',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
    },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) => prisma.category.create({ data: category })),
  );

  console.log(`✅ Created ${createdCategories.length} categories`);

  // Get category IDs by slug for easy reference
  const categoryMap = createdCategories.reduce(
    (acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    },
    {} as Record<string, string>,
  );

  // Sample products data
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      description:
        'Premium noise-canceling wireless headphones with 30-hour battery life. Perfect for music lovers and commuters.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      categoryId: categoryMap['electronics'],
      stock: 50,
    },
    {
      name: 'Smart Fitness Watch',
      description:
        'Track your health and fitness goals with GPS, heart rate monitoring, and sleep tracking features.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      categoryId: categoryMap['electronics'],
      stock: 35,
    },
    {
      name: 'Portable Power Bank 20000mAh',
      description:
        'High-capacity portable charger with fast charging support for all your devices on the go.',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5',
      categoryId: categoryMap['electronics'],
      stock: 100,
    },
    {
      name: 'Leather Laptop Backpack',
      description:
        'Stylish and durable leather backpack with padded laptop compartment, perfect for professionals.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
      categoryId: categoryMap['fashion'],
      stock: 45,
    },
    {
      name: 'Stainless Steel Water Bottle',
      description:
        'Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
      categoryId: categoryMap['home-kitchen'],
      stock: 200,
    },
    {
      name: 'Yoga Mat with Carrying Strap',
      description:
        'Premium non-slip yoga mat with extra cushioning for comfort during your workout sessions.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
      categoryId: categoryMap['sports'],
      stock: 75,
    },
    {
      name: 'Wireless Gaming Mouse',
      description:
        'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
      categoryId: categoryMap['electronics'],
      stock: 60,
    },
    {
      name: 'Coffee Maker Machine',
      description:
        'Programmable coffee maker with thermal carafe, brew strength control, and automatic shut-off.',
      price: 79.99,
      imageUrl:
        'https://www.foodandwine.com/thmb/fIx24SkrW650rc_aSk9CHDyiZ6I=/fit-in/1500x2668/filters:no_upscale():max_bytes(150000):strip_icc()/faw-espresso-machines-test-delonghi-stilosa-manual-nsimpson-584-13fa2c1da3644eecabc0f0f20a234773.jpeg',
      categoryId: categoryMap['home-kitchen'],
      stock: 40,
    },
    {
      name: 'Running Shoes',
      description:
        'Lightweight running shoes with cushioned sole and breathable mesh upper for maximum comfort.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      categoryId: categoryMap['sports'],
      stock: 80,
    },
    {
      name: 'Desk Lamp LED',
      description:
        'Modern LED desk lamp with adjustable brightness, touch control, and USB charging port.',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
      categoryId: categoryMap['home-kitchen'],
      stock: 55,
    },
    {
      name: 'Wireless Keyboard and Mouse Combo',
      description:
        'Slim wireless keyboard and mouse set with quiet keys and long battery life.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      categoryId: categoryMap['electronics'],
      stock: 90,
    },
    {
      name: 'Cotton T-Shirt Pack',
      description:
        'Pack of 3 premium cotton t-shirts in assorted colors. Comfortable and durable everyday wear.',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      categoryId: categoryMap['fashion'],
      stock: 120,
    },
    {
      name: 'Bamboo Cutting Board Set',
      description:
        'Set of 3 eco-friendly bamboo cutting boards in different sizes for all your kitchen needs.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1594535182308-8ffefbb661e1',
      categoryId: categoryMap['home-kitchen'],
      stock: 65,
    },
    {
      name: 'Wireless Earbuds',
      description:
        'True wireless earbuds with charging case, touch controls, and crystal-clear sound quality.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
      categoryId: categoryMap['electronics'],
      stock: 110,
    },
    {
      name: 'Resistance Bands Set',
      description:
        'Set of 5 resistance bands with different strength levels, perfect for home workouts.',
      price: 19.99,
      imageUrl:
        'https://blackmountainproducts.com/wp-content/uploads/2015/04/17.jpg',
      categoryId: categoryMap['sports'],
      stock: 150,
    },
    {
      name: 'Sunglasses Polarized',
      description:
        'UV400 polarized sunglasses with lightweight frame and scratch-resistant lenses.',
      price: 44.99,
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
      categoryId: categoryMap['fashion'],
      stock: 85,
    },
    {
      name: 'Blender for Smoothies',
      description:
        'High-speed blender perfect for smoothies, shakes, and frozen drinks. Easy to clean.',
      price: 69.99,
      imageUrl:
        'https://m.media-amazon.com/images/I/71yAShlixcL._AC_UF894,1000_QL80_.jpg',
      categoryId: categoryMap['home-kitchen'],
      stock: 50,
    },
    {
      name: 'Dumbbell Set',
      description:
        'Adjustable dumbbell set with secure locking mechanism. Perfect for strength training at home.',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
      categoryId: categoryMap['sports'],
      stock: 30,
    },
    {
      name: 'Canvas Tote Bag',
      description:
        'Large canvas tote bag with interior pockets. Eco-friendly and perfect for shopping or daily use.',
      price: 19.99,
      imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
      categoryId: categoryMap['fashion'],
      stock: 95,
    },
    {
      name: 'Air Purifier',
      description:
        'HEPA air purifier removes 99.97% of airborne particles. Quiet operation and energy efficient.',
      price: 129.99,
      imageUrl:
        'https://images.philips.com/is/image/philipsconsumer/vrs_2c1ccbaf43a653b580bc03064ed6ba28140b2da9?wid=700&hei=700&$pnglarge$',
      categoryId: categoryMap['home-kitchen'],
      stock: 40,
    },
  ];

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ Created ${products.length} products`);
  console.log(`📦 Categories: ${categories.map((c) => c.name).join(', ')}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
