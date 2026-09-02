/**
 * CODED-FIT / NOVA STREET — Mobile Design System & Theme
 * Haute-Couture White Luxury Palette: Pristine White, Warm Alabaster, Deep Onyx & Champagne Gold
 */

export const COLORS = {
  // Backgrounds & Canvas
  bg: '#FFFFFF',
  bgSecondary: '#FAF8F5',
  bgWarm: '#F5F2EB',
  
  // Cards & Surfaces
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardSecondary: '#F7F5F0',
  surface: '#F4F1EA',
  surfaceActive: '#EDE9E0',

  // Borders
  border: '#E8E4DC',
  borderLight: '#F0ECE4',
  borderDark: '#D5D0C6',
  borderGold: 'rgba(201, 168, 76, 0.45)',
  borderGoldSolid: '#C9A84C',
  
  // Text Colors
  textPrimary: '#121212',
  textSecondary: '#4A4640',
  textMuted: '#858077',
  textLight: '#A39E95',
  
  // Signature Gold Accents
  gold: '#C9A84C',
  goldLight: '#E2C979',
  goldDark: '#8C702E',
  goldSoft: '#FBF8EF',
  goldGlow: 'rgba(201, 168, 76, 0.18)',
  
  // Fashion Vibrants & Accents
  purpleVibrant: '#6D28D9',
  purpleLight: '#F5F3FF',
  purpleDark: '#4C1D95',
  
  // Status Colors
  success: '#059669',
  successLight: '#ECFDF5',
  successGlow: 'rgba(5, 150, 105, 0.15)',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  rust: '#B85C38',
  
  // Pure Bases
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(18, 18, 18, 0.65)',
  glassWhite: 'rgba(255, 255, 255, 0.88)',
};

export const FONTS = {
  display: 'Cinzel',
  body: 'Outfit',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#1A1815',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#1A1815',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#1A1815',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  gold: {
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  vibrant: {
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
};
