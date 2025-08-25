# OnChainHyperFoxes AI Agent 🦊

An intelligent AI agent that manages the OnChainHyperFoxes X (Twitter) account, combining X functionality with real-time Hyperliquid EVM blockchain data and NFT collection analytics.

## 🚀 Features

### X (Twitter) Account Management
- **Post tweets** about OnChainHyperFoxes NFT collection
- **Reply to mentions** and engage with the fox community
- **Monitor trending topics** in the Hyperliquid ecosystem
- **Search and analyze tweets** for fox-related insights
- **Like and retweet** relevant Hyperliquid content

### Hyperliquid EVM Integration
- **OnChainHyperFoxes NFT data** - Share collection statistics and floor prices
- **Hyperliquid trading analytics** - Post about market trends and volume
- **EVM ecosystem updates** - Highlight new projects and developments
- **Fox community achievements** - Celebrate holder milestones and rare mints

### AI-Powered Features
- **Intelligent content creation** based on real-time Hyperliquid data
- **Contextual responses** to fox community mentions and comments
- **Trend analysis** in the Hyperliquid ecosystem
- **Fox-themed content** with consistent brand voice

## 🛠️ Technology Stack

- **Next.js 14** - React framework with App Router
- **Vercel AI SDK** - AI agent development and streaming
- **Hyperliquid EVM APIs** - Blockchain data access
- **Twitter API v2** - X (Twitter) account management
- **DeepSeek API** - Advanced AI reasoning and content generation
- **Tailwind CSS** - Modern UI styling
- **TypeScript** - Type safety and development experience

## 📋 Prerequisites

Before setting up the project, you'll need:

1. **X (Twitter) Developer Account** with API access
2. **DeepSeek API Key** for AI functionality (advanced reasoning and content generation)
3. **Hyperliquid EVM API access** for blockchain data
4. **Node.js 18+** and npm/yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd onchainhyperfoxes-ai-agent
npm install
```

### 2. Environment Setup

Create a `.env.local` file with the following variables:

```env
# DeepSeek API Key
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# X (Twitter) API Keys
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here
TWITTER_USER_ID=your_twitter_user_id_here

# Hyperliquid EVM API
HYPERLIQUID_API_URL=https://api.hyperliquid.xyz
ONCHAINHYPERFOXES_CONTRACT=your_contract_address_here

# Optional: Alchemy API for additional EVM data
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

### 3. Twitter API Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app and get your API keys
3. Generate access tokens with read/write permissions
4. Add your Twitter user ID to the environment variables

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the AI agent interface.

## 🎯 Usage

### Chat Interface
- **Natural language commands** - "Post a tweet about OnChainHyperFoxes floor price"
- **Multi-step actions** - "Check mentions and reply to fox community"
- **Data-driven content** - "Get Hyperliquid analytics and create a fox-themed tweet"

### Quick Actions
- **Post Fox GM Tweet** - Post daily GM tweet with fox emoji and Hyperliquid
- **Post NFT Update** - Share OnChainHyperFoxes collection statistics
- **Post Market Analysis** - Share Hyperliquid EVM market trends
- **Auto-Reply to Mentions** - Reply to recent fox community mentions
- **Check Fox Community** - View recent mentions and replies

### Admin Controls
- **Admin Toggle** - Click the "🔓 Enable Admin" button in the sidebar to bypass access code requirements for development

### Automated Features
- **🤖 AI Scheduler** - Intelligent automation system that handles all daily tasks
- **Daily Fox GM Tweets** - Automatically posts GM tweets every day at 9 AM with fox emoji and Hyperliquid
- **Weekly NFT Updates** - Posts OnChainHyperFoxes collection updates every Monday at 10 AM
- **Daily Market Analysis** - Posts Hyperliquid EVM market analysis daily at 2 PM
- **Fox Community Engagement** - Automatically replies to mentions every 4 hours

## 🔧 API Endpoints

### `/api/agent`
Main AI agent endpoint that handles:
- X account operations (post, reply, like, retweet)
- Hyperliquid EVM data queries
- OnChainHyperFoxes NFT analytics
- AI reasoning and content generation

### `/api/ai-scheduler`
AI-powered scheduler endpoint that handles:
- Start/stop automated tasks
- Schedule optimization
- Task status monitoring

### `/api/cron/fox-gm-tweet`
Daily fox GM tweet endpoint for manual triggering

## 📁 Project Structure

```
onchainhyperfoxes-ai-agent/
├── app/
│   ├── api/agent/route.ts    # Main AI agent API
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main UI component
├── lib/
│   ├── twitter.ts            # Twitter API client
│   └── hyperliquid.ts        # Hyperliquid EVM API client
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## 🔒 Security Considerations

- **API Keys**: Never commit API keys to version control
- **Rate Limiting**: Respect Twitter API rate limits
- **Content Moderation**: Review AI-generated content before posting
- **Access Control**: Implement proper authentication for production

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
- Check the [Hyperliquid EVM documentation](https://docs.hyperliquid.xyz/)
- Review Twitter API documentation
- Open an issue in this repository

## 🔮 Future Enhancements

- **Scheduled posting** - Automate content scheduling
- **Analytics dashboard** - Track engagement metrics
- **Multi-language support** - International fox community engagement
- **Advanced content generation** - More sophisticated AI prompts
- **Fox community management** - Automated community engagement
- **NFT rarity tracking** - Monitor rare fox traits and sales
- **Hyperliquid trading signals** - Share market opportunities 