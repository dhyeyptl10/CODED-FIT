/**
 * CODED FIT — Home Screen
 * Clean minimal design: white background, crisp typography, red accent
 * Inspired by Souled Store / Spreadshirt aesthetic
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FEATURED_PRODUCTS, PRODUCTS, Product } from '../../services/products';
import { CartService } from '../../services/cart';
import { ProductCard } from '../../components/ProductCard';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

const { width: W } = Dimensions.get('window');

const HERO_SLIDES = [
  {
    id: '1',
    title: 'NEW SEASON\nAW26',
    sub: 'Sculptural Silhouettes',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    cta: 'SHOP NOW',
    link: '/shop',
  },
  {
    id: '2',
    title: 'MENSWEAR\nEDIT',
    sub: 'Heavyweight GOTS Cotton',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    cta: 'EXPLORE',
    link: '/shop',
  },
  {
    id: '3',
    title: 'WOMEN\'S\nATELIER',
    sub: 'Fluid Silks & Tailoring',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    cta: 'VIEW ALL',
    link: '/shop',
  },
];

const CATEGORIES = [
  { id: '1', label: 'New In', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80' },
  { id: '2', label: 'Men', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { id: '3', label: 'Women', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80' },
  { id: '4', label: 'Kids', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&q=80' },
  { id: '5', label: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&q=80' },
  { id: '6', label: 'Studio', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&q=80' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<ScrollView>(null);
  const [cartCount, setCartCount] = useState(0);

  // Auto-scroll hero
  useEffect(() => {
    const t = setInterval(() => {
      setActiveSlide(cur => {
        const next = (cur + 1) % HERO_SLIDES.length;
        heroRef.current?.scrollTo({ x: next * W, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Cart badge
  useEffect(() => {
    const load = async () => setCartCount(await CartService.getItemCount());
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  const handleQuickAdd = async (p: Product) => {
    await CartService.addItem(p, p.sizes[0] || 'M', 1);
    setCartCount(await CartService.getItemCount());
  };

  const featuredProducts = PRODUCTS.slice(0, 6);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>CODED FIT</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.cartTouch}>
          <Text style={styles.cartIcon}>◻</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* ── Hero Carousel ── */}
        <View style={styles.heroWrap}>
          <ScrollView
            ref={heroRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={e => {
              setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / W));
            }}
          >
            {HERO_SLIDES.map(slide => (
              <TouchableOpacity
                key={slide.id}
                activeOpacity={0.95}
                onPress={() => router.push(slide.link as any)}
                style={styles.heroSlide}
              >
                <Image source={{ uri: slide.image }} style={styles.heroImage} />
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroTitle}>{slide.title}</Text>
                  <Text style={styles.heroSub}>{slide.sub}</Text>
                  <View style={styles.heroCta}>
                    <Text style={styles.heroCtaText}>{slide.cta} →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Dots */}
          <View style={styles.dots}>
            {HERO_SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, activeSlide === i && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* ── Promo Banner ── */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoBannerText}>FREE SHIPPING ON ORDERS ABOVE ₹999 · USE CODE: FITFIRST</Text>
        </View>

        {/* ── Category Strip ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SHOP BY CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push('/(tabs)/shop')}
                style={styles.catItem}
              >
                <View style={styles.catImageWrap}>
                  <Image source={{ uri: cat.image }} style={styles.catImage} />
                </View>
                <Text style={styles.catLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Featured Products ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>NEW ARRIVALS</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productGrid}>
            {featuredProducts.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.productCard}
                onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })}
                activeOpacity={0.85}
              >
                <View style={styles.productImageWrap}>
                  <Image source={{ uri: p.images[0] }} style={styles.productImage} />
                  {p.badge && (
                    <View style={styles.productBadge}>
                      <Text style={styles.productBadgeText}>{p.badge}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.productFabric} numberOfLines={1}>{p.fabric}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{p.price.toLocaleString()}</Text>
                    {p.mrp > p.price && (
                      <Text style={styles.mrp}>₹{p.mrp.toLocaleString()}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleQuickAdd(p)}
                  >
                    <Text style={styles.addBtnText}>ADD TO BAG</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── AI Try-On Banner ── */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => router.push('/(tabs)/tryon')}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' }}
            style={styles.aiCardImage}
          />
          <View style={styles.aiCardOverlay}>
            <Text style={styles.aiCardTag}>AI POWERED</Text>
            <Text style={styles.aiCardTitle}>Virtual Try-On Studio</Text>
            <Text style={styles.aiCardSub}>Try clothes before you buy — powered by AI body scan</Text>
            <View style={styles.aiCardBtn}>
              <Text style={styles.aiCardBtnText}>TRY IT NOW →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Design Your Own ── */}
        <TouchableOpacity
          style={styles.studioCard}
          onPress={() => router.push('/(tabs)/studio')}
          activeOpacity={0.9}
        >
          <Text style={styles.studioTag}>DESIGN STUDIO</Text>
          <Text style={styles.studioTitle}>Create Your Own Garment</Text>
          <Text style={styles.studioSub}>Pick fabric, add text, choose colors — your way</Text>
          <Text style={styles.studioLink}>Start designing →</Text>
        </TouchableOpacity>

        {/* ── Trust Pillars ── */}
        <View style={styles.pillars}>
          {[
            { icon: '⚡', title: '24H Dispatch', sub: 'Ships from Ahmedabad' },
            { icon: '↩', title: 'Easy Returns', sub: '15-day free returns' },
            { icon: '✓', title: '100% Genuine', sub: 'GOTS Certified Cotton' },
            { icon: '◈', title: 'AI Fit Match', sub: 'Perfect size every time' },
          ].map(p => (
            <View key={p.title} style={styles.pillar}>
              <Text style={styles.pillarIcon}>{p.icon}</Text>
              <Text style={styles.pillarTitle}>{p.title}</Text>
              <Text style={styles.pillarSub}>{p.sub}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  menuIcon: { fontSize: 20, color: '#111111' },
  brand: { fontSize: 18, fontWeight: '900', color: '#111111', letterSpacing: 2 },
  cartTouch: { position: 'relative', padding: 4 },
  cartIcon: { fontSize: 22, color: '#111111' },
  cartBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#DC2626', borderRadius: 8,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  // Hero
  heroWrap: { position: 'relative', height: 420 },
  heroSlide: { width: W, height: 420, position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#FFFFFF', lineHeight: 34, letterSpacing: 0.5 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  heroCta: {
    marginTop: 14, alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8,
  },
  heroCtaText: { fontSize: 11, fontWeight: '900', color: '#111111', letterSpacing: 2 },
  dots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 20, backgroundColor: '#FFFFFF' },

  // Promo Banner
  promoBanner: { backgroundColor: '#111111', paddingVertical: 10, paddingHorizontal: 16 },
  promoBannerText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textAlign: 'center' },

  // Section
  section: { paddingTop: 24, paddingBottom: 8 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: '#111111', letterSpacing: 2, paddingHorizontal: 16, marginBottom: 14 },
  seeAll: { fontSize: 12, color: '#DC2626', fontWeight: '600' },

  // Categories
  catScroll: { paddingHorizontal: 16, gap: 12 },
  catItem: { alignItems: 'center', width: 72 },
  catImageWrap: {
    width: 68, height: 68, borderRadius: 34,
    overflow: 'hidden', borderWidth: 1.5, borderColor: '#EEEEEE',
    marginBottom: 6,
  },
  catImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  catLabel: { fontSize: 10, fontWeight: '700', color: '#444444', textAlign: 'center', letterSpacing: 0.3 },

  // Product Grid
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12 },
  productCard: { width: (W - 36) / 2, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEEEEE' },
  productImageWrap: { width: '100%', aspectRatio: 0.85, position: 'relative', backgroundColor: '#F5F5F5' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  productBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#DC2626', paddingHorizontal: 6, paddingVertical: 3,
  },
  productBadgeText: { fontSize: 8, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  productInfo: { padding: 10 },
  productName: { fontSize: 12, fontWeight: '700', color: '#111111', marginBottom: 2 },
  productFabric: { fontSize: 10, color: '#888888', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  price: { fontSize: 14, fontWeight: '800', color: '#111111' },
  mrp: { fontSize: 11, color: '#AAAAAA', textDecorationLine: 'line-through' },
  addBtn: { backgroundColor: '#111111', paddingVertical: 8, alignItems: 'center' },
  addBtnText: { fontSize: 9, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },

  // AI Banner
  aiCard: { marginHorizontal: 16, marginTop: 24, height: 200, overflow: 'hidden' },
  aiCardImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  aiCardOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 20, justifyContent: 'center',
  },
  aiCardTag: { fontSize: 9, fontWeight: '900', color: '#DC2626', letterSpacing: 3, marginBottom: 6 },
  aiCardTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  aiCardSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 14 },
  aiCardBtn: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8 },
  aiCardBtnText: { fontSize: 10, fontWeight: '900', color: '#111111', letterSpacing: 2 },

  // Studio Card
  studioCard: {
    margin: 16, marginTop: 12, padding: 20,
    backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EEEEEE',
  },
  studioTag: { fontSize: 9, fontWeight: '900', color: '#DC2626', letterSpacing: 3, marginBottom: 8 },
  studioTitle: { fontSize: 18, fontWeight: '900', color: '#111111', marginBottom: 4 },
  studioSub: { fontSize: 12, color: '#666666', lineHeight: 18, marginBottom: 12 },
  studioLink: { fontSize: 12, fontWeight: '700', color: '#111111' },

  // Trust Pillars
  pillars: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, marginTop: 16, gap: 1, backgroundColor: '#EEEEEE' },
  pillar: { width: (W - 32 - 3) / 2, backgroundColor: '#FFFFFF', padding: 16 },
  pillarIcon: { fontSize: 18, marginBottom: 6 },
  pillarTitle: { fontSize: 12, fontWeight: '800', color: '#111111', marginBottom: 3 },
  pillarSub: { fontSize: 10, color: '#888888', lineHeight: 14 },
});
