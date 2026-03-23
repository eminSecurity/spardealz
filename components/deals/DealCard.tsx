'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { formatPrice, formatDate, calculateDiscount } from '@/lib/utils'
import { VoteButtons } from './VoteButtons'

interface DealCardProps {
  deal: {
    id: string
    title: string
    price: number
    originalPrice: number | null
    imageUrl: string | null
    merchant: string
    temperature: number
    voteCount: number
    createdAt: Date
    category: { name: string; slug: string }
    author: { username: string; avatar: string | null }
    _count: { comments: number }
  }
}

export function DealCard({ deal }: DealCardProps) {
  const discount = calculateDiscount(deal.price, deal.originalPrice || undefined)

  return (
    <Link href={`/deals/${deal.id}`} className="deal-card block">
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-50">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              Kein Bild
            </div>
          )}
          
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-3 left-3 bg-primary text-white text-sm font-bold px-2 py-1 rounded-lg">
              -{discount}%
            </div>
          )}

          {/* Category */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-lg">
            {deal.category.name}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{deal.title}</h3>
          </div>

          {/* Merchant & Time */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>{deal.merchant}</span>
            <span className="text-gray-300">•</span>
            <span>{formatDate(deal.createdAt)}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-primary">{formatPrice(deal.price)}</span>
            {deal.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(deal.originalPrice)}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Vote Buttons */}
              <VoteButtons 
                dealId={deal.id}
                initialVotes={deal.voteCount}
                initialTemperature={deal.temperature}
              />

              {/* Comments */}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span>{deal._count.comments}</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                {deal.author.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500">{deal.author.username}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
