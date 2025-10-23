/**
 * LeanSubs Brand Constants
 * Central location for brand colors, typography, and design tokens
 * Reference: BRAND_STYLEGUIDE.md
 */

export const BRAND_COLORS = {
  primary: '#4CA9FF',
  secondary: '#B794F4',
  accent: '#334155',
  success: '#22C55E',
  warning: '#FDBA74',
  danger: '#F87171',
  light: '#F1F5F9',
  dark: '#0F172A',
} as const

export const BRAND_FONTS = {
  heading: "'Poppins', 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const

export const BRAND_RADII = {
  sm: '0.5rem',
  base: '0.75rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
} as const

export const BRAND_SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
} as const

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRING: 'expiring',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PAUSED: 'paused',
} as const

export const SUBSCRIPTION_STATUS_COLORS = {
  [SUBSCRIPTION_STATUS.ACTIVE]: 'success.500',
  [SUBSCRIPTION_STATUS.EXPIRING]: 'warning.300',
  [SUBSCRIPTION_STATUS.EXPIRED]: 'danger.400',
  [SUBSCRIPTION_STATUS.CANCELLED]: 'danger.400',
  [SUBSCRIPTION_STATUS.PAUSED]: 'accent.500',
} as const

export const SUBSCRIPTION_STATUS_LABELS = {
  [SUBSCRIPTION_STATUS.ACTIVE]: 'Active',
  [SUBSCRIPTION_STATUS.EXPIRING]: 'Expiring Soon',
  [SUBSCRIPTION_STATUS.EXPIRED]: 'Expired',
  [SUBSCRIPTION_STATUS.CANCELLED]: 'Cancelled',
  [SUBSCRIPTION_STATUS.PAUSED]: 'Paused',
} as const

export const BREAKPOINTS = {
  base: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

