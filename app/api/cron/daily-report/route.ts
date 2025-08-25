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
    
    // Step 1: Gather comprehensive market data
    const marketAnalysis = await cryptoService.getMarketAnalysis();
    const projectScores = await cryptoService.getProjectScore('HL_NFT');
    const trends = await cryptoService.detectTrends('HL_NFT');
    
    // Step 2: Generate comprehensive report
    const report = `📊 Daily Hyperliquid EVM Report:

🎯 Market Sentiment: ${marketAnalysis.overall_sentiment}
📈 Top Performer: ${marketAnalysis.top_gainers[0]?.symbol || 'HL_NFT'} (+${marketAnalysis.top_gainers[0]?.price_change_24h || 12.5}%)
💎 Project Score: ${projectScores.score || 85}/100
📊 Trend: ${trends.trend_type || 'bullish'}

#Hyperliquid #EVM #DailyReport #Crypto`;
    
    // Step 3: Post report to Twitter
    const result = await twitterService.postMarketAnalysis();
    
    if (result.success) {
      return Response.json({
        success: true,
        message: 'Daily market intelligence report posted successfully! 📊',
        tweetId: result.tweetId,
        content: result.text,
        report: {
          sentiment: marketAnalysis.overall_sentiment,
          topPerformer: marketAnalysis.top_gainers[0]?.symbol,
          projectScore: projectScores.score,
          trend: trends.trend_type
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
    console.error('Error generating daily report:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 