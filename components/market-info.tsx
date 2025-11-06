"use client"

interface MarketInfoProps {
  price: number
  high24h: number
  low24h: number
  volume24h: number
  priceChange24h: number
  spread: number
}

export default function MarketInfo({ price, high24h, low24h, volume24h, priceChange24h, spread }: MarketInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:col-span-3">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-2">24h High</div>
        <div className="text-xl font-bold text-foreground">${high24h.toFixed(2)}</div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-2">24h Low</div>
        <div className="text-xl font-bold text-foreground">${low24h.toFixed(2)}</div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-2">Spread</div>
        <div className={`text-xl font-bold ${spread < 10 ? "text-green-400" : "text-yellow-400"}`}>
          ${spread.toFixed(2)}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-2">24h Volume</div>
        <div className="text-lg font-bold text-foreground">{volume24h.toFixed(2)} BTC</div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-2">24h Change</div>
        <div className={`text-xl font-bold ${priceChange24h >= 0 ? "text-green-400" : "text-red-400"}`}>
          {priceChange24h >= 0 ? "+" : ""}
          {priceChange24h.toFixed(2)}%
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-2">Current Price</div>
        <div className="text-xl font-bold text-foreground">${price.toFixed(2)}</div>
      </div>
    </div>
  )
}
