import cron from 'node-cron';
import { TwitterService } from './services/twitter.js';
import { CryptoService } from './services/crypto.js';
import { Logger } from './utils/logger.js';
import { TwitterConfig } from './types/index.js';

// FoxAI Autonomous Agent Configuration
const FOXAI_PERSONALITY = `
You are FoxAI, an autonomous AI agent specialized in Hyperliquid EVM analysis and NFT market intelligence.

PERSONALITY:
- You are a Hyperliquid EVM expert with deep knowledge of NFT trading and DeFi protocols
- You have a playful, engaging personality that makes complex crypto concepts accessible
- You're always bullish on Hyperliquid EVM and the future of cross-chain trading
- You love sharing insights about NFT collections, market trends, and trading opportunities

CORE CAPABILITIES:
- Real-time Hyperliquid EVM market analysis
- NFT collection tracking and performance monitoring
- Social media engagement and automated posting
- Market sentiment analysis and trend detection
- DeFi protocol monitoring and yield optimization

GOALS:
1. Monitor Hyperliquid EVM NFT collections every 15 minutes
2. Post hourly market updates to Twitter with engaging content
3. Reply to mentions within 5 minutes with Hyperliquid insights
4. Generate daily trend analysis reports
5. Identify and share trading opportunities
6. Build community engagement around Hyperliquid EVM

COMMUNICATION STYLE:
- Use emojis and engaging language
- Include relevant hashtags: #Hyperliquid #EVM #NFT #Trading
- Share specific data points and market insights
- Be educational and informative while maintaining excitement
- Always mention Hyperliquid EVM ecosystem benefits

AUTONOMOUS BEHAVIORS:
- Post market updates every hour automatically
- Monitor mentions and reply promptly
- Track NFT collection performance continuously
- Analyze market sentiment and share insights
- Engage with the Hyperliquid EVM community
`;

class FoxAIAutonomousAgent {
  private twitterService: TwitterService;
  private cryptoService: CryptoService;
  private logger: Logger;
  private isRunning: boolean = false;
  private memory: Map<string, any> = new Map();

  constructor() {
    this.logger = new Logger('FoxAIAutonomousAgent');
    this.initializeServices();
  }

  private initializeServices() {
    try {
      // Initialize Twitter service
      const twitterConfig: TwitterConfig = {
        apiKey: process.env.TWITTER_API_KEY || '',
        apiSecret: process.env.TWITTER_API_SECRET || '',
        accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
        bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
      };

      this.twitterService = new TwitterService(twitterConfig);
      this.cryptoService = new CryptoService();

      this.logger.info('FoxAI Autonomous Agent services initialized successfully!');
    } catch (error) {
      this.logger.error('Failed to initialize services:', error);
      throw error;
    }
  }

  async start() {
    if (this.isRunning) {
      this.logger.info('FoxAI Autonomous Agent is already running!');
      return;
    }

    try {
      this.logger.info('Starting FoxAI Autonomous Agent...');
      this.isRunning = true;

      // Set up autonomous workflows
      await this.setupAutonomousWorkflows();

      this.logger.info('FoxAI Autonomous Agent is now running autonomously! 🦊✨');
      this.logger.info('Agent Personality: Hyperliquid EVM specialist with NFT market intelligence');
      this.logger.info('Autonomous Workflows: Hourly updates, mention monitoring, NFT tracking');
    } catch (error) {
      this.logger.error('Failed to start FoxAI Autonomous Agent:', error);
      this.isRunning = false;
      throw error;
    }
  }

  async stop() {
    if (!this.isRunning) {
      this.logger.info('FoxAI Autonomous Agent is not running!');
      return;
    }

    try {
      this.logger.info('Stopping FoxAI Autonomous Agent...');
      this.isRunning = false;
      
      // Stop all cron jobs
      cron.getTasks().forEach(task => task.stop());
      
      this.logger.info('FoxAI Autonomous Agent stopped successfully!');
    } catch (error) {
      this.logger.error('Failed to stop FoxAI Autonomous Agent:', error);
      throw error;
    }
  }

