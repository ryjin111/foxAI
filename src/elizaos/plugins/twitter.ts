import { TwitterApi } from 'twitter-api-v2';
import { Plugin, TwitterConfig, TweetContent } from '../../types';
import { Logger } from '../../utils/logger';

export class TwitterPlugin implements Plugin {
  public id = 'twitter';
  public name = 'Twitter Plugin';
  public version = '1.0.0';
  public description = 'Handles Twitter posting and monitoring';
  public capabilities = ['post_tweet', 'get_mentions', 'get_trends', 'reply_to_mention'];
  public isEnabled = true;

  private client: TwitterApi;
  private logger: Logger;
  private config: TwitterConfig;

  constructor(config: TwitterConfig) {
    this.config = config;
    this.logger = new Logger('TwitterPlugin');
    this.client = new TwitterApi({
      appKey: config.apiKey,
      appSecret: config.apiSecret,
      accessToken: config.accessToken,
      accessSecret: config.accessTokenSecret,
    });
  }

  async init(): Promise<void> {
    try {
      // Test the connection
      const me = await this.client.v2.me();
      this.logger.info(`Twitter plugin initialized for user: @${me.data.username}`);
    } catch (error) {
      this.logger.error('Failed to initialize Twitter plugin:', error);
      throw error;
    }
  }

  async execute(action: string, params?: any): Promise<any> {
    switch (action) {
      case 'post_tweet':
        return await this.postTweet(params);
      case 'get_mentions':
        return await this.getMentions(params);
      case 'get_trends':
        return await this.getTrends(params);
      case 'reply_to_mention':
        return await this.replyToMention(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async postTweet(content: TweetContent): Promise<any> {
    try {
      const tweet = await this.client.v2.tweet(content.text);
      this.logger.info(`Tweet posted successfully: ${tweet.data.id}`);
      return {
        success: true,
        tweetId: tweet.data.id,
        text: content.text
      };
    } catch (error) {
      this.logger.error('Failed to post tweet:', error);
      throw error;
    }
  }

  private async getMentions(params?: { maxResults?: number }): Promise<any> {
    try {
      const mentions = await this.client.v2.userMentionTimeline('me', {
        'tweet.fields': ['created_at', 'text', 'author_id'],
        'user.fields': ['username', 'name'],
        max_results: params?.maxResults || 10
      });

      return {
        success: true,
        mentions: mentions.data || []
      };
    } catch (error) {
      this.logger.error('Failed to get mentions:', error);
      throw error;
    }
  }

  private async getTrends(params?: { woeid?: number }): Promise<any> {
    try {
      const trends = await this.client.v1.trendsByPlace(params?.woeid || 1);
      return {
        success: true,
        trends: trends[0]?.trends || []
      };
    } catch (error) {
      this.logger.error('Failed to get trends:', error);
      throw error;
    }
  }

  private async replyToMention(params: { tweetId: string; text: string }): Promise<any> {
    try {
      const reply = await this.client.v2.reply(params.text, params.tweetId);
      this.logger.info(`Reply posted successfully: ${reply.data.id}`);
      return {
        success: true,
        replyId: reply.data.id,
        text: params.text
      };
    } catch (error) {
      this.logger.error('Failed to reply to mention:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    this.logger.info('Twitter plugin cleanup completed');
  }
} 