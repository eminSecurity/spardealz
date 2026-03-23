import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (!q || q.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query too short' },
        { status: 400 }
      )
    }

    const deals = await prisma.deal.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { merchant: { contains: q, mode: 'insensitive' } },
        ],
      },
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

    return NextResponse.json({
      success: true,
      data: deals,
      meta: { query: q, count: deals.length },
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search' },
      { status: 500 }
    )
  }
}
