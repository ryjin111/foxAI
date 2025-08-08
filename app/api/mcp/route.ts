import { NextRequest, NextResponse } from 'next/server'

// MCP Server connection (this would connect to your running MCP server)
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3001'

export async function POST(req: NextRequest) {
  try {
    const { tool, args } = await req.json()

    // Forward the request to your MCP server
    const response = await fetch(`${MCP_SERVER_URL}/api/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: tool,
        arguments: args,
      }),
    })

    if (!response.ok) {
      throw new Error(`MCP Server error: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('MCP API error:', error)
    return NextResponse.json(
      { error: 'Failed to execute MCP tool' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get available tools from MCP server
    const response = await fetch(`${MCP_SERVER_URL}/api/tools`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`MCP Server error: ${response.statusText}`)
    }

    const tools = await response.json()
    return NextResponse.json(tools)
  } catch (error) {
    console.error('MCP API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch MCP tools' },
      { status: 500 }
    )
  }
} 