"use client"

import React, { useEffect, useState } from "react"

interface Trade {
  id: string
  price: number
  amount: number
  isBuy: boolean
  timestamp: string
  isNew?: boolean
}

interface RecentTradesProps {
  trades: Trade[]
}

const TradeRow = React.memo(({ trade }: { trade: Trade }) => {
  const [flash, setFlash] = useState(trade.isNew)

  useEffect(() => {
    if (trade.isNew) {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [trade.isNew, trade.id])

  const flashClass = flash ? (trade.isBuy ? "bg-green-500/30 animate-pulse" : "bg-red-500/30 animate-pulse") : ""

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${flashClass}`}
    >
      <div className="flex-1">
        <div className={`text-sm font-semibold ${trade.isBuy ? "text-green-400" : "text-red-400"}`}>
          {trade.isBuy ? "BUY" : "SELL"}
        </div>
        <div className="text-xs text-muted-foreground">{trade.timestamp}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-mono text-foreground">${trade.price.toFixed(2)}</div>
        <div className="text-xs text-muted-foreground font-mono">{trade.amount.toFixed(4)}</div>
      </div>
    </div>
  )
})

TradeRow.displayName = "TradeRow"

export default function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-fit">
      <div className="bg-muted/50 px-4 py-2 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Recent Trades</h2>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {trades.length > 0 ? (
          trades.map((trade) => <TradeRow key={trade.id} trade={trade} />)
        ) : (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
            Waiting for trades...
          </div>
        )}
      </div>
    </div>
  )
}
