import { prisma } from '@/lib/prisma'
import { DealCard } from '@/components/deals/DealCard'
import { CategoryFilter } from '@/components/deals/CategoryFilter'
import { SortFilter } from '@/components/deals/SortFilter'

export const revalidate = 60

export default async function Home() {
  const deals = await prisma.deal.findMany({
    where: { status: 'ACTIVE' },
    include: {
      category: true,
      author: {
        select: { username: true, avatar: true },
      },
      _count: { select: { comments: true } },
    },
    orderBy: { temperature: 'desc' },
    take: 20,
  })

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          🔥 Die heißesten Deals
        </h1>
        <p className="text-white/80 text-lg">
          Entdecke täglich neue Schnäppchen aus der Community
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <CategoryFilter categories={categories} />
        <div className="flex-1" />
        <SortFilter />
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {deals.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">Noch keine Deals vorhanden 🙈</p>
          <p className="mt-2">Sei der Erste und teile ein Schnäppchen!</p>
        </div>
      )}
    </main>
  )
}
