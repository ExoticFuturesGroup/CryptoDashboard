'use client'

import { useEffect, useState } from 'react'
import { 
  getMarketOverview, 
  getMarketCapHistory, 
  getVolumeHistory,
  getDominanceData,
  getMarketTrends,
  MarketOverview as MarketOverviewType,
  MarketCapHistory,
  VolumeHistory,
  DominanceChart,
  MarketTrend
} from '@/lib/marketOverviewApi'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899']

export default function MarketOverviewPage() {
  const [overview, setOverview] = useState<MarketOverviewType | null>(null)
  const [marketCapHistory, setMarketCapHistory] = useState<MarketCapHistory[]>([])
  const [volumeHistory, setVolumeHistory] = useState<VolumeHistory[]>([])
  const [dominanceData, setDominanceData] = useState<DominanceChart[]>([])
  const [trends, setTrends] = useState<MarketTrend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [overviewData, capHistory, volHistory, dominance, trendData] = await Promise.all([
        getMarketOverview(),
        getMarketCapHistory(),
        getVolumeHistory(),
        getDominanceData(),
        getMarketTrends()
      ])
      
      setOverview(overviewData)
      setMarketCapHistory(capHistory)
      setVolumeHistory(volHistory)
      setDominanceData(dominance)
      setTrends(trendData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading market overview:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading market overview...</p>
        </div>
      </div>
    )
  }

  if (!overview) {
    return <div className="text-center py-12">Failed to load data</div>
  }

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getFearGreedColor = (index: number) => {
    if (index >= 75) return 'text-green-400'
    if (index >= 55) return 'text-blue-400'
    if (index >= 45) return 'text-yellow-400'
    if (index >= 25) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Market Overview</h1>
        <p className="text-gray-400 mt-2">
          Comprehensive cryptocurrency market statistics and analysis
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Total Market Cap</h3>
          <p className="text-3xl font-bold text-blue-400">{formatCurrency(overview.totalMarketCap)}</p>
          <p className={`text-sm mt-2 ${overview.marketCapChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {overview.marketCapChange24h >= 0 ? '+' : ''}{overview.marketCapChange24h.toFixed(2)}% (24h)
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">24h Trading Volume</h3>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(overview.total24hVolume)}</p>
          <p className={`text-sm mt-2 ${overview.volumeChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {overview.volumeChange24h >= 0 ? '+' : ''}{overview.volumeChange24h.toFixed(2)}% (24h)
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">BTC Dominance</h3>
          <p className="text-3xl font-bold text-orange-400">{overview.btcDominance.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-2">ETH: {overview.ethDominance.toFixed(1)}%</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Fear & Greed Index</h3>
          <p className={`text-3xl font-bold ${getFearGreedColor(overview.fearGreedIndex)}`}>
            {overview.fearGreedIndex}
          </p>
          <p className="text-sm text-gray-500 mt-2">{overview.fearGreedLabel}</p>
        </div>
      </div>

      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Active Cryptocurrencies</h3>
          <p className="text-2xl font-bold">{overview.activeCoins.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Active Markets</h3>
          <p className="text-2xl font-bold">{overview.activeMarkets.toLocaleString()}</p>
        </div>
      </div>

      {/* Market Cap History */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Market Cap (7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={marketCapHistory}>
            <defs>
              <linearGradient id="marketCapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9ca3af"
              tickFormatter={formatDate}
            />
            <YAxis 
              stroke="#9ca3af"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value?: number) => value ? [formatCurrency(value), 'Market Cap'] : ['', '']}
              labelFormatter={formatDate}
            />
            <Area 
              type="monotone" 
              dataKey="marketCap" 
              stroke="#3b82f6" 
              fillOpacity={1}
              fill="url(#marketCapGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume History */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Trading Volume (7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={volumeHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9ca3af"
              tickFormatter={formatDate}
            />
            <YAxis 
              stroke="#9ca3af"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value?: number) => value ? [formatCurrency(value), 'Volume'] : ['', '']}
              labelFormatter={formatDate}
            />
            <Bar dataKey="volume" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Market Dominance */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Market Dominance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dominanceData as any}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) => `${entry.name}: ${entry.value}%`}
              >
                {dominanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value?: number) => value ? `${value}%` : ''} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {dominanceData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-300">{item.value}%</span>
                  <span className={`text-sm ml-2 ${item.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Market Trends</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Period</th>
                <th className="text-right py-3 px-4">Market Cap</th>
                <th className="text-right py-3 px-4">Volume</th>
                <th className="text-right py-3 px-4">Change</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend) => (
                <tr key={trend.period} className="border-b border-gray-800 hover:bg-gray-700">
                  <td className="py-3 px-4 font-medium">{trend.period}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(trend.marketCap)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(trend.volume)}</td>
                  <td className={`py-3 px-4 text-right font-bold ${trend.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-blue-900 border-blue-700 rounded-lg shadow-lg p-6 border">
        <h3 className="text-lg font-bold mb-3">📊 Market Insights</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Total market capitalization has {overview.marketCapChange24h >= 0 ? 'increased' : 'decreased'} by {Math.abs(overview.marketCapChange24h).toFixed(2)}% in the last 24 hours</li>
          <li>• Bitcoin maintains {overview.btcDominance.toFixed(1)}% market dominance, indicating {overview.btcDominance > 50 ? 'strong' : 'moderate'} market leadership</li>
          <li>• The Fear & Greed Index at {overview.fearGreedIndex} suggests market sentiment is in "{overview.fearGreedLabel}" territory</li>
          <li>• Trading volume of {formatCurrency(overview.total24hVolume)} reflects {overview.volumeChange24h >= 0 ? 'increased' : 'decreased'} market activity</li>
          <li>• {overview.activeCoins.toLocaleString()} active cryptocurrencies across {overview.activeMarkets.toLocaleString()} markets demonstrate a diverse ecosystem</li>
        </ul>
      </div>
    </div>
  )
}
