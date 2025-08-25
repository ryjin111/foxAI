import { foxAIAutonomousAgent } from '../../../src/autonomous-agent.js';

export async function GET(req: Request) {
  try {
    const status = await foxAIAutonomousAgent.getStatus();
    return Response.json({
      success: true,
      status,
      message: 'FoxAI Autonomous Agent status retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting autonomous agent status:', error);
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
      case 'start':
        await foxAIAutonomousAgent.start();
        return Response.json({
          success: true,
          message: 'FoxAI Autonomous Agent started successfully! 🦊✨'
        });

      case 'stop':
        await foxAIAutonomousAgent.stop();
        return Response.json({
          success: true,
          message: 'FoxAI Autonomous Agent stopped successfully!'
        });

      case 'send_message':
        if (!message) {
          return Response.json({
            success: false,
            error: 'Message is required'
          }, { status: 400 });
        }
        
        const response = await foxAIAutonomousAgent.sendMessage(message);
        return Response.json({
          success: true,
          response,
          message: 'Message sent to FoxAI Autonomous Agent successfully'
        });

      case 'get_status':
        const status = await foxAIAutonomousAgent.getStatus();
        return Response.json({
          success: true,
          status,
          message: 'Agent status retrieved successfully'
        });

      default:
        return Response.json({
          success: false,
          error: 'Invalid action. Supported actions: start, stop, send_message, get_status'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error with autonomous agent action:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 