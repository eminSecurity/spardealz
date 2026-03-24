import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'iPhone 15 Pro 256GB',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    description: 'Das neue iPhone 15 Pro mit Titanium-Design und A17 Pro Chip.',
    imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600',
    specs: { storage: '256GB', color: 'Titanium', display: '6.1"' },
    prices: [
      { merchant: 'Apple Store', price: 1299, shipping: 0 },
      { merchant: 'Media Markt', price: 1249, shipping: 5.99 },
      { merchant: 'Saturn', price: 1259, shipping: 5.99 },
      { merchant: 'Amazon', price: 1199, shipping: 0 },
      { merchant: 'Otto', price: 1279, shipping: 0 },
    ],
  },
  {
    name: 'PlayStation 5 Slim',
    brand: 'Sony',
    model: 'PS5 Slim',
    description: 'Die nächste Generation Gaming - jetzt schlanker.',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600',
    specs: { storage: '1TB', edition: 'Standard' },
    prices: [
      { merchant: 'Media Markt', price: 549, shipping: 0 },
      { merchant: 'Saturn', price: 549, shipping: 0 },
      { merchant: 'Amazon', price: 529, shipping: 0 },
      { merchant: 'GameStop', price: 559, shipping: 4.99 },
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    description: 'Flagship mit 200MP Kamera und S Pen.',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
    specs: { storage: '256GB', color: 'Titanium Gray', display: '6.8"' },
    prices: [
      { merchant: 'Samsung', price: 1299, shipping: 0 },
      { merchant: 'Media Markt', price: 1199, shipping: 5.99 },
      { merchant: 'Amazon', price: 1149, shipping: 0 },
      { merchant: 'Otto', price: 1249, shipping: 0 },
    ],
  },
  {
    name: 'MacBook Air M3',
    brand: 'Apple',
    model: 'MacBook Air',
    description: 'Leicht, schnell, beeindruckend - jetzt mit M3 Chip.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    specs: { chip: 'M3', ram: '8GB', storage: '256GB', display: '13.6"' },
    prices: [
      { merchant: 'Apple Store', price: 1299, shipping: 0 },
      { merchant: 'Amazon', price: 1199, shipping: 0 },
      { merchant: 'Media Markt', price: 1249, shipping: 5.99 },
      { merchant: 'Notebooksbilliger', price: 1179, shipping: 0 },
    ],
  },
  {
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    model: 'WH-1000XM5',
    description: 'Premium Noise Cancelling Kopfhörer.',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
    specs: { color: 'Black', connectivity: 'Bluetooth 5.2' },
    prices: [
      { merchant: 'Amazon', price: 299, shipping: 0 },
      { merchant: 'Media Markt', price: 329, shipping: 5.99 },
      { merchant: 'Saturn', price: 319, shipping: 5.99 },
      { merchant: 'Sony', price: 349, shipping: 0 },
    ],
  },
]

async function seedProducts() {
  console.log('🌱 Seeding products...')

  // Clear existing products first
  await prisma.priceHistory.deleteMany({})
  await prisma.product.deleteMany({})

  for (const productData of products) {
    const { prices, ...productInfo } = productData

    // Create product
    const product = await prisma.product.create({
      data: productInfo,
    })

    console.log(`✅ Product: ${product.name}`)

    // Create prices with some history
    for (const priceData of prices) {
      await prisma.priceHistory.create({
        data: {
          ...priceData,
          productId: product.id,
          currency: 'EUR',
          url: `https://${priceData.merchant.toLowerCase().replace(/\s/g, '')}.de`,
        },
      })

      // Add some historical prices (simulating price drops)
      const daysAgo = Math.floor(Math.random() * 30)
      const oldPrice = priceData.price * (1 + Math.random() * 0.2)
      
      await prisma.priceHistory.create({
        data: {
          ...priceData,
          price: Math.round(oldPrice),
          productId: product.id,
          currency: 'EUR',
          url: `https://${priceData.merchant.toLowerCase().replace(/\s/g, '')}.de`,
          recordedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      })
    }
  }

  console.log('🎉 Products seeded!')
}

seedProducts()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
