"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import OrderBook from "@/components/order-book"
import RecentTrades from "@/components/recent-trades"
import { useMarketData } from "@/hooks/use-market-data"

export default function Home() {
  const [orderBook, setOrderBook] = useState({
    bids: new Map<number, number>(),
    asks: new Map<number, number>(),
  })
  const [trades, setTrades] = useState<
    Array<{
      id: string
      price: number
      amount: number
      isBuy: boolean
      timestamp: string
      isNew?: boolean
    }>
  >([])
  const [lastPrice, setLastPrice] = useState(0)
  const [priceChange24h, setPriceChange24h] = useState(0)

  const handleDataUpdate = (data: any) => {
    setOrderBook({
      bids: data.orderBook.bids,
      asks: data.orderBook.asks,
    })

    if (data.trades.length > 0) {
      const latestTrade = data.trades[0]
      setTrades((prev) => {
        const newTrade = {
          id: `${latestTrade.time}-${Math.random()}`,
          price: Number.parseFloat(latestTrade.price),
          amount: Number.parseFloat(latestTrade.quantity),
          isBuy: !latestTrade.isBuyerMaker,
          timestamp: new Date(latestTrade.time).toLocaleTimeString(),
          isNew: true,
        }

        const updated = [newTrade, ...prev.slice(0, 49)]

        // Remove new flag after animation
        setTimeout(() => {
          setTrades((current) => current.map((t) => (t.id === newTrade.id ? { ...t, isNew: false } : t)))
        }, 1000)

        return updated
      })

      setLastPrice(Number.parseFloat(latestTrade.price))
    }
  }

  const { connected } = useMarketData("BTCUSDT", handleDataUpdate)

  const bidsArray = useMemo(
    () =>
      Array.from(orderBook.bids.entries())
        .map(([price, amount]) => ({ price, amount }))
        .sort((a, b) => b.price - a.price)
        .slice(0, 20),
    [orderBook.bids],
  )

  const asksArray = useMemo(
    () =>
      Array.from(orderBook.asks.entries())
        .map(([price, amount]) => ({ price, amount }))
        .sort((a, b) => a.price - b.price)
        .slice(0, 20),
    [orderBook.asks],
  )

  const spread = useMemo(() => {
    if (bidsArray.length === 0 || asksArray.length === 0) return 0
    return asksArray[0].price - bidsArray[0].price
  }, [bidsArray, asksArray])

  const bidsWithCumulative = useMemo(() => {
    let cumulative = 0
    return bidsArray.map((bid) => {
      cumulative += bid.amount
      return { ...bid, total: cumulative }
    })
  }, [bidsArray])

  const asksWithCumulative = useMemo(() => {
    let cumulative = 0
    return asksArray
      .slice()
      .reverse()
      .map((ask) => {
        cumulative += ask.amount
        return { ...ask, total: cumulative }
      })
      .reverse()
  }, [asksArray])

  return (
    <main className="min-h-screen bg-background">
      <Header lastPrice={lastPrice} priceChange24hPercent={priceChange24h} wsConnected={connected} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <OrderBook
              bids={bidsWithCumulative}
              asks={asksWithCumulative}
              spread={spread}
              maxBidTotal={Math.max(...bidsWithCumulative.map((b) => b.total), 1)}
              maxAskTotal={Math.max(...asksWithCumulative.map((a) => a.total), 1)}
            />
          </div>
          <div>
            <RecentTrades trades={trades} />
          </div>
        </div>
      </div>
    </main>
  )
}
