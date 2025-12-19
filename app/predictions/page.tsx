'use client'

import { useEffect, useState } from 'react'
import { getTopCoinsByVolume, CoinData } from '@/lib/coinApi'
import { generateAllPredictions, PredictionResult } from '@/lib/predictions'
import PredictionChart from '@/components/charts/PredictionChart'

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState<PredictionResult | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

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
      const coins = await getTopCoinsByVolume(20)
      const newPredictions = generateAllPredictions(coins)
      setPredictions(newPredictions)
      
      if (!selectedCoin) {
        setSelectedCoin(newPredictions[0])
      } else {
        // Update selected coin with new data
        const updated = newPredictions.find(p => p.coin.id === selectedCoin.coin.id)
        if (updated) setSelectedCoin(updated)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading predictions:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading market predictions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Market Predictions</h1>
          <p className="text-gray-400 mt-2">
            1-hour predictions for top 20 coins by trading volume
          </p>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-4 py-2 rounded ${autoRefresh ? 'bg-green-600' : 'bg-gray-600'}`}
        >
          {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
        </button>
      </div>

      {/* Selected Coin Detail */}
      {selectedCoin && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold">{selectedCoin.coin.name} ({selectedCoin.coin.symbol})</h2>
              <p className="text-2xl text-gray-300 mt-2">
                Current Price: <span className="font-bold">${selectedCoin.coin.current_price.toFixed(2)}</span>
              </p>
            </div>
            
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                selectedCoin.recommendation === 'LONG' ? 'text-green-400' :
                selectedCoin.recommendation === 'SHORT' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {selectedCoin.recommendation === 'LONG' ? '📈 LONG' :
                 selectedCoin.recommendation === 'SHORT' ? '📉 SHORT' :
                 '➡️ NEUTRAL'}
              </div>
              <p className="text-gray-400 mt-1">Confidence: {selectedCoin.confidence.toFixed(1)}%</p>
            </div>
          </div>

          <PredictionChart prediction={selectedCoin} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Expected Return (1hr)</h3>
              <p className={`text-2xl font-bold ${
                selectedCoin.expectedReturn > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedCoin.expectedReturn > 0 ? '+' : ''}{selectedCoin.expectedReturn.toFixed(2)}%
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Profit @ 10x Leverage</h3>
              <p className="text-2xl font-bold text-blue-400">
                ${selectedCoin.profitAt10x.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Initial margin: $1050</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Profit @ 20x Leverage</h3>
              <p className="text-2xl font-bold text-purple-400">
                ${selectedCoin.profitAt20x.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Initial margin: $1050</p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Prediction Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">24h Change</p>
                <p className={`font-bold ${selectedCoin.coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedCoin.coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">24h High</p>
                <p className="font-bold">${selectedCoin.coin.high_24h.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">24h Low</p>
                <p className="font-bold">${selectedCoin.coin.low_24h.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">Volume (24h)</p>
                <p className="font-bold">${(selectedCoin.coin.total_volume / 1e6).toFixed(2)}M</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coins Grid */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">All Predictions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {predictions.map((prediction) => (
            <button
              key={prediction.coin.id}
              onClick={() => setSelectedCoin(prediction)}
              className={`text-left p-4 rounded-lg transition-all ${
                selectedCoin?.coin.id === prediction.coin.id
                  ? 'bg-blue-600 border-2 border-blue-400'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">{prediction.coin.symbol}</h3>
                  <p className="text-sm text-gray-300">{prediction.coin.name}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  prediction.recommendation === 'LONG' ? 'bg-green-600' :
                  prediction.recommendation === 'SHORT' ? 'bg-red-600' :
                  'bg-yellow-600'
                }`}>
                  {prediction.recommendation}
                </span>
              </div>
              <p className="text-lg font-bold">${prediction.coin.current_price.toFixed(2)}</p>
              <p className={`text-sm ${
                prediction.expectedReturn > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                Expected: {prediction.expectedReturn > 0 ? '+' : ''}{prediction.expectedReturn.toFixed(2)}%
              </p>
              <div className="mt-2 pt-2 border-t border-gray-600">
                <p className="text-xs text-gray-400">10x: ${prediction.profitAt10x.toFixed(2)}</p>
                <p className="text-xs text-gray-400">20x: ${prediction.profitAt20x.toFixed(2)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 bg-blue-900 border-blue-700">
        <h3 className="text-lg font-bold mb-2">⚠️ Important Disclaimer</h3>
        <p className="text-sm text-gray-300">
          These predictions are generated using statistical models and should not be considered as financial advice.
          Cryptocurrency trading carries significant risk. Always conduct your own research and never invest more than you can afford to lose.
          Leverage trading amplifies both gains and losses.
        </p>
      </div>
    </div>
  )
}