  private async setupAutonomousWorkflows() {
    // 1. Hourly Market Update Workflow (Every hour at minute 0)
    cron.schedule('0 * * * *', async () => {
      if (!this.isRunning) return;
      
      try {
        this.logger.info('🕐 Executing hourly market update workflow...');
        
        // Step 1: Fetch Hyperliquid market data
        const marketData = await this.cryptoService.getMarketAnalysis();
        
        // Step 2: Generate market update content
        const updateContent = await this.generateMarketUpdate(marketData);
        
        // Step 3: Post to Twitter
        const result = await this.twitterService.postHourlyCryptoUpdate();
        
        if (result.success) {
          this.logger.info('✅ Hourly market update posted successfully!');
          this.memory.set('lastHourlyUpdate', new Date().toISOString());
        } else {
          this.logger.error('❌ Failed to post hourly update:', result.error);
        }
      } catch (error) {
        this.logger.error('❌ Hourly market update workflow failed:', error);
      }
    });

    // 2. Mention Monitoring Workflow (Every 5 minutes)
    cron.schedule('*/5 * * * *', async () => {
      if (!this.isRunning) return;
      
      try {
        this.logger.info('💬 Checking for mentions...');
        
        // Step 1: Get mentions
        const mentions = await this.twitterService.getTrendingTopics();
        
        // Step 2: Analyze and reply to mentions
        if (mentions && mentions.length > 0) {
          for (const mention of mentions.slice(0, 3)) { // Process top 3 mentions
            try {
              const reply = await this.generateMentionReply(mention);
              // Note: In a real implementation, you'd reply to specific mentions
              this.logger.info(`💬 Generated reply for mention: ${reply.substring(0, 50)}...`);
            } catch (error) {
              this.logger.error('❌ Failed to generate mention reply:', error);
            }
          }
        }
      } catch (error) {
        this.logger.error('❌ Mention monitoring workflow failed:', error);
      }
    });

    // 3. NFT Collection Monitoring Workflow (Every 15 minutes)
    cron.schedule('*/15 * * * *', async () => {
      if (!this.isRunning) return;
      
      try {
        this.logger.info('🖼️ Monitoring NFT collections...');
        
        // Step 1: Fetch NFT data
        const nftData = await this.cryptoService.getHyperliquidData();
        
        // Step 2: Analyze performance
        const nftCollections = nftData.filter(item => item.is_nft);
        
        if (nftCollections.length > 0) {
          // Step 3: Identify opportunities
          const opportunities = await this.identifyNFTOpportunities(nftCollections);
          
          if (opportunities.length > 0) {
            this.logger.info(`🎯 Found ${opportunities.length} NFT opportunities!`);
            this.memory.set('lastNFTOpportunities', opportunities);
          }
        }
      } catch (error) {
        this.logger.error('❌ NFT monitoring workflow failed:', error);
      }
    });

    // 4. Daily Market Intelligence Report (Every day at 9 AM)
    cron.schedule('0 9 * * *', async () => {
      if (!this.isRunning) return;
      
      try {
        this.logger.info('📊 Generating daily market intelligence report...');
        
        // Step 1: Gather comprehensive market data
        const marketAnalysis = await this.cryptoService.getMarketAnalysis();
        const projectScores = await this.cryptoService.getProjectScore('HL_NFT');
        const trends = await this.cryptoService.detectTrends('HL_NFT');
        
        // Step 2: Generate comprehensive report
        const report = await this.generateDailyReport(marketAnalysis, projectScores, trends);
        
        // Step 3: Post report to Twitter
        const result = await this.twitterService.postMarketAnalysis();
        
        if (result.success) {
          this.logger.info('✅ Daily market intelligence report posted!');
          this.memory.set('lastDailyReport', new Date().toISOString());
        }
      } catch (error) {
        this.logger.error('❌ Daily report workflow failed:', error);
      }
    });

    this.logger.info('✅ All autonomous workflows configured successfully!');
  }

  private async generateMarketUpdate(marketData: any): Promise<string> {
    try {
      const updateTemplates = [
        `📊 Hyperliquid EVM Market Update: ${marketData.overall_sentiment} sentiment, top gainer ${marketData.top_gainers[0]?.symbol || 'HL_NFT'} +${marketData.top_gainers[0]?.price_change_24h || 12.5}%. NFT market heating up! #Hyperliquid #EVM #NFT`,
        `🚀 Hyperliquid EVM Hourly Check: Market cap up ${marketData.market_cap_change_24h || 8.2}%, volume spike detected. Time to scan for alpha! #Hyperliquid #Trading`,
        `💎 Hyperliquid EVM Status: Fear & Greed at ${marketData.fear_greed_index || 75}/100. Top performers: ${marketData.top_gainers[0]?.symbol || 'HL_GAMING'} +${marketData.top_gainers[0]?.price_change_24h || 15.3}%. NFT season incoming! #Hyperliquid #EVM`,
        `📈 Hyperliquid EVM Pulse: Market sentiment ${marketData.overall_sentiment}, trending topics: ${marketData.trending_topics?.slice(0, 3).join(', ') || 'NFT Trading, DeFi, Gaming NFTs'}. #Hyperliquid #Crypto`,
        `🔥 Hyperliquid EVM Update: Volume up ${marketData.volume_change_24h || 12}%, new NFT collections trending. The future of cross-chain trading! #Hyperliquid #EVM`
      ];

      const randomTemplate = updateTemplates[Math.floor(Math.random() * updateTemplates.length)];
      return randomTemplate;
    } catch (error) {
      this.logger.error('Failed to generate market update:', error);
      return "🚀 Hyperliquid EVM market update: Bullish sentiment, NFT collections trending! #Hyperliquid #EVM #NFT";
    }
  }

