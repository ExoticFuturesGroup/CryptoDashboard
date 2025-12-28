/**
 * Hot Tokens API - Tracks tokens with highest price changes and trading volume in last 30 minutes
 */

export interface HotToken {
  symbol: string
  name: string
  price: number
  priceChange30m: number
  volume30m: number
  volumeChange30m: number
  trades30m: number
  marketCap: number
  rank: number
}

export interface HotTokensData {
  topGainers: HotToken[]
  topLosers: HotToken[]
  topByVolume: HotToken[]
  lastUpdated: number
}

/**
 * Generate realistic hot tokens data for the last 30 minutes
 */
function generateHotTokensData(): HotTokensData {
  const baseTokens = [
    { symbol: 'PEPE', name: 'Pepe', basePrice: 0.00000892, baseCap: 3750000000, baseVolume: 850000000 },
    { symbol: 'WIF', name: 'dogwifhat', basePrice: 1.85, baseCap: 1850000000, baseVolume: 320000000 },
    { symbol: 'BONK', name: 'Bonk', basePrice: 0.0000145, baseCap: 950000000, baseVolume: 280000000 },
    { symbol: 'FLOKI', name: 'Floki Inu', basePrice: 0.000168, baseCap: 1600000000, baseVolume: 195000000 },
    { symbol: 'SHIB', name: 'Shiba Inu', basePrice: 0.0000214, baseCap: 12600000000, baseVolume: 425000000 },
    { symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.315, baseCap: 46200000000, baseVolume: 1850000000 },
    { symbol: 'RNDR', name: 'Render', basePrice: 7.24, baseCap: 3750000000, baseVolume: 245000000 },
    { symbol: 'FET', name: 'Fetch.ai', basePrice: 1.18, baseCap: 2980000000, baseVolume: 185000000 },
    { symbol: 'INJ', name: 'Injective', basePrice: 22.45, baseCap: 2100000000, baseVolume: 165000000 },
    { symbol: 'GALA', name: 'Gala', basePrice: 0.0428, baseCap: 1450000000, baseVolume: 142000000 },
    { symbol: 'SAND', name: 'The Sandbox', basePrice: 0.485, baseCap: 1080000000, baseVolume: 138000000 },
    { symbol: 'MANA', name: 'Decentraland', basePrice: 0.542, baseCap: 1120000000, baseVolume: 125000000 },
    { symbol: 'AXS', name: 'Axie Infinity', basePrice: 6.18, baseCap: 850000000, baseVolume: 95000000 },
    { symbol: 'APE', name: 'ApeCoin', basePrice: 1.24, baseCap: 925000000, baseVolume: 118000000 },
    { symbol: 'IMX', name: 'Immutable X', basePrice: 1.38, baseCap: 2150000000, baseVolume: 145000000 },
    { symbol: 'BLUR', name: 'Blur', basePrice: 0.285, baseCap: 850000000, baseVolume: 92000000 },
    { symbol: 'LDO', name: 'Lido DAO', basePrice: 1.82, baseCap: 1620000000, baseVolume: 175000000 },
    { symbol: 'ARB', name: 'Arbitrum', basePrice: 0.755, baseCap: 3050000000, baseVolume: 285000000 },
    { symbol: 'OP', name: 'Optimism', basePrice: 2.14, baseCap: 2850000000, baseVolume: 245000000 },
    { symbol: 'MATIC', name: 'Polygon', basePrice: 0.87, baseCap: 8050000000, baseVolume: 425000000 },
    { symbol: 'NEAR', name: 'NEAR Protocol', basePrice: 4.85, baseCap: 5450000000, baseVolume: 385000000 },
    { symbol: 'FTM', name: 'Fantom', basePrice: 0.648, baseCap: 1820000000, baseVolume: 195000000 },
    { symbol: 'AAVE', name: 'Aave', basePrice: 298.5, baseCap: 4450000000, baseVolume: 285000000 },
    { symbol: 'CRV', name: 'Curve DAO', basePrice: 0.825, baseCap: 1050000000, baseVolume: 145000000 },
    { symbol: 'MKR', name: 'Maker', basePrice: 1485.0, baseCap: 1380000000, baseVolume: 125000000 },
    { symbol: 'SNX', name: 'Synthetix', basePrice: 2.48, baseCap: 850000000, baseVolume: 95000000 },
    { symbol: 'COMP', name: 'Compound', basePrice: 58.2, baseCap: 505000000, baseVolume: 75000000 },
    { symbol: 'UNI', name: 'Uniswap', basePrice: 11.45, baseCap: 8650000000, baseVolume: 485000000 },
    { symbol: 'SUSHI', name: 'SushiSwap', basePrice: 0.845, baseCap: 215000000, baseVolume: 48000000 },
    { symbol: 'LUNA', name: 'Terra', basePrice: 0.485, baseCap: 285000000, baseVolume: 85000000 },
  ]

  const tokens: HotToken[] = baseTokens.map((token, index) => {
    // Generate random 30-minute price changes (more volatile for smaller caps)
    const volatilityFactor = Math.max(0.5, 5000000000 / token.baseCap)
    const priceChange30m = (Math.random() - 0.48) * 15 * volatilityFactor
    
    // Calculate volume for 30 minutes (roughly 1/48th of daily volume)
    const volume30m = token.baseVolume / 48 * (0.8 + Math.random() * 0.4)
    const volumeChange30m = (Math.random() - 0.4) * 80
    
    // Trading activity
    const trades30m = Math.floor(volume30m / (token.basePrice * 1000) * (0.5 + Math.random()))
    
    return {
      symbol: token.symbol,
      name: token.name,
      price: token.basePrice * (1 + priceChange30m / 100),
      priceChange30m,
      volume30m,
      volumeChange30m,
      trades30m,
      marketCap: token.baseCap,
      rank: index + 1
    }
  })

  // Sort for different categories
  const topGainers = [...tokens]
    .sort((a, b) => b.priceChange30m - a.priceChange30m)
    .slice(0, 15)

  const topLosers = [...tokens]
    .sort((a, b) => a.priceChange30m - b.priceChange30m)
    .slice(0, 15)

  const topByVolume = [...tokens]
    .sort((a, b) => b.volume30m - a.volume30m)
    .slice(0, 15)

  return {
    topGainers,
    topLosers,
    topByVolume,
    lastUpdated: Date.now()
  }
}

/**
 * Fetch hot tokens data
 */
export async function getHotTokens(): Promise<HotTokensData> {
  // In production, this would call real APIs
  // For now, generate realistic mock data
  return generateHotTokensData()
}

/**
 * Format large numbers for display
 */
export function formatVolume(volume: number): string {
  if (volume >= 1000000000) {
    return `$${(volume / 1000000000).toFixed(2)}B`
  } else if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(2)}M`
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(2)}K`
  }
  return `$${volume.toFixed(2)}`
}

/**
 * Format price with appropriate decimals
 */
export function formatPrice(price: number): string {
  if (price < 0.000001) {
    return `$${price.toFixed(10)}`
  } else if (price < 0.001) {
    return `$${price.toFixed(8)}`
  } else if (price < 1) {
    return `$${price.toFixed(6)}`
  } else if (price < 10) {
    return `$${price.toFixed(4)}`
  } else if (price < 100) {
    return `$${price.toFixed(2)}`
  }
  return `$${price.toFixed(2)}`
}
