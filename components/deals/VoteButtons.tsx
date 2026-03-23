'use client'

import { useState } from 'react'
import { Flame, Snowflake } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoteButtonsProps {
  dealId: string
  initialVotes: number
  initialTemperature: number
  userVote?: number | null
}

export function VoteButtons({ dealId, initialVotes, initialTemperature, userVote: initialUserVote }: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [temperature, setTemperature] = useState(initialTemperature)
  const [userVote, setUserVote] = useState<number | null>(initialUserVote || null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVote = async (value: number) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const response = await fetch(`/api/deals/${dealId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })

      if (!response.ok) throw new Error('Failed to vote')

      const data = await response.json()
      
      if (data.data.voted) {
        // Calculate new values
        if (userVote === value) {
          // Remove vote
          setVotes(v => v - value)
          setTemperature(t => t - value * 10)
          setUserVote(null)
        } else if (userVote === null) {
          // New vote
          setVotes(v => v + value)
          setTemperature(t => t + value * 10)
          setUserVote(value)
        } else {
          // Change vote
          setVotes(v => v + value * 2)
          setTemperature(t => t + value * 20)
          setUserVote(value)
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isHot = temperature >= 100
  const isCold = temperature < 0

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={isLoading}
        className={cn(
          "p-2 rounded-lg transition-all",
          userVote === 1 
            ? "bg-green-500 text-white" 
            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
        )}
      >
        <Flame className="w-5 h-5" />
      </button>
      
      <div className={cn(
        "text-sm font-bold px-2 py-1 rounded-full",
        isHot && "text-green-600",
        isCold && "text-red-600",
        !isHot && !isCold && "text-gray-600"
      )}>
        {temperature}°
      </div>
      
      <div className="text-xs text-gray-500">{votes} Votes</div>
      
      <button
        onClick={() => handleVote(-1)}
        disabled={isLoading}
        className={cn(
          "p-2 rounded-lg transition-all",
          userVote === -1 
            ? "bg-red-500 text-white" 
            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
        )}
      >
        <Snowflake className="w-5 h-5" />
      </button>
    </div>
  )
}
