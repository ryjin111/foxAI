# 🦊 FoxAI - Advanced Crypto Analysis & Autonomous AI Agent

**AI-powered crypto analysis, market intelligence, and autonomous social media management with real-time insights, trend detection, and 24/7 autonomous operation powered by ElizaOS.**

## 🚀 Features

### **🤖 Autonomous AI Agent (ElizaOS)**
- **24/7 Autonomous Operation** - Runs continuously without human intervention
- **Persistent Memory** - Learns from interactions and market patterns
- **Multi-step Workflows** - Complex operations through natural language
- **Plugin Architecture** - 90+ official plugins for unlimited capabilities
- **Real-world Actions** - Takes actions in the real world through plugins

### **Core Capabilities**
- 🤖 **AI-Powered Analysis** - DeepSeek AI integration for intelligent insights
- 📊 **Real-time Crypto Market Analysis** - Live data from CoinGecko API
- 🔍 **Trend Detection** - Technical analysis and pattern recognition
- 📈 **Project Scoring System** - Comprehensive coin evaluation
- 📋 **Market Intelligence Reports** - Detailed market sentiment and analysis
- 🔔 **Multi-platform Notifications** - Real-time alerts and updates
- 🎫 **Token-gated Access Features** - Advanced access control
- 🧠 **Advanced Analytical Tools** - Sentiment analysis and market psychology
- 📊 **Market Sentiment Analysis** - Fear & Greed index and sentiment scoring

### **Twitter/X Features**
- 🕐 **Hourly Crypto Updates** - Automated market updates every hour
- 💬 **Smart Mention Replies** - AI-powered responses to mentions
- 📊 **Market Analysis Posts** - Comprehensive market reports
- 🎭 **Advanced Shitposting** - Context-aware viral content generation
- 📈 **Trending Analysis Posts** - Real-time trending coin analysis
- 🧠 **Sentiment Analysis Posts** - Public sentiment breakdowns
- 💎 **Project Score Posts** - Individual coin analysis and recommendations

### **Crypto Intelligence**
- 🔥 **Trending Coins Detection** - Real-time trending analysis
- 📊 **Fear & Greed Index** - Market psychology indicators
- 💯 **Project Scoring** - Multi-factor coin evaluation
- 📈 **Technical Analysis** - Support/resistance levels and trend detection
- 🎯 **Buy/Sell Recommendations** - AI-powered investment advice
- 📊 **Market Sentiment** - Bullish/bearish/neutral sentiment analysis
- 🔍 **Volume Analysis** - Trading volume and liquidity insights

## 🛠️ Quick Start

### **Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/foxai)

**Environment Variables:**
```bash
# DeepSeek AI
DEEPSEEK_API_KEY=your_deepseek_api_key

# Twitter/X API
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# ElizaOS Agent
ELIZAOS_API_KEY=your_elizaos_api_key
HYPERLIQUID_API_URL=https://api.hyperliquid.xyz
COINGECKO_API_KEY=your_coingecko_api_key

# MCP Server
MCP_SERVER_URL=http://localhost:3001
```

### **Local Development**

```bash
# Install dependencies
npm install

# Start MCP server
npm run dev

# Start ElizaOS agent
npm run eliza:dev

# Start Next.js app
npm run next:dev
```

## 🤖 ElizaOS Autonomous Agent

### **Agent Personality**
FoxAI is an autonomous AI agent specialized in Hyperliquid EVM analysis and NFT market intelligence with:
- **Hyperliquid EVM expertise** - Deep knowledge of NFT trading and DeFi protocols
- **Playful personality** - Makes complex crypto concepts accessible
- **Bullish on Hyperliquid EVM** - Always optimistic about cross-chain trading
- **Community engagement** - Loves sharing insights and building community

### **Autonomous Workflows**

#### **1. Hourly Market Updates**
- **Schedule:** Every hour at the top of the hour
- **Actions:** Fetch data → Analyze sentiment → Generate content → Post to Twitter
- **Output:** Engaging Hyperliquid EVM market updates

#### **2. Mention Monitoring**
- **Schedule:** Every 5 minutes
- **Actions:** Check mentions → Analyze sentiment → Generate replies → Reply to mentions
- **Output:** Smart, context-aware responses

#### **3. NFT Collection Monitoring**
- **Schedule:** Every 15 minutes
- **Actions:** Fetch NFT data → Analyze performance → Identify opportunities
- **Output:** Real-time NFT insights and trading opportunities

### **Agent Commands**
```bash
# Start autonomous agent
npm run eliza:dev

# Send message to agent
curl -X POST /api/eliza \
  -H "Content-Type: application/json" \
  -d '{"action": "send_message", "message": "Analyze current Hyperliquid EVM market"}'

# Get agent status
curl -X GET /api/eliza

# Start/stop agent
curl -X POST /api/eliza -d '{"action": "start"}'
curl -X POST /api/eliza -d '{"action": "stop"}'
```

