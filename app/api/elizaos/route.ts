import { NextRequest, NextResponse } from 'next/server';

interface ElizaOSRequest {
  action: string;
  message?: string;
  pluginId?: string;
  params?: any;
}

const ELIZAOS_API_URL = process.env.ELIZAOS_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${ELIZAOS_API_URL}/api/status`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ElizaOS status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ElizaOSRequest;
    
    // Validate required fields
    if (!body.action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }
    
    const { action, ...params } = body;

    let endpoint = '';
    switch (action) {
      case 'start':
        endpoint = '/api/start';
        break;
      case 'stop':
        endpoint = '/api/stop';
        break;
      case 'message':
        endpoint = '/api/message';
        break;
      case 'execute':
        endpoint = '/api/execute';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const response = await fetch(`${ELIZAOS_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
} 