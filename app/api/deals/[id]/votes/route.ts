import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { value } = body // +1 or -1

    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { success: false, error: 'Invalid vote value' },
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

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        dealId_userId: {
          dealId: params.id,
          userId: user.id,
        },
      },
    })

    let voteChange = 0

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if clicking same button again
        await prisma.vote.delete({
          where: { id: existingVote.id },
        })
        voteChange = -value
      } else {
        // Change vote
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value },
        })
        voteChange = value * 2 // +2 or -2 depending on direction
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          dealId: params.id,
          userId: user.id,
          value,
        },
      })
      voteChange = value
    }

    // Update deal vote count and temperature
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
    })

    if (deal) {
      await prisma.deal.update({
        where: { id: params.id },
        data: {
          voteCount: {
            increment: voteChange,
          },
          temperature: {
            increment: voteChange * 10,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        voted: existingVote?.value !== value || !existingVote,
        value: existingVote?.value === value ? 0 : value,
      },
    })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to vote' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const votes = await prisma.vote.findMany({
      where: { dealId: params.id },
      include: {
        user: {
          select: { username: true, avatar: true },
        },
      },
    })

    const upvotes = votes.filter(v => v.value === 1).length
    const downvotes = votes.filter(v => v.value === -1).length

    return NextResponse.json({
      success: true,
      data: {
        votes,
        upvotes,
        downvotes,
        total: votes.length,
      },
    })
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}
