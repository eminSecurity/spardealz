import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'EUR') {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(price)
}

export function formatDate(date: Date | string) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'gerade eben'
  if (minutes < 60) return `vor ${minutes} Min.`
  if (hours < 24) return `vor ${hours} Std.`
  if (days < 7) return `vor ${days} Tagen`
  return d.toLocaleDateString('de-DE')
}

export function calculateDiscount(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return null
  const discount = ((originalPrice - price) / originalPrice) * 100
  return Math.round(discount)
}

export function getTemperatureColor(temp: number) {
  if (temp >= 100) return 'text-green-500'
  if (temp >= 0) return 'text-gray-600'
  return 'text-red-500'
}
