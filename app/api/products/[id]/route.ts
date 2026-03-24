import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
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
        _count: { select: { alerts: true } },
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get price history for chart
    const priceHistory = await prisma.priceHistory.findMany({
      where: { productId: params.id },
      orderBy: { recordedAt: 'asc' },
      take: 30,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        priceHistory,
      },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { name, ean, brand, model, description, imageUrl, specs } = body

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(ean && { ean }),
        ...(brand && { brand }),
        ...(model && { model }),
        ...(description && { description }),
        ...(imageUrl && { imageUrl }),
        ...(specs && { specs }),
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
