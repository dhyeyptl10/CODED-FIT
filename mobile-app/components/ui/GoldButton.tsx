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
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'gold' | 'outline' | 'dark' | 'white';
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
  variant = 'gold',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: GoldButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    onPress();
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'gold':
        return styles.goldBtn;
      case 'outline':
        return styles.outlineBtn;
      case 'dark':
        return styles.darkBtn;
      case 'white':
        return styles.whiteBtn;
      default:
        return styles.goldBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'gold':
        return styles.goldText;
      case 'outline':
        return styles.outlineText;
      case 'dark':
        return styles.darkText;
      case 'white':
        return styles.whiteText;
      default:
        return styles.goldText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smSize;
      case 'md':
        return styles.mdSize;
      case 'lg':
        return styles.lgSize;
      default:
        return styles.mdSize;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'gold' || variant === 'dark' ? '#FFFFFF' : COLORS.gold}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  baseText: {
    fontFamily: 'Outfit',
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  smSize: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mdSize: {
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  lgSize: {
    paddingVertical: 17,
    paddingHorizontal: 28,
  },
  goldBtn: {
    backgroundColor: COLORS.gold,
    ...SHADOWS.gold,
  },
  goldText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  outlineText: {
    color: COLORS.goldDark,
    fontSize: 12,
  },
  darkBtn: {
    backgroundColor: COLORS.textPrimary,
    ...SHADOWS.card,
  },
  darkText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  whiteBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  whiteText: {
    color: COLORS.textPrimary,
    fontSize: 12,
  },
  disabled: {
    opacity: 0.45,
  },
});
