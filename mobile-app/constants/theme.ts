/**
 * CODED FIT — Clean Minimal Design System
 * Inspired by: Souled Store, Spreadshirt — clean white, light grey, crisp red accent
 */

export const COLORS = {
  // Backgrounds
  bg: '#FFFFFF',
  bgSecondary: '#F5F5F5',
  bgWarm: '#FAFAFA',

  // Cards & Surfaces
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardSecondary: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceActive: '#F0F0F0',

  // Borders — very light, clean
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  borderDark: '#D0D0D0',
  borderAccent: '#111111',
  borderMuted: '#EEEEEE',
  borderGold: 'rgba(220, 38, 38, 0.2)',
  borderGoldSolid: '#DC2626',

  // Typography — high contrast, readable
  textPrimary: '#111111',
  textSecondary: '#444444',
  textMuted: '#888888',
  textLight: '#AAAAAA',
  textDim: '#CCCCCC',

  // CODED FIT retail palette — red / white / sky blue
  gold: '#D71920',
  goldLight: '#FFE9EA',
  goldDark: '#B01016',
  goldMuted: 'rgba(215, 25, 32, 0.08)',
  goldGlow: 'rgba(220, 38, 38, 0.12)',

  // Primary Accent
  accent: '#D71920',
  sky: '#75C8EE',
  skySoft: '#EAF7FD',
  accentDark: '#111111',
  accentMuted: '#888888',
  accentSoft: 'rgba(220, 38, 38, 0.06)',
  accentGlow: 'rgba(220, 38, 38, 0.12)',

  // Status
  success: '#16A34A',
  successLight: 'rgba(22, 163, 74, 0.08)',
  successGlow: 'rgba(22, 163, 74, 0.16)',
  warning: '#D97706',
  warningLight: 'rgba(217, 119, 6, 0.08)',
  error: '#DC2626',
  errorLight: 'rgba(220, 38, 38, 0.08)',

  // Pure Bases
  white: '#FFFFFF',
  black: '#111111',
  overlay: 'rgba(0, 0, 0, 0.5)',
  glassDark: 'rgba(255, 255, 255, 0.96)',
};

export const FONTS = {
  display: 'System',
  body: 'System',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
};
