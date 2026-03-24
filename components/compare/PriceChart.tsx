'use client'

interface PriceChartProps {
  data: {
    price: number
    recordedAt: Date
    merchant: string
  }[]
}

export function PriceChart({ data }: PriceChartProps) {
  if (data.length < 2) {
    return (
      <div className="text-center py-8 text-gray-400">
        Noch nicht genug Daten für einen Verlauf
      </div>
    )
  }

  const prices = data.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1

  const width = 800
  const height = 200
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth
    const y = height - padding - ((d.price - minPrice) / priceRange) * chartHeight
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[600px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding + (i / 4) * chartHeight
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4"
            />
          )
        })}

        {/* Price line */}
        <polyline
          fill="none"
          stroke="#FF6B35"
          strokeWidth="3"
          points={points}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * chartWidth
          const y = height - padding - ((d.price - minPrice) / priceRange) * chartHeight
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="#FF6B35"
                stroke="white"
                strokeWidth="2"
              />
              <title>
                {new Intl.NumberFormat('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(d.price)} - {d.merchant} - {new Date(d.recordedAt).toLocaleDateString('de-DE')}
              </title>
            </g>
          )
        })}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => {
          const price = maxPrice - (i / 4) * priceRange
          const y = padding + (i / 4) * chartHeight
          return (
            <text
              key={i}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {Math.round(price)}€
            </text>
          )
        })}
      </svg>
    </div>
  )
}
