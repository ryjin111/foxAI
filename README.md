# 🦊 FoxAI ElizaOS

A custom implementation of ElizaOS - an autonomous AI agent system built from scratch for crypto analysis, Twitter automation, and Hyperliquid EVM integration. Features a beautiful web dashboard for monitoring and control.

## 🚀 Features

### 🤖 **Core ElizaOS Capabilities**
- **Autonomous Agent**: Self-managing AI with personality and memory
- **Plugin System**: Modular architecture for extensible functionality
- **Workflow Engine**: Automated task scheduling and execution
- **Memory Management**: Persistent conversation and action history
- **State Management**: Real-time agent status and mood tracking

### 🖥️ **Web Dashboard**
- **Real-time Monitoring**: Live status updates and agent state
- **Interactive Chat**: Direct communication with ElizaOS
- **Plugin Management**: View and control plugin status
- **Workflow Tracking**: Monitor automated workflows
- **Activity Feed**: Recent memories and actions
- **Responsive Design**: Works on desktop and mobile

### 📊 **Crypto & Hyperliquid EVM**
- **Market Analysis**: Real-time crypto market data
- **NFT Tracking**: Hyperliquid EVM NFT collection monitoring
- **Trend Detection**: AI-powered market trend analysis
- **Project Scoring**: Comprehensive project evaluation system

### 🐦 **Twitter Integration**
- **Automated Posting**: Scheduled and triggered tweet publishing
- **Mention Monitoring**: Real-time mention tracking and responses
- **Trend Analysis**: Twitter trend integration with crypto insights
- **Content Generation**: AI-powered tweet content creation

## 🏗️ Architecture

```
ElizaOS Core (Backend)
├── Agent Personality & Memory
├── Plugin System
│   ├── Twitter Plugin
│   ├── Crypto Plugin
│   └── AI Plugin (future)
├── Workflow Engine
└── API Layer

Web Dashboard (Frontend)
├── Next.js App
├── Real-time Status
├── Chat Interface
├── Plugin Controls
└── Activity Monitoring
```

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Twitter API credentials
- Hyperliquid API access

### Setup
```bash
# Clone the repository
git clone <your-repo>
cd foxai-elizaos

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Configure environment variables
# Edit .env with your API keys
```

### Environment Variables
```env
# ElizaOS Configuration
PORT=3001
LOG_LEVEL=info

# Twitter API Configuration
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Hyperliquid API Configuration
HYPERLIQUID_API_URL=https://api.hyperliquid.xyz

# AI Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key

# Dashboard Configuration
NEXT_PUBLIC_ELIZAOS_API_URL=http://localhost:3001
```

## 🚀 Usage

### Development
```bash
# Start both backend and dashboard
npm run dev

# Start only backend
npm run server:dev

# Start only dashboard
npm run dashboard:dev
```

### Production
```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🌐 Dashboard Features

### **📊 Real-time Status**
- Agent active/inactive status
- Current mood and energy levels
- Active tasks and last actions
- Plugin and workflow status

### **💬 Interactive Chat**
- Direct communication with ElizaOS
- Message history and responses
- Real-time typing indicators
- Error handling and feedback

### **⚙️ Plugin Management**
- View all registered plugins
- Enable/disable plugin status
- Plugin capabilities overview
- Health monitoring

### **🔄 Workflow Monitoring**
- Active workflow status
- Last execution times
- Workflow performance metrics
- Manual trigger capabilities

### **📈 Activity Feed**
- Recent agent memories
- System events and actions
- Conversation history
- Timestamp tracking

## 🚀 Vercel Deployment

### **1. Prepare for Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### **2. Configure Environment Variables**
In Vercel dashboard, add these environment variables:
```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
HYPERLIQUID_API_URL=https://api.hyperliquid.xyz
DEEPSEEK_API_KEY=your_deepseek_api_key
ELIZAOS_API_URL=https://your-backend-url.vercel.app
```

### **3. Deploy**
```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### **4. Custom Domain (Optional)**
```bash
# Add custom domain
vercel domains add your-domain.com
```

## 🔌 API Endpoints

### Core ElizaOS
- `GET /api/status` - Get ElizaOS status and health
- `POST /api/start` - Start ElizaOS agent
- `POST /api/stop` - Stop ElizaOS agent
- `POST /api/message` - Send message to ElizaOS
- `POST /api/execute` - Execute plugin action

