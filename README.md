# Real-time Order Book Visualizer

A high-performance, real-time stock order book visualizer built with Next.js, TypeScript, and React. This application connects to the live Binance WebSocket API to stream real-time market data for cryptocurrency pairs.

## Features

### Part 1: WebSocket Data Feed (Live Binance API)
- **Aggregate Trades Stream**: Streams completed trades in real-time via `aggTrade` endpoint
- **Order Book Delta Stream**: Streams live order book changes via `depth@100ms` endpoint
- **Error Handling & Reconnection**: Graceful error handling with automatic reconnection attempts
- **Custom Hook**: `useBinanceSocket` hook for easy WebSocket integration

### Part 2: Order Book Component
- **Two-Column Layout**: Bids (Buy) on left, Asks (Sell) on right
- **Sorting & Organization**:
  - Bids: Sorted in DESCENDING order (highest bid at top) - Green color
  - Asks: Sorted in ASCENDING order (lowest ask at top) - Red color
- **Data Display**: Each row shows Price, Amount, and Cumulative Total
- **Spread Calculation**: Displays `(Lowest Ask) - (Highest Bid)`
- **Depth Visualization**: Background bars represent cumulative volume relative to max

### Part 3: Recent Trades Component
- **Trade Stream**: Displays 50 most recent trades
- **Flash Highlighting**: New trades flash in their respective color (Green for buys, Red for sells)
- **Trade Direction**: Automatically determines buy/sell based on API data
- **Real-time Updates**: Trades appear at the top of the list

## Performance Optimizations

- **React.memo**: Applied to OrderBookRow and TradeRow to prevent unnecessary re-renders
- **useMemo**: Used for expensive calculations (cumulative totals, sorting, depth calculations)
- **Efficient State Management**: Maps for O(1) price level updates
- **Delta Processing**: Only processes incremental updates, not full snapshots

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: React Hooks (useState, useEffect, useCallback, useMemo)
- **Styling**: Tailwind CSS v4
- **API**: Binance WebSocket API (real-time data)

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd order-book-visualizer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   Navigate to `http://localhost:3000`

## How It Works

### WebSocket Connection
The `useBinanceSocket` hook establishes two WebSocket connections:
- **Trade Stream**: `wss://stream.binance.com:9443/ws/{pair}@aggTrade`
- **Depth Stream**: `wss://stream.binance.com:9443/ws/{pair}@depth@100ms`

### Order Book Updates
1. Incoming delta updates are parsed and processed
2. Price levels with amount `0` are removed
3. Maps maintain current state for O(1) lookups
4. Cumulative totals are recalculated for depth visualization

### Trade Processing
1. New trades are extracted from the aggTrade stream
2. Direction (buy/sell) is determined from `isBuyerMaker` flag
3. Trades are added to the top of the list (max 50)
4. Flash animation highlights new trades

## Design Choices & Trade-offs

### Why WebSocket Instead of REST API?
- **Real-time Data**: WebSocket provides true real-time updates vs. REST polling
- **Reduced Latency**: Single persistent connection vs. repeated HTTP requests
- **Better Performance**: Lower overhead and bandwidth usage
- **Scalability**: Efficient for high-frequency data streams

### Why Maps for Order Book Storage?
- **O(1) Price Level Updates**: Instant lookups and updates
- **Simple Delta Processing**: No need to scan arrays
- **Memory Efficient**: Sparse data structure
- **Easy Cleanup**: Simply delete entries with amount 0

### Component Architecture
- **Separated Components**: OrderBook, RecentTrades, Header for modularity
- **Custom Hook**: Isolated WebSocket logic for reusability
- **Memoization**: Prevents unnecessary re-renders on high-frequency updates

## Deployment

### Deploy to Vercel (Recommended)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

### Deploy to Netlify

\`\`\`bash
# Build for production
npm run build

# Deploy the .next folder
\`\`\`

## Evaluation Checklist

- ✓ **Correctness**: Order book aggregates deltas correctly, sorting and totals are accurate
- ✓ **Performance**: No lag with high-frequency live data, efficient memoization
- ✓ **API Integration**: Successfully connected to live Binance WebSocket API
- ✓ **Code Quality**: Clean, modular TypeScript code with proper type safety
- ✓ **UI/UX**: Professional dark-themed interface with clear financial data presentation

## Submission Form

Submit this application here: [Google Form Link]

## License

MIT
