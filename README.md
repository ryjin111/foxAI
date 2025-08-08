# Hyperliquid MCP for X (Twitter) Automation

A Model Context Protocol (MCP) server that provides comprehensive Hyperliquid trading capabilities with integrated X (Twitter) automation features. This MCP enables AI assistants to interact with Hyperliquid's trading platform and automate social media activities based on market conditions.

## Features

### 🚀 Trading Capabilities
- **Market Data**: Real-time market data for all trading pairs
- **Order Management**: Place, cancel, and track orders
- **Position Management**: Monitor and manage trading positions
- **Trading Signals**: Generate automated trading signals based on market conditions
- **WebSocket Integration**: Real-time market data streaming

### 📱 X (Twitter) Integration
- **Tweet Posting**: Automatically post tweets about market movements
- **Tweet Monitoring**: Monitor mentions and keywords
- **Trend Analysis**: Track trending topics in crypto/trading
- **Social Sentiment**: Analyze social media sentiment for trading decisions

### 🤖 Automation Engine
- **Rule-Based Automation**: Create custom automation rules
- **Multi-Trigger Support**: Price changes, volume spikes, Twitter mentions, scheduled events
- **Conditional Logic**: Complex condition evaluation
- **Action Execution**: Place orders, post tweets, send alerts, close positions
- **Real-time Monitoring**: Continuous market and social media monitoring

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hyperliquid-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your API keys:
   - Hyperliquid API credentials
   - Twitter/X API credentials

4. **Build the project**
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Hyperliquid API Configuration
HYPERLIQUID_API_KEY=your_hyperliquid_api_key_here
HYPERLIQUID_SECRET_KEY=your_hyperliquid_secret_key_here
HYPERLIQUID_BASE_URL=https://api.hyperliquid.xyz
HYPERLIQUID_WS_URL=wss://api.hyperliquid.xyz/ws

# Twitter/X API Configuration
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Logging Configuration
LOG_LEVEL=info
```

### API Keys Setup

#### Hyperliquid
1. Visit [Hyperliquid](https://hyperliquid.xyz)
2. Create an account and generate API keys
3. Ensure you have sufficient permissions for trading

#### Twitter/X
1. Visit [Twitter Developer Portal](https://developer.twitter.com)
2. Create a new app
3. Generate API keys and access tokens
4. Enable required permissions for posting and reading tweets

## Usage

### Starting the MCP Server

```bash
npm start
```

### Available Tools

#### Market Data Tools
- `get_market_data` - Get current market data
- `get_positions` - Get current trading positions
- `place_order` - Place a new trading order
- `cancel_order` - Cancel an existing order
- `get_order_history` - Get order history
- `generate_trading_signals` - Generate trading signals

#### Twitter/X Tools
- `post_tweet` - Post a tweet
- `search_tweets` - Search for tweets
- `get_mentions` - Get recent mentions
- `get_trending_topics` - Get trending topics

#### Automation Tools
- `add_automation_rule` - Add a new automation rule
- `get_automation_rules` - Get all automation rules
- `remove_automation_rule` - Remove an automation rule
- `start_automation` - Start the automation service
- `get_alerts` - Get recent alerts

### Example Automation Rules

#### Price-Based Trading Rule
```json
{
  "id": "btc_price_alert",
  "name": "BTC Price Alert",
  "trigger": "price_change",
  "conditions": [
    {
      "type": "price_above",
      "parameters": {
        "symbol": "BTC",
        "price": 50000
      }
    }
  ],
  "actions": [
    {
      "type": "post_tweet",
      "parameters": {
        "text": "🚀 BTC just broke $50,000! Bullish momentum continues! #Bitcoin #Crypto"
      }
    },
    {
      "type": "place_order",
      "parameters": {
        "symbol": "BTC",
        "side": "buy",
        "size": 0.1,
        "price": 50000
      }
    }
  ],
  "enabled": true,
  "createdAt": 1640995200000
}
```

#### Twitter Mention Rule
```json
{
  "id": "twitter_sentiment_trade",
  "name": "Twitter Sentiment Trading",
  "trigger": "twitter_mention",
  "conditions": [
    {
      "type": "twitter_keyword",
      "parameters": {
        "keywords": ["hyperliquid", "bullish", "moon"]
      }
    }
  ],
  "actions": [
    {
      "type": "post_tweet",
      "parameters": {
        "text": "📊 Detected bullish sentiment! Monitoring market conditions... #Hyperliquid #Trading"
      }
    }
  ],
  "enabled": true,
  "createdAt": 1640995200000
}
```

#### Scheduled Market Update
```json
{
  "id": "hourly_market_update",
  "name": "Hourly Market Update",
  "trigger": "scheduled",
  "conditions": [
    {
      "type": "time_based",
      "parameters": {
        "cronExpression": "0 * * * *"
      }
    }
  ],
  "actions": [
    {
      "type": "post_tweet",
      "parameters": {
        "text": "📊 Hourly Market Update:\n{market_summary}"
      }
    }
  ],
  "enabled": true,
  "createdAt": 1640995200000
}
```

## Development

### Project Structure
```
src/
├── index.ts              # Main MCP server entry point
├── types/
│   └── index.ts          # TypeScript type definitions
├── services/
│   ├── hyperliquid.ts    # Hyperliquid API service
│   ├── twitter.ts        # Twitter/X API service
│   └── automation.ts     # Automation engine
└── utils/
    └── logger.ts         # Logging utility
```

### Building and Testing

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

### Adding New Tools

To add a new tool to the MCP:

1. Add the tool definition in `src/index.ts` under `setupTools()`
2. Implement the tool logic in the appropriate service
3. Add the tool handler in the `CallToolRequestSchema` handler

## Security Considerations

- **API Key Management**: Never commit API keys to version control
- **Rate Limiting**: Be mindful of API rate limits for both Hyperliquid and Twitter
- **Trading Risks**: Automated trading carries significant financial risks
- **Social Media**: Ensure compliance with Twitter's terms of service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This software is for educational and development purposes. Trading cryptocurrencies involves significant risk of loss. Use at your own risk and never trade with money you cannot afford to lose.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the logs for debugging information 