import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, TrendingDown, Bell, ExternalLink, Store } from 'lucide-react'
import { PriceChart } from '@/components/compare/PriceChart'
import { PriceAlertButton } from '@/components/compare/PriceAlertButton'

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      prices: {
        orderBy: { price: 'asc' },
      },
      deals: {
        where: { status: 'ACTIVE' },
        include: {
          category: true,
          author: { select: { username: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!product) notFound()

  // Get price history for chart
  const priceHistory = await prisma.priceHistory.findMany({
    where: { productId: params.id },
    orderBy: { recordedAt: 'asc' },
    take: 30,
  })

  const lowestPrice = product.prices[0]
  const highestPrice = product.prices[product.prices.length - 1]
  const avgPrice = product.prices.length > 0 
    ? product.prices.reduce((sum, p) => sum + p.price, 0) / product.prices.length 
    : 0

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      {/* Back Link */}
      <Link
        href="/compare"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Vergleich
      </Link>

      {/* Product Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="md:flex gap-6">
          {/* Image */}
          <div className="md:w-1/3 mb-4 md:mb-0">
            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <Package className="w-24 h-24 text-gray-300" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:w-2/3">
            {product.brand && (
              <span className="text-sm text-gray-500">{product.brand}</span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            
            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
            )}

            {/* Price Stats */}
            {lowestPrice && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm text-green-600 mb-1">Günstigster</div>
                  <div className="text-xl font-bold text-green-700">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: lowestPrice.currency,
                    }).format(lowestPrice.price)}
                  </div>
                  <div className="text-xs text-green-600">{lowestPrice.merchant}</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Durchschnitt</div>
                  <div className="text-xl font-bold text-gray-700">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(avgPrice)}
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-4">
                  <div className="text-sm text-red-600 mb-1">Höchster</div>
                  <div className="text-xl font-bold text-red-700">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: highestPrice?.currency || 'EUR',
                    }).format(highestPrice?.price || 0)}
                  </div>
                </div>
              </div>
            )}

            {/* Alert Button */}
            <PriceAlertButton productId={product.id} currentPrice={lowestPrice?.price} />
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      {priceHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Preisverlauf
          </h2>
          <PriceChart data={priceHistory} />
        </div>
      )}

      {/* Price Comparison Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Store className="w-5 h-5" />
          Aktuelle Angebote ({product.prices.length})
        </h2>

        <div className="space-y-3">
          {product.prices.map((price, index) => (
            <div
              key={price.id}
              className={`flex items-center justify-between p-4 rounded-xl ${
                index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{price.merchant}</div>
                  <div className="text-sm text-gray-500">
                    {price.inStock ? 'Auf Lager' : 'Nicht verfügbar'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: price.currency,
                    }).format(price.price)}
                  </div>
                  {price.shipping && (
                    <div className="text-sm text-gray-500">
                      + {price.shipping}€ Versand
                    </div>
                  )}
                </div>

                <a
                  href={price.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
                >
                  Zum Shop
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Deals */}
      {product.deals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Aktive Deals</h2>
          
          <div className="space-y-3">
            {product.deals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div>
                  <div className="font-medium">{deal.title}</div>
                  <div className="text-sm text-gray-500">
                    von {deal.author.username} • {deal.category.name}
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: deal.currency,
                  }).format(deal.price)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
