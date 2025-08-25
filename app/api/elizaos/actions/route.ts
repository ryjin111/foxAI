import { NextRequest, NextResponse } from 'next/server';

// Mock ElizaOS actions for Vercel deployment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message } = body;

    switch (action) {
      case 'start':
        return NextResponse.json({
          success: true,
          message: 'ElizaOS started successfully'
        });

      case 'stop':
        return NextResponse.json({
          success: true,
          message: 'ElizaOS stopped successfully'
        });

      case 'message':
        if (!message) {
          return NextResponse.json(
            { error: 'Message is required' },
            { status: 400 }
          );
        }

        // Simple response logic
        const lowerMessage = message.toLowerCase();
        let response = "I'm here to help! Feel free to ask me about crypto, market analysis, or social media posting.";

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          response = "Hello! I'm FoxAI, your AI assistant. How can I help you today?";
        } else if (lowerMessage.includes('crypto') || lowerMessage.includes('market')) {
          response = "I'd be happy to help with crypto analysis! What specific information are you looking for?";
        } else if (lowerMessage.includes('twitter') || lowerMessage.includes('post')) {
          response = "I can help you post to Twitter! What would you like to share?";
        } else if (lowerMessage.includes('hyperliquid')) {
          response = "Hyperliquid EVM is a cutting-edge blockchain platform! I can help you analyze market data, track NFTs, and monitor trading activity. What specific aspect interests you?";
        }

        return NextResponse.json({
          success: true,
          response
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
} 