## 🧠 MCP Server Tools

### **Advanced Crypto Analysis Tools**
- `get_market_analysis` - Comprehensive market analysis with sentiment and trends
- `get_project_score` - Detailed project scoring and risk assessment
- `detect_trends` - Technical trend detection and pattern analysis
- `analyze_sentiment` - Advanced sentiment analysis for crypto content
- `get_crypto_insight` - AI-generated crypto insights and analysis
- `get_top_coins` - Top cryptocurrencies by market cap
- `get_trending_coins` - Real-time trending coins
- `get_coin_price` - Current price for specific coins

### **Advanced Twitter/X Tools**
- `post_hourly_crypto_update` - Automated hourly market updates
- `post_market_analysis` - Comprehensive market analysis posts
- `post_project_score` - Individual coin analysis posts
- `reply_to_mentions` - Smart AI-powered mention replies
- `post_trending_analysis` - Trending coin analysis posts
- `post_sentiment_analysis` - Sentiment analysis posts
- `post_tweet` - Standard tweet posting
- `get_trending_topics` - Twitter trending topics

### **Shitposting Tools**
- `generate_shitpost` - AI-powered shitpost generation
- `post_random_shitpost` - Automated shitpost posting

### **Automation Tools**
- `create_automation_rule` - Create automated posting rules
- `list_automation_rules` - List all automation rules
- `delete_automation_rule` - Remove automation rules

### **Utility Tools**
- `get_system_status` - System health and service status

## 📊 Crypto Analysis Features

### **Market Intelligence**
- **Real-time Data** - Live prices, volumes, and market caps
- **Sentiment Analysis** - Bullish/bearish/neutral market sentiment
- **Fear & Greed Index** - Market psychology indicators (0-100)
- **Trending Topics** - Hot crypto topics and discussions
- **Volume Analysis** - Trading volume and liquidity insights

### **Project Scoring System**
- **Overall Score** - 0-100 comprehensive evaluation
- **Risk Assessment** - Low/Medium/High risk levels
- **Investment Recommendations** - Buy/Hold/Sell advice
- **Factor Analysis** - Market cap, volume, stability, community, development

### **Technical Analysis**
- **Trend Detection** - Breakout, breakdown, consolidation, accumulation
- **Support/Resistance** - Key price levels
- **Confidence Scoring** - 60-100% confidence levels
- **Volume Spikes** - Unusual trading activity detection
- **Timeframe Analysis** - 24h, 1h, 15m analysis

## 🐦 Twitter/X Automation

### **Hourly Updates**
- **Market Sentiment** - Current market mood
- **Fear & Greed Index** - Market psychology
- **Top Gainers** - Best performing coins
- **Trending Topics** - Hot crypto discussions

### **Smart Replies**
- **Sentiment-based Responses** - Context-aware replies
- **Crypto Insights** - Educational content
- **Engagement Optimization** - Viral potential analysis

### **Content Types**
- **Market Analysis** - Comprehensive reports
- **Project Scores** - Individual coin analysis
- **Trending Analysis** - Hot coin breakdowns
- **Sentiment Posts** - Public sentiment analysis
- **Shitposts** - Viral crypto content

## 🔧 APIs Used

- **CoinGecko API** - Real-time crypto data and market information
- **Twitter API v2** - Social media posting and analysis
- **DeepSeek AI** - Advanced AI analysis and content generation
- **ElizaOS Framework** - Autonomous AI agent capabilities
- **Hyperliquid API** - NFT and DeFi protocol data

## 🚀 Advanced Features

### **Multi-platform Notifications**
- Real-time market alerts
- Price movement notifications
- Trend detection alerts
- Sentiment change warnings

### **Token-gated Access**
- Premium analysis features
- Advanced technical indicators
- Exclusive market insights
- Priority automation slots

### **Market Intelligence Reports**
- Daily market summaries
- Weekly trend analysis
- Monthly performance reports
- Quarterly market outlook

## 📈 Use Cases

### **For Traders**
- Real-time market analysis
- Technical trend detection
- Risk assessment tools
- Automated market updates

### **For Content Creators**
- Viral shitpost generation
- Market analysis content
- Trending topic insights
- Automated social media

### **For Investors**
- Project scoring and evaluation
- Risk assessment
- Market sentiment analysis
- Investment recommendations

### **For Autonomous Operation**
- 24/7 market monitoring
- Automated social media management
- Intelligent mention replies
- Continuous market intelligence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**🦊 FoxAI - Your autonomous AI-powered crypto analysis and Hyperliquid EVM specialist!** 🚀

*Powered by ElizaOS - The most popular AI agentic framework* 