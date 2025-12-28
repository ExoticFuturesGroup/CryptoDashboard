'use client'

import { useEffect, useState } from 'react'
import { getCryptoNews, getNewsByCategory, getNewsSources, NewsArticle, NewsSource } from '@/lib/newsApi'

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [sources, setSources] = useState<NewsSource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'Market', 'DeFi', 'NFT', 'Regulation', 'Technology', 'Adoption']

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterNews()
  }, [selectedCategory])

  async function loadData() {
    try {
      const [newsData, sourcesData] = await Promise.all([
        getCryptoNews(30),
        getNewsSources()
      ])
      
      setNews(newsData)
      setSources(sourcesData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading news:', error)
      setLoading(false)
    }
  }

  async function filterNews() {
    setLoading(true)
    try {
      if (selectedCategory === 'All') {
        const newsData = await getCryptoNews(30)
        setNews(newsData)
      } else {
        const newsData = await getNewsByCategory(selectedCategory, 30)
        setNews(newsData)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error filtering news:', error)
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }
  }

  const filteredNews = news.filter(article => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.source.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Crypto News</h1>
        <p className="text-gray-400 mt-2">
          Latest cryptocurrency news from Messari, CoinGecko, DeFi Llama, QuickNode and more
        </p>
      </div>

      {/* News Sources Overview */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">News Sources</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sources.map((source) => (
            <div key={source.name} className="text-center p-3 bg-gray-700 rounded-lg">
              <p className="font-bold text-lg">{source.name}</p>
              <p className="text-sm text-gray-400">{source.articlesCount} articles</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Search News</label>
            <input
              type="text"
              placeholder="Search by title, description, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* News Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
          <p className="text-gray-400">{filteredNews.length} articles</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredNews.map((article) => (
            <div
              key={article.id}
              className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col md:flex-row">
                {/* Article Image */}
                {article.imageUrl && (
                  <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-600 text-xs rounded">{article.category}</span>
                    <span className="text-sm text-gray-400">{article.source}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-400">{formatTimeAgo(article.publishedAt)}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>

                  <p className="text-gray-300 mb-3">{article.description}</p>

                  {article.coins && article.coins.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-400">Related:</span>
                      {article.coins.map((coin) => (
                        <span
                          key={coin}
                          className="px-2 py-1 bg-gray-700 text-xs rounded text-gray-300"
                        >
                          {coin}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No articles found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* API Information */}
      <div className="bg-purple-900 border-purple-700 rounded-lg shadow-lg p-6 border">
        <h3 className="text-lg font-bold mb-3">📰 News Sources</h3>
        <p className="text-sm text-gray-300 mb-3">
          This news feed aggregates content from multiple trusted cryptocurrency news sources:
        </p>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• <strong>Messari</strong> - In-depth crypto research and market analysis</li>
          <li>• <strong>CoinGecko</strong> - Market data and cryptocurrency insights</li>
          <li>• <strong>DeFi Llama</strong> - DeFi protocol news and analytics</li>
          <li>• <strong>QuickNode</strong> - Blockchain infrastructure and developer news</li>
          <li>• <strong>CoinDesk</strong> - Leading cryptocurrency journalism</li>
          <li>• <strong>Decrypt</strong> - Web3 and crypto culture coverage</li>
        </ul>
        <p className="text-xs text-gray-400 mt-4">
          Note: Currently displaying mock data. In production, this will pull real-time news from these APIs.
        </p>
      </div>
    </div>
  )
}
