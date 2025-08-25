# FoxAI - AI Shitposting & Crypto Assistant

An AI-powered shitposting and crypto insights assistant with MCP (Model Context Protocol) server and modern web interface.

## Features

- 🤖 **Shitposting Tools**: Generate random shitposts and memes
- 🚀 **Crypto Insights**: Real-time crypto data and market analysis
- 🐦 **Twitter Integration**: Post tweets and analyze sentiment
- ⚡ **Automation**: Rule-based social media and crypto automation
- 📊 **CoinGecko Integration**: Live cryptocurrency data
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

### Shitposting Tools
- `generate_shitpost` - Generate a random shitpost (meme, copypasta, troll, random, crypto)
- `post_random_shitpost` - Post a random shitpost to Twitter

### Crypto Tools
- `get_crypto_insight` - Get a crypto market insight with shitpost
- `get_top_coins` - Get top cryptocurrencies by market cap
- `get_trending_coins` - Get trending cryptocurrencies
- `get_coin_price` - Get current price of a specific coin

### Social Media Tools
- `analyze_sentiment` - Analyze sentiment of tweets or text content
- `post_tweet` - Post a tweet to Twitter/X
- `get_trending_topics` - Get trending topics from Twitter

### Automation Tools
- `create_automation_rule` - Create automation rules
- `list_automation_rules` - List automation rules
- `delete_automation_rule` - Delete automation rules

### Utility Tools
- `get_system_status` - Get system status and health information

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
- **Crypto**: Crypto market insights and shitposts

## Crypto Features

- **Real-time Data**: Live cryptocurrency prices and market data
- **Top Coins**: Get top cryptocurrencies by market cap
- **Trending Coins**: See what's hot in the crypto world
- **Price Tracking**: Check specific coin prices
- **Crypto Shitposts**: Generate crypto-themed content

## APIs Used

- **CoinGecko API**: For cryptocurrency data (no API key required)
- **Twitter API**: For posting tweets and sentiment analysis
- **OpenAI API**: For AI chat functionality

## License

MIT 