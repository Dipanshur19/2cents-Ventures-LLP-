"use client"

import { useMemo } from "react"

interface OrderBookEntry {
  price: number
  amount: number
}

interface DepthChartProps {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

export default function DepthChart({ bids, asks }: DepthChartProps) {
  const chartData = useMemo(() => {
    if (bids.length === 0 || asks.length === 0) return { maxAmount: 1, bidBars: [], askBars: [] }

    const maxAmount = Math.max(...bids.map((b) => b.amount), ...asks.map((a) => a.amount))

    const bidBars = bids.slice(0, 10).map((bid) => ({
      price: bid.price,
      amount: bid.amount,
      percentage: (bid.amount / maxAmount) * 100,
    }))

    const askBars = asks.slice(0, 10).map((ask) => ({
      price: ask.price,
      amount: ask.amount,
      percentage: (ask.amount / maxAmount) * 100,
    }))

    return { maxAmount, bidBars: bidBars.reverse(), askBars }
  }, [bids, asks])

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4">Market Depth</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bids */}
        <div>
          <h3 className="text-xs font-semibold text-green-400 mb-3">Buy Orders</h3>
          <div className="space-y-2">
            {chartData.bidBars.map((bar, idx) => (
              <div key={`bid-${idx}`} className="flex items-center gap-2">
                <div className="w-12 text-xs text-right font-mono text-muted-foreground">${bar.price.toFixed(0)}</div>
                <div className="flex-1 h-6 bg-muted rounded-sm relative overflow-hidden">
                  <div
                    className="h-full bg-green-500/30 border border-green-500/50 transition-all duration-300"
                    style={{ width: `${bar.percentage}%` }}
                  />
                </div>
                <div className="w-16 text-xs text-right font-mono text-muted-foreground">{bar.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Asks */}
        <div>
          <h3 className="text-xs font-semibold text-red-400 mb-3">Sell Orders</h3>
          <div className="space-y-2">
            {chartData.askBars.map((bar, idx) => (
              <div key={`ask-${idx}`} className="flex items-center gap-2">
                <div className="w-12 text-xs text-right font-mono text-muted-foreground">${bar.price.toFixed(0)}</div>
                <div className="flex-1 h-6 bg-muted rounded-sm relative overflow-hidden">
                  <div
                    className="h-full bg-red-500/30 border border-red-500/50 transition-all duration-300"
                    style={{ width: `${bar.percentage}%` }}
                  />
                </div>
                <div className="w-16 text-xs text-right font-mono text-muted-foreground">{bar.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
