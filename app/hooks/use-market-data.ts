"use client"

import { useEffect, useRef, useCallback, useState } from "react"

export interface TradeData {
  price: string
  quantity: string
  time: number
  isBuyerMaker: boolean
}

interface MarketData {
  orderBook: {
    bids: Map<number, number>
    asks: Map<number, number>
  }
  trades: TradeData[]
  lastPrice: number
}

/**
 * Custom hook for simulating real-time market data
 * In production, replace this with actual Binance WebSocket implementation
 */
export function useMarketData(pair = "BTCUSDT", onDataUpdate?: (data: MarketData) => void) {
  const [connected, setConnected] = useState(false)
  const bidsRef = useRef(new Map<number, number>())
  const asksRef = useRef(new Map<number, number>())
  const tradesRef = useRef<TradeData[]>([])
  const priceRef = useRef(45250)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const initialize = useCallback(() => {
    const basePrice = 45250
    for (let i = 0; i < 20; i++) {
      bidsRef.current.set(basePrice - i * 2.5, Math.random() * 3 + 0.5)
      asksRef.current.set(basePrice + i * 2.5, Math.random() * 3 + 0.5)
    }
  }, [])

  const startSimulation = useCallback(() => {
    initialize()
    setConnected(true)

    intervalRef.current = setInterval(() => {
      const bids = Array.from(bidsRef.current.entries())
      const asks = Array.from(asksRef.current.entries())

      // Update random price levels
      if (bids.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(3, bids.length))
        const [price] = bids[idx]
        bidsRef.current.set(price, Math.random() * 4 + 0.2)
      }

      if (asks.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(3, asks.length))
        const [price] = asks[idx]
        asksRef.current.set(price, Math.random() * 4 + 0.2)
      }

      // Simulate price movement
      priceRef.current += (Math.random() - 0.5) * 30
      priceRef.current = Math.max(43000, Math.min(47000, priceRef.current))

      // Add trade
      tradesRef.current.unshift({
        price: priceRef.current.toFixed(2),
        quantity: (Math.random() * 2 + 0.1).toFixed(4),
        time: Date.now(),
        isBuyerMaker: Math.random() > 0.5,
      })
      tradesRef.current = tradesRef.current.slice(0, 50)

      // Emit update
      onDataUpdate?.({
        orderBook: {
          bids: new Map(bidsRef.current),
          asks: new Map(asksRef.current),
        },
        trades: tradesRef.current,
        lastPrice: priceRef.current,
      })
    }, 500)
  }, [initialize, onDataUpdate])

  useEffect(() => {
    startSimulation()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startSimulation])

  return {
    connected,
    orderBook: { bids: bidsRef.current, asks: asksRef.current },
    trades: tradesRef.current,
  }
}
