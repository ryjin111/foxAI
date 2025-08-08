import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { HyperliquidService } from './services/hyperliquid.js';
import { TwitterService } from './services/twitter.js';
import { AutomationService } from './services/automation.js';
import { Logger } from './utils/logger.js';
import { 
  HyperliquidConfig, 
  TwitterConfig, 
  AutomationRule, 
  TradingSignal,
  MarketData,
  Position,
  Order 
} from './types/index.js';

// Load environment variables
dotenv.config();

class HyperliquidMCPServer {
  private server: Server;
  private hyperliquidService: HyperliquidService;
  private twitterService: TwitterService;
  private automationService: AutomationService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('HyperliquidMCP');
    
    // Initialize services
    const hyperliquidConfig: HyperliquidConfig = {
      apiKey: process.env.HYPERLIQUID_API_KEY || '',
      secretKey: process.env.HYPERLIQUID_SECRET_KEY || '',
      baseUrl: process.env.HYPERLIQUID_BASE_URL || 'https://api.hyperliquid.xyz',
      wsUrl: process.env.HYPERLIQUID_WS_URL || 'wss://api.hyperliquid.xyz/ws',
    };

    const twitterConfig: TwitterConfig = {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    };

    this.hyperliquidService = new HyperliquidService(hyperliquidConfig);
    this.twitterService = new TwitterService(twitterConfig);
    this.automationService = new AutomationService(this.hyperliquidService, this.twitterService);

    // Initialize MCP server
    this.server = new Server(
      {
        name: 'hyperliquid-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
  }

  private setupTools(): void {
    // Trading Tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Market Data Tools
          {
            name: 'get_market_data',
            description: 'Get current market data for specified symbols or all markets',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'Optional symbol to get data for specific market',
                },
              },
            },
          },
          {
            name: 'get_positions',
            description: 'Get current trading positions',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'place_order',
            description: 'Place a new trading order',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'Trading symbol (e.g., BTC, ETH)',
                },
                side: {
                  type: 'string',
                  enum: ['buy', 'sell'],
                  description: 'Order side',
                },
                size: {
                  type: 'number',
                  description: 'Order size',
                },
                price: {
                  type: 'number',
                  description: 'Order price',
                },
              },
              required: ['symbol', 'side', 'size'],
            },
          },
          {
            name: 'cancel_order',
            description: 'Cancel an existing order',
            inputSchema: {
              type: 'object',
              properties: {
                orderId: {
                  type: 'string',
                  description: 'Order ID to cancel',
                },
              },
              required: ['orderId'],
            },
          },
          {
            name: 'get_order_history',
            description: 'Get order history',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of orders to retrieve',
                  default: 100,
                },
              },
            },
          },
          {
            name: 'generate_trading_signals',
            description: 'Generate trading signals for a symbol',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'Symbol to generate signals for',
                },
              },
              required: ['symbol'],
            },
          },

          // Twitter/X Tools
          {
            name: 'post_tweet',
            description: 'Post a tweet to X (Twitter)',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Tweet text content',
                },
              },
              required: ['text'],
            },
          },
          {
            name: 'search_tweets',
            description: 'Search for tweets',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                limit: {
                  type: 'number',
                  description: 'Number of tweets to retrieve',
                  default: 100,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_mentions',
            description: 'Get recent mentions',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of mentions to retrieve',
                  default: 50,
                },
              },
            },
          },
          {
            name: 'get_trending_topics',
            description: 'Get trending topics',
            inputSchema: {
              type: 'object',
              properties: {
                woeid: {
                  type: 'number',
                  description: 'Where On Earth ID for location',
                  default: 1,
                },
              },
            },
          },

          // Automation Tools
          {
            name: 'add_automation_rule',
            description: 'Add a new automation rule',
            inputSchema: {
              type: 'object',
              properties: {
                rule: {
                  type: 'object',
                  description: 'Automation rule configuration',
                },
              },
              required: ['rule'],
            },
          },
          {
            name: 'get_automation_rules',
            description: 'Get all automation rules',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'remove_automation_rule',
            description: 'Remove an automation rule',
            inputSchema: {
              type: 'object',
              properties: {
                ruleId: {
                  type: 'string',
                  description: 'Rule ID to remove',
                },
              },
              required: ['ruleId'],
            },
          },
          {
            name: 'start_automation',
            description: 'Start the automation service',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_alerts',
            description: 'Get recent alerts',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Market Data Tools
          case 'get_market_data':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await this.hyperliquidService.getMarketData(args.symbol), null, 2),
                },
              ],
            };

          case 'get_positions':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await this.hyperliquidService.getPositions(), null, 2),
                },
              ],
            };

          case 'place_order':
            const order = await this.hyperliquidService.placeOrder({
              symbol: args.symbol,
              side: args.side,
              size: args.size,
              price: args.price,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(order, null, 2),
                },
              ],
            };

          case 'cancel_order':
            const cancelled = await this.hyperliquidService.cancelOrder(args.orderId);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ success: cancelled }, null, 2),
                },
              ],
            };

          case 'get_order_history':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await this.hyperliquidService.getOrderHistory(args.limit), null, 2),
                },
              ],
            };

          case 'generate_trading_signals':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await this.hyperliquidService.generateTradingSignals(args.symbol), null, 2),
                },
              ],
            };

          // Twitter/X Tools
          case 'post_tweet':
            const tweetId = await this.twitterService.postTweet(args.text);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ tweetId, success: true }, null, 2),
                },
              ],
            };

          case 'search_tweets':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await this.twitterService.searchTweets(args.query, args.limit), null, 2),
                },
              ],
            };

          case 'get_mentions':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await this.twitterService.getMentions(args.limit), null, 2),
                },
              ],
            };

          case 'get_trending_topics':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await this.twitterService.getTrendingTopics(args.woeid), null, 2),
                },
              ],
            };

          // Automation Tools
          case 'add_automation_rule':
            this.automationService.addRule(args.rule as AutomationRule);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ success: true, message: 'Rule added successfully' }, null, 2),
                },
              ],
            };

          case 'get_automation_rules':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(this.automationService.getRules(), null, 2),
                },
              ],
            };

          case 'remove_automation_rule':
            const removed = this.automationService.removeRule(args.ruleId);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ success: removed }, null, 2),
                },
              ],
            };

          case 'start_automation':
            await this.automationService.startAutomation();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ success: true, message: 'Automation started' }, null, 2),
                },
              ],
            };

          case 'get_alerts':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(this.automationService.getAlerts(), null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        this.logger.error(`Tool execution failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }, null, 2),
            },
          ],
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('Hyperliquid MCP Server started');
  }
}

// Start the server
const server = new HyperliquidMCPServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 