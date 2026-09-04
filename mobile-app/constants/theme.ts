/**
 * CODED-FIT / NOVA STREET — Mobile Design System & Theme
 * Haute-Couture Black & White Luxury: Pure Pitch Black, Crisp White, Minimalist Monochromatic Architecture & Sharp Edges
 */

export const COLORS = {
  // Backgrounds & Canvas
  bg: '#000000',
  bgSecondary: '#0A0A0A',
  bgWarm: '#121212',
  
  // Cards & Surfaces (Sharp Monochromatic Luxury)
  card: '#111111',
  cardElevated: '#171717',
  cardSecondary: '#1C1C1C',
  surface: '#141414',
  surfaceActive: '#262626',

  // Minimalist Borders
  border: '#262626',
  borderLight: '#3A3A3A',
  borderDark: '#171717',
  borderAccent: '#FFFFFF',
  borderMuted: '#1E1E1E',
  
  // High-Contrast Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E5E5',
  textMuted: '#A3A3A3',
  textLight: '#737373',
  textDim: '#525252',
  
  // Primary Luxury Accents (Pure High-Contrast White & Deep Black)
  accent: '#FFFFFF',
  accentDark: '#000000',
  accentMuted: '#404040',
  accentSoft: 'rgba(255, 255, 255, 0.08)',
  accentGlow: 'rgba(255, 255, 255, 0.15)',
  
  // Status Colors (Subtle & High-Contrast)
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
  glassDark: 'rgba(17, 17, 17, 0.94)',
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

// Clean, straight, sharp edges (no round bubbly curves)
export const RADIUS = {
  sm: 0,
  md: 0,
  lg: 0,
  xl: 0,
  xxl: 0,
  full: 0,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
};
