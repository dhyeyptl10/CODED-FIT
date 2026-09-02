import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { YouCamGarment } from '../services/youcam';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface GarmentCardProps {
  garment: YouCamGarment;
  isSelected: boolean;
  onSelect: () => void;
}

export function GarmentCard({ garment, isSelected, onSelect }: GarmentCardProps) {
  const handlePress = () => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    onSelect();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[
        styles.card,
        isSelected && styles.cardSelected,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: garment.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {garment.tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{garment.tag}</Text>
          </View>
        )}
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedText}>✓ FITTED</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {garment.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{garment.price.toLocaleString('en-IN')}</Text>
          <Text style={styles.fabric} numberOfLines={1}>
            {garment.fabric.split(' ')[0]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 12,
    ...SHADOWS.card,
  },
  cardSelected: {
    borderColor: COLORS.gold,
    backgroundColor: '#FCFAF5',
    ...SHADOWS.gold,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(18, 18, 18, 0.82)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.sm,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: COLORS.gold,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.sm,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  details: {
    padding: 8,
  },
  name: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.goldDark,
  },
  fabric: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
});
