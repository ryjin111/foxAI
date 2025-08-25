import { TwitterApi } from 'twitter-api-v2';
import { TwitterConfig, SentimentResult, ShitpostTemplate } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { CryptoService, MarketAnalysis, ProjectScore } from './crypto.js';

export class TwitterService {
  private client: TwitterApi;
  private logger: Logger;
  private cryptoService: CryptoService;
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
    },
    {
      id: '6',
      name: 'Crypto Moon',
      template: '🚀 {coin} is mooning! {percentage}% gains in 24h! To the moon! 🌙 #Crypto #MoonMission',
      category: 'crypto',
      tags: ['crypto', 'moon', 'gains']
    },
    {
      id: '7',
      name: 'Market Analysis',
      template: '📊 Market Update: {sentiment} sentiment. Top gainer: {top_gainer} +{gain_percentage}%. Fear & Greed: {fear_greed}/100 #Crypto #Trading',
      category: 'analysis',
      tags: ['market', 'analysis', 'trading']
    },
    {
      id: '8',
      name: 'Project Score',
      template: '💎 {coin} Project Score: {score}/100 | Risk: {risk_level} | Recommendation: {recommendation} #CryptoAnalysis #Investing',
      category: 'analysis',
      tags: ['score', 'analysis', 'investment']
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
    this.cryptoService = new CryptoService();
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

  async postHourlyCryptoUpdate(): Promise<any> {
    try {
      const marketAnalysis = await this.cryptoService.getMarketAnalysis();
      const topGainer = marketAnalysis.top_gainers[0];
      
      const tweet = `📊 Hyperliquid EVM Hourly Update 🕐\n\n` +
        `Market Sentiment: ${marketAnalysis.overall_sentiment.toUpperCase()} 📈\n` +
        `Fear & Greed: ${marketAnalysis.fear_greed_index}/100\n` +
        `Top Gainer: ${topGainer?.symbol || 'N/A'} +${topGainer?.price_change_24h?.toFixed(2) || 0}%\n` +
        `NFT Focus: ${topGainer?.is_nft ? 'Yes' : 'No'}\n\n` +
        `#Hyperliquid #EVM #NFT #Trading`;

      return await this.postTweet(tweet);
    } catch (error) {
      this.logger.error('Failed to post hourly Hyperliquid update:', error);
      throw error;
    }
  }

  async postMarketAnalysis(): Promise<any> {
    try {
      const analysis = await this.cryptoService.getMarketAnalysis();
      
      const tweet = `🔍 Hyperliquid EVM Market Analysis 📊\n\n` +
        `Overall Sentiment: ${analysis.overall_sentiment.toUpperCase()}\n` +
        `Market Cap Change: ${analysis.market_cap_change_24h.toFixed(2)}%\n` +
        `Volume Change: ${analysis.volume_change_24h.toFixed(2)}%\n` +
        `Fear & Greed: ${analysis.fear_greed_index}/100\n\n` +
        `Trending: ${analysis.trending_topics.join(', ')}\n\n` +
        `#HyperliquidEVM #MarketAnalysis #NFT #Trading`;

      return await this.postTweet(tweet);
    } catch (error) {
      this.logger.error('Failed to post Hyperliquid market analysis:', error);
      throw error;
    }
  }

  async postProjectScore(coinId: string): Promise<any> {
    try {
      const score = await this.cryptoService.getProjectScore(coinId);
      
      const tweet = `💎 ${score.name} Hyperliquid EVM Analysis 📊\n\n` +
        `Overall Score: ${score.score}/100 ⭐\n` +
        `Risk Level: ${score.risk_level.toUpperCase()}\n` +
        `Recommendation: ${score.recommendation.toUpperCase()}\n\n` +
        `Market Cap: ${score.factors.market_cap.toFixed(1)}/100\n` +
        `Volume: ${score.factors.volume.toFixed(1)}/100\n` +
        `Stability: ${score.factors.price_stability.toFixed(1)}/100\n\n` +
        `#HyperliquidEVM #${score.name} #NFT #Investing`;

      return await this.postTweet(tweet);
    } catch (error) {
      this.logger.error('Failed to post Hyperliquid project score:', error);
      throw error;
    }
  }

  async replyToMentions(): Promise<any[]> {
    try {
      // Get mentions from the last hour
      const mentions = await this.client.v2.mentionTimeline({
        'tweet.fields': ['author_id', 'text', 'created_at'],
        'user.fields': ['username'],
        'max_results': 10
      });

      const replies = [];
      
      for (const mention of mentions.data || []) {
        const reply = await this.generateMentionReply(mention.text);
        if (reply) {
          const tweetReply = await this.client.v2.reply(reply, mention.id);
          replies.push({
            originalTweetId: mention.id,
            replyId: tweetReply.data.id,
            reply: reply
          });
        }
      }

      this.logger.info(`Replied to ${replies.length} mentions`);
      return replies;
    } catch (error) {
      this.logger.error('Failed to reply to mentions:', error);
      throw error;
    }
  }

  async generateMentionReply(mentionText: string): Promise<string | null> {
    try {
      // Analyze the mention for sentiment and keywords
      const sentiment = await this.cryptoService.analyzeSentiment(mentionText);
      
      // Generate appropriate reply based on sentiment
      if (sentiment.sentiment === 'bullish') {
        return `🚀 Bullish vibes on Hyperliquid EVM! Love the energy! ${mentionText.includes('nft') ? '#NFT' : '#Hyperliquid'} to the moon! 🌙`;
      } else if (sentiment.sentiment === 'bearish') {
        return `📉 Bear market on Hyperliquid EVM? Perfect time to accumulate NFTs! 💎 Diamond hands will prevail! #HODL #Hyperliquid`;
      } else {
        // Generate a random Hyperliquid insight
        const insight = await this.cryptoService.getRandomCryptoInsight();
        return `🤖 Thanks for the mention! Here's a Hyperliquid EVM insight: ${insight}`;
      }
    } catch (error) {
      this.logger.error('Failed to generate Hyperliquid mention reply:', error);
      return null;
    }
  }

  async postTrendingAnalysis(): Promise<any> {
    try {
      const trendingCoins = await this.cryptoService.getTrendingCoins();
      const topCoins = await this.cryptoService.getTopCoins(5);
      
      const tweet = `🔥 Hyperliquid EVM Trending Analysis 📈\n\n` +
        `Top Trending:\n` +
        trendingCoins.slice(0, 3).map((coin, i) => 
          `${i + 1}. ${coin.item.name} (${coin.item.symbol.toUpperCase()})`
        ).join('\n') + `\n\n` +
        `Market Leaders:\n` +
        topCoins.slice(0, 3).map((coin, i) => 
          `${i + 1}. ${coin.name} $${coin.current_price.toFixed(2)}`
        ).join('\n') + `\n\n` +
        `#Hyperliquid #EVM #Trending #NFT #Analysis`;

      return await this.postTweet(tweet);
    } catch (error) {
      this.logger.error('Failed to post Hyperliquid trending analysis:', error);
      throw error;
    }
  }

  async postSentimentAnalysis(text: string): Promise<any> {
    try {
      const sentiment = await this.cryptoService.analyzeSentiment(text);
      
      const tweet = `🧠 Hyperliquid EVM Sentiment Analysis 📊\n\n` +
        `Text: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"\n\n` +
        `Sentiment: ${sentiment.sentiment.toUpperCase()}\n` +
        `Score: ${sentiment.score}/100\n` +
        `Keywords: ${sentiment.keywords.join(', ')}\n\n` +
        `#HyperliquidEVM #SentimentAnalysis #NFT #AI`;

      return await this.postTweet(tweet);
    } catch (error) {
      this.logger.error('Failed to post Hyperliquid sentiment analysis:', error);
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
      const trends = await this.client.v1.trendsByPlace(1);
      return trends.slice(0, count).map((trend: any) => ({
        name: trend.name,
        query: trend.query,
        tweet_volume: trend.tweet_volume
      }));
    } catch (error) {
      this.logger.error('Failed to get trending topics:', error);
      return [];
    }
  }

  async generateShitpost(category?: string): Promise<string> {
    const templates = this.shitpostTemplates.filter(t => 
      !category || t.category === category
    );
    
    if (templates.length === 0) {
      return "🚀 Just deployed my AI-powered blockchain solution! Disrupting the industry one commit at a time! #TechBro #Innovation";
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    
    if (category === 'crypto') {
      return await this.cryptoService.getRandomCryptoInsight();
    }

    return template.template;
  }

  async postRandomShitpost(): Promise<any> {
    try {
      const shitpost = await this.generateShitpost();
      return await this.postTweet(shitpost);
    } catch (error) {
      this.logger.error('Failed to post random shitpost:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    try {
      // Simple check - in production you might want to make an actual API call
      return !!(this.client);
    } catch (error) {
      return false;
    }
  }

  async getFollowersCount(): Promise<number> {
    try {
      const me = await this.client.v2.me();
      return me.data.public_metrics?.followers_count || 0;
    } catch (error) {
      this.logger.error('Failed to get followers count:', error);
      return 0;
    }
  }

  async getTweetAnalytics(tweetId: string): Promise<any> {
    try {
      const tweet = await this.client.v2.singleTweet(tweetId, {
        'tweet.fields': ['public_metrics', 'created_at']
      });
      return tweet.data;
    } catch (error) {
      this.logger.error('Failed to get tweet analytics:', error);
      return null;
    }
  }
} 