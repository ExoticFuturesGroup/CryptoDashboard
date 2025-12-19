export interface Exchange {
  id: string
  name: string
  year_established: number
  country: string
  trust_score: number
  trade_volume_24h_btc: number
  trade_volume_24h_usd: number
}

export interface CEFIStats {
  totalExchanges: number
  total24hVolume: number
  topExchanges: Exchange[]
  dominance: {
    name: string
    percentage: number
  }[]
}

export async function getCEFIStats(): Promise<CEFIStats> {
  // In production, this would call actual exchange APIs
  // For now, returning realistic mock data
  
  const topExchanges: Exchange[] = [
    {
      id: 'binance',
      name: 'Binance',
      year_established: 2017,
      country: 'Cayman Islands',
      trust_score: 10,
      trade_volume_24h_btc: 145000,
      trade_volume_24h_usd: 6235000000
    },
    {
      id: 'coinbase',
      name: 'Coinbase Exchange',
      year_established: 2012,
      country: 'United States',
      trust_score: 10,
      trade_volume_24h_btc: 58000,
      trade_volume_24h_usd: 2494000000
    },
    {
      id: 'kraken',
      name: 'Kraken',
      year_established: 2011,
      country: 'United States',
      trust_score: 10,
      trade_volume_24h_btc: 34000,
      trade_volume_24h_usd: 1462000000
    },
    {
      id: 'okx',
      name: 'OKX',
      year_established: 2013,
      country: 'Seychelles',
      trust_score: 9,
      trade_volume_24h_btc: 42000,
      trade_volume_24h_usd: 1806000000
    },
    {
      id: 'bybit',
      name: 'Bybit',
      year_established: 2018,
      country: 'Dubai',
      trust_score: 9,
      trade_volume_24h_btc: 38000,
      trade_volume_24h_usd: 1634000000
    },
    {
      id: 'huobi',
      name: 'HTX',
      year_established: 2013,
      country: 'Seychelles',
      trust_score: 8,
      trade_volume_24h_btc: 28000,
      trade_volume_24h_usd: 1204000000
    }
  ]

  const total24hVolume = topExchanges.reduce((sum, ex) => sum + ex.trade_volume_24h_usd, 0)

  const dominance = topExchanges.slice(0, 5).map(ex => ({
    name: ex.name,
    percentage: (ex.trade_volume_24h_usd / total24hVolume) * 100
  }))

  return {
    totalExchanges: 150,
    total24hVolume,
    topExchanges,
    dominance
  }
}
