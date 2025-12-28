'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { PredictionResult } from '@/lib/predictions'

interface PredictionChartProps {
  prediction: PredictionResult
}

export default function PredictionChart({ prediction }: PredictionChartProps) {
  const { coin, predictions } = prediction

  // Prepare data for chart
  const chartData = [
    {
      time: 0,
      predicted: coin.current_price,
      upperBound: coin.current_price,
      lowerBound: coin.current_price,
      label: 'Now'
    },
    ...predictions.map(p => ({
      time: p.time,
      predicted: p.predicted,
      upperBound: p.upperBound,
      lowerBound: p.lowerBound,
      label: `${p.time}m`
    }))
  ]

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af"
            label={{ value: 'Minutes', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
          />
          <YAxis 
            stroke="#9ca3af"
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6'
            }}
            formatter={(value?: number) => value ? [`$${value.toFixed(2)}`, ''] : ['', '']}
            labelFormatter={(label) => `Time: ${label} minutes`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill="url(#confidenceGradient)"
            name="Upper Bound (95% CI)"
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill="url(#confidenceGradient)"
            name="Lower Bound (95% CI)"
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Predicted Price"
            dot={{ fill: '#3b82f6', r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="upperBound" 
            stroke="#10b981" 
            strokeWidth={1}
            strokeDasharray="5 5"
            name="Upper Bound"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="lowerBound" 
            stroke="#ef4444" 
            strokeWidth={1}
            strokeDasharray="5 5"
            name="Lower Bound"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
