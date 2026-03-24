import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const prices = await prisma.priceHistory.findMany({
      where: { productId: params.id },
      orderBy: { recordedAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: prices,
    })
  } catch (error) {
    console.error('Error fetching prices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { merchant, price, currency, shipping, url, inStock } = body

    if (!merchant || !price || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const priceEntry = await prisma.priceHistory.create({
      data: {
        productId: params.id,
        merchant,
        price,
        currency: currency || 'EUR',
        shipping,
        url,
        inStock: inStock ?? true,
      },
    })

    // Check price alerts
    const alerts = await prisma.priceAlert.findMany({
      where: {
        productId: params.id,
        active: true,
        targetPrice: { gte: price },
      },
    })

    // TODO: Send notifications to users with alerts

    return NextResponse.json({
      success: true,
      data: priceEntry,
      alertsTriggered: alerts.length,
    })
  } catch (error) {
    console.error('Error creating price:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create price' },
      { status: 500 }
    )
  }
}
