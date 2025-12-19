/**
 * Portfolio Management Module
 * Handles exchange API integration and portfolio analytics
 */

export interface ExchangeCredentials {
  exchangeName: string
  apiKey: string
  apiSecret: string
  apiPassphrase?: string
  testMode: boolean
}

export interface PortfolioHolding {
  symbol: string
  coinId: string
  amount: number
  averageBuyPrice: number
  currentPrice: number
  value: number
  profitLoss: number
  profitLossPercent: number
  allocation: number // Percentage of total portfolio
}

export interface PortfolioTransaction {
  id: string
  timestamp: number
  type: 'BUY' | 'SELL' | 'TRANSFER_IN' | 'TRANSFER_OUT'
  symbol: string
  amount: number
  price: number
  fee: number
  exchange: string
}

export interface PortfolioStatistics {
  totalValue: number
  totalInvested: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  dayChange: number
  dayChangePercent: number
  weekChange: number
  weekChangePercent: number
  monthChange: number
  monthChangePercent: number
  allTimeHigh: number
  allTimeLow: number
  sharpeRatio: number
  volatility: number
  bestPerformer: { symbol: string, return: number }
  worstPerformer: { symbol: string, return: number }
}

export interface ExchangeBalance {
  exchange: string
  holdings: PortfolioHolding[]
  totalValue: number
  lastSync: number
}

/**
 * Portfolio Manager Class
 */
class PortfolioManager {
  private exchanges: Map<string, ExchangeCredentials> = new Map()
  private holdings: Map<string, PortfolioHolding> = new Map()
  private transactions: PortfolioTransaction[] = []
  private balanceHistory: Array<{ timestamp: number, value: number }> = []

  /**
   * Add exchange API credentials
   */
  async addExchange(credentials: ExchangeCredentials): Promise<void> {
    // Validate credentials (in production, test API connection)
    if (!credentials.apiKey || !credentials.apiSecret) {
      throw new Error('Invalid API credentials')
    }

    this.exchanges.set(credentials.exchangeName, credentials)
    console.log(`Added ${credentials.exchangeName} to portfolio`)
    
    // Sync balances
    await this.syncExchange(credentials.exchangeName)
  }

  /**
   * Remove exchange
   */
  removeExchange(exchangeName: string): void {
    this.exchanges.delete(exchangeName)
    console.log(`Removed ${exchangeName} from portfolio`)
  }

  /**
   * Get all configured exchanges
   */
  getExchanges(): string[] {
    return Array.from(this.exchanges.keys())
  }

  /**
   * Sync balances from exchange
   */
  async syncExchange(exchangeName: string): Promise<void> {
    const credentials = this.exchanges.get(exchangeName)
    if (!credentials) {
      throw new Error(`Exchange ${exchangeName} not configured`)
    }

    // In production, call actual exchange API
    // For now, generate mock data
    const mockHoldings = await this.fetchExchangeBalances(exchangeName, credentials)
    
    // Update holdings
    for (const holding of mockHoldings) {
      const key = `${exchangeName}-${holding.symbol}`
      this.holdings.set(key, holding)
    }

    console.log(`Synced ${mockHoldings.length} holdings from ${exchangeName}`)
  }

  /**
   * Fetch balances from exchange API
   */
  private async fetchExchangeBalances(
    exchangeName: string,
    credentials: ExchangeCredentials
  ): Promise<PortfolioHolding[]> {
    // In production, integrate with actual exchange APIs:
    // - Binance: https://api.binance.com
    // - Coinbase: https://api.coinbase.com
    // - Kraken: https://api.kraken.com
    // - etc.

    // Mock data for demonstration
    const mockCoins = [
      { symbol: 'BTC', amount: 0.5, avgPrice: 38000, currentPrice: 43000 },
      { symbol: 'ETH', amount: 5.2, avgPrice: 2100, currentPrice: 2250 },
      { symbol: 'SOL', amount: 120, avgPrice: 85, currentPrice: 98 },
      { symbol: 'AVAX', amount: 200, avgPrice: 32, currentPrice: 37 },
      { symbol: 'LINK', amount: 450, avgPrice: 12.5, currentPrice: 14.5 }
    ]

    return mockCoins.map(coin => {
      const value = coin.amount * coin.currentPrice
      const invested = coin.amount * coin.avgPrice
      const profitLoss = value - invested
      const profitLossPercent = (profitLoss / invested) * 100

      return {
        symbol: coin.symbol,
        coinId: coin.symbol.toLowerCase(),
        amount: coin.amount,
        averageBuyPrice: coin.avgPrice,
        currentPrice: coin.currentPrice,
        value,
        profitLoss,
        profitLossPercent,
        allocation: 0 // Will be calculated in getPortfolioStatistics
      }
    })
  }

  /**
   * Get all portfolio holdings
   */
  getAllHoldings(): PortfolioHolding[] {
    return Array.from(this.holdings.values())
  }

