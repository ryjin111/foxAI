# 🦊 FoxAI - AI-Powered Trading Console

A modern, AI-driven trading console built with Next.js, AI SDK, and integrated with your MCP server for advanced trading automation.

## 🚀 Features

### **AI-Powered Trading Assistant**
- **Natural Language Interface**: Chat with AI about trading strategies
- **Real-time Market Analysis**: Live market data and AI-generated signals
- **Automation Management**: Configure and monitor trading rules
- **Risk Management**: AI-powered position sizing and stop-loss recommendations

### **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching
- **Real-time Updates**: Live market data and signal updates
- **Interactive Charts**: Visual representation of market trends

### **Integration Capabilities**
- **MCP Server**: Full integration with your existing MCP trading server
- **Blockchain Data**: Alchemy SDK integration for on-chain data
- **Social Media**: Twitter sentiment analysis and automated posting
- **API Extensibility**: Easy to add new data sources and tools

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **AI/ML**: Vercel AI SDK, OpenAI GPT-4
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: MCP Server, Node.js
- **Blockchain**: Alchemy SDK, Viem
- **Deployment**: Vercel

## 📦 Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp env.example .env.local
   ```
   
   Add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_key
   HYPERLIQUID_API_KEY=your_hyperliquid_key
   HYPERLIQUID_SECRET_KEY=your_hyperliquid_secret
   TWITTER_API_KEY=your_twitter_key
   ALCHEMY_API_KEY=your_alchemy_key
   ```

3. **Start Development Server**:
   ```bash
   npm run next:dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🎯 Usage

### **Dashboard**
- View real-time market data
- Monitor AI-generated trading signals
- Track portfolio performance
- Manage automation rules

### **AI Chat**
- Ask about trading strategies
- Get market analysis
- Configure automation rules
- Receive risk management advice

### **Trading Tools**
- Place orders through AI interface
- Monitor positions
- Set up automated trading rules
- Analyze market sentiment

## 🔧 Configuration

### **MCP Server Integration**
The console connects to your MCP server for trading operations. Ensure your MCP server is running and accessible.

### **AI Models**
- **Default**: GPT-3.5-turbo for chat
- **Advanced**: GPT-4 for complex analysis
- **Custom**: Add your own models via AI SDK

### **Data Sources**
- **Market Data**: Hyperliquid API
- **Blockchain**: Alchemy API
- **Social Media**: Twitter API
- **News**: RSS feeds and news APIs

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### **Other Platforms**
- **Netlify**: Compatible with Next.js
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 🔒 Security

- **API Key Management**: Secure environment variable handling
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Sanitized user inputs
- **HTTPS**: Secure communication

## 📈 Performance

- **Edge Runtime**: Fast API responses
- **Streaming**: Real-time AI responses
- **Caching**: Optimized data fetching
- **CDN**: Global content delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact the development team

---

**Built with ❤️ by the FoxAI Team** 