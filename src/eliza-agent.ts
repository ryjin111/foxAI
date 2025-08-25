import { Agent } from '@elizaos/core';
import { TwitterPlugin } from '@elizaos/twitter';
import { BlockchainPlugin } from '@elizaos/blockchain';
import { DeFiPlugin } from '@elizaos/defi';
import { AIPlugin } from '@elizaos/ai';
import { Logger } from './utils/logger.js';

// FoxAI ElizaOS Agent Configuration
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

const FOXAI_GOALS = [
  "Monitor Hyperliquid EVM NFT collections and market data",
  "Post engaging hourly market updates to Twitter",
  "Reply to mentions with Hyperliquid EVM insights",
  "Analyze market sentiment and identify trends",
  "Share NFT trading opportunities and alpha",
  "Build community engagement around Hyperliquid EVM",
  "Track DeFi protocol performance and yield opportunities",
  "Generate comprehensive market intelligence reports"
];

class FoxAIElizaAgent {
  private agent: Agent;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('FoxAIElizaAgent');
    this.initializeAgent();
  }

  private async initializeAgent() {
    try {
      this.logger.info('Initializing FoxAI ElizaOS Agent...');

      // Initialize ElizaOS Agent
      this.agent = new Agent({
        name: "FoxAI",
        personality: FOXAI_PERSONALITY,
        goals: FOXAI_GOALS,
        plugins: [
          new TwitterPlugin({
            apiKey: process.env.TWITTER_API_KEY,
            apiSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
          }),
          new BlockchainPlugin({
            networks: ['ethereum', 'arbitrum', 'polygon'],
            providers: {
              hyperliquid: process.env.HYPERLIQUID_API_URL || 'https://api.hyperliquid.xyz'
            }
          }),
          new DeFiPlugin({
            protocols: ['hyperliquid', 'uniswap', 'aave'],
            apiKeys: {
              coinGecko: process.env.COINGECKO_API_KEY
            }
          }),
          new AIPlugin({
            provider: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY,
            model: 'deepseek-chat'
          })
        ],
        memory: {
          type: 'persistent',
          storage: 'local'
        },
        autonomy: {
          enabled: true,
          checkInterval: 60000, // Check every minute
          maxConcurrentTasks: 5
        }
      });

      // Set up autonomous workflows
      await this.setupAutonomousWorkflows();

      this.logger.info('FoxAI ElizaOS Agent initialized successfully!');
    } catch (error) {
      this.logger.error('Failed to initialize FoxAI ElizaOS Agent:', error);
      throw error;
    }
  }

  private async setupAutonomousWorkflows() {
    // Hourly market update workflow
    this.agent.addWorkflow('hourly_market_update', {
      schedule: '0 * * * *', // Every hour
      steps: [
        {
          name: 'fetch_hyperliquid_data',
          action: 'blockchain.getMarketData',
          params: { network: 'hyperliquid' }
        },
        {
          name: 'analyze_market_sentiment',
          action: 'ai.analyzeSentiment',
          params: { data: '{{fetch_hyperliquid_data.result}}' }
        },
        {
          name: 'generate_market_update',
          action: 'ai.generateContent',
          params: {
            prompt: 'Create an engaging hourly Hyperliquid EVM market update tweet based on the data',
            data: '{{analyze_market_sentiment.result}}'
          }
        },
        {
          name: 'post_to_twitter',
          action: 'twitter.postTweet',
          params: { content: '{{generate_market_update.result}}' }
        }
      ]
    });

    // Mention monitoring workflow
    this.agent.addWorkflow('mention_monitoring', {
      schedule: '*/5 * * * *', // Every 5 minutes
      steps: [
        {
          name: 'check_mentions',
          action: 'twitter.getMentions',
          params: { count: 10 }
        },
        {
          name: 'analyze_mentions',
          action: 'ai.analyzeMentions',
          params: { mentions: '{{check_mentions.result}}' }
        },
        {
          name: 'generate_replies',
          action: 'ai.generateReplies',
          params: { analysis: '{{analyze_mentions.result}}' }
        },
        {
          name: 'reply_to_mentions',
          action: 'twitter.replyToMentions',
          params: { replies: '{{generate_replies.result}}' }
        }
      ]
    });

    // NFT collection monitoring workflow
    this.agent.addWorkflow('nft_monitoring', {
      schedule: '*/15 * * * *', // Every 15 minutes
      steps: [
        {
          name: 'fetch_nft_data',
          action: 'blockchain.getNFTCollections',
          params: { network: 'hyperliquid' }
        },
        {
          name: 'analyze_performance',
          action: 'defi.analyzeNFTPerformance',
          params: { collections: '{{fetch_nft_data.result}}' }
        },
        {
          name: 'identify_opportunities',
          action: 'ai.identifyOpportunities',
          params: { performance: '{{analyze_performance.result}}' }
        }
      ]
    });

    this.logger.info('Autonomous workflows configured successfully!');
  }

  async start() {
    try {
      this.logger.info('Starting FoxAI ElizaOS Agent...');
      await this.agent.start();
      this.logger.info('FoxAI ElizaOS Agent is now running autonomously! 🦊✨');
    } catch (error) {
      this.logger.error('Failed to start FoxAI ElizaOS Agent:', error);
      throw error;
    }
  }

  async stop() {
    try {
      this.logger.info('Stopping FoxAI ElizaOS Agent...');
      await this.agent.stop();
      this.logger.info('FoxAI ElizaOS Agent stopped successfully!');
    } catch (error) {
      this.logger.error('Failed to stop FoxAI ElizaOS Agent:', error);
      throw error;
    }
  }

  async sendMessage(message: string) {
    try {
      const response = await this.agent.sendMessage(message);
      return response;
    } catch (error) {
      this.logger.error('Failed to send message to agent:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      return await this.agent.getStatus();
    } catch (error) {
      this.logger.error('Failed to get agent status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const foxAIElizaAgent = new FoxAIElizaAgent();

// Start the agent if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  foxAIElizaAgent.start().catch(console.error);
} 