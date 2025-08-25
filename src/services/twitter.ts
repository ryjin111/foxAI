import { TwitterApi } from 'twitter-api-v2';
import { TwitterConfig, SentimentResult, ShitpostTemplate } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class TwitterService {
  private client: TwitterApi;
  private logger: Logger;
  private shitpostTemplates: ShitpostTemplate[] = [
    {
      id: '1',
      name: 'Classic Copypasta',
      template: 'I am not a robot 🤖 I am a human being with feelings and emotions. Please treat me with respect.',
      category: 'copypasta',
      tags: ['robot', 'feelings']
    },
    {
      id: '2',
      name: 'Tech Bro',
      template: 'Just deployed my AI-powered blockchain solution to the cloud. Disrupting the industry one commit at a time. 🚀 #TechBro #Innovation',
      category: 'meme',
      tags: ['tech', 'ai', 'blockchain']
    },
    {
      id: '3',
      name: 'Random Fact',
      template: 'Did you know that {random_fact}? Mind = blown 🤯',
      category: 'random',
      tags: ['facts', 'random']
    },
    {
      id: '4',
      name: 'Troll Response',
      template: 'Well, actually... 🤓 *proceeds to write a 10-page essay about why you\'re wrong*',
      category: 'troll',
      tags: ['troll', 'well-actually']
    },
    {
      id: '5',
      name: 'Vibe Check',
      template: 'Vibe check failed. You\'re not vibing with the algorithm. Try again later. 😤',
      category: 'meme',
      tags: ['vibe', 'algorithm']
    }
  ];

  constructor(config: TwitterConfig) {
    this.client = new TwitterApi({
      appKey: config.apiKey,
      appSecret: config.apiSecret,
      accessToken: config.accessToken,
      accessSecret: config.accessTokenSecret,
    });
    this.logger = new Logger('TwitterService');
  }

  async postTweet(text: string): Promise<any> {
    try {
      const tweet = await this.client.v2.tweet(text);
      this.logger.info(`Tweet posted: ${tweet.data.id}`);
      return { success: true, tweetId: tweet.data.id, text };
    } catch (error) {
      this.logger.error('Failed to post tweet:', error);
      throw error;
    }
  }

  async analyzeSentiment(text: string, keywords?: string[]): Promise<SentimentResult> {
    // Simple sentiment analysis (you can make this more sophisticated)
    const positiveWords = ['good', 'great', 'awesome', 'amazing', 'love', 'happy', 'excellent'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'horrible', 'worst'];
    
    const words = text.toLowerCase().split(' ');
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let score = 0;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = positiveCount / words.length;
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = negativeCount / words.length;
    }
    
    return {
      text,
      sentiment,
      score,
      keywords: keywords || []
    };
  }

  async getTrendingTopics(count: number = 10): Promise<any[]> {
    try {
      // Use a simpler approach for trending topics
      const trends = await this.client.v1.trendsByPlace(1); // 1 = worldwide
      return trends[0]?.trends?.slice(0, count) || [];
    } catch (error) {
      this.logger.error('Failed to get trending topics:', error);
      return [];
    }
  }

  generateShitpost(category?: string): string {
    let templates = this.shitpostTemplates;
    
    if (category) {
      templates = templates.filter(t => t.category === category);
    }
    
    if (templates.length === 0) {
      return "I'm out of shitposts. Please try again later. 😅";
    }
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    let text = template.template;
    
    // Replace placeholders
    if (text.includes('{random_fact}')) {
      const facts = [
        'bananas are berries but strawberries aren\'t',
        'honey never spoils',
        'octopuses have three hearts',
        'the shortest war lasted 38 minutes',
        'penguins can jump 6 feet out of water'
      ];
      text = text.replace('{random_fact}', facts[Math.floor(Math.random() * facts.length)]);
    }
    
    return text;
  }

  async postRandomShitpost(): Promise<any> {
    const shitpost = this.generateShitpost();
    return await this.postTweet(shitpost);
  }

  isConnected(): boolean {
    return !!this.client;
  }
} 