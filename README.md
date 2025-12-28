# CryptoDashboard

A comprehensive cryptocurrency dashboard application built with Next.js, TypeScript, and Recharts for advanced market predictions and analytics.

## Features

### 📈 Market Predictions
- **1-hour price predictions** for the top 20 cryptocurrencies by trading volume
- **3-minute interval updates** with detailed graphical visualization
- **95% confidence intervals** showing upper and lower bounds
- **Trading position recommendations**: Long, Short, or Neutral signals based on statistical analysis
- **Profit calculations** at 10x and 20x leverage with $1050 initial margin
- **Auto-refresh capability** for real-time updates
- Interactive charts with detailed prediction metrics

### 🏦 CEFI Analytics
- Centralized exchange statistics and rankings
- 24-hour trading volume comparisons
- Market dominance visualization with pie charts
- Trust score ratings for major exchanges
- Country and establishment year information
- Key insights and market concentration metrics

### ⛓️ DEFI Analytics
- Total Value Locked (TVL) across DeFi protocols
- Top protocol rankings by TVL
- Chain dominance breakdown (Ethereum, Tron, BNB Chain, etc.)
- Category analysis (Liquid Staking, Lending, DEX, CDP, Yield)
- Protocol performance metrics (1h, 24h, 7d changes)
- Multi-chain protocol tracking

## Technology Stack

- **Framework**: Next.js 16.1.0 with TypeScript
- **Styling**: Tailwind CSS 4.x
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios for API calls
- **State Management**: React hooks
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ExoticFuturesGroup/CryptoDashboard.git
cd CryptoDashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
CryptoDashboard/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── predictions/         # Market predictions page
│   ├── cefi/               # CEFI analytics page
│   └── defi/               # DEFI analytics page
├── components/              # React components
│   ├── charts/             # Chart components
│   │   └── PredictionChart.tsx
│   └── layout/             # Layout components
│       └── Navigation.tsx
├── lib/                    # Utility libraries
│   ├── coinApi.ts         # Coin data API
│   ├── predictions.ts     # Prediction algorithms
│   ├── cefiApi.ts         # CEFI data API
│   └── defiApi.ts         # DEFI data API
└── public/                # Static assets
```

## How It Works

### Market Predictions Algorithm

The prediction system uses a statistical model based on:
1. **Historical volatility** from 24-hour price changes
2. **Random walk with drift** to simulate price movements
3. **95% confidence intervals** using standard deviation calculations
4. **Position recommendations** based on expected returns
5. **Leverage profit calculations** with configurable initial margin

### Data Sources

- **Mock Data**: Currently uses realistic mock data for development
- **Extensible**: Designed to integrate with real APIs (CoinGecko, CoinMarketCap, DeFi Llama)
- **Top 20 Coins**: Automatically fetches/generates data for coins by trading volume

## Features in Detail

### Prediction Metrics
- Current price and 24h statistics
- Expected return percentage over 1 hour
- Profit estimates at 10x leverage ($1050 margin)
- Profit estimates at 20x leverage ($1050 margin)
- Upper and lower bound projections
- Confidence level percentages

### Trading Signals
- **LONG**: Expected price increase > 0.5%
- **SHORT**: Expected price decrease > 0.5%
- **NEUTRAL**: Expected change between -0.5% and +0.5%

### Visual Elements
- Interactive area charts with confidence bands
- Color-coded position indicators
- Responsive grid layouts
- Real-time data updates
- Dark theme optimized for extended viewing

## Disclaimer

⚠️ **Important**: These predictions are generated using statistical models and should not be considered as financial advice. Cryptocurrency trading carries significant risk. Always conduct your own research and never invest more than you can afford to lose. Leverage trading amplifies both gains and losses.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Contact

For questions or support, please open an issue on GitHub.