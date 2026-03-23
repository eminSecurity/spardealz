'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Smartphone, Home, Shirt, Gamepad, ShoppingCart } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Home,
  Shirt,
  Gamepad,
  ShoppingCart,
}

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string; icon: string | null }[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/"
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          !currentCategory
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        Alle
      </Link>

      {categories.map((category) => {
        const Icon = category.icon ? iconMap[category.icon] : null
        const isActive = currentCategory === category.slug

        return (
          <Link
            key={category.id}
            href={`?category=${category.slug}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {category.name}
          </Link>
        )
      })}
    </div>
  )
}
