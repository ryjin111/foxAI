import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FoxAI - AI-Powered Trading Console',
  description: 'Advanced AI trading automation with MCP server integration',
  keywords: ['AI', 'Trading', 'Automation', 'MCP', 'Hyperliquid', 'Crypto'],
  authors: [{ name: 'FoxAI Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen ai-console">
          {children}
        </div>
      </body>
    </html>
  )
} 