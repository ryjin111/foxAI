import { TwitterService } from '../../../../src/services/twitter.js';
import { TwitterConfig } from '../../../../src/types/index.js';

// Hyperliquid EVM update templates with variations
const HYPERLIQUID_UPDATE_TEMPLATES = [
  "📊 Hyperliquid EVM Market Update: Bullish sentiment, top gainer HL_NFT +12.5%. NFT market heating up! #Hyperliquid #EVM #NFT",
  "🚀 Hyperliquid EVM Hourly Check: Market cap up 8.2%, volume spike detected. Time to scan for alpha! #Hyperliquid #Trading",
  "💎 Hyperliquid EVM Status: Fear & Greed at 75/100. Top performers: HL_GAMING +15.3%. NFT season incoming! #Hyperliquid #EVM",
  "📈 Hyperliquid EVM Pulse: Market sentiment bullish, trending topics: NFT Trading, DeFi, Gaming NFTs. #Hyperliquid #Crypto",
  "🔥 Hyperliquid EVM Update: Volume up 12%, new NFT collections trending. The future of cross-chain trading! #Hyperliquid #EVM"
];

export async function GET(req: Request) {
  try {
    // Check if this is a valid cron request
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    
    // Optional: Add a secret key for security
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if we already posted an update in the last hour
    const now = new Date();
    const lastUpdateKey = 'last_hyperliquid_update';
    const lastUpdate = localStorage.getItem(lastUpdateKey);
    
    if (lastUpdate) {
      const lastUpdateTime = new Date(lastUpdate);
      const hoursSinceLastUpdate = (now.getTime() - lastUpdateTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastUpdate < 1) {
        return Response.json({ 
          message: 'Hyperliquid update already posted in the last hour',
          nextUpdate: new Date(lastUpdateTime.getTime() + 60 * 60 * 1000).toISOString()
        });
      }
    }

    // Initialize Twitter service
    const twitterConfig: TwitterConfig = {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    };

    const twitterService = new TwitterService(twitterConfig);
    
    // Post the Hyperliquid update
    const result = await twitterService.postHourlyCryptoUpdate();
    
    if (result.success) {
      // Store the timestamp of this update
      localStorage.setItem(lastUpdateKey, now.toISOString());
      
      return Response.json({
        success: true,
        message: 'Hyperliquid EVM update posted successfully',
        tweetId: result.tweetId,
        content: result.text,
        timestamp: now.toISOString()
      });
    } else {
      return Response.json({
        success: false,
        error: result.error,
        details: result.details
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error posting Hyperliquid update:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Manual trigger endpoint for testing
export async function POST(req: Request) {
  try {
    // Initialize Twitter service
    const twitterConfig: TwitterConfig = {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    };

    const twitterService = new TwitterService(twitterConfig);
    
    // Post the Hyperliquid update
    const result = await twitterService.postHourlyCryptoUpdate();
    
    if (result.success) {
      return Response.json({
        success: true,
        message: 'Hyperliquid EVM update posted successfully',
        tweetId: result.tweetId,
        content: result.text,
        timestamp: new Date().toISOString()
      });
    } else {
      return Response.json({
        success: false,
        error: result.error,
        details: result.details
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error posting Hyperliquid update:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 