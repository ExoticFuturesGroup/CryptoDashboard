'use client'

import { useEffect, useState } from 'react'
import { 
  portfolioManager,
  ExchangeCredentials,
  PortfolioHolding,
  PortfolioStatistics,
  PortfolioTransaction
} from '@/lib/portfolio/portfolioManager'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899']

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([])
  const [statistics, setStatistics] = useState<PortfolioStatistics | null>(null)
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([])
  const [exchanges, setExchanges] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddExchange, setShowAddExchange] = useState(false)
  const [newExchange, setNewExchange] = useState<ExchangeCredentials>({
    exchangeName: '',
    apiKey: '',
    apiSecret: '',
    apiPassphrase: '',
    testMode: true
  })

  useEffect(() => {
    loadPortfolio()
  }, [])

  async function loadPortfolio() {
    try {
      const stats = await portfolioManager.getPortfolioStatistics()
      const allHoldings = portfolioManager.getAllHoldings()
      const recentTransactions = portfolioManager.getTransactions(20)
      const configuredExchanges = portfolioManager.getExchanges()

      setStatistics(stats)
      setHoldings(allHoldings)
      setTransactions(recentTransactions)
      setExchanges(configuredExchanges)
    } catch (error) {
      console.error('Error loading portfolio:', error)
    }
  }

  async function handleAddExchange() {
    if (!newExchange.exchangeName || !newExchange.apiKey || !newExchange.apiSecret) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await portfolioManager.addExchange(newExchange)
      await loadPortfolio()
      setShowAddExchange(false)
      setNewExchange({
        exchangeName: '',
        apiKey: '',
        apiSecret: '',
        apiPassphrase: '',
        testMode: true
      })
      alert(`Successfully connected to ${newExchange.exchangeName}`)
    } catch (error) {
      alert(`Error connecting to exchange: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveExchange(exchangeName: string) {
    if (confirm(`Are you sure you want to remove ${exchangeName}?`)) {
      portfolioManager.removeExchange(exchangeName)
      await loadPortfolio()
    }
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getPercentColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Portfolio</h1>
          <p className="text-gray-400 mt-2">
            Manage your cryptocurrency holdings and track performance
          </p>
        </div>
        <button
          onClick={() => setShowAddExchange(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition"
        >
          + Add Exchange
        </button>
      </div>

      {/* Add Exchange Modal */}
      {showAddExchange && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Add Exchange API</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Exchange Name</label>
                <select
                  value={newExchange.exchangeName}
                  onChange={(e) => setNewExchange({ ...newExchange, exchangeName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Exchange</option>
                  <option value="Binance">Binance</option>
                  <option value="Coinbase">Coinbase</option>
                  <option value="Kraken">Kraken</option>
                  <option value="Bybit">Bybit</option>
                  <option value="OKX">OKX</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">API Key</label>
                <input
                  type="text"
                  value={newExchange.apiKey}
                  onChange={(e) => setNewExchange({ ...newExchange, apiKey: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Your API Key"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">API Secret</label>
                <input
                  type="password"
                  value={newExchange.apiSecret}
                  onChange={(e) => setNewExchange({ ...newExchange, apiSecret: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Your API Secret"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">API Passphrase (if required)</label>
                <input
                  type="password"
                  value={newExchange.apiPassphrase}
                  onChange={(e) => setNewExchange({ ...newExchange, apiPassphrase: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newExchange.testMode}
                  onChange={(e) => setNewExchange({ ...newExchange, testMode: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-400">Use Test Mode (Recommended)</label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddExchange}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect'}
              </button>
              <button
                onClick={() => setShowAddExchange(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              🔒 Your API keys are stored locally and never sent to our servers.
              Make sure to use read-only API keys.
            </p>
          </div>
        </div>
      )}

      {/* Connected Exchanges */}
      {exchanges.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Connected Exchanges</h2>
          <div className="flex flex-wrap gap-4">
            {exchanges.map(exchange => (
              <div key={exchange} className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                <span className="font-bold">{exchange}</span>
                <button
                  onClick={() => handleRemoveExchange(exchange)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {holdings.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-lg p-12 border border-gray-700 text-center">
          <h3 className="text-2xl font-bold mb-4">No Portfolio Data</h3>
          <p className="text-gray-400 mb-6">
            Connect your exchange API to automatically sync your portfolio or manually add transactions
          </p>
          <button
            onClick={() => setShowAddExchange(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition"
          >
            Get Started
          </button>
        </div>
      ) : (
        <>
          {/* Portfolio Statistics */}
          {statistics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <h3 className="text-sm text-gray-400 mb-2">Total Portfolio Value</h3>
                  <p className="text-3xl font-bold text-blue-400">{formatCurrency(statistics.totalValue)}</p>
                  <p className={`text-sm mt-2 ${getPercentColor(statistics.dayChangePercent)}`}>
                    {formatPercent(statistics.dayChangePercent)} (24h)
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <h3 className="text-sm text-gray-400 mb-2">Total Profit/Loss</h3>
                  <p className={`text-3xl font-bold ${getPercentColor(statistics.totalProfitLoss)}`}>
                    {formatCurrency(statistics.totalProfitLoss)}
                  </p>
                  <p className={`text-sm mt-2 ${getPercentColor(statistics.totalProfitLossPercent)}`}>
                    {formatPercent(statistics.totalProfitLossPercent)}
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <h3 className="text-sm text-gray-400 mb-2">Best Performer</h3>
                  <p className="text-2xl font-bold text-green-400">{statistics.bestPerformer.symbol}</p>
                  <p className="text-sm mt-2 text-green-400">
                    {formatPercent(statistics.bestPerformer.return)}
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <h3 className="text-sm text-gray-400 mb-2">Sharpe Ratio</h3>
                  <p className="text-3xl font-bold text-purple-400">{statistics.sharpeRatio.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">Risk-adjusted return</p>
                </div>
              </div>

              {/* Additional Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <h3 className="text-sm text-gray-400 mb-3">Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Week:</span>
                      <span className={`text-sm font-bold ${getPercentColor(statistics.weekChangePercent)}`}>
                        {formatPercent(statistics.weekChangePercent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Month:</span>
                      <span className={`text-sm font-bold ${getPercentColor(statistics.monthChangePercent)}`}>
                        {formatPercent(statistics.monthChangePercent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">All-Time High:</span>
                      <span className="text-sm font-bold">{formatCurrency(statistics.allTimeHigh)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <h3 className="text-sm text-gray-400 mb-3">Risk Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Volatility:</span>
                      <span className="text-sm font-bold">{statistics.volatility.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Invested:</span>
                      <span className="text-sm font-bold">{formatCurrency(statistics.totalInvested)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Worst Performer:</span>
                      <span className="text-sm font-bold text-red-400">{statistics.worstPerformer.symbol}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <h3 className="text-sm text-gray-400 mb-3">Holdings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Assets:</span>
                      <span className="text-sm font-bold">{holdings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Exchanges:</span>
                      <span className="text-sm font-bold">{exchanges.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transactions:</span>
                      <span className="text-sm font-bold">{transactions.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Allocation */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Portfolio Allocation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={holdings as any}
                        dataKey="allocation"
                        nameKey="symbol"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry: any) => `${entry.symbol}: ${entry.allocation.toFixed(1)}%`}
                      >
                        {holdings.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {holdings.map((holding, index) => (
                      <div key={holding.symbol} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{holding.symbol}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{formatCurrency(holding.value)}</p>
                          <p className={`text-xs ${getPercentColor(holding.profitLossPercent)}`}>
                            {formatPercent(holding.profitLossPercent)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Holdings Table */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Asset</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-right py-3 px-4">Avg Buy Price</th>
                    <th className="text-right py-3 px-4">Current Price</th>
                    <th className="text-right py-3 px-4">Value</th>
                    <th className="text-right py-3 px-4">Profit/Loss</th>
                    <th className="text-right py-3 px-4">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map(holding => (
                    <tr key={holding.symbol} className="border-b border-gray-800 hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="font-bold">{holding.symbol}</div>
                        <div className="text-xs text-gray-400">{holding.coinId}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{holding.amount.toFixed(4)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(holding.averageBuyPrice)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(holding.currentPrice)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">{formatCurrency(holding.value)}</td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${getPercentColor(holding.profitLoss)}`}>
                        <div>{formatCurrency(holding.profitLoss)}</div>
                        <div className="text-sm">{formatPercent(holding.profitLossPercent)}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{holding.allocation.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction History */}
          {transactions.length > 0 && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Asset</th>
                      <th className="text-right py-3 px-4">Amount</th>
                      <th className="text-right py-3 px-4">Price</th>
                      <th className="text-right py-3 px-4">Fee</th>
                      <th className="text-left py-3 px-4">Exchange</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(txn => (
                      <tr key={txn.id} className="border-b border-gray-800 hover:bg-gray-700">
                        <td className="py-3 px-4 text-sm">
                          {new Date(txn.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            txn.type === 'BUY' ? 'bg-green-600' :
                            txn.type === 'SELL' ? 'bg-red-600' :
                            'bg-blue-600'
                          }`}>
                            {txn.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold">{txn.symbol}</td>
                        <td className="py-3 px-4 text-right font-mono">{txn.amount.toFixed(4)}</td>
                        <td className="py-3 px-4 text-right font-mono">{formatCurrency(txn.price)}</td>
                        <td className="py-3 px-4 text-right font-mono text-gray-400">{formatCurrency(txn.fee)}</td>
                        <td className="py-3 px-4">{txn.exchange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Information */}
      <div className="bg-green-900 border-green-700 rounded-lg shadow-lg p-6 border">
        <h3 className="text-lg font-bold mb-3">💼 Portfolio Features</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Connect multiple exchange APIs (Binance, Coinbase, Kraken, Bybit, OKX)</li>
          <li>• Automatic portfolio synchronization and real-time tracking</li>
          <li>• Comprehensive performance metrics and risk analysis</li>
          <li>• Sharpe Ratio calculation for risk-adjusted returns</li>
          <li>• Transaction history and cost basis tracking</li>
          <li>• Portfolio allocation visualization and rebalancing insights</li>
        </ul>
      </div>
    </div>
  )
}
