'use client'

import { useState, useEffect } from 'react'

/**
 * Avantis Fi Trading Interface
 * 
 * This is a demonstration UI for the Avantis SDK integration.
 * For production use, uncomment and configure the SDK imports:
 * 
 * import { AvantisSDK, PositionSide, OrderType } from '@todayapp/avantis-sdk'
 * 
 * SDK Documentation: https://sdk.avantisfi.com
 * NPM Package: @todayapp/avantis-sdk
 */

export default function TradingPage() {
  const [selectedPair, setSelectedPair] = useState('BTC/USD')
  const [positionSide, setPositionSide] = useState<'LONG' | 'SHORT'>('LONG')
  const [positionSize, setPositionSize] = useState('1000')
  const [leverage, setLeverage] = useState('10')
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET')
  const [limitPrice, setLimitPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [isConnected, setIsConnected] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const tradingPairs = [
    'BTC/USD', 'ETH/USD', 'SOL/USD', 'AVAX/USD', 'MATIC/USD',
    'LINK/USD', 'AAVE/USD', 'UNI/USD', 'EUR/USD', 'GBP/USD',
    'JPY/USD', 'GOLD/USD', 'SILVER/USD'
  ]

  // Simulated price feed
  useEffect(() => {
    const prices: Record<string, number> = {
      'BTC/USD': 44945.94,
      'ETH/USD': 2302.17,
      'SOL/USD': 96.48,
      'AVAX/USD': 37.77,
      'MATIC/USD': 0.87,
      'LINK/USD': 14.53,
      'AAVE/USD': 98.45,
      'UNI/USD': 6.47,
      'EUR/USD': 1.08,
      'GBP/USD': 1.27,
      'JPY/USD': 0.0067,
      'GOLD/USD': 2043.50,
      'SILVER/USD': 24.15,
    }
    
    setCurrentPrice(prices[selectedPair] || null)
  }, [selectedPair])

  const handleConnect = async () => {
    setLoading(true)
    
    /**
     * TODO: Implement real wallet connection using Avantis SDK
     * 
     * Example implementation:
     * const sdk = new AvantisSDK('base')
     * await sdk.setSigner({ type: 'wallet', provider: window.ethereum })
     * 
     * For now, this is a simulated connection for UI demonstration
     */
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsConnected(true)
    setLoading(false)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  const handleOpenPosition = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }

    setLoading(true)
    
    /**
     * TODO: Implement real position opening using Avantis SDK
     * 
     * Example implementation:
     * const sdk = new AvantisSDK('base')
     * const result = await sdk.trader.openPosition({
     *   pair: selectedPair,
     *   side: positionSide === 'LONG' ? PositionSide.LONG : PositionSide.SHORT,
     *   size: parseFloat(positionSize),
     *   leverage: parseFloat(leverage),
     *   orderType: orderType === 'MARKET' ? OrderType.MARKET : OrderType.LIMIT,
     *   stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
     *   takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
     *   slippage: parseFloat(slippage)
     * })
     * 
     * For now, this is a simulated transaction for UI demonstration
     */
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // TODO: Replace alert with proper toast notification
    alert(`Position opened successfully!\n\nPair: ${selectedPair}\nSide: ${positionSide}\nSize: $${positionSize}\nLeverage: ${leverage}x\nOrder Type: ${orderType}`)
    
    setLoading(false)
  }

  const calculateLiquidationPrice = () => {
    if (!currentPrice || !positionSize || !leverage) return null
    
    const size = parseFloat(positionSize)
    const lev = parseFloat(leverage)
    const price = currentPrice
    
    if (positionSide === 'LONG') {
      return (price * (lev - 1) / lev).toFixed(2)
    } else {
      return (price * (lev + 1) / lev).toFixed(2)
    }
  }

  const calculatePnL = (targetPrice: string) => {
    if (!currentPrice || !positionSize || !targetPrice) return null
    
    const size = parseFloat(positionSize)
    const lev = parseFloat(leverage)
    const entry = currentPrice
    const target = parseFloat(targetPrice)
    
    const priceDiff = positionSide === 'LONG' ? (target - entry) : (entry - target)
    const pnl = (priceDiff / entry) * size * lev
    
    return pnl.toFixed(2)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Demo Mode Banner */}
      <div className="mb-6 bg-yellow-900/30 border-2 border-yellow-500/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-400 text-2xl">⚠️</div>
          <div>
            <h3 className="font-bold text-yellow-400 mb-1">DEMO MODE - UI DEMONSTRATION ONLY</h3>
            <p className="text-sm text-gray-300">
              This is a demonstration interface showing Avantis SDK integration capabilities. 
              No real transactions are executed. For production deployment, wallet connection and 
              trading functions need to be activated with proper Avantis SDK configuration.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Avantis Trading
        </h1>
        <p className="text-gray-400 mt-2">
          Trade crypto, forex, and commodities with leverage on Avantis DEX
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-gray-300">
              {isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
            </span>
          </div>
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Open Position</h2>
            
            <div className="space-y-4">
              {/* Trading Pair */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Trading Pair
                </label>
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  {tradingPairs.map(pair => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
              </div>

              {/* Current Price */}
              {currentPrice && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Price:</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${currentPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Position Side */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Position Side
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPositionSide('LONG')}
                    className={`py-3 rounded-lg font-medium transition-colors ${
                      positionSide === 'LONG'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    LONG
                  </button>
                  <button
                    onClick={() => setPositionSide('SHORT')}
                    className={`py-3 rounded-lg font-medium transition-colors ${
                      positionSide === 'SHORT'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    SHORT
                  </button>
                </div>
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrderType('MARKET')}
                    className={`py-3 rounded-lg font-medium transition-colors ${
                      orderType === 'MARKET'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    MARKET
                  </button>
                  <button
                    onClick={() => setOrderType('LIMIT')}
                    className={`py-3 rounded-lg font-medium transition-colors ${
                      orderType === 'LIMIT'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    LIMIT
                  </button>
                </div>
              </div>

              {/* Limit Price (if LIMIT order) */}
              {orderType === 'LIMIT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Limit Price ($)
                  </label>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder="Enter limit price"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Position Size */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Position Size ($)
                </label>
                <input
                  type="number"
                  value={positionSize}
                  onChange={(e) => setPositionSize(e.target.value)}
                  placeholder="Enter position size"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Leverage */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Leverage: {leverage}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1x</span>
                  <span>25x</span>
                  <span>50x</span>
                  <span>75x</span>
                  <span>100x</span>
                </div>
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Stop Loss ($) - Optional
                </label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="Enter stop loss price"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Take Profit */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Take Profit ($) - Optional
                </label>
                <input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="Enter take profit price"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Slippage */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Slippage Tolerance (%)
                </label>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  step="0.1"
                  placeholder="0.5"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleOpenPosition}
                disabled={!isConnected || loading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                  positionSide === 'LONG'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Opening Position...' : `Open ${positionSide} Position`}
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Position Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Position Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Pair:</span>
                <span className="font-medium">{selectedPair}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Side:</span>
                <span className={`font-medium ${positionSide === 'LONG' ? 'text-green-400' : 'text-red-400'}`}>
                  {positionSide}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="font-medium">${positionSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Leverage:</span>
                <span className="font-medium">{leverage}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Collateral:</span>
                <span className="font-medium">
                  ${(parseFloat(positionSize) / parseFloat(leverage)).toFixed(2)}
                </span>
              </div>
              {calculateLiquidationPrice() && (
                <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
                  <span className="text-gray-400">Liquidation:</span>
                  <span className="font-medium text-red-400">
                    ${calculateLiquidationPrice()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* P&L Calculator */}
          {stopLoss && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Stop Loss P&L</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">
                  {calculatePnL(stopLoss) ? `$${calculatePnL(stopLoss)}` : '-'}
                </div>
                <div className="text-sm text-gray-400 mt-1">Potential Loss</div>
              </div>
            </div>
          )}

          {takeProfit && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Take Profit P&L</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {calculatePnL(takeProfit) ? `+$${calculatePnL(takeProfit)}` : '-'}
                </div>
                <div className="text-sm text-gray-400 mt-1">Potential Profit</div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-400 text-xl">ℹ️</div>
              <div className="text-sm text-gray-300">
                <p className="font-medium mb-2">Powered by Avantis Finance</p>
                <p className="text-gray-400">
                  Trade crypto, forex, and commodities with up to 100x leverage on a
                  decentralized platform. Always manage your risk appropriately.
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-400 text-xl">⚠️</div>
              <div className="text-sm text-gray-300">
                <p className="font-medium mb-2">High Risk Warning</p>
                <p className="text-gray-400">
                  Leveraged trading carries high risk. You may lose your entire investment.
                  Only trade with funds you can afford to lose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SDK Information */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">About Avantis SDK Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-blue-400 text-2xl mb-2">🔗</div>
            <h4 className="font-medium mb-2">SDK Integration</h4>
            <p className="text-sm text-gray-400">
              This page integrates with the official Avantis Trading SDK (@todayapp/avantis-sdk)
              for seamless trading on Base network.
            </p>
          </div>
          <div>
            <div className="text-purple-400 text-2xl mb-2">⚡</div>
            <h4 className="font-medium mb-2">Supported Assets</h4>
            <p className="text-sm text-gray-400">
              Trade BTC, ETH, SOL, and 100+ other assets including forex pairs (EUR/USD, GBP/USD)
              and commodities (Gold, Silver).
            </p>
          </div>
          <div>
            <div className="text-green-400 text-2xl mb-2">🛡️</div>
            <h4 className="font-medium mb-2">Decentralized</h4>
            <p className="text-sm text-gray-400">
              Trade directly from your wallet on a fully decentralized platform with transparent
              pricing and no intermediaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
