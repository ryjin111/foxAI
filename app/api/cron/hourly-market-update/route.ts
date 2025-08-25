import { TwitterService } from '../../../../src/services/twitter.js';
import { CryptoService } from '../../../../src/services/crypto.js';
import { TwitterConfig } from '../../../../src/types/index.js';

export async function GET(req: Request) {
  try {
    // Check if this is a valid cron request
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    
    // Optional: Add a secret key for security
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize services
    const twitterConfig: TwitterConfig = {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    };

    const twitterService = new TwitterService(twitterConfig);
    const cryptoService = new CryptoService();
    
    // Step 1: Fetch Hyperliquid market data
    const marketData = await cryptoService.getMarketAnalysis();
    
    // Step 2: Post hourly update to Twitter
    const result = await twitterService.postHourlyCryptoUpdate();
    
    if (result.success) {
      return Response.json({
        success: true,
        message: 'Hourly market update posted successfully! 🦊✨',
        tweetId: result.tweetId,
        content: result.text,
        marketData: {
          sentiment: marketData.overall_sentiment,
          fearGreedIndex: marketData.fear_greed_index,
          topGainer: marketData.top_gainers[0]?.symbol
        },
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
    console.error('Error posting hourly market update:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 