import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'hot'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    let orderBy: any = { temperature: 'desc' }
    if (sort === 'new') orderBy = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }

    const where: any = { status: 'ACTIVE' }
    if (category) {
      where.category = { slug: category }
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        include: {
          category: true,
          author: {
            select: { username: true, avatar: true },
          },
          _count: { select: { comments: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.deal.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: deals,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, originalPrice, merchant, categoryId, productUrl, imageUrl } = body

    if (!title || !price || !merchant || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Get actual user from session
    const user = await prisma.user.findFirst({ where: { role: 'USER' } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      )
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        description: description || '',
        price,
        originalPrice,
        merchant,
        productUrl: productUrl || '#',
        imageUrl,
        categoryId,
        authorId: user.id,
        status: 'PENDING',
      },
      include: {
        category: true,
        author: {
          select: { username: true, avatar: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: deal,
    })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}
