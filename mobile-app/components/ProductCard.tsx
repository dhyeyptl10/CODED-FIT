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

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 44) / 2;

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const router = useRouter();

  const handleCardPress = () => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    router.push(`/product/${product.id}`);
  };

  const handleQuickAddPress = (e: any) => {
    e.stopPropagation();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    if (onQuickAdd) {
      onQuickAdd(product);
    }
  };

  const discountPercent = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handleCardPress}
      style={styles.container}
    >
      {/* Product Image Container */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Funnel / Badge */}
        {product.badge && (
          <View style={styles.badgeWrap}>
            <Badge
              label={product.badge}
              variant={product.funnel === 'rtw' ? 'green' : 'gold'}
              size="sm"
            />
          </View>
        )}

        {/* Stock / Hype Indicator */}
        <View style={styles.hypePill}>
          <Text style={styles.hypeText}>🔥 {product.hypeRating}%</Text>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.fabricText} numberOfLines={1}>
          {product.fabric}
        </Text>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            <Text style={styles.price}>
              ₹{product.price.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.mrp}>
              ₹{product.mrp.toLocaleString('en-IN')}
            </Text>
          </View>
          <Text style={styles.discount}>{discountPercent}% OFF</Text>
        </View>

        {/* Quick Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleQuickAddPress}
          style={styles.quickAddBtn}
        >
          <Text style={styles.quickAddText}>+ ADD TO BAG</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  imageWrap: {
    width: '100%',
    height: 190,
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeWrap: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  hypePill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(18, 18, 18, 0.78)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  hypeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  details: {
    padding: 10,
  },
  fabricText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.goldDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  mrp: {
    fontSize: 10,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.success,
  },
  quickAddBtn: {
    backgroundColor: '#F8F6F0',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: 7,
    alignItems: 'center',
  },
  quickAddText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.8,
  },
});
