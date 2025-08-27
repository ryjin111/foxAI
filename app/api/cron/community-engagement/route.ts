import { NextRequest, NextResponse } from 'next/server';
import { FoxyTwitterClient } from '@/lib/twitter';
import { accessCodeManager } from '@/lib/access-codes-override';

export async function GET(req: NextRequest) {
  try {
    // Check if this is a valid cron request
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    
    // Optional: Add a secret key for security
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Enable admin bypass for the cron job
    accessCodeManager.enableAdminBypass();

    const twitterClient = new FoxyTwitterClient();
    
    // Get recent mentions of @onchainhyperfoxes
    const mentionsResult = await twitterClient.getMentions();
    
    if (!mentionsResult.success || !mentionsResult.mentions || mentionsResult.mentions.length === 0) {
      return NextResponse.json({ 
        message: 'No mentions found to reply to',
        success: true 
      });
    }

    // Reply to up to 3 recent mentions
    const mentionsToReply = mentionsResult.mentions.slice(0, 3);
    const replies = [];
    
    for (const mention of mentionsToReply) {
      // Generate contextual reply based on mention content
      let replyContent = '';
      const mentionText = mention.text.toLowerCase();
      
      if (mentionText.includes('thanks') || mentionText.includes('thank')) {
        replyContent = `🦊 np anon. Fox holders share alpha while normies stay ngmi on @hyperliquidX`;
      } else if (mentionText.includes('great') || mentionText.includes('awesome') || mentionText.includes('love')) {
        replyContent = `🦊 based take. @hyperliquidX ecosystem where chads accumulate while others cope`;
      } else if (mentionText.includes('gm') || mentionText.includes('morning')) {
        replyContent = `🦊 GM chad. Fox holders stay winning on @hyperliquidX while normies seethe`;
      } else if (mentionText.includes('fox') || mentionText.includes('collection')) {
        replyContent = `🦊 Fox superiority on @hyperliquidX. Other collections stay mid. cope harder anon`;
      } else if (mentionText.includes('?') || mentionText.includes('question')) {
        replyContent = `🦊 ngmi mindset anon. @hyperliquidX is where alpha lives. dyor or stay poor`;
      } else {
        // Default savage reply
        replyContent = `🦊 Fox holders built different on @hyperliquidX. Normies wouldn't understand`;
      }
      
      // Ensure reply is under 280 characters
      if (replyContent.length > 280) {
        replyContent = replyContent.substring(0, 280);
      }
      
      const replyResult = await twitterClient.replyToTweet(mention.id, replyContent);
      
      if (replyResult.success) {
        replies.push({
          mentionId: mention.id,
          authorId: mention.author_id,
          replyContent,
          tweetId: replyResult.tweetId,
          success: true
        });
      } else {
        replies.push({
          mentionId: mention.id,
          authorId: mention.author_id,
          replyContent,
          error: replyResult.error,
          success: false
        });
      }
      
      // Add delay between replies to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return NextResponse.json({
      success: true,
      message: `Community engagement completed`,
      mentionsFound: mentionsResult.mentions.length,
      repliesSent: replies.filter(r => r.success).length,
      replies
    });

  } catch (error) {
    console.error('Community engagement cron error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 