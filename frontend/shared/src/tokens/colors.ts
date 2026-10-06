/**
 * CODED FIT — Unified Design Tokens: Colors
 * Shared between Web (Tailwind / CSS variables) and Mobile (React Native)
 */

export const CODED_COLORS = {
  // Brand Base
  obsidian: '#0B0C0F',
  obsidianLight: '#14151A',
  obsidianCard: '#1A1C22',
  alabaster: '#FAF8F5',
  porcelain: '#FFFFFF',
  
  // Luxury & Bespoke Accents
  gold: '#C9A84C',
  goldLight: '#DFBE68',
  goldDark: '#A38435',
  
  // High-Energy & Alerts
  vermillion: '#E10600',
  vermillionGlow: '#FF4D40',
  
  // Neutrals & Structure
  borderLight: '#E2E2E6',
  borderDark: '#2A2D34',
  textPrimaryLight: '#0A0A0C',
  textSecondaryLight: '#585960',
  textPrimaryDark: '#F3F4F6',
  textSecondaryDark: '#9CA3AF',
  muted: '#8B8D96',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  error: '#EF4444'
} as const;

export type CodedColorKey = keyof typeof CODED_COLORS;
