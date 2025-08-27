// Simple Access Code Override - Foxy is always accessible, no UI restrictions
export const accessCodeManager = {
  setAccessCode: () => true,
  getCurrentAccessCode: () => null, // Return null to hide access status UI
  isAdminBypassEnabled: () => true,
  enableAdminBypass: () => {},
  disableAdminBypass: () => {},
  getUsageStats: () => ({}),
  canPerformAction: () => ({ allowed: true }),
  recordAction: () => {},
  getAccessStatus: () => ''
}; 