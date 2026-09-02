/**
 * CODED-FIT / NOVA STREET — Product Details & Tailoring Customizer
 * Haute-Couture White Luxury Theme: Gallery, Size Selector, Fabric Details, Try-On Shortcut
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { PRODUCTS } from '../../services/products';
import { CartService } from '../../services/cart';
import { GoldButton } from '../../components/ui/GoldButton';
import { Badge } from '../../components/ui/Badge';
import { useShare } from '../../hooks/useShare';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { shareProduct } = useShare();

  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const handleAddToCart = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    await CartService.addItem(product, selectedSize, 1);
    Alert.alert(
      '✦ ADDED TO BAG',
      product.name + ' (Size ' + selectedSize + ') has been added to your shopping bag.',
      [
        { text: 'CONTINUE SHOPPING' },
        { text: 'VIEW BAG', onPress: () => router.push('/cart') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image Viewer */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[activeImageIdx] || product.images[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={() => shareProduct(product.name, product.price)}
            style={styles.shareBtn}
          >
            <Text style={{ fontSize: 16 }}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* Product Information */}
        <View style={styles.detailsContainer}>
          <View style={styles.topBadgeRow}>
            <Badge
              label={product.funnel === 'rtw' ? '⚡ 24H EXPRESS DISPATCH' : '✂️ UNIT-OF-ONE BESPOKE'}
              variant={product.funnel === 'rtw' ? 'green' : 'gold'}
            />
            <Text style={styles.hypeRating}>🔥 {product.hypeRating}% Demand</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.fabricSubtitle}>{product.fabric}</Text>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
            <Text style={styles.mrp}>₹{product.mrp.toLocaleString('en-IN')}</Text>
            <Text style={styles.discount}>
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
            </Text>
          </View>

          {/* Virtual Try-On Shortcut Banner */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/tryon')}
            style={styles.tryOnShortcut}
          >
            <Text style={{ fontSize: 24 }}>📸</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.tryOnShortcutTitle}>Try On in AI 3D Studio</Text>
              <Text style={styles.tryOnShortcutSub}>
                Preview exact fit on your body or supermodel with YouCam AI.
              </Text>
            </View>
            <Text style={styles.tryOnArrow}>→</Text>
          </TouchableOpacity>

          {/* Sizing Selection */}
          <View style={styles.sectionWrap}>
            <View style={styles.sizeHeader}>
              <Text style={styles.sectionTitle}>SELECT SIZING</Text>
              <Text style={styles.sizeGuideText}>Sizing Guide</Text>
            </View>

            <View style={styles.sizeRow}>
              {product.sizes.map(size => (
                <TouchableOpacity
                  key={size}
                  onPress={() => {
                    try { Haptics.selectionAsync(); } catch (_) {}
                    setSelectedSize(size);
                  }}
                  style={[
                    styles.sizePill,
                    selectedSize === size && styles.sizePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizePillText,
                      selectedSize === size && styles.sizePillTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>FABRIC & CRAFTSMANSHIP</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>TOTAL</Text>
          <Text style={styles.bottomPrice}>₹{product.price.toLocaleString('en-IN')}</Text>
        </View>
        <GoldButton
          title="ADD TO BAG ✦"
          onPress={handleAddToCart}
          size="lg"
          style={{ flex: 1, marginLeft: 16 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 380,
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  shareBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hypeRating: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.rust,
  },
  productName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    fontFamily: 'Cinzel',
    lineHeight: 26,
  },
  fabricSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.goldDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  mrp: {
    fontSize: 14,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.success,
  },
  tryOnShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F3',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginTop: 16,
    gap: 12,
  },
  tryOnShortcutTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tryOnShortcutSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tryOnArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.goldDark,
  },
  sectionWrap: {
    marginTop: 20,
  },
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sizeGuideText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.goldDark,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  sizePill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 50,
    alignItems: 'center',
  },
  sizePillActive: {
    backgroundColor: COLORS.textPrimary,
    borderColor: COLORS.textPrimary,
  },
  sizePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  sizePillTextActive: {
    color: '#FFFFFF',
  },
  descriptionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 6,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.card,
  },
  bottomLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
});
