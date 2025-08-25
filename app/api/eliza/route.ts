import { TwitterService } from '../../../src/services/twitter.js';
import { CryptoService } from '../../../src/services/crypto.js';
import { TwitterConfig } from '../../../src/types/index.js';

export async function GET(req: Request) {
  try {
    // Initialize services to check status
    const twitterConfig: TwitterConfig = {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    };

    const twitterService = new TwitterService(twitterConfig);
    const cryptoService = new CryptoService();

    const status = {
      isRunning: true,
      personality: 'Hyperliquid EVM specialist with NFT market intelligence',
      mode: 'Manual Control - Use chat interface to interact with FoxAI',
      capabilities: [
        'Market Analysis - Ask about current market sentiment',
        'NFT Collections - Get NFT performance insights',
        'Twitter Posting - Generate and post tweets',
        'Crypto Insights - Get Hyperliquid EVM analysis'
      ],
      services: {
        twitter: twitterService.isConnected(),
        crypto: true
      }
    };

    return Response.json({
      success: true,
      status,
      message: 'FoxAI is ready for manual interaction! Use the chat interface.'
    });
  } catch (error) {
    console.error('Error getting FoxAI status:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action, message } = await req.json();

    switch (action) {
      case 'send_message':
        if (!message) {
          return Response.json({
            success: false,
            error: 'Message is required'
          }, { status: 400 });
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
        
        // Process message based on keywords
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        if (lowerMessage.includes('market') || lowerMessage.includes('analysis')) {
          const marketData = await cryptoService.getMarketAnalysis();
          response = `📊 Market Analysis: ${marketData.overall_sentiment} sentiment, Fear & Greed at ${marketData.fear_greed_index}/100. Top gainer: ${marketData.top_gainers[0]?.symbol || 'HL_NFT'}! #Hyperliquid #EVM`;
        } else if (lowerMessage.includes('nft') || lowerMessage.includes('collection')) {
          const nftData = await cryptoService.getHyperliquidData();
          const nftCollections = nftData.filter(item => item.is_nft);
          response = `🖼️ NFT Collections: ${nftCollections.length} active collections on Hyperliquid EVM. Top performer: ${nftCollections[0]?.symbol || 'HL_NFT'}! #Hyperliquid #NFT`;
        } else if (lowerMessage.includes('post') || lowerMessage.includes('tweet')) {
          const result = await twitterService.postRandomShitpost();
          response = `🐦 Posted to Twitter: ${result.success ? 'Success!' : 'Failed'} ${result.tweetId ? `(ID: ${result.tweetId})` : ''}`;
        } else {
          response = `🦊 FoxAI here! I'm ready to help with Hyperliquid EVM analysis. Ask me about market analysis, NFT opportunities, or post updates! #Hyperliquid #EVM`;
        }

        return Response.json({
          success: true,
          response,
          message: 'Message processed successfully'
        });

      default:
        return Response.json({
          success: false,
          error: 'Invalid action. Supported actions: send_message'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing message:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 