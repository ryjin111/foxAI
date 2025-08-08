import { TwitterApi } from 'twitter-api-v2';
import { TwitterConfig, TwitterPost } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class TwitterService {
  private client: TwitterApi | null = null;
  private logger: Logger;
  private isEnabled: boolean;

  constructor(config: TwitterConfig) {
    this.logger = new Logger('TwitterService');
    
    // Check if we have valid Twitter credentials
    if (config.apiKey && config.apiSecret && config.accessToken && config.accessTokenSecret) {
      try {
        this.client = new TwitterApi({
          appKey: config.apiKey,
          appSecret: config.apiSecret,
          accessToken: config.accessToken,
          accessSecret: config.accessTokenSecret,
        });
        this.isEnabled = true;
        this.logger.info('Twitter service initialized successfully');
      } catch (error) {
        this.logger.warn('Failed to initialize Twitter client, running in disabled mode');
        this.isEnabled = false;
      }
    } else {
      this.logger.warn('Twitter credentials not provided, running in disabled mode');
      this.isEnabled = false;
    }
  }

  async postTweet(text: string): Promise<string> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, tweet not posted');
      return 'disabled';
    }
    
    try {
      const tweet = await this.client.v2.tweet(text);
      this.logger.info(`Tweet posted successfully: ${tweet.data.id}`);
      return tweet.data.id;
    } catch (error) {
      this.logger.error(`Failed to post tweet: ${error}`);
      throw error;
    }
  }

  async postTweetWithMedia(text: string, mediaPath: string): Promise<string> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, tweet with media not posted');
      return 'disabled';
    }
    
    try {
      // Upload media first
      const mediaId = await this.client.v1.uploadMedia(mediaPath);
      
      // Post tweet with media
      const tweet = await this.client.v2.tweet({
        text,
        media: { media_ids: [mediaId] },
      });
      
      this.logger.info(`Tweet with media posted successfully: ${tweet.data.id}`);
      return tweet.data.id;
    } catch (error) {
      this.logger.error(`Failed to post tweet with media: ${error}`);
      throw error;
    }
  }

  async searchTweets(query: string, limit: number = 100): Promise<TwitterPost[]> {
    try {
      // Simplified implementation - return empty array for now
      this.logger.warn('Search tweets functionality simplified - returning empty array');
      return [];
    } catch (error) {
      this.logger.error(`Failed to search tweets: ${error}`);
      throw error;
    }
  }

  async getMentions(limit: number = 50): Promise<TwitterPost[]> {
    try {
      // Simplified implementation - return empty array for now
      this.logger.warn('Get mentions functionality simplified - returning empty array');
      return [];
    } catch (error) {
      this.logger.error(`Failed to get mentions: ${error}`);
      throw error;
    }
  }

  async replyToTweet(tweetId: string, text: string): Promise<string> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, reply not posted');
      return 'disabled';
    }
    
    try {
      const reply = await this.client.v2.reply(text, tweetId);
      this.logger.info(`Reply posted successfully: ${reply.data.id}`);
      return reply.data.id;
    } catch (error) {
      this.logger.error(`Failed to reply to tweet: ${error}`);
      throw error;
    }
  }

  async retweet(tweetId: string): Promise<boolean> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, retweet not performed');
      return false;
    }
    
    try {
      // Note: This requires the user ID, which we don't have in this context
      // For now, we'll skip this functionality
      this.logger.warn('Retweet functionality requires user ID - not implemented');
      return false;
    } catch (error) {
      this.logger.error(`Failed to retweet: ${error}`);
      return false;
    }
  }

  async likeTweet(tweetId: string): Promise<boolean> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, like not performed');
      return false;
    }
    
    try {
      // Note: This requires the user ID, which we don't have in this context
      // For now, we'll skip this functionality
      this.logger.warn('Like functionality requires user ID - not implemented');
      return false;
    } catch (error) {
      this.logger.error(`Failed to like tweet: ${error}`);
      return false;
    }
  }

  async getTrendingTopics(woeid: number = 1): Promise<string[]> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, trending topics not available');
      return [];
    }
    
    try {
      const trends = await this.client.v1.trendsByPlace(woeid);
      return trends[0]?.trends?.map((trend: any) => trend.name) || [];
    } catch (error) {
      this.logger.error(`Failed to get trending topics: ${error}`);
      return [];
    }
  }

  async monitorKeywords(keywords: string[], callback: (tweet: TwitterPost) => void): Promise<void> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, keyword monitoring not available');
      return;
    }
    
    try {
      const rules = keywords.map(keyword => ({ value: keyword }));
      
      // Set up streaming rules
      await this.client.v2.updateStreamRules({
        add: rules,
      });

      // Start streaming
      const stream = await this.client.v2.searchStream();

      stream.on('data', (tweet) => {
        const twitterPost: TwitterPost = {
          id: tweet.data.id,
          text: tweet.data.text,
          timestamp: new Date(tweet.data.created_at!).getTime(),
          metrics: {
            likes: tweet.data.public_metrics?.like_count || 0,
            retweets: tweet.data.public_metrics?.retweet_count || 0,
            replies: tweet.data.public_metrics?.reply_count || 0,
          },
        };
        
        callback(twitterPost);
      });

      stream.on('error', (error) => {
        this.logger.error(`Stream error: ${error}`);
      });

    } catch (error) {
      this.logger.error(`Failed to monitor keywords: ${error}`);
      throw error;
    }
  }

  async getFollowersCount(): Promise<number> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, followers count not available');
      return 0;
    }
    
    try {
      const user = await this.client.v2.me({
        'user.fields': ['public_metrics'],
      });
      return user.data.public_metrics?.followers_count || 0;
    } catch (error) {
      this.logger.error(`Failed to get followers count: ${error}`);
      return 0;
    }
  }

  async getTweetAnalytics(tweetId: string): Promise<any> {
    if (!this.isEnabled || !this.client) {
      this.logger.warn('Twitter service is disabled, tweet analytics not available');
      return null;
    }
    
    try {
      const analytics = await this.client.v2.tweet(tweetId);
      return analytics.data;
    } catch (error) {
      this.logger.error(`Failed to get tweet analytics: ${error}`);
      throw error;
    }
  }
} 