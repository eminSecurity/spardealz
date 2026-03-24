'use client'

import { useState } from 'react'
import { Bell, BellRing, X } from 'lucide-react'

interface PriceAlertButtonProps {
  productId: string
  currentPrice?: number
}

export function PriceAlertButton({ productId, currentPrice }: PriceAlertButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [targetPrice, setTargetPrice] = useState(currentPrice ? Math.floor(currentPrice * 0.9) : '')
  const [isLoading, setIsLoading] = useState(false)
  const [hasAlert, setHasAlert] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetPrice) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPrice: parseFloat(targetPrice.toString()) }),
      })

      if (response.ok) {
        setHasAlert(true)
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Error setting alert:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/alerts`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setHasAlert(false)
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  if (hasAlert) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
          <BellRing className="w-5 h-5" />
          <span className="font-medium">Preisalarm aktiv</span>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
      >
        <Bell className="w-5 h-5" />
        Preisalarm setzen
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Preisalarm setzen</h3>
            
            <p className="text-gray-600 mb-4">
              Wir benachrichtigen dich, wenn der Preis unter deinen Wunschpreis fällt.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wunschpreis (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="z.B. 899"
                  required
                />
                {currentPrice && (
                  <p className="text-sm text-gray-500 mt-1">
                    Aktueller Preis: {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(currentPrice)}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Wird gespeichert...' : 'Alarm setzen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