### Dashboard API
- `GET /api/elizaos` - Proxy to ElizaOS status
- `POST /api/elizaos` - Proxy to ElizaOS actions

### Health Check
- `GET /health` - Server health status

## 🧩 Plugin System

### Twitter Plugin
```typescript
// Available actions
- post_tweet: Post content to Twitter
- get_mentions: Retrieve user mentions
- get_trends: Get trending topics
- reply_to_mention: Reply to specific mentions
```

### Crypto Plugin
```typescript
// Available actions
- get_market_data: Get Hyperliquid market data
- get_nft_data: Retrieve NFT collection data
- analyze_trends: Perform trend analysis
- get_project_score: Calculate project scores
```

## 🔄 Workflow System

### Creating Workflows
```typescript
const workflow: Workflow = {
  id: 'hourly-update',
  name: 'Hourly Market Update',
  description: 'Post hourly crypto market updates',
  steps: [
    {
      id: 'get-data',
      name: 'Get Market Data',
      pluginId: 'crypto',
      action: 'get_market_data'
    },
    {
      id: 'post-tweet',
      name: 'Post Update',
      pluginId: 'twitter',
      action: 'post_tweet'
    }
  ],
  schedule: '0 * * * *', // Every hour
  isActive: true
};
```

## 🧠 Agent Personality

### FoxAI Traits
- **Intelligent**: Advanced analytical capabilities
- **Curious**: Always learning and exploring
- **Helpful**: Proactive assistance and insights
- **Analytical**: Data-driven decision making
- **Creative**: Innovative content generation
- **Determined**: Persistent problem solving

### Goals
- Provide valuable crypto insights
- Engage with the community
- Share market analysis
- Help users make informed decisions
- Stay updated with latest trends

## 📈 Memory System

### Memory Types
- **Conversation**: Chat history and interactions
- **Action**: Plugin executions and results
- **Observation**: Market data and trends
- **Decision**: Agent decision-making process
- **System**: System events and status changes

### Memory Management
- Automatic cleanup (keeps last 1000 memories)
- Metadata support for rich context
- Timestamp-based organization
- Search and retrieval capabilities

## 🔧 Development

### Project Structure
```
├── src/
│   ├── elizaos/
│   │   ├── core.ts              # Main ElizaOS agent
│   │   └── plugins/
│   │       ├── twitter.ts       # Twitter integration
│   │       └── crypto.ts        # Crypto/Hyperliquid
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   ├── utils/
│   │   └── logger.ts           # Logging utility
│   └── index.ts                # Backend entry point
├── app/
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard page
│   └── api/
│       └── elizaos/
│           └── route.ts        # API proxy routes
├── package.json                # Dependencies and scripts
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS config
├── vercel.json                # Vercel deployment config
└── README.md                  # Documentation
```

### Adding New Plugins
1. Create plugin class implementing `Plugin` interface
2. Add plugin to `src/elizaos/plugins/`
3. Register plugin in `src/index.ts`
4. Update types if needed

### Testing
```bash
# Run tests
npm test

# Run specific test
npm test -- --grep "plugin"
```

## 🚀 Deployment Options

### Vercel (Recommended)
- **Automatic deployments** from Git
- **Global CDN** for fast loading
- **Serverless functions** for API
- **Environment variables** management
- **Custom domains** support

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY app ./app
COPY next.config.js ./
COPY tailwind.config.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Hosting
```bash
# Build for production
npm run build

# Start server
npm start
```

## 🔮 Future Enhancements

### Planned Features
- **AI Plugin**: DeepSeek integration for advanced reasoning
- **Database Integration**: Persistent storage for memories
- **Advanced Workflows**: Conditional logic and branching
- **Plugin Marketplace**: Community plugin ecosystem
- **Multi-Agent Support**: Collaborative agent networks
- **Mobile App**: Native mobile dashboard
- **Real-time Notifications**: Push notifications for events

### Plugin Ideas
- **Discord Integration**: Community engagement
- **Telegram Bot**: Mobile notifications
- **Email Automation**: Newsletter and alerts
- **Trading Signals**: Automated trading recommendations
- **Sentiment Analysis**: Social media sentiment tracking
- **Calendar Integration**: Schedule management
- **File Management**: Document processing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discord**: [Community Server](link-to-discord)
- **Email**: support@foxai.com

---

**Built with ❤️ by FoxAI Team** 