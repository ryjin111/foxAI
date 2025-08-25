# FoxAI - AI Shitposting Assistant

An AI-powered shitposting assistant with MCP (Model Context Protocol) server and modern web interface.

## Features

- 🤖 **Shitposting Tools**: Generate random shitposts and memes
- 🐦 **Twitter Integration**: Post tweets and analyze sentiment
- ⚡ **Automation**: Rule-based social media automation
- 📊 **Trending Topics**: Get what's hot on Twitter
- 🎯 **Sentiment Analysis**: Analyze text sentiment

## Quick Deploy to Vercel

### 1. Fork/Clone this repository

### 2. Set up Environment Variables

In your Vercel project settings, add these environment variables:

```
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
OPENAI_API_KEY=your_openai_api_key
```

### 3. Deploy

Click the deploy button below or run:

```bash
vercel --prod
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/foxai)

## MCP Server Tools

The MCP server provides these tools:

- `generate_shitpost` - Generate a random shitpost
- `post_random_shitpost` - Post a random shitpost to Twitter
- `analyze_sentiment` - Analyze text sentiment
- `post_tweet` - Post a tweet to Twitter
- `get_trending_topics` - Get trending topics
- `create_automation_rule` - Create automation rules
- `list_automation_rules` - List automation rules
- `delete_automation_rule` - Delete automation rules
- `get_system_status` - Get system status

## Local Development

```bash
# Install dependencies
npm install

# Start the MCP server
npm run dev

# Start the web interface
npm run next:dev
```

## Shitpost Categories

- **Meme**: Tech bro and viral content
- **Copypasta**: Classic internet copypastas
- **Troll**: Well-actually responses and trolling
- **Random**: Random facts and unexpected content

## License

MIT 