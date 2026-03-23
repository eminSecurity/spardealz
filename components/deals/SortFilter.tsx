'use client'

import { useState } from 'react'
import { ChevronDown, Flame, Clock, TrendingUp, DollarSign } from 'lucide-react'

const sortOptions = [
  { value: 'hot', label: 'Am heißesten', icon: Flame },
  { value: 'new', label: 'Neueste', icon: Clock },
  { value: 'price-asc', label: 'Preis ↑', icon: DollarSign },
  { value: 'price-desc', label: 'Preis ↓', icon: DollarSign },
]

export function SortFilter() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(sortOptions[0])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <selected.icon className="w-4 h-4" />
        <span>{selected.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSelected(option)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                selected.value === option.value ? 'text-primary font-medium' : 'text-gray-600'
              }`}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
