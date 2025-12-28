'use client'

import { useEffect, useState } from 'react'
import { getDeFiStats, DeFiStats } from '@/lib/defiApi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

export default function DeFiPage() {
  const [stats, setStats] = useState<DeFiStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const data = await getDeFiStats()
      setStats(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading DeFi stats:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading DeFi statistics...</p>
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
        <h1 className="text-4xl font-bold">DeFi Analytics</h1>
        <p className="text-gray-400 mt-2">
          Decentralized Finance Protocol Statistics and TVL Data
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Total Value Locked</h3>
          <p className="text-3xl font-bold text-purple-400">
            ${(stats.totalTVL / 1e9).toFixed(2)}B
          </p>
          <p className="text-xs text-gray-500 mt-2">Across all DeFi protocols</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Total Protocols</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.totalProtocols.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Active DeFi protocols</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-2">Leading Protocol</h3>
          <p className="text-3xl font-bold text-green-400">{stats.topProtocols[0].name}</p>
          <p className="text-xs text-gray-500 mt-2">
            ${(stats.topProtocols[0].tvl / 1e9).toFixed(2)}B TVL
          </p>
        </div>
      </div>

      {/* Protocol TVL Chart */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Top Protocols by TVL</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats.topProtocols}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
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
              formatter={(value?: number) => value ? [`$${(value / 1e9).toFixed(2)}B`, 'TVL'] : ['', '']}
            />
            <Bar dataKey="tvl" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chain Dominance */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Chain Dominance by TVL</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.chainDominance}
                dataKey="percentage"
                nameKey="chain"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) => `${entry.chain}: ${entry.percentage}%`}
              >
                {stats.chainDominance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value?: number) => value ? `${value}%` : ""} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {stats.chainDominance.map((item, index) => (
              <div key={item.chain} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{item.chain}</span>
                  </div>
                  <span className="text-gray-400">{item.percentage}%</span>
                </div>
                <div className="ml-7 text-sm text-gray-500">
                  ${(item.tvl / 1e9).toFixed(2)}B TVL
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Category Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryBreakdown}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) => `${entry.category}: ${entry.percentage}%`}
              >
                {stats.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value?: number) => value ? `${value}%` : ""} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {stats.categoryBreakdown.map((item, index) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <span className="text-gray-400">{item.percentage}%</span>
                </div>
                <div className="ml-7 text-sm text-gray-500">
                  ${(item.tvl / 1e9).toFixed(2)}B TVL
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Protocols Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Top DeFi Protocols</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Protocol</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Chain</th>
                <th className="text-right py-3 px-4">TVL</th>
                <th className="text-right py-3 px-4">1h</th>
                <th className="text-right py-3 px-4">24h</th>
                <th className="text-right py-3 px-4">7d</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProtocols.map((protocol, index) => (
                <tr key={protocol.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-bold">{protocol.name}</div>
                      <div className="text-sm text-gray-400">{protocol.symbol}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs bg-gray-700">
                      {protocol.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{protocol.chain}</td>
                  <td className="py-3 px-4 text-right font-mono text-purple-400">
                    ${(protocol.tvl / 1e9).toFixed(2)}B
                  </td>
                  <td className={`py-3 px-4 text-right ${protocol.change_1h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {protocol.change_1h >= 0 ? '+' : ''}{protocol.change_1h.toFixed(2)}%
                  </td>
                  <td className={`py-3 px-4 text-right ${protocol.change_1d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d.toFixed(2)}%
                  </td>
                  <td className={`py-3 px-4 text-right ${protocol.change_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {protocol.change_7d >= 0 ? '+' : ''}{protocol.change_7d.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 bg-purple-900 border-purple-700">
        <h3 className="text-lg font-bold mb-3">⛓️ Key Insights</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Ethereum dominates with {stats.chainDominance[0].percentage}% of total DeFi TVL</li>
          <li>• Liquid Staking is the largest category at {stats.categoryBreakdown[0].percentage}% of TVL</li>
          <li>• Top 3 protocols hold ${((stats.topProtocols.slice(0, 3).reduce((sum, p) => sum + p.tvl, 0)) / 1e9).toFixed(2)}B in combined TVL</li>
          <li>• Multi-chain protocols are gaining traction for cross-ecosystem liquidity</li>
          <li>• {stats.totalProtocols.toLocaleString()} active protocols demonstrate a vibrant DeFi ecosystem</li>
        </ul>
      </div>
    </div>
  )
}
