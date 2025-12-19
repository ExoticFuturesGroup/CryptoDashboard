'use client'

import { useEffect, useState } from 'react'
import { getCEFIStats, CEFIStats } from '@/lib/cefiApi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

export default function CEFIPage() {
  const [stats, setStats] = useState<CEFIStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const data = await getCEFIStats()
      setStats(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading CEFI stats:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading CEFI statistics...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load data</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">CEFI Analytics</h1>
        <p className="text-gray-400 mt-2">
          Centralized Exchange Statistics and Market Data
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Total Exchanges</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.totalExchanges}</p>
          <p className="text-xs text-gray-500 mt-2">Active centralized exchanges</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">24h Trading Volume</h3>
          <p className="text-3xl font-bold text-green-400">
            ${(stats.total24hVolume / 1e9).toFixed(2)}B
          </p>
          <p className="text-xs text-gray-500 mt-2">Across all major exchanges</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Top Exchange</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.topExchanges[0].name}</p>
          <p className="text-xs text-gray-500 mt-2">
            ${(stats.topExchanges[0].trade_volume_24h_usd / 1e9).toFixed(2)}B daily volume
          </p>
        </div>
      </div>

      {/* Exchange Volume Chart */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Exchange 24h Volume Comparison</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats.topExchanges}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis 
              stroke="#9ca3af"
              tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value?: number) => value ? [`$${(value / 1e9).toFixed(2)}B`, '24h Volume'] : ['', '']}
            />
            <Bar dataKey="trade_volume_24h_usd" fill="#3b82f6" />
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
                data={stats.dominance}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
              >
                {stats.dominance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value?: number) => value ? `${value.toFixed(2)}%` : ''} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {stats.dominance.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-gray-400">{item.percentage.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Exchanges Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Top Exchanges</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Exchange</th>
                <th className="text-left py-3 px-4">Country</th>
                <th className="text-left py-3 px-4">Established</th>
                <th className="text-right py-3 px-4">Trust Score</th>
                <th className="text-right py-3 px-4">24h Volume (BTC)</th>
                <th className="text-right py-3 px-4">24h Volume (USD)</th>
              </tr>
            </thead>
            <tbody>
              {stats.topExchanges.map((exchange, index) => (
                <tr key={exchange.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-bold">{exchange.name}</td>
                  <td className="py-3 px-4 text-gray-400">{exchange.country}</td>
                  <td className="py-3 px-4 text-gray-400">{exchange.year_established}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-sm ${
                      exchange.trust_score >= 9 ? 'bg-green-600' :
                      exchange.trust_score >= 7 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}>
                      {exchange.trust_score}/10
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {exchange.trade_volume_24h_btc.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-green-400">
                    ${(exchange.trade_volume_24h_usd / 1e9).toFixed(2)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 bg-blue-900 border-blue-700">
        <h3 className="text-lg font-bold mb-3">📊 Key Insights</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• {stats.topExchanges[0].name} leads with {((stats.dominance[0].percentage)).toFixed(1)}% market share</li>
          <li>• Top 3 exchanges control {(stats.dominance.slice(0, 3).reduce((sum, d) => sum + d.percentage, 0)).toFixed(1)}% of trading volume</li>
          <li>• Average trust score of top exchanges: {(stats.topExchanges.reduce((sum, e) => sum + e.trust_score, 0) / stats.topExchanges.length).toFixed(1)}/10</li>
          <li>• Total market concentration indicates healthy competition among major players</li>
        </ul>
      </div>
    </div>
  )
}
