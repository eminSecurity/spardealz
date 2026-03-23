import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: {
          select: { username: true, avatar: true },
        },
        comments: {
          include: {
            author: {
              select: { username: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        tags: true,
      },
    })

    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: deal,
    })
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { title, description, price, originalPrice, status } = body

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(originalPrice !== undefined && { originalPrice }),
        ...(status && { status }),
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
    console.error('Error updating deal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.deal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}
