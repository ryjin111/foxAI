'use client'

import React, { useState } from 'react'
import { useChat } from 'ai/react'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Bot, 
  Settings, 
  BarChart3,
  Wallet,
  Zap,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

// Mock data for demonstration
const mockMarketData = [
  { symbol: 'BTC', price: 43250, change: 2.5, volume: '2.1B', signal: 'bullish' },
  { symbol: 'ETH', price: 2650, change: -1.2, volume: '1.8B', signal: 'neutral' },
  { symbol: 'SOL', price: 98.5, change: 5.8, volume: '890M', signal: 'bullish' },
  { symbol: 'MATIC', price: 0.85, change: -0.5, volume: '320M', signal: 'bearish' },
]

const mockSignals = [
  { id: 1, symbol: 'BTC', type: 'buy', confidence: 0.85, timestamp: '2 min ago', price: 43250 },
  { id: 2, symbol: 'SOL', type: 'buy', confidence: 0.78, timestamp: '5 min ago', price: 98.5 },
  { id: 3, symbol: 'ETH', type: 'hold', confidence: 0.45, timestamp: '8 min ago', price: 2650 },
]

const mockAlerts = [
  { id: 1, type: 'success', message: 'Order executed: BTC buy 0.1 @ $43,250', time: '1 min ago' },
  { id: 2, type: 'warning', message: 'High volatility detected in SOL', time: '3 min ago' },
  { id: 3, type: 'info', message: 'Market update posted to Twitter', time: '5 min ago' },
]

export default function AIConsole() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'signal-bullish'
      case 'bearish': return 'signal-bearish'
      default: return 'signal-neutral'
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />
      case 'bearish': return <TrendingDown className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FoxAI</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Trading Console</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">System Online</span>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'trading', label: 'Trading', icon: Activity },
              { id: 'signals', label: 'Signals', icon: Zap },
              { id: 'chat', label: 'AI Chat', icon: MessageSquare },
              { id: 'alerts', label: 'Alerts', icon: AlertCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Overview */}
            <div className="lg:col-span-2">
              <div className="trading-card">
                <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Market Overview</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mockMarketData.map((asset) => (
                    <div key={asset.symbol} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{asset.symbol}</span>
                        <span className={`signal-indicator ${getSignalColor(asset.signal)}`}>
                          {getSignalIcon(asset.signal)}
                        </span>
                      </div>
                      <div className="text-2xl font-bold">${asset.price.toLocaleString()}</div>
                      <div className={`text-sm ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </div>
                      <div className="text-xs text-muted-foreground">Vol: {asset.volume}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Signals */}
            <div className="trading-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>AI Signals</span>
              </h2>
              <div className="space-y-3">
                {mockSignals.map((signal) => (
                  <div key={signal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        signal.type === 'buy' ? 'bg-green-500' : 
                        signal.type === 'sell' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <div className="font-medium">{signal.symbol}</div>
                        <div className="text-sm text-muted-foreground">{signal.type.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${signal.price.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{signal.confidence * 100}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <div className="trading-card h-[600px] flex flex-col">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>AI Trading Assistant</span>
              </h2>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me about trading strategies, market analysis, or automation rules!</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about trading strategies, market analysis, or automation..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="max-w-2xl mx-auto">
            <div className="trading-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>System Alerts</span>
              </h2>
              <div className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.type === 'success' ? 'bg-green-500' :
                      alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 