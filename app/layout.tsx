import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FoxAI - AI Shitposting Assistant',
  description: 'AI-powered shitposting with MCP server and modern console',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 