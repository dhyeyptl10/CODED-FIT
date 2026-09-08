/**
 * CODED-FIT / NOVA STREET — Mobile Design System & Theme
 * Ultra-Luxury Haute-Couture Theme: Pitch Black, Regal Gold (#D4AF37), Pure White & Editorial Contrast
 */

export const COLORS = {
  // Backgrounds & Canvas
  bg: '#F7F7FC',
  bgSecondary: '#FFFFFF',
  bgWarm: '#F0F0F8',
  
  // Cards & Surfaces (Sharp & Sleek Monochromatic with Gold Subtle Accents)
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardSecondary: '#F0F0F8',
  surface: '#FFFFFF',
  surfaceActive: '#E8E8F2',

  // Borders
  border: '#E3E3EC',
  borderLight: '#D7D7E2',
  borderDark: '#C8C8D4',
  borderAccent: '#0B0B0D',
  borderMuted: '#ECECF4',
  borderGold: 'rgba(201, 0, 45, 0.25)',
  borderGoldSolid: '#C9002D',
  
  // High-Contrast Typography
  textPrimary: '#0B0B0D',
  textSecondary: '#35353C',
  textMuted: '#6D6D76',
  textLight: '#85858D',
  textDim: '#A0A0AA',

  // True Regal Gold Accents
  gold: '#C9002D',
  goldLight: '#FFDCE4',
  goldDark: '#9E0024',
  goldMuted: 'rgba(201, 0, 45, 0.10)',
  goldGlow: 'rgba(201, 0, 45, 0.18)',
  
  // Primary Luxury Accents
  accent: '#C9002D',
  accentDark: '#0B0B0D',
  accentMuted: '#70707A',
  accentSoft: 'rgba(201, 0, 45, 0.08)',
  accentGlow: 'rgba(201, 0, 45, 0.2)',
  
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
  overlay: 'rgba(11, 11, 13, 0.82)',
  glassDark: 'rgba(255, 255, 255, 0.96)',
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
