import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'gold' | 'green' | 'rust' | 'purple' | 'muted' | 'outline' | 'white';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  label,
  variant = 'gold',
  size = 'md',
  style,
  textStyle,
}: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'gold':
        return styles.goldBadge;
      case 'green':
        return styles.greenBadge;
      case 'rust':
        return styles.rustBadge;
      case 'purple':
        return styles.purpleBadge;
      case 'white':
        return styles.whiteBadge;
      case 'outline':
        return styles.outlineBadge;
      case 'muted':
      default:
        return styles.mutedBadge;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'gold':
        return styles.goldText;
      case 'green':
        return styles.greenText;
      case 'rust':
        return styles.rustText;
      case 'purple':
        return styles.purpleText;
      case 'white':
        return styles.whiteText;
      case 'outline':
        return styles.outlineText;
      case 'muted':
      default:
        return styles.mutedText;
    }
  };

  return (
    <View
      style={[
        styles.base,
        getVariantStyle(),
        size === 'sm' ? styles.sm : styles.md,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          getTextStyle(),
          size === 'sm' ? styles.smText : styles.mdText,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  smText: {
    fontSize: 9,
  },
  mdText: {
    fontSize: 10,
  },

  goldBadge: {
    backgroundColor: '#FBF8EE',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  goldText: {
    color: COLORS.goldDark,
  },

  greenBadge: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  greenText: {
    color: COLORS.success,
  },

  rustBadge: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  rustText: {
    color: COLORS.rust,
  },

  purpleBadge: {
    backgroundColor: COLORS.purpleLight,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  purpleText: {
    color: COLORS.purpleVibrant,
  },

  whiteBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  whiteText: {
    color: COLORS.textPrimary,
  },

  outlineBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outlineText: {
    color: COLORS.textSecondary,
  },

  mutedBadge: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  mutedText: {
    color: COLORS.textMuted,
  },
});
