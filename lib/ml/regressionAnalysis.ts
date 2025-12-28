/**
 * Regression Analysis Module
 * Performs predictive analysis on cryptocurrency prices using historical 15-minute interval data
 * Trained on 30-90 days of historical data
 */

import { HistoricalDataPoint } from '../database/coinDatabase'

export interface RegressionPrediction {
  timestamp: number
  predictedPrice: number
  upperBound: number
  lowerBound: number
  confidence: number
}

export interface RegressionModel {
  coinId: string
  trainedOn: number // Number of data points
  trainingPeriod: string // e.g., "90 days"
  accuracy: number // R-squared value
  rmse: number // Root Mean Square Error
  lastTrained: number
}

export interface PredictionResult {
  coinId: string
  symbol: string
  currentPrice: number
  predictions: RegressionPrediction[]
  model: RegressionModel
  recommendation: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL'
  expectedReturn1h: number
  expectedReturn4h: number
  expectedReturn24h: number
}

/**
 * Simple Linear Regression implementation
 */
class LinearRegression {
  private slope: number = 0
  private intercept: number = 0
  private rSquared: number = 0

  /**
   * Fit the model to data
   */
  fit(x: number[], y: number[]): void {
    if (x.length !== y.length || x.length === 0) {
      throw new Error('Invalid input data')
    }

    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    this.intercept = (sumY - this.slope * sumX) / n

    // Calculate R-squared
    const yMean = sumY / n
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = this.predict(x[i])
      return sum + Math.pow(yi - predicted, 2)
    }, 0)
    this.rSquared = 1 - (ssRes / ssTot)
  }

  /**
   * Predict value for given x
   */
  predict(x: number): number {
    return this.slope * x + this.intercept
  }

  /**
   * Get R-squared value
   */
  getRSquared(): number {
    return this.rSquared
  }
}

/**
 * Moving Average Convergence Divergence (MACD) for trend detection
 */
function calculateMACD(prices: number[]): { macd: number, signal: number, histogram: number } {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  const macd = ema12 - ema26
  
  // Signal line is 9-period EMA of MACD
  const macdValues = [macd] // Simplified
  const signal = macd * 0.9 // Simplified
  const histogram = macd - signal
  
  return { macd, signal, histogram }
}

/**
 * Calculate Exponential Moving Average
 */
function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1]
  
  const multiplier = 2 / (period + 1)
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema
  }
  
  return ema
}

/**
 * Calculate Relative Strength Index (RSI)
 */
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50
  
  const changes = []
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1])
  }
  
  let gains = 0
  let losses = 0
  
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) gains += changes[i]
    else losses += Math.abs(changes[i])
  }
  
  const avgGain = gains / period
  const avgLoss = losses / period
  
  if (avgLoss === 0) return 100
  
  const rs = avgGain / avgLoss
  const rsi = 100 - (100 / (1 + rs))
  
  return rsi
}

/**
 * Calculate Bollinger Bands
 */
function calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
  const sma = prices.slice(-period).reduce((a, b) => a + b, 0) / period
  const squaredDiffs = prices.slice(-period).map(p => Math.pow(p - sma, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period
  const sd = Math.sqrt(variance)
  
  return {
    upper: sma + (stdDev * sd),
    middle: sma,
    lower: sma - (stdDev * sd)
  }
}

/**
 * Train regression model on historical data
 */
export async function trainRegressionModel(
  coinId: string,
  historicalData: HistoricalDataPoint[],
  days: number = 90
): Promise<RegressionModel> {
  // Prepare training data
  const x = historicalData.map((_, i) => i) // Time index
  const y = historicalData.map(d => d.close) // Close prices
  
  // Train linear regression
  const model = new LinearRegression()
  model.fit(x, y)
  
  // Calculate RMSE
  const predictions = x.map(xi => model.predict(xi))
  const squaredErrors = y.map((yi, i) => Math.pow(yi - predictions[i], 2))
  const mse = squaredErrors.reduce((a, b) => a + b, 0) / squaredErrors.length
  const rmse = Math.sqrt(mse)
  
  return {
    coinId,
    trainedOn: historicalData.length,
    trainingPeriod: `${days} days`,
    accuracy: model.getRSquared(),
    rmse,
    lastTrained: Date.now()
  }
}

/**
 * Generate predictions using trained model
 */
export async function generateRegressionPredictions(
  coinId: string,
  symbol: string,
  historicalData: HistoricalDataPoint[],
  hoursAhead: number = 24
): Promise<PredictionResult> {
  // Train model
  const modelInfo = await trainRegressionModel(coinId, historicalData)
  
  // Prepare data
  const x = historicalData.map((_, i) => i)
  const y = historicalData.map(d => d.close)
  
  const model = new LinearRegression()
  model.fit(x, y)
  
  const currentPrice = historicalData[historicalData.length - 1].close
  const lastTimestamp = historicalData[historicalData.length - 1].timestamp
  const intervalMs = 15 * 60 * 1000 // 15 minutes
  
  // Calculate technical indicators
  const recentPrices = y.slice(-100) // Last 100 data points
  const rsi = calculateRSI(recentPrices)
  const macd = calculateMACD(recentPrices)
  const bb = calculateBollingerBands(recentPrices)
  
  // Generate predictions
  const predictions: RegressionPrediction[] = []
  const intervals = hoursAhead * 4 // 4 intervals per hour
  
  // Calculate volatility for confidence intervals
  const returns = []
  for (let i = 1; i < y.length; i++) {
    returns.push((y[i] - y[i - 1]) / y[i - 1])
  }
  const volatility = Math.sqrt(returns.reduce((sum, r) => sum + r * r, 0) / returns.length)
  
  for (let i = 1; i <= intervals; i++) {
    const futureX = x.length + i
    const predictedPrice = model.predict(futureX)
    
    // Adjust prediction based on trend and volatility
    const trendAdjustment = (macd.histogram > 0 ? 1 : -1) * Math.abs(macd.histogram) * 0.001
    const adjustedPrice = predictedPrice * (1 + trendAdjustment)
    
    // Calculate confidence intervals (95%)
    const timeHorizon = i / 4 // hours
    const uncertainty = volatility * Math.sqrt(timeHorizon) * 1.96
    const upperBound = adjustedPrice * (1 + uncertainty)
    const lowerBound = adjustedPrice * (1 - uncertainty)
    
    // Confidence decreases with time
    const confidence = Math.max(50, 95 - (i / intervals) * 25)
    
    predictions.push({
      timestamp: lastTimestamp + (i * intervalMs),
      predictedPrice: adjustedPrice,
      upperBound,
      lowerBound,
      confidence
    })
  }
  
  // Calculate expected returns
  const price1h = predictions[3]?.predictedPrice || currentPrice
  const price4h = predictions[15]?.predictedPrice || currentPrice
  const price24h = predictions[predictions.length - 1]?.predictedPrice || currentPrice
  
  const expectedReturn1h = ((price1h - currentPrice) / currentPrice) * 100
  const expectedReturn4h = ((price4h - currentPrice) / currentPrice) * 100
  const expectedReturn24h = ((price24h - currentPrice) / currentPrice) * 100
  
  // Generate recommendation based on multiple factors
  let recommendation: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL'
  
  const bullishSignals = [
    expectedReturn24h > 2,
    rsi < 30,
    macd.histogram > 0,
    currentPrice < bb.lower
  ].filter(Boolean).length
  
  const bearishSignals = [
    expectedReturn24h < -2,
    rsi > 70,
    macd.histogram < 0,
    currentPrice > bb.upper
  ].filter(Boolean).length
  
  if (bullishSignals >= 3) recommendation = 'STRONG_BUY'
  else if (bullishSignals >= 2) recommendation = 'BUY'
  else if (bearishSignals >= 3) recommendation = 'STRONG_SELL'
  else if (bearishSignals >= 2) recommendation = 'SELL'
  else recommendation = 'HOLD'
  
  return {
    coinId,
    symbol,
    currentPrice,
    predictions,
    model: modelInfo,
    recommendation,
    expectedReturn1h,
    expectedReturn4h,
    expectedReturn24h
  }
}

/**
 * Batch generate predictions for multiple coins
 */
export async function batchGeneratePredictions(
  coins: Array<{ coinId: string, symbol: string, historicalData: HistoricalDataPoint[] }>,
  hoursAhead: number = 24
): Promise<PredictionResult[]> {
  const results: PredictionResult[] = []
  
  for (const coin of coins) {
    try {
      const result = await generateRegressionPredictions(
        coin.coinId,
        coin.symbol,
        coin.historicalData,
        hoursAhead
      )
      results.push(result)
    } catch (error) {
      console.error(`Error generating predictions for ${coin.symbol}:`, error)
    }
  }
  
  return results
}
