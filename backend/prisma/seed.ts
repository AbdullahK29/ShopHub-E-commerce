/* eslint-disable @typescript-eslint/no-var-requires */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Category } from '@prisma/client'
import bcrypt from 'bcryptjs'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Missing required environment variable: DATABASE_URL')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
})

async function main() {
  console.log('🌱 Seeding database...')

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'laptops'   }, update: {}, create: { name: 'Laptops',   slug: 'laptops',   description: 'Premium laptops'      } }),
    prisma.category.upsert({ where: { slug: 'audio'     }, update: {}, create: { name: 'Audio',     slug: 'audio',     description: 'Headphones & speakers' } }),
    prisma.category.upsert({ where: { slug: 'phones'    }, update: {}, create: { name: 'Phones',    slug: 'phones',    description: 'Smartphones'           } }),
    prisma.category.upsert({ where: { slug: 'tablets'   }, update: {}, create: { name: 'Tablets',   slug: 'tablets',   description: 'Tablets & iPads'       } }),
    prisma.category.upsert({ where: { slug: 'wearables' }, update: {}, create: { name: 'Wearables', slug: 'wearables', description: 'Smartwatches & bands'  } }),
    prisma.category.upsert({ where: { slug: 'monitors'  }, update: {}, create: { name: 'Monitors',  slug: 'monitors',  description: 'Displays & monitors'   } }),
  ])

  const adminHash    = await bcrypt.hash('admin123',    12)
  const customerHash = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.upsert({
    where:  { email: 'admin@shophub.com' },
    update: {},
    create: {
      email: 'admin@shophub.com', passwordHash: adminHash,
      firstName: 'Admin', lastName: 'ShopHub',
      role: 'ADMIN', isEmailVerified: true,
    },
  })

  await prisma.user.upsert({
    where:  { email: 'demo@shophub.com' },
    update: {},
    create: {
      email: 'demo@shophub.com', passwordHash: customerHash,
      firstName: 'Abdullah', lastName: 'Khan',
      role: 'CUSTOMER', isEmailVerified: true,
    },
  })

