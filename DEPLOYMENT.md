# 🚀 FoxAI Console Deployment Guide

## Quick Deploy to Vercel

Your FoxAI AI console is now ready for deployment! Here's how to get it live:

### **1. Push to GitHub**
```bash
git add .
git commit -m "Add AI console with Next.js"
git push origin main
```

### **2. Deploy to Vercel**

1. **Go to [Vercel](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure the project**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

### **3. Set Environment Variables**

In your Vercel project settings, add these environment variables:

```env
# Optional - for full AI functionality
OPENAI_API_KEY=your_openai_api_key

# Your MCP server (if deployed separately)
MCP_SERVER_URL=https://your-mcp-server.vercel.app

# Trading APIs (optional)
HYPERLIQUID_API_KEY=your_hyperliquid_key
HYPERLIQUID_SECRET_KEY=your_hyperliquid_secret

# Social Media (optional)
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
```

### **4. Deploy!**

Click "Deploy" and your AI console will be live in minutes!

---

## 🎯 What You Get

### **Live AI Console Features**
- ✅ **Dashboard**: Clean interface ready for real market data
- ✅ **AI Chat**: Chat interface ready for AI API integration
- ✅ **Trading Interface**: Ready for MCP server connection
- ✅ **Signals Panel**: Ready for AI-generated signals
- ✅ **Alerts System**: Ready for system notifications
- ✅ **Responsive Design**: Works on all devices
- ✅ **Modern UI**: Professional trading interface

### **Next Steps After Deployment**

1. **Enable Full AI Chat**:
   - Add OpenAI API key to environment variables
   - Uncomment AI SDK imports in `app/page.tsx`
   - Replace mock chat with real AI functionality

2. **Connect MCP Server**:
   - Deploy your MCP server separately
   - Update `MCP_SERVER_URL` environment variable
   - Enable real trading functionality

3. **Add Real Data**:
   - Connect Hyperliquid API for live market data
   - Add Alchemy SDK for blockchain data
   - Integrate Twitter API for sentiment analysis

---

## 🔧 Local Development

### **Install Dependencies**
```bash
npm install
```

### **Start Development Server**
```bash
npm run next:dev
```

### **Build for Production**
```bash
npm run build
```

---

## 📱 Interface Features

Your deployed console includes:

- **📊 Market Dashboard**: Ready for live market data integration
- **🤖 AI Chat Interface**: Ready for AI API connection
- **⚡ Trading Interface**: Ready for MCP server integration
- **📈 Signals Panel**: Ready for AI-generated signals
- **🔔 Alert System**: Ready for system notifications
- **📱 Responsive Design**: Mobile-friendly interface

---

## 🎨 Customization

### **Styling**
- Edit `app/globals.css` for custom styles
- Modify `tailwind.config.cjs` for theme changes
- Update components in `app/page.tsx`

### **Functionality**
- Add new API routes in `app/api/`
- Extend chat functionality with AI SDK
- Integrate additional data sources

### **Deployment**
- Custom domain setup in Vercel
- Environment-specific configurations
- Performance monitoring and analytics

---

## 🆘 Support

- **Documentation**: Check `README-AI-CONSOLE.md`
- **Issues**: Report on GitHub
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**🎉 Your FoxAI console is ready to deploy!** 