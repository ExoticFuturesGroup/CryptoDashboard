export interface MarketOverview {
  totalMarketCap: number
  total24hVolume: number
  btcDominance: number
  ethDominance: number
  marketCapChange24h: number
  volumeChange24h: number
  activeCoins: number
  activeMarkets: number
  fearGreedIndex: number
  fearGreedLabel: string
}

export interface MarketCapHistory {
  timestamp: number
  marketCap: number
}

export interface VolumeHistory {
  timestamp: number
  volume: number
}

export interface DominanceChart {
  name: string
  value: number
  change24h: number
}

export interface MarketTrend {
  period: string
  marketCap: number
  volume: number
  change: number
}

// Fetch market overview statistics
export async function getMarketOverview(): Promise<MarketOverview> {
  // In production, this would call real APIs
  // For now, returning realistic mock data
  
  return {
    totalMarketCap: 1785000000000, // $1.785T
    total24hVolume: 89500000000, // $89.5B
    btcDominance: 51.2,
    ethDominance: 16.8,
    marketCapChange24h: 2.3,
    volumeChange24h: -5.2,
    activeCoins: 12547,
    activeMarkets: 45892,
    fearGreedIndex: 62,
    fearGreedLabel: 'Greed'
  }
}

// Fetch 7-day market cap history
export async function getMarketCapHistory(): Promise<MarketCapHistory[]> {
  const now = Date.now()
  const data: MarketCapHistory[] = []
  
  for (let i = 6; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000)
    const randomChange = (Math.random() - 0.5) * 0.05
    const marketCap = 1785000000000 * (1 + randomChange)
    data.push({ timestamp, marketCap })
  }
  
  return data
}

// Fetch 7-day volume history
export async function getVolumeHistory(): Promise<VolumeHistory[]> {
  const now = Date.now()
  const data: VolumeHistory[] = []
  
  for (let i = 6; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000)
    const randomChange = (Math.random() - 0.5) * 0.15
    const volume = 89500000000 * (1 + randomChange)
    data.push({ timestamp, volume })
  }
  
  return data
}

// Fetch dominance data
export async function getDominanceData(): Promise<DominanceChart[]> {
  return [
    { name: 'Bitcoin', value: 51.2, change24h: 0.3 },
    { name: 'Ethereum', value: 16.8, change24h: -0.2 },
    { name: 'Stablecoins', value: 12.5, change24h: 0.1 },
    { name: 'BNB', value: 3.8, change24h: 0.05 },
    { name: 'Solana', value: 2.1, change24h: 0.15 },
    { name: 'XRP', value: 1.9, change24h: 0.08 },
    { name: 'Others', value: 11.7, change24h: -0.1 }
  ]
}

// Fetch market trends
export async function getMarketTrends(): Promise<MarketTrend[]> {
  return [
    {
      period: '1 Hour',
      marketCap: 1785000000000,
      volume: 89500000000,
      change: 0.5
    },
    {
      period: '24 Hours',
      marketCap: 1745000000000,
      volume: 94200000000,
      change: 2.3
    },
    {
      period: '7 Days',
      marketCap: 1698000000000,
      volume: 87300000000,
      change: 5.1
    },
    {
      period: '30 Days',
      marketCap: 1621000000000,
      volume: 82100000000,
      change: 10.1
    }
  ]
}
