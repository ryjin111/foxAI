'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquare, 
  TrendingUp, 
  Settings, 
  Zap, 
  Bot, 
  Sparkles,
  Twitter,
  Heart,
  Share2,
  Activity
} from 'lucide-react'

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
    { icon: Sparkles, label: 'Generate Shitpost', action: 'generate_shitpost' },
    { icon: Twitter, label: 'Post to Twitter', action: 'post_tweet' },
    { icon: TrendingUp, label: 'Trending Topics', action: 'get_trending' },
    { icon: Heart, label: 'Analyze Sentiment', action: 'analyze_sentiment' },
  ]

  const stats = [
    { label: 'Shitposts Generated', value: '42', icon: Sparkles },
    { label: 'Tweets Posted', value: '15', icon: Twitter },
    { label: 'Automation Rules', value: '3', icon: Zap },
    { label: 'System Status', value: 'Online', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <FoxIcon className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">FoxAI</h1>
              <p className="text-sm text-muted-foreground">AI Shitposting Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Online</span>
            </Badge>
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Automation</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Generate content and interact with social media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {quickActions.map((action, index) => (
                    <Button key={index} variant="outline" className="h-20 flex-col space-y-2">
                      <action.icon className="h-6 w-6" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest shitposts and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm">Generated a new shitpost</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                    <Badge variant="secondary">Meme</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm">Posted to Twitter</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                    <Badge variant="secondary">Posted</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <p className="text-sm">Analyzed sentiment</p>
                      <p className="text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                    <Badge variant="secondary">Positive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Chat with FoxAI</CardTitle>
                <CardDescription>Generate shitposts, analyze sentiment, and more</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4">
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
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <p className="text-sm">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me to generate a shitpost, analyze sentiment, or post to Twitter..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    Send
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Rules</CardTitle>
                <CardDescription>Set up automated shitposting and social media interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Daily Shitpost</h3>
                      <p className="text-sm text-muted-foreground">Posts a random shitpost every day at 9 AM</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Trending Response</h3>
                      <p className="text-sm text-muted-foreground">Responds to trending topics with relevant shitposts</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Sentiment Analysis</h3>
                      <p className="text-sm text-muted-foreground">Analyzes mentions and responds based on sentiment</p>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your FoxAI shitposting assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Twitter API Configuration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your Twitter API keys are configured and ready to use.
                    </p>
                    <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Connected</span>
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">MCP Server Status</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The MCP server provides tools for shitposting and automation.
                    </p>
                    <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Running</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 