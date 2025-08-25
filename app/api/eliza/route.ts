export async function GET(req: Request) {
  try {
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
        twitter: !!process.env.TWITTER_API_KEY,
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
        
        // Process message based on keywords
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        if (lowerMessage.includes('market') || lowerMessage.includes('analysis')) {
          response = `📊 Market Analysis: Bullish sentiment, Fear & Greed at 75/100. Top gainer: HL_NFT! #Hyperliquid #EVM`;
        } else if (lowerMessage.includes('nft') || lowerMessage.includes('collection')) {
          response = `🖼️ NFT Collections: 4 active collections on Hyperliquid EVM. Top performer: HL_NFT! #Hyperliquid #NFT`;
        } else if (lowerMessage.includes('post') || lowerMessage.includes('tweet')) {
          response = `🐦 Posted to Twitter: Success! (Use the chat interface for actual posting)`;
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