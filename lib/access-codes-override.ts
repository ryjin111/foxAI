// Simple Access Code Override - Foxy is always accessible, no UI restrictions
export const accessCodeManager = {
  setAccessCode: (code?: string) => true,
  getCurrentAccessCode: () => null, // Return null to hide access status UI
  isAdminBypassEnabled: () => true,
  enableAdminBypass: () => {},
  disableAdminBypass: () => {},
  getUsageStats: () => ({}),
  canPerformAction: (action?: string) => ({ allowed: true }),
  recordAction: (action?: string) => {},
  getAccessStatus: () => '',
  getRestrictionMessage: () => 'Foxy has full access!'
}; 