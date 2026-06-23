// src/theme.js — APEX Daily Design Tokens
// Warm White + Professional Amber theme

export const Colors = {
  // Backgrounds
  bg: '#FAFAF8',           // Warm white main background
  surface: '#F4EFE6',      // Warm cream cards
  surfaceAlt: '#EDE7DB',   // Slightly deeper cream for contrast
  border: '#E0D8CC',       // Soft warm border
  borderLight: '#EDE7DB',  // Lighter border

  // Brand
  amber: '#C96A0A',        // Primary warm amber (professional, not garish)
  amberLight: '#F0A558',   // Light amber for tags/accents
  amberBg: '#FEF3E6',      // Amber tint background
  amberBorder: '#F5C896',  // Amber border

  // Semantic category colors
  work: '#C96A0A',         // Warm amber — work
  workBg: '#FEF3E6',
  focus: '#1D6FA4',        // Professional steel blue — focus
  focusBg: '#E8F2FA',
  health: '#1A7D5A',       // Deep forest green — health
  healthBg: '#E6F5EF',
  personal: '#7040B0',     // Refined purple — personal
  personalBg: '#F0EAF8',

  // Text
  textPrimary: '#1C1917',  // Rich near-black (warm toned)
  textSecondary: '#78716C', // Warm gray
  textMuted: '#A8A29E',    // Muted warm gray
  textOnAmber: '#FFFFFF',  // White on amber button

  // UI
  white: '#FFFFFF',
  shadow: 'rgba(28, 25, 23, 0.08)',
  shadowMd: 'rgba(28, 25, 23, 0.12)',
  success: '#1A7D5A',
  successBg: '#E6F5EF',
  nowLine: '#C96A0A',
};

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  display: 34,

  // Weights
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};
