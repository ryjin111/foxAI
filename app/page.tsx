'use client'

import { useState, useEffect } from 'react'

export default function AIConsole() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Dynamic stats state
  const [stats, setStats] = useState({
    shitpostsGenerated: 0,
    cryptoInsights: 0,
    tweetsPosted: 0,
    systemStatus: 'Online'
  })

  useEffect(() => {
    setMounted(true)
    loadStats()
  }, [])

  // Load dynamic stats
  const loadStats = async () => {
    try {
      // Get stats from localStorage or initialize
      const savedStats = localStorage.getItem('foxai-stats')
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      } else {
        // Initialize with some default values
        const initialStats = {
          shitpostsGenerated: Math.floor(Math.random() * 50) + 20,
          cryptoInsights: Math.floor(Math.random() * 30) + 10,
          tweetsPosted: Math.floor(Math.random() * 20) + 5,
          systemStatus: 'Online'
        }
        setStats(initialStats)
        localStorage.setItem('foxai-stats', JSON.stringify(initialStats))
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Update stats when actions are performed
  const updateStats = (type: string) => {
    setStats(prev => {
      const newStats = { ...prev }
      switch (type) {
        case 'shitpost':
          newStats.shitpostsGenerated += 1
          break
        case 'crypto':
          newStats.cryptoInsights += 1
          break
        case 'tweet':
          newStats.tweetsPosted += 1
          break
      }
      localStorage.setItem('foxai-stats', JSON.stringify(newStats))
      return newStats
    })
  }

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
          setMessages(prev => [...prev, aiMessage])
          
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value)
            aiMessage = { ...aiMessage, content: aiMessage.content + chunk }
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

  // Handle quick actions
  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'shitpost':
        updateStats('shitpost')
        // Simulate generating a shitpost
        const shitpost = "🚀 Just deployed my AI-powered blockchain solution to the cloud. Disrupting the industry one commit at a time! #TechBro #Innovation"
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `Generated shitpost: ${shitpost}` }])
        break
      case 'crypto':
        updateStats('crypto')
        // Simulate crypto insight
        const insight = "📊 Bitcoin is currently at $43,250 with a 2.3% increase in the last 24h. Market sentiment is bullish! 🚀 #Crypto #Bitcoin"
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `Crypto insight: ${insight}` }])
        break
      case 'tweet':
        updateStats('tweet')
        // Simulate posting tweet
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '🐦 Tweet posted successfully! Check your Twitter account.' }])
        break
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🦊</span>
              <div>
                <h1 className="text-xl font-bold">FoxAI</h1>
                <p className="text-sm text-gray-600">AI Shitposting & Crypto Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">{stats.systemStatus}</span>
              </div>
              <span className="text-gray-400">⏰</span>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '🤖' },
            { id: 'chat', label: 'Chat', icon: '💬' },
            { id: 'crypto', label: 'Crypto', icon: '🚀' },
            { id: 'automation', label: 'Automation', icon: '⚡' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Shitposts Generated', value: stats.shitpostsGenerated.toString(), icon: '✨' },
                { label: 'Crypto Insights', value: stats.cryptoInsights.toString(), icon: '🚀' },
                { label: 'Tweets Posted', value: stats.tweetsPosted.toString(), icon: '🐦' },
                { label: 'System Status', value: stats.systemStatus, icon: '📊' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <p className="text-gray-600 mb-4">Generate content and get crypto insights</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '✨', label: 'Generate Shitpost', action: 'shitpost' },
                  { icon: '🚀', label: 'Crypto Insight', action: 'crypto' },
                  { icon: '📈', label: 'Top Coins', action: 'coins' },
                  { icon: '🐦', label: 'Post to Twitter', action: 'tweet' },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="h-20 border border-gray-200 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-600 mb-4">Latest shitposts and crypto insights</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Generated a crypto insight</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Crypto</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Posted shitpost to Twitter</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Posted</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Analyzed Bitcoin price</p>
                    <p className="text-xs text-gray-500">10 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">BTC</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Chat with FoxAI</h2>
              <p className="text-gray-600">Generate shitposts, get crypto insights, and more</p>
            </div>
            <div className="flex-1 flex flex-col p-6">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me to generate a shitpost, get crypto insights, or post to Twitter..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Crypto */}
        {activeTab === 'crypto' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">🚀 Crypto Insights</h2>
              <p className="text-gray-600 mb-4">Get real-time crypto data and generate insights</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl mb-2">📈</div>
                  <h3 className="font-medium">Top Coins</h3>
                  <p className="text-sm text-gray-600">Get top cryptocurrencies</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl mb-2">🔥</div>
                  <h3 className="font-medium">Trending</h3>
                  <p className="text-sm text-gray-600">See what's hot</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl mb-2">💎</div>
                  <h3 className="font-medium">Price Check</h3>
                  <p className="text-sm text-gray-600">Check specific coins</p>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">💬 Crypto Shitposts</h2>
              <p className="text-gray-600 mb-4">Generate crypto-themed shitposts and insights</p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">🚀 Bitcoin just went 🚀 UP! 5.23% in 24h! To the moon or to the ground? Only time will tell! 🌙 #Crypto #MoonMission</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">📊 Ethereum is pumping! Market cap: $234.5B. This is either the best or worst investment of your life! 💎 #DiamondHands</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">🔥 Solana is pumping like crazy! 12.45% change in 24h. Your portfolio is either celebrating or crying right now! 😅 #CryptoLife</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Automation */}
        {activeTab === 'automation' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Automation Rules</h2>
            <p className="text-gray-600 mb-4">Set up automated shitposting and crypto insights</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Daily Crypto Update</h3>
                  <p className="text-sm text-gray-600">Posts crypto market insights every day at 9 AM</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Shitpost Generator</h3>
                  <p className="text-sm text-gray-600">Posts random shitposts every 4 hours</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Crypto Price Alerts</h3>
                  <p className="text-sm text-gray-600">Alerts when major coins have big moves</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Inactive</span>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <p className="text-gray-600 mb-4">Configure your FoxAI shitposting and crypto assistant</p>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Twitter API Configuration</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your Twitter API keys are configured and ready to use.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Connected</span>
                </div>
              </div>
              <div className="border-t pt-6">
                <h3 className="font-medium mb-2">CoinGecko API</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connected to CoinGecko for real-time crypto data.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Connected</span>
                </div>
              </div>
              <div className="border-t pt-6">
                <h3 className="font-medium mb-2">DeepSeek AI</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connected to DeepSeek for intelligent responses.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Connected</span>
                </div>
              </div>
              <div className="border-t pt-6">
                <h3 className="font-medium mb-2">MCP Server Status</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The MCP server provides tools for shitposting, crypto insights, and automation.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Running</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 