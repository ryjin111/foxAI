// Access Code Override - Makes Foxy always accessible
export const accessCodeManager = {
  // Always return true - Foxy is open access
  setAccessCode: () => true,
  getCurrentAccessCode: () => ({
    code: 'FOXY_ACTIVE',
    level: 'premium' as const,
    type: 'permanent' as const,
    description: 'Foxy AI Agent - Full Access',
    permissions: {
      canPostTweets: true,
      canReplyToTweets: true,
      canViewAnalytics: true,
      canUseScheduler: true,
      maxTweetsPerDay: 999,
      maxRepliesPerDay: 999
    }
  }),
  isAdminBypassEnabled: () => true,
  enableAdminBypass: () => {},
  disableAdminBypass: () => {},
  getUsageStats: () => ({
    tweetsToday: 0,
    repliesToday: 0,
    lastActivity: new Date(),
    accessCode: 'FOXY_ACTIVE',
    tweetsPosted: 0,
    remainingTweets: 999,
    repliesSent: 0
  }),
  canPerformAction: (action?: string) => ({ allowed: true, message: 'Foxy is ready!' }),
  recordAction: (action?: string) => {},
  getAccessStatus: () => 'Foxy AI Agent - Full Access'
}; 