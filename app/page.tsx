import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          CryptoDashboard
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Advanced Market Predictions & Analytics Platform
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/predictions" className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">📈 Market Predictions</h2>
          <p className="text-gray-300">
            Real-time predictions for top 20 coins with 95% confidence intervals,
            trading signals, and profit calculations at 10x-20x leverage.
          </p>
        </Link>

        <Link href="/cefi" className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-green-500 transition-all">
          <h2 className="text-2xl font-bold mb-4 text-green-400">🏦 CEFI Analytics</h2>
          <p className="text-gray-300">
            Centralized finance market statistics, exchange volumes,
            and institutional trading insights.
          </p>
        </Link>

        <Link href="/defi" className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-purple-500 transition-all">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">⛓️ DEFI Analytics</h2>
          <p className="text-gray-300">
            Decentralized finance metrics, TVL analysis,
            and on-chain activity monitoring.
          </p>
        </Link>
      </div>

      <section className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-8">
        <h3 className="text-2xl font-bold mb-4">Key Features</h3>
        <ul className="space-y-2 text-gray-300">
          <li>✅ 1-hour price predictions with 3-minute intervals</li>
          <li>✅ 95% confidence interval bounds (upper & lower)</li>
          <li>✅ Long/Short/Neutral position recommendations</li>
          <li>✅ Profit estimates with 10x-20x leverage ($1050 initial margin)</li>
          <li>✅ Real-time market data integration</li>
          <li>✅ Comprehensive CEFI & DEFI statistics</li>
        </ul>
      </section>
    </div>
  )
}
