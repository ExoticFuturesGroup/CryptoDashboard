import axios from 'axios'

export interface CoinData {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_1h_in_currency?: number
  high_24h: number
  low_24h: number
}

// Fetch top coins by trading volume from CoinGecko
export async function getTopCoinsByVolume(limit: number = 20): Promise<CoinData[]> {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          order: 'volume_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '1h'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching coin data:', error)
    // Return mock data for development
    return generateMockCoinData(limit)
  }
}

// Generate mock data for development/testing
function generateMockCoinData(limit: number): CoinData[] {
  const mockCoins = [
    { symbol: 'btc', name: 'Bitcoin', basePrice: 43000 },
    { symbol: 'eth', name: 'Ethereum', basePrice: 2250 },
    { symbol: 'usdt', name: 'Tether', basePrice: 1.00 },
    { symbol: 'bnb', name: 'BNB', basePrice: 310 },
    { symbol: 'sol', name: 'Solana', basePrice: 98 },
    { symbol: 'xrp', name: 'XRP', basePrice: 0.62 },
    { symbol: 'usdc', name: 'USD Coin', basePrice: 1.00 },
    { symbol: 'ada', name: 'Cardano', basePrice: 0.58 },
    { symbol: 'avax', name: 'Avalanche', basePrice: 37 },
    { symbol: 'doge', name: 'Dogecoin', basePrice: 0.09 },
    { symbol: 'dot', name: 'Polkadot', basePrice: 7.2 },
    { symbol: 'matic', name: 'Polygon', basePrice: 0.89 },
    { symbol: 'link', name: 'Chainlink', basePrice: 14.5 },
    { symbol: 'trx', name: 'TRON', basePrice: 0.10 },
    { symbol: 'dai', name: 'Dai', basePrice: 1.00 },
    { symbol: 'ltc', name: 'Litecoin', basePrice: 72 },
    { symbol: 'uni', name: 'Uniswap', basePrice: 6.8 },
    { symbol: 'atom', name: 'Cosmos', basePrice: 10.2 },
    { symbol: 'etc', name: 'Ethereum Classic', basePrice: 20.5 },
    { symbol: 'xlm', name: 'Stellar', basePrice: 0.13 }
  ]

  return mockCoins.slice(0, limit).map((coin, index) => {
    const volatility = Math.random() * 0.1 - 0.05 // -5% to +5%
    const current_price = coin.basePrice * (1 + volatility)
    
    return {
      id: coin.symbol,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price,
      market_cap: current_price * (1000000 - index * 10000),
      total_volume: current_price * (100000 - index * 1000),
      price_change_percentage_24h: (Math.random() * 20 - 10),
      price_change_percentage_1h_in_currency: (Math.random() * 4 - 2),
      high_24h: current_price * 1.05,
      low_24h: current_price * 0.95
    }
  })
}

// Fetch historical data for a coin (simulated)
export async function getHistoricalData(coinId: string, days: number = 1) {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: 'minute'
        }
      }
    )
    return response.data.prices
  } catch (error) {
    console.error('Error fetching historical data:', error)
    return []
  }
}
