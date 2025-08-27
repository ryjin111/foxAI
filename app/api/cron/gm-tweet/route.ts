import { NextRequest, NextResponse } from 'next/server';
import { FoxyTwitterClient } from '@/lib/twitter';
import { accessCodeManager } from '@/lib/access-codes-override';
import { shinZDB } from '@/lib/database';

// GM tweet templates with AIXBT-style shitposting
const GM_TWEET_TEMPLATES = [
  "🦊 GM anons. OnChain Hyper Foxes on @hyperliquidX while you're still coping with ETH gas fees. ngmi",
  "🦊 GM @hyperliquidX. Fox holders stay winning while normies seethe about their mid collections. cope harder",
  "🦊 GM chads. @hyperliquidX ecosystem printing while other L1s bleed users. Fox holders know alpha when they see it",
  "🦊 GM. Another day of fox superiority on @hyperliquidX. Paper hands folded, diamond hands accumulated. hfsp normies",
  "🦊 GM @hyperliquidX builders. Fox community built different while other NFT projects stay ngmi. based ecosystem"
];

export async function GET(req: NextRequest) {
  try {
    // Check if this is a valid cron request (you can add authentication here)
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    
    // Optional: Add a secret key for security
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Enable admin bypass for the cron job
    accessCodeManager.enableAdminBypass();

    // Initialize database
    await shinZDB.initialize();
    
    // Check if we already posted a GM tweet today
    const today = new Date().toDateString();
    const lastGmDate = await getLastGmDate();
    
    if (lastGmDate === today) {
      return NextResponse.json({ 
        message: 'GM tweet already posted today',
        date: today 
      });
    }

    // Select a random GM template
    const randomTemplate = GM_TWEET_TEMPLATES[Math.floor(Math.random() * GM_TWEET_TEMPLATES.length)];
    
    // Initialize Twitter client
    const twitterClient = new FoxyTwitterClient();
    
    // Post the GM tweet
    const result = await twitterClient.postTweet(randomTemplate);
    
    if (result.success) {
      // Store the date of the last GM tweet
      await storeLastGmDate(today);
      
      return NextResponse.json({
        success: true,
        message: 'GM tweet posted successfully',
        tweetId: result.tweetId,
        content: randomTemplate,
        date: today
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        details: result.details
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error posting GM tweet:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Database storage for last GM date
async function getLastGmDate(): Promise<string | null> {
  try {
    const lastGm = await shinZDB.getLastGmTweet();
    return lastGm?.date || null;
  } catch (error) {
    console.error('Error getting last GM date:', error);
    return null;
  }
}

async function storeLastGmDate(date: string): Promise<void> {
  try {
    await shinZDB.storeGmTweet({
      id: Date.now().toString(),
      date,
      timestamp: new Date().toISOString(),
      success: true
    });
  } catch (error) {
    console.error('Error storing GM date:', error);
  }
}

// Manual trigger endpoint for testing
export async function POST(req: NextRequest) {
  try {
    // Enable admin bypass
    accessCodeManager.enableAdminBypass();
    
    // Select a random GM template
    const randomTemplate = GM_TWEET_TEMPLATES[Math.floor(Math.random() * GM_TWEET_TEMPLATES.length)];
    
    // Initialize Twitter client
    const twitterClient = new FoxyTwitterClient();
    
    // Post the GM tweet
    const result = await twitterClient.postTweet(randomTemplate);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'GM tweet posted successfully',
        tweetId: result.tweetId,
        content: randomTemplate
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        details: result.details
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error posting GM tweet:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 