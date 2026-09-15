/**
 * CODED-FIT / NOVA STREET — High-Fashion Monochrome Luxury Button
 * Clean contrast, sharp architectural edges (non-curved), haptic feedback
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface LuxuryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function GoldButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: LuxuryButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return styles.btnOutline;
      case 'secondary':
        return styles.btnSecondary;
      case 'ghost':
        return styles.btnGhost;
      case 'dark':
        return styles.btnDark;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      case 'secondary':
        return styles.textSecondary;
      case 'ghost':
        return styles.textGhost;
      case 'dark':
        return styles.textDark;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.btnBase,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#000000' : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.textBase, getTextStyles(), textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm, // 0 sharp edges
    gap: 8,
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  sizeLg: {
    paddingVertical: 18,
    paddingHorizontal: 28,
  },

  // Variants
  btnPrimary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  btnOutline: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  btnSecondary: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#333333',
  },
  btnDark: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#262626',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  btnDisabled: {
    opacity: 0.35,
  },

  // Text
  textBase: {
    fontFamily: FONTS.body,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  textPrimary: {
    color: '#000000',
  },
  textOutline: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#E5E5E5',
  },
  textGhost: {
    color: '#A3A3A3',
  },
});
