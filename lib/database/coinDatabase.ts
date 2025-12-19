/**
 * Coin Database Module
 * Stores and retrieves historical price data for top 50 coins by TMV (Trading Market Volume)
 * Tracks 15-minute interval data for regression analysis
 */

export interface CoinPriceData {
  coinId: string
  symbol: string
  name: string
  timestamp: number
  price: number
  volume24h: number
  marketCap: number
  priceChange24h: number
}

export interface HistoricalDataPoint {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CoinMetadata {
  coinId: string
  symbol: string
  name: string
  rank: number
  currentPrice: number
  volume24h: number
  marketCap: number
  lastUpdated: number
}

// In-memory database simulation (in production, use PostgreSQL, MongoDB, or similar)
class CoinDatabaseManager {
  private top50Coins: Map<string, CoinMetadata> = new Map()
  private historicalData: Map<string, HistoricalDataPoint[]> = new Map()
  private lastUpdate: number = 0

  constructor() {
    this.initializeDatabase()
  }

  /**
   * Initialize database with mock data
   * In production, this would connect to a real database
   */
  private initializeDatabase() {
    console.log('Initializing Coin Database...')
    // Database would be initialized here
  }

  /**
   * Get top 50 coins by Trading Market Volume in last 24 hours
   */
  async getTop50CoinsByTMV(): Promise<CoinMetadata[]> {
    // In production, fetch from database sorted by volume24h
    // For now, generate mock data
    const coins: CoinMetadata[] = []
    const coinList = this.generateTop50Coins()
    
    for (let i = 0; i < 50; i++) {
      coins.push(coinList[i])
      this.top50Coins.set(coinList[i].coinId, coinList[i])
    }
    
    this.lastUpdate = Date.now()
    return coins
  }

  /**
   * Get historical 15-minute interval data for a coin
   * @param coinId - Coin identifier
   * @param days - Number of days to retrieve (30-90 for training)
   */
  async getHistoricalData(coinId: string, days: number = 90): Promise<HistoricalDataPoint[]> {
    // In production, query database for historical data
    // Generate mock data for now
    const data = this.generateHistoricalData(coinId, days)
    this.historicalData.set(coinId, data)
    return data
  }

  /**
   * Store new price data point
   */
  async storePriceData(data: CoinPriceData): Promise<void> {
    // In production, insert into database
    console.log(`Storing price data for ${data.symbol} at ${new Date(data.timestamp).toISOString()}`)
  }

  /**
   * Bulk store historical data
   */
  async bulkStoreHistoricalData(coinId: string, data: HistoricalDataPoint[]): Promise<void> {
    this.historicalData.set(coinId, data)
    console.log(`Stored ${data.length} historical data points for ${coinId}`)
  }

  /**
   * Update top 50 coins list (should run periodically)
   */
  async updateTop50Coins(): Promise<void> {
    const coins = await this.getTop50CoinsByTMV()
    console.log(`Updated top 50 coins list at ${new Date().toISOString()}`)
  }

