/**
 * CODED-FIT / NOVA STREET — Mobile Home Screen
 * Haute-Couture White Luxury: Brand Hero, Split Men/Women CTAs, Location-Aware ETA, Featured Collection & Tech Features
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FEATURED_PRODUCTS } from '../../services/products';
import { CartService } from '../../services/cart';
import { ProductCard } from '../../components/ProductCard';
import { GoldButton } from '../../components/ui/GoldButton';
import { Badge } from '../../components/ui/Badge';
import { useLocation } from '../../hooks/useLocation';
import { useShare } from '../../hooks/useShare';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const { shareWithFriend } = useShare();

  const handleQuickAdd = async (product: any) => {
    await CartService.addItem(product, 'M', 1);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Top Announcement Marquee Bar ── */}
      <View style={styles.topMarquee}>
        <Text style={styles.marqueeText} numberOfLines={1}>
          ✦ DUAL-FUNNEL HYBRID FASHION ✦ 24H DISPATCH & BESPOKE TAILORING ✦
        </Text>
      </View>

      {/* ── Brand Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoMain}>
            NOVA <Text style={styles.logoGold}>STREET</Text>
          </Text>
          <Text style={styles.logoSub}>HYBRID CUSTOM-CURATED APPAREL · 2026</Text>
        </View>

        {/* Live Location Delivery Badge */}
        {location && (
          <View style={styles.locationPill}>
            <Text style={styles.locationDot}>●</Text>
            <Text style={styles.locationCity}>
              {location.city} ({location.deliveryEstimate.dispatchBadge.split(' ')[1] || '24H'})
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HERO BANNER: Split Men / Women ── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>WHERE EXPERT DESIGN MEETS YOUR EXACT FIT</Text>
          <Text style={styles.heroSubtitle}>
            Ahmedabad GOTS organic cottons fused with generative AI try-on and unit-of-one tailoring.
          </Text>

          <View style={styles.heroSplitRow}>
            {/* Shop Men Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/shop')}
              style={styles.heroModelCard}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85',
                }}
                style={styles.heroModelImage}
              />
              <View style={styles.heroCardOverlay}>
                <Badge label="COLLECTION" variant="gold" size="sm" />
                <Text style={styles.heroCardTitle}>MEN</Text>
                <Text style={styles.heroCardLink}>Shop Releases →</Text>
              </View>
            </TouchableOpacity>

            {/* Shop Women Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/shop')}
              style={styles.heroModelCard}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85',
                }}
                style={styles.heroModelImage}
              />
              <View style={styles.heroCardOverlay}>
                <Badge label="COLLECTION" variant="gold" size="sm" />
                <Text style={styles.heroCardTitle}>WOMEN</Text>
                <Text style={styles.heroCardLink}>Shop Releases →</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CTA BANNER: AI Try-On Studio ── */}
        <View style={styles.tryOnPromoCard}>
          <View style={styles.tryOnPromoContent}>
            <Badge label="NEW · AI VIRTUAL TRY-ON" variant="purple" size="sm" />
            <Text style={styles.tryOnPromoTitle}>
              Change Clothes in 1-Click with Generative AI
            </Text>
            <Text style={styles.tryOnPromoSub}>
              Preview bespoke garments on AI supermodels or your live camera photo before you buy.
            </Text>
            <GoldButton
              title="ENTER AI TRY-ON STUDIO ✦"
              onPress={() => router.push('/tryon')}
              size="md"
              style={{ alignSelf: 'flex-start', marginTop: 12 }}
            />
          </View>
        </View>

        {/* ── FEATURED COLLECTION GRID ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>FEATURED RELEASES</Text>
            <Text style={styles.sectionSub}>Dual-Funnel: RTW 24H Dispatch & Bespoke Tailoring</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/shop')}>
            <Text style={styles.seeAllText}>VIEW ALL →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {FEATURED_PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </View>

        {/* ── BRAND PILLARS ── */}
        <View style={styles.pillarsSection}>
          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>⚡</Text>
            <Text style={styles.pillarTitle}>24H EXPRESS DISPATCH</Text>
            <Text style={styles.pillarSub}>
              Standard fits ship in under 24 hours directly from Ahmedabad.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>🌿</Text>
            <Text style={styles.pillarTitle}>GOTS ORGANIC COTTON</Text>
            <Text style={styles.pillarSub}>
              Pure 280-450 GSM heavyweight textiles crafted with zero compromise.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>✂️</Text>
            <Text style={styles.pillarTitle}>UNIT-OF-ONE BESPOKE</Text>
            <Text style={styles.pillarSub}>
              Precision laser-tailored to your exact 3D body measurements.
            </Text>
          </View>
        </View>

        {/* ── SHARE APP WITH A FRIEND PROMO ── */}
        <View style={styles.sharePromoCard}>
          <Text style={styles.sharePromoTitle}>GIVE ₹500, GET ₹500</Text>
          <Text style={styles.sharePromoSub}>
            Share Nova Street with a friend and earn credits toward bespoke apparel.
          </Text>
          <GoldButton
            title="SHARE WITH CONTACTS 📤"
            variant="outline"
            onPress={shareWithFriend}
            size="md"
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topMarquee: {
    backgroundColor: '#FAF8F0',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 5,
    alignItems: 'center',
  },
  marqueeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.goldDark,
    letterSpacing: 1.2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoMain: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 2,
    fontFamily: 'Cinzel',
  },
  logoGold: {
    color: COLORS.goldDark,
  },
  logoSub: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  locationDot: {
    fontSize: 8,
    color: COLORS.success,
  },
  locationCity: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.success,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  heroSection: {
    padding: 16,
    backgroundColor: '#FAF8F5',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    lineHeight: 26,
    fontFamily: 'Cinzel',
  },
  heroSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 16,
  },
  heroSplitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroModelCard: {
    flex: 1,
    height: 220,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  heroModelImage: {
    width: '100%',
    height: '100%',
  },
  heroCardOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.35)',
    padding: 12,
    justifyContent: 'space-between',
  },
  heroCardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    fontFamily: 'Cinzel',
  },
  heroCardLink: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  tryOnPromoCard: {
    margin: 16,
    padding: 20,
    borderRadius: RADIUS.xl,
    backgroundColor: '#FAF8F3',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    ...SHADOWS.card,
  },
  tryOnPromoContent: {},
  tryOnPromoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    marginTop: 8,
    lineHeight: 24,
  },
  tryOnPromoSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.2,
  },
  sectionSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.goldDark,
    letterSpacing: 0.5,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  pillarsSection: {
    padding: 16,
    gap: 10,
  },
  pillarCard: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 14,
  },
  pillarIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  pillarTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  pillarSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },

  sharePromoCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    padding: 18,
    alignItems: 'center',
    textAlign: 'center',
    ...SHADOWS.card,
  },
  sharePromoTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  sharePromoSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
