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
                  enum: ['meme', 'copypasta', 'troll', 'random'],
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
          // Social Media Tools
          {
            name: 'analyze_sentiment',
            description: 'Analyze sentiment of tweets or text content',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Text content to analyze',
                },
                keywords: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Optional keywords to focus on',
                },
              },
              required: ['text'],
            },
          },
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
              required: ['text'],
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
            const shitpost = this.twitterService.generateShitpost(args?.category as string);
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

          // Social Media Tools
          case 'analyze_sentiment':
            const sentiment = await this.twitterService.analyzeSentiment(
              args?.text as string,
              args?.keywords as string[]
            );
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