"use client"

interface HeaderProps {
  lastPrice: number
  priceChange24hPercent: number
  wsConnected?: boolean
}

export default function Header({ lastPrice, priceChange24hPercent, wsConnected }: HeaderProps) {
  const isPositive = priceChange24hPercent >= 0

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">₿</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">BTC/USDT</h1>
              <p className="text-sm text-muted-foreground">Bitcoin to Tether</p>
            </div>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-foreground">Real-time Order Book Visualizer</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              <p className="text-xs text-muted-foreground">{wsConnected ? "Live - Binance API" : "Connecting..."}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">${lastPrice.toFixed(2)}</div>
            <div className={`text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? "+" : ""}
              {priceChange24hPercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
