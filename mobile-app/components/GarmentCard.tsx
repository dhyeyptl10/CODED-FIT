/**
 * CODED-FIT / NOVA STREET — Garment Card Component for Virtual Try-On
 * Sharp Black & White Studio Card
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { YouCamGarment } from '../services/youcam';
import { Badge } from './ui/Badge';
import { COLORS, RADIUS } from '../constants/theme';

interface GarmentCardProps {
  garment: YouCamGarment;
  isSelected: boolean;
  onSelect: (garment: YouCamGarment) => void;
}

export function GarmentCard({ garment, isSelected, onSelect }: GarmentCardProps) {
  const handlePress = () => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    onSelect(garment);
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
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: garment.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {garment.tag && (
          <View style={styles.tagWrap}>
            <Badge label={garment.tag} variant={isSelected ? 'white' : 'dark'} size="sm" />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {garment.name}
        </Text>
        <Text style={styles.price}>₹{garment.price.toLocaleString('en-IN')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 105,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.sm, // 0 sharp edges
    overflow: 'hidden',
    marginRight: 10,
  },
  cardSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  imageWrap: {
    width: '100%',
    height: 120,
    backgroundColor: '#0D0D0D',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagWrap: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  info: {
    padding: 6,
  },
  name: {
    fontSize: 9,
    fontWeight: '700',
    color: '#E5E5E5',
    marginBottom: 2,
  },
  price: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
