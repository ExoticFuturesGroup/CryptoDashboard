'use client'

import { useEffect, useState } from 'react'
import { getHotTokens, HotToken, HotTokensData, formatVolume, formatPrice } from '@/lib/hotTokensApi'

export default function HotTokensPage() {
  const [data, setData] = useState<HotTokensData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'volume'>('gainers')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  async function loadData() {
    try {
      const hotTokens = await getHotTokens()
      setData(hotTokens)
      setLoading(false)
    } catch (error) {
      console.error('Error loading hot tokens:', error)
      setLoading(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading hot tokens...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Failed to load hot tokens data</p>
        <button
          onClick={loadData}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Retry
        </button>
      </div>
    )
  }

  const currentTokens = 
    activeTab === 'gainers' ? data.topGainers :
    activeTab === 'losers' ? data.topLosers :
    data.topByVolume

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">🔥 Hot Tokens</h1>
          <p className="text-gray-400 mt-2">
            Real-time tracking of tokens with highest price changes and trading volume in last 30 minutes
          </p>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          🔄 Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-2">🚀 Top Gainer (30m)</h3>
          <p className="text-3xl font-bold text-green-400">
            {data.topGainers[0].symbol}
          </p>
          <p className="text-xl text-green-400 mt-1">
            +{data.topGainers[0].priceChange30m.toFixed(2)}%
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-2">📉 Top Loser (30m)</h3>
          <p className="text-3xl font-bold text-red-400">
            {data.topLosers[0].symbol}
          </p>
          <p className="text-xl text-red-400 mt-1">
            {data.topLosers[0].priceChange30m.toFixed(2)}%
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-2">💰 Highest Volume (30m)</h3>
          <p className="text-3xl font-bold text-blue-400">
            {data.topByVolume[0].symbol}
          </p>
          <p className="text-xl text-blue-400 mt-1">
            {formatVolume(data.topByVolume[0].volume30m)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`flex-1 py-4 px-6 font-bold transition ${
              activeTab === 'gainers'
                ? 'bg-green-900 text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🚀 Top Gainers ({data.topGainers.length})
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`flex-1 py-4 px-6 font-bold transition ${
              activeTab === 'losers'
                ? 'bg-red-900 text-red-400 border-b-2 border-red-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            📉 Top Losers ({data.topLosers.length})
          </button>
          <button
            onClick={() => setActiveTab('volume')}
            className={`flex-1 py-4 px-6 font-bold transition ${
              activeTab === 'volume'
                ? 'bg-blue-900 text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            💰 Top by Volume ({data.topByVolume.length})
          </button>
        </div>

        {/* Tokens Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-750">
                <th className="text-left py-4 px-6">Rank</th>
                <th className="text-left py-4 px-6">Token</th>
                <th className="text-right py-4 px-6">Price</th>
                <th className="text-right py-4 px-6">30m Change %</th>
                <th className="text-right py-4 px-6">30m Volume</th>
                <th className="text-right py-4 px-6">Volume Change %</th>
                <th className="text-right py-4 px-6">Trades (30m)</th>
                <th className="text-right py-4 px-6">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {currentTokens.map((token, index) => (
                <tr 
                  key={token.symbol} 
                  className="border-b border-gray-800 hover:bg-gray-700 transition"
                >
                  <td className="py-4 px-6">
                    <span className="text-gray-400">#{index + 1}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-lg">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-mono">
                    {formatPrice(token.price)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`text-lg font-bold ${
                      token.priceChange30m >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {token.priceChange30m >= 0 ? '+' : ''}{token.priceChange30m.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-blue-400">
                    {formatVolume(token.volume30m)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`font-bold ${
                      token.volumeChange30m >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {token.volumeChange30m >= 0 ? '+' : ''}{token.volumeChange30m.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-300">
                    {formatNumber(token.trades30m)}
                  </td>
                  <td className="py-4 px-6 text-right text-gray-400">
                    {formatVolume(token.marketCap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-900 border-blue-700 rounded-lg shadow-lg p-6 border">
        <h3 className="text-lg font-bold mb-3">📊 About Hot Tokens</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• <strong>Top Gainers</strong>: Tokens with the highest positive price change in the last 30 minutes</li>
          <li>• <strong>Top Losers</strong>: Tokens with the highest negative price change in the last 30 minutes</li>
          <li>• <strong>Top by Volume</strong>: Tokens with the highest trading volume in the last 30 minutes</li>
          <li>• <strong>30m Change %</strong>: Percentage price change compared to 30 minutes ago</li>
          <li>• <strong>30m Volume</strong>: Total trading volume in USD over the last 30 minutes</li>
          <li>• <strong>Volume Change %</strong>: Change in trading volume compared to average</li>
          <li>• <strong>Auto-refresh</strong>: Data updates every 30 seconds when enabled</li>
        </ul>
      </div>

      {/* Last Updated */}
      <div className="text-center text-gray-400 text-sm">
        Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  )
}