  /**
   * Get portfolio holdings by exchange
   */
  getHoldingsByExchange(exchangeName: string): PortfolioHolding[] {
    const holdings: PortfolioHolding[] = []
    for (const [key, holding] of this.holdings) {
      if (key.startsWith(exchangeName)) {
        holdings.push(holding)
      }
    }
    return holdings
  }

  /**
   * Get comprehensive portfolio statistics
   */
  async getPortfolioStatistics(): Promise<PortfolioStatistics> {
    const holdings = this.getAllHoldings()
    
    if (holdings.length === 0) {
      return this.getEmptyStatistics()
    }

    // Calculate totals
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)
    const totalInvested = holdings.reduce((sum, h) => sum + (h.amount * h.averageBuyPrice), 0)
    const totalProfitLoss = totalValue - totalInvested
    const totalProfitLossPercent = (totalProfitLoss / totalInvested) * 100

    // Update allocations
    holdings.forEach(h => {
      h.allocation = (h.value / totalValue) * 100
    })

    // Calculate time-based changes (mock data)
    const dayChange = totalValue * (Math.random() * 0.04 - 0.02) // -2% to +2%
    const dayChangePercent = (dayChange / (totalValue - dayChange)) * 100
    const weekChange = totalValue * (Math.random() * 0.08 - 0.04)
    const weekChangePercent = (weekChange / (totalValue - weekChange)) * 100
    const monthChange = totalValue * (Math.random() * 0.16 - 0.08)
    const monthChangePercent = (monthChange / (totalValue - monthChange)) * 100

    // Calculate risk metrics
    const returns = holdings.map(h => h.profitLossPercent / 100)
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    const volatility = Math.sqrt(variance) * 100

    // Sharpe Ratio (simplified - assumes risk-free rate of 2%)
    const riskFreeRate = 0.02
    const excessReturn = avgReturn - riskFreeRate
    const sharpeRatio = volatility > 0 ? excessReturn / (volatility / 100) : 0

    // Best and worst performers
    const sortedByPerformance = [...holdings].sort((a, b) => b.profitLossPercent - a.profitLossPercent)
    const bestPerformer = {
      symbol: sortedByPerformance[0]?.symbol || 'N/A',
      return: sortedByPerformance[0]?.profitLossPercent || 0
    }
    const worstPerformer = {
      symbol: sortedByPerformance[sortedByPerformance.length - 1]?.symbol || 'N/A',
      return: sortedByPerformance[sortedByPerformance.length - 1]?.profitLossPercent || 0
    }

    // Historical high/low
    const allTimeHigh = totalValue * 1.15 // Mock
    const allTimeLow = totalInvested * 0.85 // Mock

    return {
      totalValue,
      totalInvested,
      totalProfitLoss,
      totalProfitLossPercent,
      dayChange,
      dayChangePercent,
      weekChange,
      weekChangePercent,
      monthChange,
      monthChangePercent,
      allTimeHigh,
      allTimeLow,
      sharpeRatio,
      volatility,
      bestPerformer,
      worstPerformer
    }
  }

  /**
   * Add manual transaction
   */
  addTransaction(transaction: Omit<PortfolioTransaction, 'id'>): void {
    const newTransaction: PortfolioTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...transaction
    }
    
    this.transactions.push(newTransaction)
    console.log(`Added transaction: ${transaction.type} ${transaction.amount} ${transaction.symbol}`)
  }

  /**
   * Get transaction history
   */
  getTransactions(limit?: number): PortfolioTransaction[] {
    const sorted = [...this.transactions].sort((a, b) => b.timestamp - a.timestamp)
    return limit ? sorted.slice(0, limit) : sorted
  }

  /**
   * Get transactions for a specific coin
   */
  getTransactionsBySymbol(symbol: string): PortfolioTransaction[] {
    return this.transactions.filter(t => t.symbol === symbol)
  }

  /**
   * Export portfolio data
   */
  exportPortfolio(): {
    holdings: PortfolioHolding[]
    transactions: PortfolioTransaction[]
    exchanges: string[]
  } {
    return {
      holdings: this.getAllHoldings(),
      transactions: this.getTransactions(),
      exchanges: this.getExchanges()
    }
  }

  /**
   * Get empty statistics
   */
  private getEmptyStatistics(): PortfolioStatistics {
    return {
      totalValue: 0,
      totalInvested: 0,
      totalProfitLoss: 0,
      totalProfitLossPercent: 0,
      dayChange: 0,
      dayChangePercent: 0,
      weekChange: 0,
      weekChangePercent: 0,
      monthChange: 0,
      monthChangePercent: 0,
      allTimeHigh: 0,
      allTimeLow: 0,
      sharpeRatio: 0,
      volatility: 0,
      bestPerformer: { symbol: 'N/A', return: 0 },
      worstPerformer: { symbol: 'N/A', return: 0 }
    }
  }
}

// Singleton instance
export const portfolioManager = new PortfolioManager()
