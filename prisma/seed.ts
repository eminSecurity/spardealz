import { PrismaClient, Role, DealStatus } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Elektronik', slug: 'elektronik', icon: 'Smartphone', description: 'Smartphones, Laptops, Tablets & mehr' },
  { name: 'Haushalt', slug: 'haushalt', icon: 'Home', description: 'Küche, Bad, Reinigung & Wohnen' },
  { name: 'Fashion', slug: 'fashion', icon: 'Shirt', description: 'Kleidung, Schuhe & Accessoires' },
  { name: 'Gaming', slug: 'gaming', icon: 'Gamepad', description: 'Konsolen, Games & Zubehör' },
  { name: 'Supermarkt', slug: 'supermarkt', icon: 'ShoppingCart', description: 'Lebensmittel & Drogerie' },
]

const tags = [
  { name: 'iPhone', slug: 'iphone' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Nike', slug: 'nike' },
  { name: 'PlayStation', slug: 'playstation' },
  { name: 'Xbox', slug: 'xbox' },
  { name: 'Nintendo', slug: 'nintendo' },
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Media Markt', slug: 'media-markt' },
]

const deals = [
  // Elektronik
  { title: 'iPhone 15 Pro 256GB', description: 'Das neue iPhone 15 Pro mit Titanium-Design und A17 Pro Chip.', price: 849, originalPrice: 999, merchant: 'Media Markt', category: 'elektronik', tags: ['iphone'], imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600', temp: 245 },
  { title: 'Samsung Galaxy S24 Ultra', description: 'Flagship mit 200MP Kamera und S Pen.', price: 999, originalPrice: 1299, merchant: 'Saturn', category: 'elektronik', tags: ['samsung'], imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', temp: 189 },
  { title: 'Sony WH-1000XM5', description: 'Premium Noise Cancelling Kopfhörer.', price: 299, originalPrice: 399, merchant: 'Amazon', category: 'elektronik', tags: [], imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', temp: 156 },
  { title: 'MacBook Air M3', description: 'Leicht, schnell, beeindruckend - jetzt mit M3 Chip.', price: 1149, originalPrice: 1299, merchant: 'Apple Store', category: 'elektronik', tags: [], imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', temp: 312 },
  { title: 'iPad Air 11" M2', description: 'Vielseitig wie immer. Fähiger als je zuvor.', price: 599, originalPrice: 699, merchant: 'Media Markt', category: 'elektronik', tags: ['iphone'], imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', temp: 98 },
  // Haushalt
  { title: 'Dyson V15 Detect Absolute', description: 'Kabelloser Staubsauger mit Laser-Dust-Detection.', price: 499, originalPrice: 699, merchant: 'Otto', category: 'haushalt', tags: [], imageUrl: 'https://images.unsplash.com/photo-1558317374-a3519ff44335?w=600', temp: 178 },
  { title: 'Nespresso Vertuo Next', description: 'Kaffeemaschine für verschiedene Tassengrößen.', price: 99, originalPrice: 199, merchant: 'Nespresso', category: 'haushalt', tags: [], imageUrl: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=600', temp: 134 },
  { title: 'Bosch Serie 8 Waschmaschine', description: '9kg, 1400 U/min, Home Connect.', price: 599, originalPrice: 799, merchant: 'Amazon', category: 'haushalt', tags: [], imageUrl: 'https://images.unsplash.com/photo-1626806775351-538d9fe13ae4?w=600', temp: 67 },
  // Fashion
  { title: 'Nike Air Max 90', description: 'Legendärer Style, maximale Dämpfung.', price: 89, originalPrice: 149, merchant: 'Nike Store', category: 'fashion', tags: ['nike'], imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', temp: 423 },
  { title: 'Adidas Ultraboost 22', description: 'Energierückführung auf höchstem Niveau.', price: 119, originalPrice: 179, merchant: 'Adidas', category: 'fashion', tags: [], imageUrl: 'https://images.unsplash.com/photo-1584539696499-12a16837a30f?w=600', temp: 267 },
  { title: 'The North Face Puffer Jacket', description: 'Daunenjacke für kalte Tage.', price: 199, originalPrice: 299, merchant: 'Zalando', category: 'fashion', tags: [], imageUrl: 'https://images.unsplash.com/photo-1545594861-3bef43ff22f7?w=600', temp: 145 },
  // Gaming
  { title: 'PlayStation 5 Slim', description: 'Die nächste Generation Gaming.', price: 449, originalPrice: 549, merchant: 'Media Markt', category: 'gaming', tags: ['playstation'], imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600', temp: 892 },
  { title: 'Xbox Series X', description: 'Das schnellste, leistungsstärkste Xbox.', price: 429, originalPrice: 499, merchant: 'Saturn', category: 'gaming', tags: ['xbox'], imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600', temp: 345 },
  { title: 'Nintendo Switch OLED', description: 'Spiele überall mit lebhaften Farben.', price: 299, originalPrice: 349, merchant: 'Amazon', category: 'gaming', tags: ['nintendo'], imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6f1e6d9c9?w=600', temp: 567 },
  // Supermarkt
  { title: 'Persil Universal 4kg', description: 'Vollwaschmittel für strahlende Sauberkeit.', price: 14, originalPrice: 24, merchant: 'Amazon', category: 'supermarkt', tags: ['amazon'], imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600', temp: 45 },
  { title: 'Nescafé Gold 200g', description: 'Premium Löslicher Kaffee.', price: 4, originalPrice: 8, merchant: 'Rewe', category: 'supermarkt', tags: [], imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600', temp: 34 },
  { title: 'Coca-Cola 12x1L', description: 'Erfrischend im Multipack.', price: 9, originalPrice: 15, merchant: 'Getränkemarkt', category: 'supermarkt', tags: [], imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600', temp: 78 },
  { title: 'Fairy Ultra Konzentrat', description: 'Spülmittel mit bis zu 50% mehr Kraft.', price: 2, originalPrice: 4, merchant: 'dm', category: 'supermarkt', tags: [], imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600', temp: 23 },
  { title: 'Tempur Kissen Original', description: 'Anatomisches Nackenstützkissen.', price: 79, originalPrice: 119, merchant: 'Mömax', category: 'haushalt', tags: [], imageUrl: 'https://images.unsplash.com/photo-1584109504429-28d7eb404b13?w=600', temp: 56 },
]

async function main() {
  console.log('🌱 Starte Seeding...')

  // Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Kategorien erstellt')

  // Tags
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }
  console.log('✅ Tags erstellt')

  // Demo Users
  const users = [
    { email: 'admin@spardealz.de', username: 'admin', name: 'Administrator', role: Role.ADMIN, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
    { email: 'mod@spardealz.de', username: 'moderator', name: 'Moderator', role: Role.MODERATOR, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mod' },
    { email: 'user1@spardealz.de', username: 'dealhunter', name: 'Deal Hunter', role: Role.USER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' },
    { email: 'user2@spardealz.de', username: 'schnapper', name: 'Der Schnapper', role: Role.USER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2' },
    { email: 'user3@spardealz.de', username: 'sparfuchs', name: 'Sparfuchs', role: Role.USER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3' },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }
  console.log('✅ Demo-User erstellt')

  // Deals
  const dbUsers = await prisma.user.findMany()
  const dbCategories = await prisma.category.findMany()
  const dbTags = await prisma.tag.findMany()

  for (const deal of deals) {
    const category = dbCategories.find(c => c.slug === deal.category)
    if (!category) continue

    const tagIds = deal.tags
      .map(t => dbTags.find(dt => dt.slug === t)?.id)
      .filter(Boolean) as string[]

    await prisma.deal.create({
      data: {
        title: deal.title,
        description: deal.description,
        price: deal.price,
        originalPrice: deal.originalPrice,
        merchant: deal.merchant,
        productUrl: `https://${deal.merchant.toLowerCase().replace(/\s/g, '')}.de/produkt`,
        imageUrl: deal.imageUrl,
        temperature: deal.temp,
        voteCount: Math.floor(deal.temp / 10),
        status: DealStatus.ACTIVE,
        categoryId: category.id,
        authorId: dbUsers[Math.floor(Math.random() * dbUsers.length)].id,
        tags: { connect: tagIds.map(id => ({ id })) },
      },
    })
  }
  console.log(`✅ ${deals.length} Demo-Deals erstellt`)

  console.log('🎉 Seeding abgeschlossen!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
