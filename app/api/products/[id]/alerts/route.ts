import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Get actual user from session
    const user = await prisma.user.findFirst({ where: { role: 'USER' } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      )
    }

    const alert = await prisma.priceAlert.findUnique({
      where: {
        productId_userId: {
          productId: params.id,
          userId: user.id,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: alert,
    })
  } catch (error) {
    console.error('Error fetching alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alert' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { targetPrice } = body

    if (!targetPrice || targetPrice <= 0) {
      return NextResponse.json(
        { success: false, error: 'Target price is required' },
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

    const alert = await prisma.priceAlert.upsert({
      where: {
        productId_userId: {
          productId: params.id,
          userId: user.id,
        },
      },
      update: {
        targetPrice,
        active: true,
      },
      create: {
        productId: params.id,
        userId: user.id,
        targetPrice,
        active: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: alert,
    })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Get actual user from session
    const user = await prisma.user.findFirst({ where: { role: 'USER' } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      )
    }

    await prisma.priceAlert.delete({
      where: {
        productId_userId: {
          productId: params.id,
          userId: user.id,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Alert deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert' },
      { status: 500 }
    )
  }
}
