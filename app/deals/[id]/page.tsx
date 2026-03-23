import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate, calculateDiscount } from '@/lib/utils'
import { Flame, Clock, MessageCircle, ExternalLink, Share2 } from 'lucide-react'
import Link from 'next/link'

interface DealPageProps {
  params: { id: string }
}

export default async function DealPage({ params }: DealPageProps) {
  const deal = await prisma.deal.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      author: { select: { username: true, avatar: true } },
      comments: {
        include: { author: { select: { username: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!deal) notFound()

  const discount = calculateDiscount(deal.price, deal.originalPrice || undefined)

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${deal.category.slug}`} className="hover:text-primary">
          {deal.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{deal.title}</span>
      </nav>

      {/* Deal Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-2/5 bg-gray-50 relative">
            {deal.imageUrl ? (
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="w-full h-64 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-full flex items-center justify-center text-gray-400">
                Kein Bild
              </div>
            )}
            {discount && (
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full font-bold">
                -{discount}%
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 md:w-3/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-500">{deal.merchant}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">{formatDate(deal.createdAt)}</span>
            </div>

            <h1 className="text-2xl font-bold mb-4">{deal.title}</h1>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">{formatPrice(deal.price)}</span>
              {deal.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(deal.originalPrice)}
                </span>
              )}
            </div>

            {/* Temperature */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                deal.temperature >= 100 ? 'bg-green-100 text-green-700' :
                deal.temperature >= 0 ? 'bg-gray-100 text-gray-700' :
                'bg-red-100 text-red-700'
              }`}>
                <Flame className="w-4 h-4" />
                <span className="font-semibold">{deal.temperature}°</span>
              </div>
              <span className="text-sm text-gray-500">{deal.voteCount} Votes</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <a
                href={deal.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Zum Angebot
                <ExternalLink className="w-4 h-4" />
              </a>
              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-3">Beschreibung</h2>
        <p className="text-gray-600 leading-relaxed">{deal.description}</p>
      </div>

      {/* Comments */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Kommentare ({deal.comments.length})
        </h2>

        {deal.comments.length > 0 ? (
          <div className="space-y-4">
            {deal.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                <img
                  src={comment.author.avatar || '/avatar-default.png'}
                  alt={comment.author.username}
                  className="w-10 h-10 rounded-full bg-gray-100"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.author.username}</span>
                    <span className="text-sm text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Noch keine Kommentare. Sei der Erste! 🚀</p>
        )}
      </div>
    </main>
  )
}
