# 🦊 FoxAI - Advanced Crypto Analysis & AI Assistant

**AI-powered crypto analysis, market intelligence, and social media management with real-time insights, trend detection, and manual control via chat interface.**

## 🚀 Features

### **🤖 AI Assistant (Manual Control)**
- **Interactive Chat Interface** - Talk to FoxAI directly
- **On-Demand Analysis** - Get insights when you need them
- **Manual Twitter Posting** - Generate and post tweets when you want
- **Full Control** - You decide what and when to post
- **No Automation Complexity** - Simple and straightforward

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
- 🎭 **Manual Tweet Generation** - Generate tweets on demand
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

# Hyperliquid API
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

# Start Next.js app
npm run next:dev
```

## 🤖 AI Assistant

### **Agent Personality**
FoxAI is an AI assistant specialized in Hyperliquid EVM analysis and NFT market intelligence with:
- **Hyperliquid EVM expertise** - Deep knowledge of NFT trading and DeFi protocols
- **Playful personality** - Makes complex crypto concepts accessible
- **Bullish on Hyperliquid EVM** - Always optimistic about cross-chain trading
- **Community engagement** - Loves sharing insights and building community

### **How to Use**

#### **1. Chat Interface (Main Way)**
- **Open the web interface** - Navigate to your deployed app
- **Ask questions** - "What's the current market sentiment?"
- **Request analysis** - "Analyze Hyperliquid EVM market"
- **Generate content** - "Create a tweet about NFT opportunities"
- **Post to Twitter** - "Post to Twitter" or "Generate a tweet"

#### **2. Example Chat Commands**
```
"Post to Twitter"
"Analyze Hyperliquid EVM market"
"Generate a tweet about NFTs"
"What's the current market sentiment?"
"Show me NFT performance"
"Create a market analysis tweet"
```

#### **3. API Endpoint (Simple Status)**
- **GET** `/api/eliza` - Get FoxAI status
- **POST** `/api/eliza` - Send simple messages (limited functionality)

### **Example API Usage**
```bash
# Get agent status
curl -X GET https://your-app.vercel.app/api/eliza

# Send simple message
curl -X POST https://your-app.vercel.app/api/eliza \
  -H "Content-Type: application/json" \
  -d '{"action": "send_message", "message": "Analyze current Hyperliquid EVM market"}'
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
- `post_hourly_crypto_update` - Generate and post market updates
- `post_market_analysis` - Comprehensive market analysis posts
- `post_project_score` - Individual coin analysis posts
- `reply_to_mentions` - Smart AI-powered mention replies
- `post_trending_analysis` - Trending coin analysis posts
- `post_sentiment_analysis` - Sentiment analysis posts
- `post_tweet` - Standard tweet posting
- `get_trending_topics` - Twitter trending topics

### **Shitposting Tools**
- `generate_shitpost` - AI-powered shitpost generation
- `post_random_shitpost` - Generate and post shitposts

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

## 🐦 Twitter/X Features

### **Manual Tweet Generation**
- **Market Analysis** - Generate market update tweets
- **NFT Insights** - Create NFT collection analysis
- **Trending Topics** - Post about hot crypto topics
- **Sentiment Posts** - Share market sentiment analysis

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
- Priority access features

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
- Manual market updates

### **For Content Creators**
- Viral shitpost generation
- Market analysis content
- Trending topic insights
- Manual social media posting

### **For Investors**
- Project scoring and evaluation
- Risk assessment
- Market sentiment analysis
- Investment recommendations

### **For Manual Control**
- On-demand market monitoring
- Manual social media management
- Interactive analysis
- Controlled content creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**🦊 FoxAI - Your AI-powered crypto analysis and Hyperliquid EVM specialist!** 🚀

*Simple, manual control for maximum flexibility* 