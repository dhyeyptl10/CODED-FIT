/**
 * CODED-FIT / NOVA STREET — Product Card Component
 * Ultra-Luxury Editorial Card with Wishlist Heart, Gold Quick Add, and Discount Badges
 */

import React, { useState } from 'react';
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
  cardWidth?: number;
}

export function ProductCard({ product, onQuickAdd, cardWidth }: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const effectiveWidth = cardWidth || CARD_WIDTH;
  const discountPct = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

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

  const handleToggleWishlist = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    setIsWishlisted(!isWishlisted);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      style={[styles.cardContainer, { width: effectiveWidth }]}
    >
      {/* Product Image */}
      <View style={[styles.imageWrap, { height: effectiveWidth * 1.35 }]}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Top-Left Badges */}
        <View style={styles.badgeOverlay}>
          <Badge
            label={product.funnel === 'ready-to-wear' ? '24H RTW' : 'BESPOKE'}
            variant={product.funnel === 'ready-to-wear' ? 'white' : 'dark'}
            size="sm"
          />
          {discountPct > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPct}% OFF</Text>
            </View>
          )}
        </View>

        {/* Top-Right Wishlist Heart Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggleWishlist}
          style={[styles.wishlistBtn, isWishlisted && styles.wishlistBtnActive]}
        >
          <Text style={[styles.wishlistIcon, isWishlisted && styles.wishlistIconActive]}>
            {isWishlisted ? '✦' : '✧'}
          </Text>
        </TouchableOpacity>

        {/* Quick Add Button */}
        <TouchableOpacity
          activeOpacity={0.85}
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
          {product.mrp > product.price && (
            <Text style={styles.mrpText}>₹{product.mrp.toLocaleString('en-IN')}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E7EF',
    borderRadius: 5,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrap: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#F1F1F3',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  discountBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderWidth: 1,
    borderColor: '#E2E2E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistBtnActive: {
    backgroundColor: '#FFE5EA',
    borderColor: '#C9002D',
  },
  wishlistIcon: {
    color: '#15151B',
    fontSize: 16,
    lineHeight: 18,
  },
  wishlistIconActive: {
    color: '#C9002D',
  },
  quickAddBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#050505',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAddText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  infoWrap: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  fabricText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#6D6D76',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#111116',
    lineHeight: 16,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111116',
    letterSpacing: 0.5,
  },
  mrpText: {
    fontSize: 10.5,
    color: '#666666',
    textDecorationLine: 'line-through',
  },
});
