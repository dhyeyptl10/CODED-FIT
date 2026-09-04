/**
 * CODED-FIT / NOVA STREET — Product Card Component
 * Sharp Black & White Minimalist Luxury
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Product } from '../services/products';
import { Badge } from './ui/Badge';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 44) / 2;

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    router.push('/product/' + product.id as any);
  };

  const handleQuickAdd = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    if (onQuickAdd) onQuickAdd(product);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      style={styles.cardContainer}
    >
      {/* Product Image */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Top Badges */}
        <View style={styles.badgeOverlay}>
          <Badge
            label={product.funnel === 'rtw' ? '24H' : 'BESPOKE'}
            variant={product.funnel === 'rtw' ? 'white' : 'dark'}
            size="sm"
          />
        </View>

        {/* Quick Add Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleQuickAdd}
          style={styles.quickAddBtn}
        >
          <Text style={styles.quickAddText}>+ ADD</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoWrap}>
        <Text style={styles.fabricText} numberOfLines={1}>
          {product.fabric}
        </Text>
        <Text style={styles.nameText} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₹{product.price.toLocaleString('en-IN')}</Text>
          <Text style={styles.mrpText}>₹{product.mrp.toLocaleString('en-IN')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.sm, // 0 sharp edges
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  imageWrap: {
    width: '100%',
    height: CARD_WIDTH * 1.35,
    position: 'relative',
    backgroundColor: '#0D0D0D',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  quickAddBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
  },
  quickAddText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.5,
  },
  infoWrap: {
    padding: 10,
  },
  fabricText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#A3A3A3',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  nameText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 15,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  mrpText: {
    fontSize: 10,
    color: '#737373',
    textDecorationLine: 'line-through',
  },
});