const productsData = [
  // Laptops
  { name: 'Apple MacBook Pro 14" M3',    description: 'The most powerful MacBook Pro. M3 chip, Liquid Retina XDR display, 22hr battery.',    price: 1999, discountPrice: 1799, stock: 12, categorySlug: 'laptops',   sku: 'MBP-14-M3',        rating: 4.8, reviewCount: 2341,  images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'] },
  { name: 'Dell XPS 15 OLED',            description: 'Stunning OLED display, Intel Core i9, 32GB RAM. The professional\'s choice.',          price: 1799, discountPrice: null,  stock: 7,  categorySlug: 'laptops',   sku: 'DELL-XPS-15-OLED', rating: 4.6, reviewCount: 1204,  images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'] },
  { name: 'ASUS ROG Zephyrus G14',       description: 'AMD Ryzen 9 + RTX 4060. Ultra-slim gaming laptop under 1.65kg.',                      price: 1499, discountPrice: 1299, stock: 5,  categorySlug: 'laptops',   sku: 'ASUS-ROG-G14',     rating: 4.7, reviewCount: 876,   images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'] },
  // Audio
  { name: 'Sony WH-1000XM5',             description: 'Industry-leading noise canceling. 30hr battery, crystal clear calls.',                  price: 399,  discountPrice: null,  stock: 3,  categorySlug: 'audio',     sku: 'SONY-WH-XM5',      rating: 4.6, reviewCount: 8920,  images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'] },
  { name: 'Apple AirPods Pro 2',          description: 'H2 chip, Active Noise Cancellation, Adaptive Audio, up to 30hr battery.',              price: 249,  discountPrice: 229,   stock: 25, categorySlug: 'audio',     sku: 'APP-AIRPODS-PRO2', rating: 4.8, reviewCount: 12400, images: ['https://images.unsplash.com/photo-1588423771073-b8903fead714?w=800'] },
  { name: 'Bose QuietComfort 45',         description: 'Legendary Bose noise cancellation. 24hr battery, comfortable all-day wear.',           price: 329,  discountPrice: 279,   stock: 9,  categorySlug: 'audio',     sku: 'BOSE-QC45',        rating: 4.5, reviewCount: 5670,  images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'] },
  // Phones
  { name: 'iPhone 15 Pro Max 256GB',      description: 'Titanium design. A17 Pro chip. 48MP camera with 5x optical zoom.',                    price: 1199, discountPrice: 1099,  stock: 0,  categorySlug: 'phones',    sku: 'IPH-15-PM-256',    rating: 4.9, reviewCount: 15430, images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800'] },
  { name: 'Samsung Galaxy S24 Ultra',     description: '200MP camera, built-in S Pen, 5000mAh battery, titanium frame.',                      price: 1299, discountPrice: null,  stock: 14, categorySlug: 'phones',    sku: 'SAM-S24-ULTRA',    rating: 4.7, reviewCount: 9870,  images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'] },
  { name: 'Google Pixel 8 Pro',           description: 'Tensor G3 chip, 7 years of updates, best computational photography on Android.',       price: 999,  discountPrice: 899,   stock: 18, categorySlug: 'phones',    sku: 'GOOG-PIX-8PRO',    rating: 4.6, reviewCount: 4320,  images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800'] },
  // Tablets
  { name: 'iPad Pro 12.9" M2',            description: 'The ultimate iPad with M2 chip and Liquid Retina XDR display.',                       price: 1099, discountPrice: 999,   stock: 15, categorySlug: 'tablets',   sku: 'IPAD-PRO-12-M2',   rating: 4.7, reviewCount: 4210,  images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'] },
  { name: 'Samsung Galaxy Tab S9',        description: 'AMOLED display, Snapdragon 8 Gen 2, IP68 water resistant, S Pen included.',           price: 799,  discountPrice: 729,   stock: 11, categorySlug: 'tablets',   sku: 'SAM-TAB-S9',       rating: 4.5, reviewCount: 3120,  images: ['https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800'] },
  // Wearables
  { name: 'Apple Watch Ultra 2',          description: 'The most rugged Apple Watch. Titanium case, precision GPS, 60hr battery.',             price: 799,  discountPrice: null,  stock: 20, categorySlug: 'wearables', sku: 'AW-ULTRA-2',       rating: 4.9, reviewCount: 6540,  images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'] },
  { name: 'Samsung Galaxy Watch 6',       description: 'Advanced health tracking, sleep coaching, BioActive sensor, 40hr battery.',            price: 299,  discountPrice: 259,   stock: 17, categorySlug: 'wearables', sku: 'SAM-GW6',          rating: 4.4, reviewCount: 2980,  images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'] },
  // Monitors
  { name: 'LG UltraWide 34" Monitor',    description: '34" 21:9 curved QHD. 160Hz, 1ms response, G-Sync compatible.',                       price: 599,  discountPrice: 499,   stock: 9,  categorySlug: 'monitors',  sku: 'LG-UW-34-QHD',     rating: 4.6, reviewCount: 2890,  images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'] },
  { name: 'Dell 4K 27" USB-C Monitor',   description: '4K IPS panel, 99% sRGB, USB-C 90W charging, adjustable stand.',                      price: 499,  discountPrice: 449,   stock: 12, categorySlug: 'monitors',  sku: 'DELL-27-4K',       rating: 4.7, reviewCount: 1650,  images: ['https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800'] },
]

  for (const p of productsData) {
    const category = categories.find((c: Category) => c.slug === p.categorySlug)!
    await prisma.product.upsert({
      where:  { sku: p.sku },
      update: {},
      create: {
        name: p.name, description: p.description,
        price: p.price,
        ...(p.discountPrice ? { discountPrice: p.discountPrice } : {}),
        stockQuantity: p.stock,
        categoryId: category.id, vendorId: admin.id,
        images: p.images, sku: p.sku,
        rating: p.rating, reviewCount: p.reviewCount,
      },
    })
  }

  console.log('✅ Database seeded successfully')
}

main()
  .catch((e: Error) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())