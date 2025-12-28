'use client'

import { useEffect, useState } from 'react'
import { 
  getCurrentHYPEPrice, 
  generateHYPEPredictions, 
  calculateHYPERecommendation,
  HYPEPriceData,
  HYPEPrediction
} from '@/lib/hypeApi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function HYPEPredictionPage() {
  const [currentPrice, setCurrentPrice] = useState<HYPEPriceData | null>(null)
  const [predictions, setPredictions] = useState<HYPEPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [recommendation, setRecommendation] = useState<{
    recommendation: string
    expectedReturn: number
    confidence: number
  } | null>(null)

  useEffect(() => {
    loadPredictions()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadPredictions()
    }, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [autoRefresh])

  async function loadPredictions() {
    try {
      setLoading(true)
      const data = await generateHYPEPredictions()
      setCurrentPrice(data.currentPrice)
      setPredictions(data.predictions)
      
      const rec = calculateHYPERecommendation(data.currentPrice.price, data.predictions)
      setRecommendation(rec)
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading HYPE predictions:', error)
      setLoading(false)
    }
  }

  if (loading && !currentPrice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading HYPE predictions...</p>
        </div>
      </div>
    )
  }

  if (!currentPrice || predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Failed to load HYPE prediction data</p>
        <button
          onClick={loadPredictions}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Retry
        </button>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const minutes = Math.floor((timestamp - currentPrice.timestamp) / (60 * 1000))
    return `${minutes}m`
  }

  // Prepare chart data
  const chartData = [
    {
      time: '0m',
      timestamp: currentPrice.timestamp,
      price: currentPrice.price,
      upper: currentPrice.price,
      lower: currentPrice.price
    },
    ...predictions.map(p => ({
      time: formatTime(p.timestamp),
      timestamp: p.timestamp,
      price: p.predictedPrice,
      upper: p.upperBound,
      lower: p.lowerBound
    }))
  ]

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'STRONG_BUY': return 'text-green-400 bg-green-900'
      case 'BUY': return 'text-green-300 bg-green-800'
      case 'HOLD': return 'text-yellow-400 bg-yellow-900'
      case 'SELL': return 'text-orange-400 bg-orange-900'
      case 'STRONG_SELL': return 'text-red-400 bg-red-900'
      default: return 'text-gray-400 bg-gray-800'
    }
  }

  const initialMargin = 1050
  const leverage10x = recommendation ? (recommendation.expectedReturn / 100) * initialMargin * 10 : 0
  const leverage20x = recommendation ? (recommendation.expectedReturn / 100) * initialMargin * 20 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">HYPE Cryptocurrency Prediction</h1>
          <p className="text-gray-400 mt-2">
            30-minute forecast with 3-minute intervals | 95% Confidence Intervals
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

      {/* Current Price Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Hyperliquid (HYPE)</h2>
            <p className="text-gray-400 mt-1">Real-time market data</p>
          </div>
          {recommendation && (
            <div className={`px-6 py-3 rounded-lg ${getRecommendationColor(recommendation.recommendation)}`}>
              <div className="text-2xl font-bold">{recommendation.recommendation}</div>
              <div className="text-sm opacity-80">Confidence: {recommendation.confidence.toFixed(1)}%</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-400">Current Price</p>
            <p className="text-2xl font-bold text-blue-400">{formatCurrency(currentPrice.price)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">24h Change</p>
            <p className={`text-2xl font-bold ${currentPrice.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {currentPrice.priceChange24h >= 0 ? '+' : ''}{currentPrice.priceChange24h.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">24h High / Low</p>
            <p className="text-lg font-bold">
              {formatCurrency(currentPrice.high24h)} / {formatCurrency(currentPrice.low24h)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">24h Volume</p>
            <p className="text-lg font-bold">${(currentPrice.volume24h / 1000000).toFixed(0)}M</p>
          </div>
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">30-Minute Price Prediction (3-min intervals)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis 
              stroke="#9ca3af"
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value?: number) => value ? [`$${value.toFixed(2)}`, ''] : ['', '']}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="lower" 
              stroke="#ef4444" 
              fill="url(#colorLower)"
              name="Lower Bound (95% CI)"
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#colorPrice)"
              name="Predicted Price"
            />
            <Area 
              type="monotone" 
              dataKey="upper" 
              stroke="#10b981" 
              fill="url(#colorUpper)"
              name="Upper Bound (95% CI)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Profit Calculations */}
      {recommendation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-2">Expected Return (30min)</h3>
            <p className={`text-3xl font-bold ${recommendation.expectedReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {recommendation.expectedReturn >= 0 ? '+' : ''}{recommendation.expectedReturn.toFixed(2)}%
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-2">Profit @ 10x Leverage</h3>
            <p className={`text-3xl font-bold ${leverage10x >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {leverage10x >= 0 ? '+' : ''}{formatCurrency(Math.abs(leverage10x))}
            </p>
            <p className="text-sm text-gray-400 mt-1">Initial margin: ${initialMargin}</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-2">Profit @ 20x Leverage</h3>
            <p className={`text-3xl font-bold ${leverage20x >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {leverage20x >= 0 ? '+' : ''}{formatCurrency(Math.abs(leverage20x))}
            </p>
            <p className="text-sm text-gray-400 mt-1">Initial margin: ${initialMargin}</p>
          </div>
        </div>
      )}

      {/* Prediction Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Detailed Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-right py-3 px-4">Predicted Price</th>
                <th className="text-right py-3 px-4">Lower Bound</th>
                <th className="text-right py-3 px-4">Upper Bound</th>
                <th className="text-right py-3 px-4">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-700">
                  <td className="py-3 px-4">{formatTime(pred.timestamp)}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-400">
                    {formatCurrency(pred.predictedPrice)}
                  </td>
                  <td className="py-3 px-4 text-right text-red-400">
                    {formatCurrency(pred.lowerBound)}
                  </td>
                  <td className="py-3 px-4 text-right text-green-400">
                    {formatCurrency(pred.upperBound)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {pred.confidence.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-blue-900 border-blue-700 rounded-lg shadow-lg p-6 border">
        <h3 className="text-lg font-bold mb-3">📊 Prediction Methodology</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• <strong>ARIMA Model</strong>: Autoregressive integrated moving average for time series forecasting</li>
          <li>• <strong>GARCH Volatility</strong>: Generalized autoregressive conditional heteroskedasticity for dynamic volatility modeling</li>
          <li>• <strong>95% Confidence Intervals</strong>: Statistical range where the actual price is expected to fall 95% of the time</li>
          <li>• <strong>Data Sources</strong>: Real-time data from CoinGecko, CoinMarketCap, and Messari APIs</li>
          <li>• <strong>Update Frequency</strong>: Predictions refresh every 60 seconds with latest market data</li>
        </ul>
      </div>

      {/* Warning */}
      <div className="bg-red-900 border-red-700 rounded-lg shadow-lg p-6 border">
        <h3 className="text-lg font-bold mb-3">⚠️ Important Disclaimer</h3>
        <p className="text-sm text-gray-300">
          These predictions are generated using statistical models (ARIMA/GARCH) and should not be considered as financial advice. 
          Cryptocurrency markets are highly volatile and unpredictable, especially in short time frames (30 minutes). 
          Past performance and statistical models do not guarantee future results. Leverage trading amplifies both gains and losses significantly. 
          Only trade with capital you can afford to lose. Always conduct your own research before making any investment decisions.
        </p>
      </div>
    </div>
  )
}