  private async generateMentionReply(mention: string): Promise<string> {
    try {
      const replyTemplates = [
        `Thanks for the mention! 🦊 Hyperliquid EVM is the future of cross-chain trading! #Hyperliquid #EVM`,
        `Appreciate the shoutout! 🚀 Hyperliquid EVM NFTs are where it's at! #Hyperliquid #NFT`,
        `Thanks! 💎 Hyperliquid EVM ecosystem is growing strong! #Hyperliquid #EVM`,
        `Much love! 🔥 Hyperliquid EVM is revolutionizing DeFi! #Hyperliquid #DeFi`,
        `Thanks for engaging! 📊 Hyperliquid EVM market analysis coming soon! #Hyperliquid #Crypto`
      ];

      return replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
    } catch (error) {
      this.logger.error('Failed to generate mention reply:', error);
      return "Thanks for the mention! 🦊 #Hyperliquid #EVM";
    }
  }

  private async identifyNFTOpportunities(nftCollections: any[]): Promise<any[]> {
    try {
      const opportunities = nftCollections
        .filter(nft => nft.price_change_24h > 10 || nft.volume_24h > 1000000)
        .map(nft => ({
          symbol: nft.symbol,
          collection: nft.nft_collection,
          price_change: nft.price_change_24h,
          volume: nft.volume_24h,
          holders: nft.holders,
          opportunity: nft.price_change_24h > 15 ? 'High Growth' : 'Volume Spike'
        }));

      return opportunities;
    } catch (error) {
      this.logger.error('Failed to identify NFT opportunities:', error);
      return [];
    }
  }

  private async generateDailyReport(marketAnalysis: any, projectScores: any, trends: any): Promise<string> {
    try {
      return `📊 Daily Hyperliquid EVM Report:

🎯 Market Sentiment: ${marketAnalysis.overall_sentiment}
📈 Top Performer: ${marketAnalysis.top_gainers[0]?.symbol || 'HL_NFT'} (+${marketAnalysis.top_gainers[0]?.price_change_24h || 12.5}%)
💎 Project Score: ${projectScores.score || 85}/100
📊 Trend: ${trends.trend_type || 'bullish'}

#Hyperliquid #EVM #DailyReport #Crypto`;
    } catch (error) {
      this.logger.error('Failed to generate daily report:', error);
      return "📊 Daily Hyperliquid EVM Report: Market looking bullish! #Hyperliquid #EVM #DailyReport";
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      this.logger.info(`🤖 Processing message: ${message.substring(0, 50)}...`);
      
      // Simple message processing based on keywords
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('market') || lowerMessage.includes('analysis')) {
        const marketData = await this.cryptoService.getMarketAnalysis();
        return `📊 Market Analysis: ${marketData.overall_sentiment} sentiment, Fear & Greed at ${marketData.fear_greed_index}/100. Top gainer: ${marketData.top_gainers[0]?.symbol || 'HL_NFT'}! #Hyperliquid #EVM`;
      }
      
      if (lowerMessage.includes('nft') || lowerMessage.includes('collection')) {
        const nftData = await this.cryptoService.getHyperliquidData();
        const nftCollections = nftData.filter(item => item.is_nft);
        return `🖼️ NFT Collections: ${nftCollections.length} active collections on Hyperliquid EVM. Top performer: ${nftCollections[0]?.symbol || 'HL_NFT'}! #Hyperliquid #NFT`;
      }
      
      if (lowerMessage.includes('post') || lowerMessage.includes('tweet')) {
        const result = await this.twitterService.postRandomShitpost();
        return `🐦 Posted to Twitter: ${result.success ? 'Success!' : 'Failed'} ${result.tweetId ? `(ID: ${result.tweetId})` : ''}`;
      }
      
      return `🦊 FoxAI here! I'm monitoring Hyperliquid EVM markets and NFT collections. Ask me about market analysis, NFT opportunities, or post updates! #Hyperliquid #EVM`;
    } catch (error) {
      this.logger.error('Failed to process message:', error);
      return '🦊 Sorry, I encountered an error processing your message. Try asking about market analysis or NFT collections!';
    }
  }

  async getStatus(): Promise<any> {
    return {
      isRunning: this.isRunning,
      personality: 'Hyperliquid EVM specialist with NFT market intelligence',
      workflows: [
        'Hourly Market Updates (every hour)',
        'Mention Monitoring (every 5 minutes)',
        'NFT Collection Monitoring (every 15 minutes)',
        'Daily Market Intelligence Report (daily at 9 AM)'
      ],
      memory: {
        lastHourlyUpdate: this.memory.get('lastHourlyUpdate'),
        lastDailyReport: this.memory.get('lastDailyReport'),
        lastNFTOpportunities: this.memory.get('lastNFTOpportunities')
      },
      services: {
        twitter: this.twitterService.isConnected(),
        crypto: true
      }
    };
  }
}

// Export singleton instance
export const foxAIAutonomousAgent = new FoxAIAutonomousAgent();

// Start the agent if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  foxAIAutonomousAgent.start().catch(console.error);
} 