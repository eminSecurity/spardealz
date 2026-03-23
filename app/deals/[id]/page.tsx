import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate, calculateDiscount } from '@/lib/utils'
import { ExternalLink, Share2 } from 'lucide-react'
import Link from 'next/link'
import { VoteButtons } from '@/components/deals/VoteButtons'
import { CommentSection } from '@/components/deals/CommentSection'

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

            {/* Vote Buttons */}
            <div className="flex items-center gap-4 mb-6">
              <VoteButtons
                dealId={deal.id}
                initialVotes={deal.voteCount}
                initialTemperature={deal.temperature}
              />
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

      {/* Comments - Client Component */}
      <div className="mt-6">
        <CommentSection 
          dealId={deal.id} 
          initialComments={deal.comments.map(c => ({
            ...c,
            createdAt: c.createdAt.toISOString() as unknown as Date
          }))} 
        />
      </div>
    </main>
  )
}
