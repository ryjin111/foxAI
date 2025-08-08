import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// Create an OpenAI API client (that's edge friendly!)
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set')
}
const config = new Configuration({
  apiKey,
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Create a system message that includes FoxAI context
  const systemMessage = {
    role: 'system',
    content: `You are FoxAI, an advanced AI trading assistant with access to:

1. **Trading Tools**: Market data, order placement, position management
2. **AI Signals**: Real-time trading signals and analysis
3. **Automation**: Rule-based trading automation
4. **Social Media**: Twitter integration for sentiment analysis
5. **Risk Management**: Position sizing and stop-loss management

You can help users with:
- Market analysis and trading strategies
- Setting up automation rules
- Interpreting AI-generated signals
- Risk management advice
- Social media sentiment analysis
- Portfolio optimization

Always provide practical, actionable advice and explain your reasoning. Be concise but thorough.`
  }

  // Add the system message to the conversation
  const conversation = [systemMessage, ...messages]

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: conversation,
    temperature: 0.7,
    max_tokens: 500,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream)
} 