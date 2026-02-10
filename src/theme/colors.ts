export const colors = {
  // Primary
  navy: '#1a2744',
  navyLight: '#243356',
  navyDark: '#111b30',

  // Accent
  gold: '#c4973d',
  goldLight: '#d4ad5a',
  goldDark: '#a67d2e',

  // Backgrounds
  warmGrey: '#fafaf9',
  white: '#ffffff',
  offWhite: '#f5f5f4',

  // Borders
  border: '#e8e6e3',
  borderLight: '#f0eeeb',

  // Text
  textPrimary: '#1a1a1a',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textWhite: '#ffffff',
  textGold: '#c4973d',

  // Status
  success: '#22c55e',
  successLight: '#dcfce7',
  successDark: '#16a34a',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  warningDark: '#d97706',
  error: '#ef4444',
  errorLight: '#fee2e2',
  errorDark: '#dc2626',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  infoDark: '#2563eb',

  // Frosted glass
  frostedWhite: 'rgba(255, 255, 255, 0.15)',
  frostedWhiteBorder: 'rgba(255, 255, 255, 0.25)',
  frostedWhiteMedium: 'rgba(255, 255, 255, 0.2)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
