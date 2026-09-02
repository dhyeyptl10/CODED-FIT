/**
 * CODED-FIT / NOVA STREET — Mobile Shopping Bag & Fast Checkout
 * Haute-Couture White Luxury Theme: Items List, Delivery ETA, Biometric / UPI Checkout
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { CartService, CartItem as CartItemType } from '../../services/cart';
import { CartItem } from '../../components/CartItem';
import { GoldButton } from '../../components/ui/GoldButton';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [promoCode, setPromoCode] = useState<string>('FIRST500');
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const { authenticateBiometric } = useAuth();
  const { location } = useLocation();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const items = await CartService.getCart();
    setCart(items);
  };

  const handleUpdateQty = async (productId: string, size: string, color: string | undefined, newQty: number) => {
    await CartService.updateQty(productId, size, color, newQty);
    loadCart();
  };

  const handleRemove = async (productId: string, size: string, color?: string) => {
    await CartService.removeItem(productId, size, color);
    loadCart();
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const discount = subtotal > 1999 ? 500 : 0;
  const shipping = subtotal > 999 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleCheckout = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (_) {}

    setIsCheckingOut(true);
    const authSuccess = await authenticateBiometric();

    setIsCheckingOut(false);
    if (authSuccess) {
      await CartService.clearCart();
      loadCart();
      Alert.alert(
        '✦ ORDER CONFIRMED',
        'Your bespoke order has been placed! Our master tailors in Ahmedabad will begin precision crafting immediately.',
        [{ text: 'VIEW UR PICKS', onPress: () => router.push('/dashboard') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>SHOPPING BAG</Text>
        <Text style={styles.subTitle}>
          {cart.reduce((sum, item) => sum + item.qty, 0)} Items · Free Shipping Above ₹999
        </Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 44, marginBottom: 12 }}>👜</Text>
          <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
          <Text style={styles.emptySub}>
            Explore our curated releases or design a bespoke tailored garment in the AI Try-On studio.
          </Text>
          <GoldButton
            title="EXPLORE COLLECTION ✦"
            onPress={() => router.push('/shop')}
            size="md"
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Delivery ETA Pill */}
          {location && (
            <View style={styles.etaCard}>
              <Text style={{ fontSize: 16 }}>🚚</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.etaTitle}>Delivering to {location.city}</Text>
                <Text style={styles.etaSub}>{location.deliveryEstimate.dispatchBadge}</Text>
              </View>
              <Badge label="EXPRESS" variant="green" size="sm" />
            </View>
          )}

          {/* Cart Items List */}
          <View style={styles.itemsList}>
            {cart.map((item, idx) => (
              <CartItem
                key={item.product.id + '_' + item.size + '_' + idx}
                item={item}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
              />
            ))}
          </View>

          {/* Order Bill Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>PRICE DETAILS</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bag Total</Text>
              <Text style={styles.summaryVal}>₹{subtotal.toLocaleString('en-IN')}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: COLORS.success }]}>
                  Promo Applied ({promoCode})
                </Text>
                <Text style={[styles.summaryVal, { color: COLORS.success }]}>
                  - ₹{discount.toLocaleString('en-IN')}
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Standard Shipping</Text>
              <Text style={[styles.summaryVal, { color: shipping === 0 ? COLORS.success : COLORS.textPrimary }]}>
                {shipping === 0 ? 'FREE' : '₹' + shipping}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>TOTAL PAYABLE</Text>
              <Text style={styles.totalVal}>₹{total.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <GoldButton
              title="PROCEED TO 1-TOUCH CHECKOUT ✦"
              onPress={handleCheckout}
              loading={isCheckingOut}
              size="lg"
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
  },
  subTitle: {
    fontSize: 9,
    color: COLORS.goldDark,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  etaTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  etaSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemsList: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  summaryCard: {
    backgroundColor: '#FAF8F5',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.goldDark,
  },
});
