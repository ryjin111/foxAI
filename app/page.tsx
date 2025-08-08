'use client'

import React, { useState } from 'react'
// import { useChat } from 'ai/react'
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   Activity, 
//   Bot, 
//   Settings, 
//   BarChart3,
//   Wallet,
//   Zap,
//   MessageSquare,
//   AlertCircle,
//   CheckCircle,
//   Clock
// } from 'lucide-react'

// Fallback icon components for build compatibility
const TrendingUp = ({ className }: { className?: string }) => <span className={className}>📈</span>
const TrendingDown = ({ className }: { className?: string }) => <span className={className}>📉</span>
const Activity = ({ className }: { className?: string }) => <span className={className}>📊</span>
const Bot = ({ className }: { className?: string }) => <span className={className}>🤖</span>
const Settings = ({ className }: { className?: string }) => <span className={className}>⚙️</span>
const BarChart3 = ({ className }: { className?: string }) => <span className={className}>📊</span>
const Wallet = ({ className }: { className?: string }) => <span className={className}>💰</span>
const Zap = ({ className }: { className?: string }) => <span className={className}>⚡</span>
const MessageSquare = ({ className }: { className?: string }) => <span className={className}>💬</span>
const AlertCircle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>
const CheckCircle = ({ className }: { className?: string }) => <span className={className}>✅</span>
const Clock = ({ className }: { className?: string }) => <span className={className}>⏰</span>



export default function AIConsole() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        if (reader) {
          const decoder = new TextDecoder()
          let aiMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' }
          
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value)
            aiMessage.content += chunk
            setMessages(prev => [...prev.slice(0, -1), aiMessage])
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
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
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Connect your trading APIs to view live market data</p>
                </div>
              </div>
            </div>

            {/* AI Signals */}
            <div className="trading-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>AI Signals</span>
              </h2>
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>AI-generated trading signals will appear here</p>
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
                
                {messages.map((message: { id: string; role: string; content: string }) => (
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

        {activeTab === 'trading' && (
          <div className="max-w-4xl mx-auto">
            <div className="trading-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Trading Interface</span>
              </h2>
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Connect your MCP server to enable trading functionality</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="max-w-4xl mx-auto">
            <div className="trading-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Trading Signals</span>
              </h2>
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>AI-generated trading signals will appear here</p>
              </div>
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
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>System alerts and notifications will appear here</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 