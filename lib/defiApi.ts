export interface DeFiProtocol {
  id: string
  name: string
  symbol: string
  chain: string
  tvl: number
  change_1h: number
  change_1d: number
  change_7d: number
  category: string
}

export interface DeFiStats {
  totalTVL: number
  totalProtocols: number
  topProtocols: DeFiProtocol[]
  chainDominance: {
    chain: string
    tvl: number
    percentage: number
  }[]
  categoryBreakdown: {
    category: string
    tvl: number
    percentage: number
  }[]
}

export async function getDeFiStats(): Promise<DeFiStats> {
  // In production, this would call DeFi Llama or similar APIs
  // For now, returning realistic mock data
  
  const topProtocols: DeFiProtocol[] = [
    {
      id: 'lido',
      name: 'Lido',
      symbol: 'LDO',
      chain: 'Ethereum',
      tvl: 23400000000,
      change_1h: 0.5,
      change_1d: 2.3,
      change_7d: 5.8,
      category: 'Liquid Staking'
    },
    {
      id: 'makerdao',
      name: 'MakerDAO',
      symbol: 'MKR',
      chain: 'Ethereum',
      tvl: 8900000000,
      change_1h: -0.2,
      change_1d: 1.1,
      change_7d: 3.4,
      category: 'CDP'
    },
    {
      id: 'aave',
      name: 'Aave',
      symbol: 'AAVE',
      chain: 'Multi-Chain',
      tvl: 6700000000,
      change_1h: 0.8,
      change_1d: 3.2,
      change_7d: 7.1,
      category: 'Lending'
    },
    {
      id: 'justlend',
      name: 'JustLend',
      symbol: 'JST',
      chain: 'Tron',
      tvl: 6200000000,
      change_1h: 0.1,
      change_1d: -0.5,
      change_7d: 2.8,
      category: 'Lending'
    },
    {
      id: 'curve',
      name: 'Curve',
      symbol: 'CRV',
      chain: 'Multi-Chain',
      tvl: 4300000000,
      change_1h: 0.3,
      change_1d: 1.8,
      change_7d: 4.2,
      category: 'DEX'
    },
    {
      id: 'uniswap',
      name: 'Uniswap',
      symbol: 'UNI',
      chain: 'Multi-Chain',
      tvl: 4100000000,
      change_1h: 0.6,
      change_1d: 2.5,
      change_7d: 6.3,
      category: 'DEX'
    },
    {
      id: 'compound',
      name: 'Compound',
      symbol: 'COMP',
      chain: 'Ethereum',
      tvl: 3200000000,
      change_1h: -0.1,
      change_1d: 0.8,
      change_7d: 2.1,
      category: 'Lending'
    },
    {
      id: 'convex',
      name: 'Convex Finance',
      symbol: 'CVX',
      chain: 'Ethereum',
      tvl: 2800000000,
      change_1h: 0.4,
      change_1d: 1.5,
      change_7d: 3.7,
      category: 'Yield'
    }
  ]

  const totalTVL = topProtocols.reduce((sum, p) => sum + p.tvl, 0)

  const chainDominance = [
    { chain: 'Ethereum', tvl: 45000000000, percentage: 55 },
    { chain: 'Tron', tvl: 8000000000, percentage: 10 },
    { chain: 'BNB Chain', tvl: 6500000000, percentage: 8 },
    { chain: 'Solana', tvl: 4200000000, percentage: 5 },
    { chain: 'Arbitrum', tvl: 3800000000, percentage: 4.5 },
    { chain: 'Others', tvl: 14500000000, percentage: 17.5 }
  ]

  const categoryBreakdown = [
    { category: 'Liquid Staking', tvl: 28000000000, percentage: 34 },
    { category: 'Lending', tvl: 20000000000, percentage: 24 },
    { category: 'DEX', tvl: 16000000000, percentage: 19 },
    { category: 'CDP', tvl: 10000000000, percentage: 12 },
    { category: 'Yield', tvl: 6000000000, percentage: 7 },
    { category: 'Others', tvl: 3000000000, percentage: 4 }
  ]

  return {
    totalTVL: 82000000000,
    totalProtocols: 3500,
    topProtocols,
    chainDominance,
    categoryBreakdown
  }
}
