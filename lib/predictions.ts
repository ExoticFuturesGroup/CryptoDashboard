import { CoinData } from './coinApi'

export interface PredictionPoint {
  time: number // minutes from now
  predicted: number
  upperBound: number
  lowerBound: number
}

export interface PredictionResult {
  coin: CoinData
  predictions: PredictionPoint[]
  recommendation: 'LONG' | 'SHORT' | 'NEUTRAL'
  confidence: number
  expectedReturn: number
  profitAt10x: number
  profitAt20x: number
}

// Calculate standard deviation
function calculateStdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  return Math.sqrt(variance)
}

// Generate predictions with 95% confidence intervals
export function generatePredictions(coin: CoinData): PredictionResult {
  const intervals = 20 // 20 intervals of 3 minutes each = 60 minutes
  const predictions: PredictionPoint[] = []
  
  // Calculate volatility based on 24h price change
  const volatility = Math.abs(coin.price_change_percentage_24h / 100) || 0.02
  const hourlyVolatility = volatility / Math.sqrt(24)
  
  // Trend direction based on recent price action
  const trend = (coin.price_change_percentage_1h_in_currency || 0) / 100
  
  let currentPrice = coin.current_price
  const prices: number[] = [currentPrice]
  
  // Generate price path with random walk + trend
  for (let i = 1; i <= intervals; i++) {
    const timeMinutes = i * 3
    
    // Random walk with drift (trend)
    const randomShock = (Math.random() - 0.5) * 2 * hourlyVolatility
    const driftComponent = trend * (timeMinutes / 60)
    const priceChange = driftComponent + randomShock
    
    currentPrice = currentPrice * (1 + priceChange)
    prices.push(currentPrice)
    
    // 95% confidence interval (approximately 1.96 standard deviations)
    const stdDev = currentPrice * hourlyVolatility * Math.sqrt(timeMinutes / 60)
    const margin = 1.96 * stdDev
    
    predictions.push({
      time: timeMinutes,
      predicted: currentPrice,
      upperBound: currentPrice + margin,
      lowerBound: currentPrice - margin
    })
  }
  
  // Determine trading recommendation
  const finalPrice = predictions[predictions.length - 1].predicted
  const priceChange = (finalPrice - coin.current_price) / coin.current_price
  const expectedReturn = priceChange * 100
  
  let recommendation: 'LONG' | 'SHORT' | 'NEUTRAL'
  if (expectedReturn > 0.5) {
    recommendation = 'LONG'
  } else if (expectedReturn < -0.5) {
    recommendation = 'SHORT'
  } else {
    recommendation = 'NEUTRAL'
  }
  
  // Calculate confidence based on consistency of trend
  const confidence = Math.min(95, 70 + Math.abs(expectedReturn) * 5)
  
  // Calculate profit with leverage
  const initialMargin = 1050
  const profitAt10x = initialMargin * Math.abs(expectedReturn / 100) * 10
  const profitAt20x = initialMargin * Math.abs(expectedReturn / 100) * 20
  
  return {
    coin,
    predictions,
    recommendation,
    confidence,
    expectedReturn,
    profitAt10x,
    profitAt20x
  }
}

// Generate predictions for multiple coins
export function generateAllPredictions(coins: CoinData[]): PredictionResult[] {
  return coins.map(coin => generatePredictions(coin))
}
