'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            CryptoDashboard
          </Link>
          
          <div className="flex space-x-8">
            <Link 
              href="/predictions" 
              className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                isActive('/predictions') 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Market Predictions
            </Link>
            <Link 
              href="/cefi" 
              className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                isActive('/cefi') 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              CEFI Analytics
            </Link>
            <Link 
              href="/defi" 
              className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                isActive('/defi') 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              DEFI Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
