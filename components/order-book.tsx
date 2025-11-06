"use client"

import React, { useMemo } from "react"

interface OrderBookEntry {
  price: number
  amount: number
  total: number
}

interface OrderBookProps {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  spread: number
  maxBidTotal: number
  maxAskTotal: number
}

const OrderBookRow = React.memo(
  ({
    price,
    amount,
    total,
    isBid,
    maxTotal,
  }: {
    price: number
    amount: number
    total: number
    isBid: boolean
    maxTotal: number
  }) => {
    const depthPercentage = (total / maxTotal) * 100
    const bgColor = isBid ? "bg-green-500/20" : "bg-red-500/20"
    const textColor = isBid ? "text-green-400" : "text-red-400"

    return (
      <div
        className={`flex items-center justify-between px-4 py-2 border-b border-border/50 hover:${bgColor} transition-colors relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 ${isBid ? "bg-green-500/10" : "bg-red-500/10"}`}
          style={{
            width: `${depthPercentage}%`,
            marginLeft: isBid ? 0 : "auto",
          }}
        />
        <div className="relative flex-1">
          <span className={`font-mono text-sm ${textColor}`}>${price.toFixed(2)}</span>
        </div>
        <div className="relative text-sm font-mono text-muted-foreground w-24 text-right">{amount.toFixed(4)}</div>
        <div className="relative text-sm font-mono text-foreground w-24 text-right">{total.toFixed(4)}</div>
      </div>
    )
  },
)

OrderBookRow.displayName = "OrderBookRow"

export default function OrderBook({ bids, asks, spread, maxBidTotal, maxAskTotal }: OrderBookProps) {
  const bidsWithCumulativeDisplay = useMemo(() => bids.slice().reverse(), [bids])

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-muted/50 px-4 py-2 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Order Book - BTC/USDT</h2>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {/* Asks - Sell Orders */}
        <div>
          <div className="px-4 py-2 text-xs text-muted-foreground font-semibold border-b border-border bg-muted/20 flex justify-between">
            <span>Sell Orders (Asks)</span>
            <span className="text-right">Price | Amount | Total</span>
          </div>
          {asks.map((ask, idx) => (
            <OrderBookRow
              key={`ask-${idx}`}
              price={ask.price}
              amount={ask.amount}
              total={ask.total}
              isBid={false}
              maxTotal={maxAskTotal}
            />
          ))}
        </div>

        {/* Spread */}
        <div className="px-4 py-3 bg-primary/20 border-y border-border text-center">
          <div className="text-xs text-muted-foreground mb-1">Spread</div>
          <div className="text-base font-semibold text-primary">${spread.toFixed(2)}</div>
        </div>

        {/* Bids - Buy Orders */}
        <div>
          <div className="px-4 py-2 text-xs text-muted-foreground font-semibold border-b border-border bg-muted/20 flex justify-between">
            <span>Buy Orders (Bids)</span>
            <span className="text-right">Price | Amount | Total</span>
          </div>
          {bidsWithCumulativeDisplay.map((bid, idx) => (
            <OrderBookRow
              key={`bid-${idx}`}
              price={bid.price}
              amount={bid.amount}
              total={bid.total}
              isBid={true}
              maxTotal={maxBidTotal}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
