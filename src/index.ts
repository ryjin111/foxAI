import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { TwitterService } from './services/twitter.js';
import { AutomationService } from './services/automation.js';
import { CryptoService } from './services/crypto.js';
import { Logger } from './utils/logger.js';
import { 
  TwitterConfig, 
  AutomationRule
} from './types/index.js';

// Load environment variables
dotenv.config();

class FoxAIMCPServer {
  private server: Server;
  private twitterService: TwitterService;
  private automationService: AutomationService;
  private cryptoService: CryptoService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('FoxAIMCP');
    
    // Initialize services
    const twitterConfig: TwitterConfig = {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    };

    this.twitterService = new TwitterService(twitterConfig);
    this.automationService = new AutomationService(this.twitterService);
    this.cryptoService = new CryptoService();

    // Initialize MCP server
    this.server = new Server(
      {
        name: 'foxai-mcp',
        version: '1.0.0',
      }
    );

    this.setupTools();
  }

  private setupTools(): void {
    // Core Tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Shitposting Tools
          {
            name: 'generate_shitpost',
            description: 'Generate a random shitpost',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: ['meme', 'copypasta', 'troll', 'random', 'crypto'],
                  description: 'Category of shitpost to generate',
                },
              },
            },
          },
          {
            name: 'post_random_shitpost',
            description: 'Post a random shitpost to Twitter',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          // Crypto Tools
          {
            name: 'get_crypto_insight',
            description: 'Get a crypto market insight with shitpost',
            inputSchema: {
              type: 'object',
              properties: {
                coin: {
                  type: 'string',
                  description: 'Optional specific coin ID (e.g., bitcoin, ethereum)',
                },
              },
            },
          },
          {
            name: 'get_top_coins',
            description: 'Get top cryptocurrencies by market cap',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of coins to return (default: 10)',
                },
              },
            },
          },
          {
            name: 'get_trending_coins',
            description: 'Get trending cryptocurrencies',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_coin_price',
            description: 'Get current price of a specific coin',
            inputSchema: {
              type: 'object',
              properties: {
                coin_id: {
                  type: 'string',
                  description: 'Coin ID (e.g., bitcoin, ethereum)',
                },
              },
            },
          },
          {
            name: 'get_market_analysis',
            description: 'Get comprehensive market analysis with sentiment and trends',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_project_score',
            description: 'Get project score and analysis for a specific coin',
            inputSchema: {
              type: 'object',
              properties: {
                coin_id: {
                  type: 'string',
                  description: 'Coin ID to analyze',
                },
              },
            },
          },
          {
            name: 'detect_trends',
            description: 'Detect technical trends for a specific coin',
            inputSchema: {
              type: 'object',
              properties: {
                coin_id: {
                  type: 'string',
                  description: 'Coin ID to analyze',
                },
              },
            },
          },
          {
            name: 'analyze_sentiment',
            description: 'Analyze sentiment of text for crypto keywords',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Text to analyze',
                },
              },
            },
          },
          // Social Media Tools
          {
            name: 'post_tweet',
            description: 'Post a tweet to Twitter/X',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Tweet content',
                },
              },
            },
          },
          {
            name: 'post_hourly_crypto_update',
            description: 'Post hourly crypto market update to Twitter',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'post_market_analysis',
            description: 'Post comprehensive market analysis to Twitter',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'post_project_score',
            description: 'Post project score analysis for a specific coin to Twitter',
            inputSchema: {
              type: 'object',
              properties: {
                coin_id: {
                  type: 'string',
                  description: 'Coin ID to analyze and post',
                },
              },
            },
          },
          {
            name: 'reply_to_mentions',
            description: 'Automatically reply to recent Twitter mentions',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'post_trending_analysis',
            description: 'Post trending crypto analysis to Twitter',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'post_sentiment_analysis',
            description: 'Post sentiment analysis of text to Twitter',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Text to analyze and post sentiment for',
                },
              },
            },
          },
          {
            name: 'get_trending_topics',
            description: 'Get trending topics from Twitter',
            inputSchema: {
              type: 'object',
              properties: {
                count: {
                  type: 'number',
                  description: 'Number of trending topics to return',
                  default: 10,
                },
              },
            },
          },
          // Automation Tools
          {
            name: 'create_automation_rule',
            description: 'Create a new automation rule',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Rule name',
                },
                trigger: {
                  type: 'string',
                  description: 'Trigger type (scheduled, twitter_mention, etc.)',
                },
                conditions: {
                  type: 'array',
                  description: 'Rule conditions',
                },
                actions: {
                  type: 'array',
                  description: 'Rule actions',
                },
              },
              required: ['name', 'trigger', 'actions'],
            },
          },
          {
            name: 'list_automation_rules',
            description: 'List all automation rules',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'delete_automation_rule',
            description: 'Delete an automation rule',
            inputSchema: {
              type: 'object',
              properties: {
                ruleId: {
                  type: 'string',
                  description: 'Rule ID to delete',
                },
              },
              required: ['ruleId'],
            },
          },
          // Utility Tools
          {
            name: 'get_system_status',
            description: 'Get system status and health information',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Shitposting Tools
          case 'generate_shitpost':
            let shitpost: string;
            if (args?.category === 'crypto') {
              shitpost = await this.cryptoService.getRandomCryptoInsight();
            } else {
              shitpost = await this.twitterService.generateShitpost(args?.category as string);
            }
            return {
              content: [
                {
                  type: 'text',
                  text: shitpost,
                },
              ],
            };

          case 'post_random_shitpost':
            const result = await this.twitterService.postRandomShitpost();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };

          // Crypto Tools
          case 'get_crypto_insight':
            const insight = await this.cryptoService.getRandomCryptoInsight();
            return {
              content: [
                {
                  type: 'text',
                  text: insight,
                },
              ],
            };

          case 'get_top_coins':
            const topCoins = await this.cryptoService.getTopCoins(args?.limit as number);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(topCoins, null, 2),
                },
              ],
            };

          case 'get_trending_coins':
            const trendingCoins = await this.cryptoService.getTrendingCoins();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(trendingCoins, null, 2),
                },
              ],
            };

          case 'get_coin_price':
            const price = await this.cryptoService.getCoinPrice(args?.coin_id as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ coinId: args?.coin_id, price }, null, 2),
                },
              ],
            };

          case 'get_market_analysis':
            const marketAnalysis = await this.cryptoService.getMarketAnalysis();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(marketAnalysis, null, 2),
                },
              ],
            };

          case 'get_project_score':
            const projectScore = await this.cryptoService.getProjectScore(args?.coin_id as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(projectScore, null, 2),
                },
              ],
            };

          case 'detect_trends':
            const trendDetection = await this.cryptoService.detectTrends(args?.coin_id as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(trendDetection, null, 2),
                },
              ],
            };

          // Social Media Tools
          case 'analyze_sentiment':
            const sentiment = await this.cryptoService.analyzeSentiment(args?.text as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(sentiment, null, 2),
                },
              ],
            };

          case 'post_tweet':
            const tweet = await this.twitterService.postTweet(args?.text as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(tweet, null, 2),
                },
              ],
            };

          case 'post_hourly_crypto_update':
            const hourlyUpdate = await this.twitterService.postHourlyCryptoUpdate();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    success: hourlyUpdate.success,
                    message: hourlyUpdate.success ? 'Hyperliquid EVM update posted successfully' : 'Failed to post update',
                    tweetId: hourlyUpdate.tweetId,
                    content: hourlyUpdate.text,
                    error: hourlyUpdate.error
                  }, null, 2),
                },
              ],
            };

          case 'post_market_analysis':
            const marketPost = await this.twitterService.postMarketAnalysis();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(marketPost, null, 2),
                },
              ],
            };

          case 'post_project_score':
            const projectPost = await this.twitterService.postProjectScore(args?.coin_id as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(projectPost, null, 2),
                },
              ],
            };

          case 'reply_to_mentions':
            const mentionReplies = await this.twitterService.replyToMentions();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(mentionReplies, null, 2),
                },
              ],
            };

          case 'post_trending_analysis':
            const trendingPost = await this.twitterService.postTrendingAnalysis();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(trendingPost, null, 2),
                },
              ],
            };

          case 'post_sentiment_analysis':
            const sentimentPost = await this.twitterService.postSentimentAnalysis(args?.text as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(sentimentPost, null, 2),
                },
              ],
            };

          case 'get_trending_topics':
            const topics = await this.twitterService.getTrendingTopics(args?.count as number);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(topics, null, 2),
                },
              ],
            };

          // Automation Tools
          case 'create_automation_rule':
            const rule = await this.automationService.createRule(args as any);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(rule, null, 2),
                },
              ],
            };

          case 'list_automation_rules':
            const rules = await this.automationService.listRules();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(rules, null, 2),
                },
              ],
            };

          case 'delete_automation_rule':
            const deleted = await this.automationService.deleteRule(args?.ruleId as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ success: deleted }, null, 2),
                },
              ],
            };

          // Utility Tools
          case 'get_system_status':
            const status = {
              server: 'FoxAI MCP Server',
              version: '1.0.0',
              status: 'running',
              timestamp: new Date().toISOString(),
              services: {
                twitter: this.twitterService.isConnected(),
                automation: this.automationService.getRuleCount(),
                crypto: 'connected',
              },
            };
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(status, null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        this.logger.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('FoxAI MCP Server started');
  }
}

// Start the server
const server = new FoxAIMCPServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 