  /**
   * Generate mock data for top 50 coins
   */
  private generateTop50Coins(): CoinMetadata[] {
    const coinNames = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', basePrice: 43000, baseVolume: 25000000000 },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', basePrice: 2250, baseVolume: 15000000000 },
      { id: 'tether', symbol: 'USDT', name: 'Tether', basePrice: 1.00, baseVolume: 45000000000 },
      { id: 'binancecoin', symbol: 'BNB', name: 'BNB', basePrice: 310, baseVolume: 1200000000 },
      { id: 'solana', symbol: 'SOL', name: 'Solana', basePrice: 98, baseVolume: 2500000000 },
      { id: 'ripple', symbol: 'XRP', name: 'XRP', basePrice: 0.62, baseVolume: 1800000000 },
      { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', basePrice: 1.00, baseVolume: 8000000000 },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano', basePrice: 0.58, baseVolume: 450000000 },
      { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', basePrice: 37, baseVolume: 650000000 },
      { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.09, baseVolume: 890000000 },
      { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', basePrice: 7.2, baseVolume: 280000000 },
      { id: 'polygon', symbol: 'MATIC', name: 'Polygon', basePrice: 0.89, baseVolume: 420000000 },
      { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', basePrice: 14.5, baseVolume: 380000000 },
      { id: 'tron', symbol: 'TRX', name: 'TRON', basePrice: 0.10, baseVolume: 1500000000 },
      { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', basePrice: 72, baseVolume: 540000000 },
      { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', basePrice: 6.8, baseVolume: 210000000 },
      { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', basePrice: 10.2, baseVolume: 185000000 },
      { id: 'stellar', symbol: 'XLM', name: 'Stellar', basePrice: 0.13, baseVolume: 160000000 },
      { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic', basePrice: 20.5, baseVolume: 220000000 },
      { id: 'monero', symbol: 'XMR', name: 'Monero', basePrice: 165, baseVolume: 95000000 },
      // Additional 30 coins
      { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', basePrice: 2.8, baseVolume: 150000000 },
      { id: 'algorand', symbol: 'ALGO', name: 'Algorand', basePrice: 0.28, baseVolume: 85000000 },
      { id: 'vechain', symbol: 'VET', name: 'VeChain', basePrice: 0.032, baseVolume: 72000000 },
      { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', basePrice: 5.8, baseVolume: 110000000 },
      { id: 'aptos', symbol: 'APT', name: 'Aptos', basePrice: 9.5, baseVolume: 180000000 },
      { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', basePrice: 1.45, baseVolume: 290000000 },
      { id: 'optimism', symbol: 'OP', name: 'Optimism', basePrice: 3.2, baseVolume: 165000000 },
      { id: 'hedera', symbol: 'HBAR', name: 'Hedera', basePrice: 0.089, baseVolume: 78000000 },
      { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', basePrice: 12.5, baseVolume: 95000000 },
      { id: 'immutable-x', symbol: 'IMX', name: 'Immutable X', basePrice: 2.1, baseVolume: 68000000 },
      { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox', basePrice: 0.52, baseVolume: 125000000 },
      { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity', basePrice: 8.2, baseVolume: 87000000 },
      { id: 'decentraland', symbol: 'MANA', name: 'Decentraland', basePrice: 0.58, baseVolume: 92000000 },
      { id: 'aave', symbol: 'AAVE', name: 'Aave', basePrice: 105, baseVolume: 142000000 },
      { id: 'maker', symbol: 'MKR', name: 'Maker', basePrice: 1450, baseVolume: 76000000 },
      { id: 'compound', symbol: 'COMP', name: 'Compound', basePrice: 58, baseVolume: 42000000 },
      { id: 'curve', symbol: 'CRV', name: 'Curve', basePrice: 0.82, baseVolume: 135000000 },
      { id: 'sushi', symbol: 'SUSHI', name: 'SushiSwap', basePrice: 1.25, baseVolume: 48000000 },
      { id: 'fantom', symbol: 'FTM', name: 'Fantom', basePrice: 0.48, baseVolume: 98000000 },
      { id: 'theta', symbol: 'THETA', name: 'Theta Network', basePrice: 1.35, baseVolume: 56000000 },
      { id: 'elrond', symbol: 'EGLD', name: 'MultiversX', basePrice: 52, baseVolume: 71000000 },
      { id: 'flow', symbol: 'FLOW', name: 'Flow', basePrice: 0.92, baseVolume: 45000000 },
      { id: 'tezos', symbol: 'XTZ', name: 'Tezos', basePrice: 1.15, baseVolume: 62000000 },
      { id: 'eos', symbol: 'EOS', name: 'EOS', basePrice: 0.85, baseVolume: 89000000 },
      { id: 'zcash', symbol: 'ZEC', name: 'Zcash', basePrice: 38, baseVolume: 52000000 },
      { id: 'dash', symbol: 'DASH', name: 'Dash', basePrice: 42, baseVolume: 38000000 },
      { id: 'neo', symbol: 'NEO', name: 'NEO', basePrice: 14.5, baseVolume: 44000000 },
      { id: 'iota', symbol: 'IOTA', name: 'IOTA', basePrice: 0.28, baseVolume: 35000000 },
      { id: 'stacks', symbol: 'STX', name: 'Stacks', basePrice: 1.85, baseVolume: 67000000 },
      { id: 'kava', symbol: 'KAVA', name: 'Kava', basePrice: 0.98, baseVolume: 31000000 }
    ]

    return coinNames.map((coin, index) => ({
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      rank: index + 1,
      currentPrice: coin.basePrice * (1 + (Math.random() - 0.5) * 0.05),
      volume24h: coin.baseVolume * (1 + (Math.random() - 0.5) * 0.15),
      marketCap: coin.basePrice * coin.baseVolume * 0.1,
      lastUpdated: Date.now()
    }))
  }

  /**
   * Generate historical 15-minute interval data
   */
  private generateHistoricalData(coinId: string, days: number): HistoricalDataPoint[] {
    const data: HistoricalDataPoint[] = []
    const intervalsPerDay = 96 // 24 hours * 4 intervals per hour
    const totalIntervals = days * intervalsPerDay
    const now = Date.now()
    const intervalMs = 15 * 60 * 1000 // 15 minutes

    // Start with a base price
    const metadata = this.top50Coins.get(coinId)
    let basePrice = metadata ? metadata.currentPrice : 100

    for (let i = totalIntervals; i >= 0; i--) {
      const timestamp = now - (i * intervalMs)
      
      // Simulate price movement with some volatility
      const volatility = 0.02 // 2% volatility
      const trend = 0.0001 // Slight upward trend
      const randomChange = (Math.random() - 0.5) * volatility
      const priceChange = (trend + randomChange) * basePrice
      
      basePrice = Math.max(basePrice + priceChange, basePrice * 0.95) // Prevent too much downside
      
      const open = basePrice
      const high = open * (1 + Math.random() * 0.015)
      const low = open * (1 - Math.random() * 0.015)
      const close = low + (high - low) * Math.random()
      const volume = (metadata?.volume24h || 1000000) * (0.015 + Math.random() * 0.01) // ~1/96th of daily volume
      
      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume
      })
      
      basePrice = close
    }

    return data
  }
}

// Singleton instance
export const coinDatabase = new CoinDatabaseManager()
