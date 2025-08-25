import { NextRequest, NextResponse } from 'next/server';

interface ElizaOSStatus {
  isActive: boolean;
  personality: {
    name: string;
    traits: string[];
    goals: string[];
  };
  state: {
    mood: string;
    energy: number;
    currentTask?: string;
    lastAction?: string;
  };
  plugins: Array<{
    id: string;
    name: string;
    isEnabled: boolean;
  }>;
  workflows: Array<{
    id: string;
    name: string;
    isActive: boolean;
    lastRun?: string;
  }>;
  recentMemories: Array<{
    id: string;
    timestamp: string;
    type: string;
    content: string;
  }>;
}

// Mock ElizaOS status for Vercel deployment
// In a real implementation, this would connect to your ElizaOS backend
export async function GET(request: NextRequest) {
  try {
    // Simulate ElizaOS status
    const status: ElizaOSStatus = {
      isActive: true,
      personality: {
        name: "FoxAI",
        traits: [
          "Intelligent",
          "Curious", 
          "Helpful",
          "Analytical",
          "Creative",
          "Determined"
        ],
        goals: [
          "Provide valuable crypto insights",
          "Engage with the community",
          "Share market analysis",
          "Help users make informed decisions",
          "Stay updated with latest trends"
        ]
      },
      state: {
        mood: "focused",
        energy: 85,
        currentTask: "Monitoring crypto markets",
        lastAction: "Analyzed Hyperliquid EVM data"
      },
      plugins: [
        {
          id: "twitter",
          name: "Twitter Plugin",
          isEnabled: true
        },
        {
          id: "crypto", 
          name: "Crypto Plugin",
          isEnabled: true
        }
      ],
      workflows: [
        {
          id: "hourly-update",
          name: "Hourly Market Update",
          isActive: true,
          lastRun: new Date().toISOString()
        },
        {
          id: "mention-monitoring",
          name: "Mention Monitoring", 
          isActive: true,
          lastRun: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
        }
      ],
      recentMemories: [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          type: "action",
          content: "Retrieved latest Hyperliquid market data"
        },
        {
          id: "2", 
          timestamp: new Date(Date.now() - 60000).toISOString(),
          type: "conversation",
          content: "User: What's the current crypto market status?"
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: "system", 
          content: "ElizaOS started and is now active"
        }
      ]
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ElizaOS status' },
      { status: 500 }
    );
  }
} 