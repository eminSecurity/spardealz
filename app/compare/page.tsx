import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Search, TrendingDown, Package } from 'lucide-react'

export const revalidate = 60

export default async function ComparePage() {
  const products = await prisma.product.findMany({
    include: {
      prices: {
        orderBy: { price: 'asc' },
        take: 1,
      },
      _count: { select: { deals: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary-900 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          📊 Preisvergleich
        </h1>
        <p className="text-white/80 text-lg">
          Finde die besten Preise und verfolge Preisentwicklungen
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Produkt suchen (z.B. iPhone 15, PlayStation 5)..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const lowestPrice = product.prices[0]
          return (
            <Link
              key={product.id}
              href={`/compare/${product.id}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                  {product.brand && (
                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  )}
                  
                  {lowestPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('de-DE', {
                          style: 'currency',
                          currency: lowestPrice.currency,
                        }).format(lowestPrice.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        bei {lowestPrice.merchant}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400">Keine Preise verfügbar</p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" />
                      {product.prices.length} Angebote
                    </span>
                    {product._count.deals > 0 && (
                      <span>{product._count.deals} Deals</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl">Noch keine Produkte im Vergleich</p>
          <p className="mt-2">Füge Produkte hinzu, um Preise zu vergleichen</p>
        </div>
      )}
    </main>
  )
}
