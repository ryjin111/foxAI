import { TwitterApi } from 'twitter-api-v2';
import { TwitterConfig, TwitterPost } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class TwitterService {
  private client: TwitterApi;
  private logger: Logger;

  constructor(config: TwitterConfig) {
    this.client = new TwitterApi({
      appKey: config.apiKey,
      appSecret: config.apiSecret,
      accessToken: config.accessToken,
      accessSecret: config.accessTokenSecret,
    });
    this.logger = new Logger('TwitterService');
  }

  async postTweet(text: string): Promise<string> {
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
      const tweets = await this.client.v2.search(query, {
        max_results: limit,
        'tweet.fields': ['created_at', 'public_metrics'],
      });

      return tweets.data.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        timestamp: new Date(tweet.created_at!).getTime(),
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
        },
      }));
    } catch (error) {
      this.logger.error(`Failed to search tweets: ${error}`);
      throw error;
    }
  }

  async getMentions(limit: number = 50): Promise<TwitterPost[]> {
    try {
      const mentions = await this.client.v2.userMentionTimeline({
        max_results: limit,
        'tweet.fields': ['created_at', 'public_metrics'],
      });

      return mentions.data.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        timestamp: new Date(tweet.created_at!).getTime(),
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
        },
      }));
    } catch (error) {
      this.logger.error(`Failed to get mentions: ${error}`);
      throw error;
    }
  }

  async replyToTweet(tweetId: string, text: string): Promise<string> {
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
    try {
      await this.client.v2.retweet(tweetId);
      this.logger.info(`Retweeted successfully: ${tweetId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to retweet: ${error}`);
      return false;
    }
  }

  async likeTweet(tweetId: string): Promise<boolean> {
    try {
      await this.client.v2.like(tweetId);
      this.logger.info(`Liked tweet successfully: ${tweetId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to like tweet: ${error}`);
      return false;
    }
  }

  async getTrendingTopics(woeid: number = 1): Promise<string[]> {
    try {
      const trends = await this.client.v1.trendsPlace(woeid);
      return trends[0].trends.map(trend => trend.name);
    } catch (error) {
      this.logger.error(`Failed to get trending topics: ${error}`);
      return [];
    }
  }

  async monitorKeywords(keywords: string[], callback: (tweet: TwitterPost) => void): Promise<void> {
    try {
      const rules = keywords.map(keyword => ({ value: keyword }));
      
      // Set up streaming rules
      await this.client.v2.updateStreamRules({
        add: rules,
      });

      // Start streaming
      const stream = await this.client.v2.searchStream({
        'tweet.fields': ['created_at', 'public_metrics'],
      });

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
    try {
      const analytics = await this.client.v2.tweet(tweetId, {
        'tweet.fields': ['public_metrics', 'non_public_metrics'],
      });
      return analytics.data;
    } catch (error) {
      this.logger.error(`Failed to get tweet analytics: ${error}`);
      throw error;
    }
  }
} 