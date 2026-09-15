/**
 * CODED-FIT / NOVA STREET — Monochrome Status Badge
 * Architectural clean sharp borders
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'white' | 'dark' | 'green' | 'red' | 'gold' | 'purple' | 'amber';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'white', size = 'md' }: BadgeProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'dark':
        return styles.badgeDark;
      case 'green':
        return styles.badgeGreen;
      case 'red':
        return styles.badgeRed;
      case 'amber':
        return styles.badgeAmber;
      case 'white':
      case 'gold':
      case 'purple':
      default:
        return styles.badgeWhite;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'dark':
        return styles.textDark;
      case 'green':
        return styles.textGreen;
      case 'red':
        return styles.textRed;
      case 'amber':
        return styles.textAmber;
      case 'white':
      case 'gold':
      case 'purple':
      default:
        return styles.textWhite;
    }
  };

  return (
    <View
      style={[
        styles.badgeBase,
        getBadgeStyle(),
        size === 'sm' ? styles.sizeSm : styles.sizeMd,
      ]}
    >
      <Text style={[styles.textBase, getTextStyle(), size === 'sm' && { fontSize: 8 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeBase: {
    borderRadius: RADIUS.sm, // 0 sharp edges
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sizeSm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  sizeMd: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  textBase: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  badgeWhite: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  textWhite: {
    color: '#000000',
  },

  badgeDark: {
    backgroundColor: '#111111',
    borderColor: '#333333',
  },
  textDark: {
    color: '#E5E5E5',
  },

  badgeGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
  },
  textGreen: {
    color: '#22C55E',
  },

  badgeRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  textRed: {
    color: '#EF4444',
  },

  badgeAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
  },
  textAmber: {
    color: '#F59E0B',
  },
});
