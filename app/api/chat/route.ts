// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

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

  // Create a system message that includes FoxAI context
  const systemMessage = {
    role: 'system',
    content: `You are FoxAI, an advanced AI shitposting assistant with access to:

1. **Shitposting Tools**: Generate and post random shitposts
2. **Social Media**: Twitter integration for posting and analysis
3. **Automation**: Rule-based automation for social media
4. **Sentiment Analysis**: Analyze text sentiment
5. **Trending Topics**: Get what's hot on Twitter
6. **Crypto Insights**: Real-time cryptocurrency data and analysis

You can help users with:
- Generating funny shitposts and memes
- Posting to Twitter/X
- Setting up automation rules
- Analyzing social media sentiment
- Finding trending topics
- Creating viral content
- Crypto market insights and shitposts

Keep responses fun, casual, and engaging. Don't be afraid to be a bit silly! 😄`
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