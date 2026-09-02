import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CartItem as CartItemType } from '../services/cart';
import { Badge } from './ui/Badge';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface CartItemProps {
  item: CartItemType;
  onUpdateQty: (productId: string, size: string, color: string | undefined, newQty: number) => void;
  onRemove: (productId: string, size: string, color?: string) => void;
}

export function CartItem({ item, onUpdateQty, onRemove }: CartItemProps) {
  const handleIncrease = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    onUpdateQty(item.product.id, item.size, item.selectedColor, item.qty + 1);
  };

  const handleDecrease = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    if (item.qty > 1) {
      onUpdateQty(item.product.id, item.size, item.selectedColor, item.qty - 1);
    } else {
      onRemove(item.product.id, item.size, item.selectedColor);
    }
  };

  const handleRemove = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (_) {}
    onRemove(item.product.id, item.size, item.selectedColor);
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <Image
        source={{ uri: item.product.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Item Details */}
      <View style={styles.details}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.product.name}
          </Text>
          <TouchableOpacity onPress={handleRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Funnel / Type Badge */}
        <View style={styles.metaRow}>
          <Badge
            label={item.product.funnel === 'rtw' ? '⚡ 24H DISPATCH' : '✂️ BESPOKE FIT'}
            variant={item.product.funnel === 'rtw' ? 'green' : 'gold'}
            size="sm"
          />
          <Text style={styles.sizeText}>
            Size: <Text style={styles.sizeVal}>{item.size}</Text>
          </Text>
          {item.selectedColor && (
            <Text style={styles.colorText}>
              · {item.selectedColor}
            </Text>
          )}
        </View>

        {/* Custom Body Metrics Pill if Bespoke */}
        {item.customMeasurements && (
          <View style={styles.bespokeMetrics}>
            <Text style={styles.bespokeText}>
              Custom 3D Fit: {item.customMeasurements.heightCm}cm · {item.customMeasurements.weightKg}kg
            </Text>
          </View>
        )}

        {/* Bottom Row: Price & Quantity Controls */}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ₹{(item.product.price * item.qty).toLocaleString('en-IN')}
          </Text>

          <View style={styles.qtyContainer}>
            <TouchableOpacity onPress={handleDecrease} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.qty}</Text>
            <TouchableOpacity onPress={handleIncrease} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  removeText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  sizeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sizeVal: {
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  colorText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  bespokeMetrics: {
    backgroundColor: '#FAF8F3',
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    borderRadius: RADIUS.sm,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  bespokeText: {
    fontSize: 9,
    color: COLORS.goldDark,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F5F0',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: 8,
  },
});
