import { TwitterService } from '../../../../src/services/twitter.js';
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

    // Initialize Twitter service
    const twitterConfig: TwitterConfig = {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    };

    const twitterService = new TwitterService(twitterConfig);
    
    // Step 1: Get trending topics (simulating mentions)
    const trendingTopics = await twitterService.getTrendingTopics();
    
    // Step 2: Process mentions and generate replies
    let processedMentions = 0;
    if (trendingTopics && trendingTopics.length > 0) {
      for (const topic of trendingTopics.slice(0, 3)) { // Process top 3
        try {
          // Generate reply for the topic
          const reply = `Thanks for the mention! 🦊 Hyperliquid EVM is the future of cross-chain trading! #Hyperliquid #EVM #${topic.replace(/\s+/g, '')}`;
          
          // In a real implementation, you'd reply to specific mentions
          console.log(`💬 Generated reply for topic: ${topic} - ${reply.substring(0, 50)}...`);
          processedMentions++;
        } catch (error) {
          console.error('❌ Failed to generate reply for topic:', topic, error);
        }
      }
    }
    
    return Response.json({
      success: true,
      message: `Mention monitoring completed! Processed ${processedMentions} mentions`,
      trendingTopics: trendingTopics?.slice(0, 5) || [],
      processedMentions,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in mention monitoring:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 