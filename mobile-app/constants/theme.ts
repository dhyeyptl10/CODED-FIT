/**
 * CODED-FIT / NOVA STREET — Mobile Design System & Theme
 * Ultra-Luxury Haute-Couture Theme: Pitch Black, Regal Gold (#D4AF37), Pure White & Editorial Contrast
 */

export const COLORS = {
  // Backgrounds & Canvas
  bg: '#000000',
  bgSecondary: '#070707',
  bgWarm: '#0D0D0D',
  
  // Cards & Surfaces (Sharp & Sleek Monochromatic with Gold Subtle Accents)
  card: '#111111',
  cardElevated: '#171717',
  cardSecondary: '#1C1C1C',
  surface: '#141414',
  surfaceActive: '#262626',

  // Borders
  border: '#222222',
  borderLight: '#333333',
  borderDark: '#141414',
  borderAccent: '#FFFFFF',
  borderMuted: '#1A1A1A',
  borderGold: 'rgba(212, 175, 55, 0.35)',
  borderGoldSolid: '#D4AF37',
  
  // High-Contrast Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#F5F5F0',
  textMuted: '#999999',
  textLight: '#737373',
  textDim: '#525252',

  // True Regal Gold Accents
  gold: '#D4AF37',
  goldLight: '#F5E6A3',
  goldDark: '#A8892C',
  goldMuted: 'rgba(212, 175, 55, 0.12)',
  goldGlow: 'rgba(212, 175, 55, 0.28)',
  
  // Primary Luxury Accents
  accent: '#D4AF37',
  accentDark: '#000000',
  accentMuted: '#404040',
  accentSoft: 'rgba(212, 175, 55, 0.08)',
  accentGlow: 'rgba(212, 175, 55, 0.2)',
  
  // Status Colors
  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.12)',
  successGlow: 'rgba(34, 197, 94, 0.25)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.12)',
  
  // Pure Bases
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.82)',
  glassDark: 'rgba(10, 10, 10, 0.94)',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.85,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
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
