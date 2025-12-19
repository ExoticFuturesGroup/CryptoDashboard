import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/layout/Navigation'

export const metadata: Metadata = {
  title: 'CryptoDashboard - Market Predictions & Analytics',
  description: 'Real-time cryptocurrency market predictions with CEFI and DEFI analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-900">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
