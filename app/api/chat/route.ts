// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

// MCP Server connection
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3001'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Check if DeepSeek API key is available
  if (!process.env.DEEPSEEK_API_KEY) {
    // Fallback response without API key
    const responses = [
      "Hey there! I'm FoxAI, your shitposting and crypto assistant! 🦊✨ What can I help you with today?",
      "🚀 Ready to generate some epic shitposts or get crypto insights? Just let me know what you need!",
      "💎 Crypto markets are wild today! Want me to check the latest prices or generate a crypto shitpost?",
      "🐦 Twitter is calling! Need help with a tweet or want to analyze some sentiment?",
      "⚡ Automation time! I can help you set up rules for posting and crypto alerts.",
      "🤖 I'm here to make your shitposting game strong! What's on your mind?"
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    // Simulate streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const text = randomResponse
        controller.enqueue(encoder.encode(text))
        controller.close()
      }
    })
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }

  // Check if user wants to post to Twitter
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
  const isTwitterRequest = lastMessage.includes('post') && (lastMessage.includes('twitter') || lastMessage.includes('x') || lastMessage.includes('tweet'))

  if (isTwitterRequest) {
    try {
      // Generate a shitpost first
      const shitpostResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Generate a viral Hyperliquid EVM tweet about NFTs, trading, or market analysis. Focus on Hyperliquid EVM ecosystem, NFTs, cross-chain trading, and the future of DeFi. Keep it under 280 characters. Make it engaging and shareable with relevant hashtags.'
            },
            {
              role: 'user',
              content: 'Generate a random Hyperliquid EVM tweet'
            }
          ],
          stream: false,
          temperature: 0.8,
          max_tokens: 200,
        }),
      })

      if (shitpostResponse.ok) {
        const shitpostData = await shitpostResponse.json()
        const shitpost = shitpostData.choices?.[0]?.message?.content || "🚀 Just deployed my AI-powered blockchain solution! Disrupting the industry one commit at a time! #TechBro #Innovation"

        // Post to Twitter via MCP
        const mcpResponse = await fetch(`${MCP_SERVER_URL}/api/tools`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'post_tweet',
            arguments: { text: shitpost },
          }),
        })

        if (mcpResponse.ok) {
          const result = await mcpResponse.json()
          return new Response(`🐦 Posted to Twitter/X: "${shitpost}"\n\nStatus: ${result.success ? 'Success!' : 'Failed'}\nTweet ID: ${result.tweetId || 'N/A'}`, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'no-cache',
            },
          })
        } else {
          const errorText = await mcpResponse.text()
          console.error('MCP Server error:', errorText)
          return new Response(`🐦 Generated tweet: "${shitpost}"\n\nNote: Twitter posting failed (MCP server error: ${mcpResponse.status})\n\nTo fix this:\n1. Make sure MCP server is running on ${MCP_SERVER_URL}\n2. Check Twitter API keys are correct\n3. Verify MCP server has access to Twitter API`, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'no-cache',
            },
          })
        }
      }
    } catch (error) {
      console.error('Twitter posting error:', error)
    }
  }

  // Create a system message that includes FoxAI context
  const systemMessage = {
    role: 'system',
    content: `You are FoxAI, an advanced AI Hyperliquid EVM analysis assistant with access to:

1. **Hyperliquid EVM Analysis**: Real-time data from Hyperliquid EVM platform
2. **NFT Tracking**: Monitor NFT collections and trading on Hyperliquid EVM
3. **Market Intelligence**: Comprehensive market analysis and sentiment
4. **Social Media**: Twitter integration for posting and analysis
5. **Automation**: Rule-based automation for social media
6. **Sentiment Analysis**: Analyze text sentiment for Hyperliquid EVM content
7. **Trend Detection**: Get what's hot on Hyperliquid EVM
8. **Project Scoring**: Evaluate Hyperliquid EVM assets and NFTs

You can help users with:
- Generating Hyperliquid EVM market insights and analysis
- Tracking NFT collections and trading activity
- Posting to Twitter/X with Hyperliquid EVM focus
- Setting up automation rules for Hyperliquid EVM updates
- Analyzing social media sentiment for Hyperliquid EVM
- Finding trending Hyperliquid EVM assets and NFTs
- Creating viral Hyperliquid EVM content
- Providing NFT market insights and recommendations

Keep responses fun, casual, and engaging. Focus on Hyperliquid EVM ecosystem, NFTs, and the future of cross-chain trading! 😄

IMPORTANT: When users ask to post to Twitter/X, I can actually do it! Just say "post to twitter" or "post to x" and I'll generate and post Hyperliquid EVM content for you.`
  }

  // Add the system message to the conversation
  const conversation = [systemMessage, ...messages]

  try {
    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: conversation,
        stream: false,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`)
    }

    // Get the complete response
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

    // Return the complete response
    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('DeepSeek API error:', error)
    
    // Fallback response on error
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const text = "Sorry, I'm having trouble connecting to my AI brain right now! 🤖 But I'm still here to help with shitposting and crypto insights! What do you need?"
        controller.enqueue(encoder.encode(text))
        controller.close()
      }
    })
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }
} 