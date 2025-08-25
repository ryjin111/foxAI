import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAIApi, Configuration } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Create a system message that includes FoxAI context
  const systemMessage = {
    role: 'system',
    content: `You are FoxAI, an advanced AI shitposting assistant with access to:

1. **Shitposting Tools**: Generate and post random shitposts
2. **Social Media**: Twitter integration for posting and analysis
3. **Automation**: Rule-based automation for social media
4. **Sentiment Analysis**: Analyze text sentiment
5. **Trending Topics**: Get what's hot on Twitter

You can help users with:
- Generating funny shitposts and memes
- Posting to Twitter/X
- Setting up automation rules
- Analyzing social media sentiment
- Finding trending topics
- Creating viral content

Keep responses fun, casual, and engaging. Don't be afraid to be a bit silly! 😄`
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