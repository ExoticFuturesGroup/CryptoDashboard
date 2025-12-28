import axios from 'axios'

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  category: string
  coins?: string[]
}

export interface NewsSource {
  name: string
  articlesCount: number
}

// Fetch crypto news from multiple sources
export async function getCryptoNews(limit: number = 20): Promise<NewsArticle[]> {
  // In production, this would call:
  // - Messari API: https://data.messari.io/api/v1/news
  // - CoinGecko API: https://api.coingecko.com/api/v3/news (if available)
  // - DeFi Llama: https://api.llama.fi/news (if available)
  // - QuickNode: Custom news endpoints
  
  // For now, returning mock news data
  return generateMockNews(limit)
}

// Fetch news by category
export async function getNewsByCategory(category: string, limit: number = 10): Promise<NewsArticle[]> {
  const allNews = await getCryptoNews(50)
  return allNews.filter(article => article.category === category).slice(0, limit)
}

// Fetch news by coin
export async function getNewsByCoin(coinSymbol: string, limit: number = 10): Promise<NewsArticle[]> {
  const allNews = await getCryptoNews(50)
  return allNews.filter(article => 
    article.coins?.includes(coinSymbol.toUpperCase())
  ).slice(0, limit)
}

// Get news sources
export async function getNewsSources(): Promise<NewsSource[]> {
  return [
    { name: 'Messari', articlesCount: 150 },
    { name: 'CoinGecko', articlesCount: 89 },
    { name: 'DeFi Llama', articlesCount: 67 },
    { name: 'QuickNode', articlesCount: 45 },
    { name: 'CoinDesk', articlesCount: 234 },
    { name: 'Decrypt', articlesCount: 178 }
  ]
}

// Generate mock news data
function generateMockNews(limit: number): NewsArticle[] {
  const sources = ['Messari', 'CoinGecko', 'DeFi Llama', 'QuickNode', 'CoinDesk', 'Decrypt']
  const categories = ['Market', 'DeFi', 'NFT', 'Regulation', 'Technology', 'Adoption']
  const coins = ['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'XRP', 'AVAX', 'DOT', 'MATIC', 'LINK']
  
  const newsTemplates = [
    {
      title: 'Bitcoin Surges Past $45K as Institutional Interest Grows',
      description: 'Major financial institutions continue to increase their cryptocurrency holdings as Bitcoin demonstrates strong momentum in the market.',
      category: 'Market',
      coins: ['BTC']
    },
    {
      title: 'Ethereum Layer 2 Solutions See Record Transaction Volume',
      description: 'Scaling solutions on Ethereum are processing unprecedented transaction volumes, signaling growing adoption of DeFi applications.',
      category: 'DeFi',
      coins: ['ETH']
    },
    {
      title: 'SEC Approves New Framework for Digital Asset Classification',
      description: 'Regulatory clarity emerges as the SEC publishes comprehensive guidelines for cryptocurrency classification and compliance.',
      category: 'Regulation',
      coins: []
    },
    {
      title: 'Solana Network Upgrade Brings Enhanced Performance',
      description: 'Latest protocol update significantly improves transaction throughput and reduces latency on the Solana blockchain.',
      category: 'Technology',
      coins: ['SOL']
    },
    {
      title: 'DeFi TVL Reaches All-Time High of $82 Billion',
      description: 'Total Value Locked across DeFi protocols hits new record as yield farming and liquidity provision continue to attract capital.',
      category: 'DeFi',
      coins: ['ETH', 'AVAX', 'BNB']
    },
    {
      title: 'Major Retailer Announces Bitcoin Payment Integration',
      description: 'Global retail chain partners with leading crypto payment processor to accept Bitcoin at all locations worldwide.',
      category: 'Adoption',
      coins: ['BTC']
    },
    {
      title: 'Cardano Smart Contract Activity Surges 400%',
      description: 'Developer activity and smart contract deployments on Cardano network see exponential growth in Q4.',
      category: 'Technology',
      coins: ['ADA']
    },
    {
      title: 'Polygon zkEVM Mainnet Launch Attracts Major DeFi Protocols',
      description: 'Leading DeFi platforms announce plans to deploy on Polygon zkEVM, citing superior scalability and security.',
      category: 'DeFi',
      coins: ['MATIC', 'ETH']
    },
    {
      title: 'Crypto Market Cap Surpasses $1.8 Trillion Mark',
      description: 'Total cryptocurrency market capitalization reaches new milestone driven by institutional adoption and retail interest.',
      category: 'Market',
      coins: ['BTC', 'ETH']
    },
    {
      title: 'Chainlink Oracles Power 70% of DeFi Ecosystem',
      description: 'Data shows Chainlink oracles now secure majority of DeFi protocols, providing critical price feed infrastructure.',
      category: 'Technology',
      coins: ['LINK', 'ETH']
    },
    {
      title: 'Central Bank Digital Currency Trials Expand Globally',
      description: 'Over 100 countries now actively exploring or testing central bank digital currencies in various pilot programs.',
      category: 'Regulation',
      coins: []
    },
    {
      title: 'NFT Marketplace Volume Rebounds with New Gaming Projects',
      description: 'Gaming-focused NFT collections drive marketplace activity to highest levels in six months.',
      category: 'NFT',
      coins: ['ETH', 'SOL']
    },
    {
      title: 'Avalanche Subnet Deployments Double in Recent Quarter',
      description: 'Enterprise blockchain deployments on Avalanche subnets accelerate as companies seek customizable solutions.',
      category: 'Technology',
      coins: ['AVAX']
    },
    {
      title: 'Stablecoin Market Cap Exceeds $150 Billion',
      description: 'Growth in stablecoin usage reflects increasing demand for crypto-to-crypto trading and DeFi participation.',
      category: 'Market',
      coins: []
    },
    {
      title: 'Major Bank Launches Crypto Custody Service',
      description: 'Traditional financial institution enters cryptocurrency custody market, offering institutional-grade security solutions.',
      category: 'Adoption',
      coins: ['BTC', 'ETH']
    }
  ]
  
  const news: NewsArticle[] = []
  const now = Date.now()
  
  for (let i = 0; i < limit; i++) {
    const template = newsTemplates[i % newsTemplates.length]
    const hoursAgo = i * 2 + Math.floor(Math.random() * 2)
    
    news.push({
      id: `news-${i}`,
      title: template.title,
      description: template.description,
      url: `https://example.com/news/${i}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      publishedAt: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
      imageUrl: `https://via.placeholder.com/400x200?text=Crypto+News+${i + 1}`,
      category: template.category,
      coins: template.coins
    })
  }
  
  return news
}
