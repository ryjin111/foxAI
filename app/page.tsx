'use client'

import { useState } from 'react'

const FoxIcon = ({ className }: { className?: string }) => <span className={className}>🦊</span>
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

  const quickActions = [
    { icon: '✨', label: 'Generate Shitpost', action: 'generate_shitpost' },
    { icon: '🐦', label: 'Post to Twitter', action: 'post_tweet' },
    { icon: '📈', label: 'Trending Topics', action: 'get_trending' },
    { icon: '❤️', label: 'Analyze Sentiment', action: 'analyze_sentiment' },
  ]

  const stats = [
    { label: 'Shitposts Generated', value: '42', icon: '✨' },
    { label: 'Tweets Posted', value: '15', icon: '🐦' },
    { label: 'Automation Rules', value: '3', icon: '⚡' },
    { label: 'System Status', value: 'Online', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FoxIcon className="text-2xl" />
              <div>
                <h1 className="text-xl font-bold">FoxAI</h1>
                <p className="text-sm text-gray-600">AI Shitposting Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <Clock className="text-gray-400" />
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
              {stats.map((stat, index) => (
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
              <p className="text-gray-600 mb-4">Generate content and interact with social media</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
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
              <p className="text-gray-600 mb-4">Latest shitposts and interactions</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Generated a new shitpost</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Meme</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Posted to Twitter</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Posted</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Analyzed sentiment</p>
                    <p className="text-xs text-gray-500">10 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Positive</span>
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
              <p className="text-gray-600">Generate shitposts, analyze sentiment, and more</p>
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
                  placeholder="Ask me to generate a shitpost, analyze sentiment, or post to Twitter..."
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

        {/* Automation */}
        {activeTab === 'automation' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Automation Rules</h2>
            <p className="text-gray-600 mb-4">Set up automated shitposting and social media interactions</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Daily Shitpost</h3>
                  <p className="text-sm text-gray-600">Posts a random shitpost every day at 9 AM</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Trending Response</h3>
                  <p className="text-sm text-gray-600">Responds to trending topics with relevant shitposts</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Sentiment Analysis</h3>
                  <p className="text-sm text-gray-600">Analyzes mentions and responds based on sentiment</p>
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
            <p className="text-gray-600 mb-4">Configure your FoxAI shitposting assistant</p>
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
                <h3 className="font-medium mb-2">MCP Server Status</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The MCP server provides tools for shitposting and automation.
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