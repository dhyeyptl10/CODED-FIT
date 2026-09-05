/**
 * CODED-FIT / NOVA STREET — Mobile Home Screen
 * Haute-Couture Luxury: Auto-scrolling Hero Carousel, Instagram-Style Stories Bubbles,
 * Flash Drop Countdown, Horizontal Product Rails, and Ranked Trending Pieces
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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FEATURED_PRODUCTS, Product } from '../../services/products';
import { CartService } from '../../services/cart';
import { ProductCard } from '../../components/ProductCard';
import { GoldButton } from '../../components/ui/GoldButton';
import { Badge } from '../../components/ui/Badge';
import { useLocation } from '../../hooks/useLocation';
import { useShare } from '../../hooks/useShare';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 400;

const HERO_SLIDES = [
  {
    id: '1',
    title: 'NEW SEASON AW26',
    sub: 'Sculptural Silhouettes & Bespoke Cuts',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=85',
    link: '/shop',
    tag: 'LIMITED DROP',
  },
  {
    id: '2',
    title: 'MENSWEAR EDIT',
    sub: 'Heavyweight GOTS Cotton & Minimalist Precision',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&q=85',
    link: '/shop',
    tag: '24H DISPATCH',
  },
  {
    id: '3',
    title: 'WOMENSWEAR ATELIER',
    sub: 'Fluid Silks & Sculpted Tailoring',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85',
    link: '/shop',
    tag: 'HAUTE COUTURE',
  },
  {
    id: '4',
    title: 'BESPOKE 3D STUDIO',
    sub: 'Unit-of-One Millimeter Fit Tailoring',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85',
    link: '/tryon',
    tag: 'AI POWERED',
  },
];

const STORY_BUBBLES = [
  { id: '1', name: 'New In', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=240&q=80', filter: 'all' },
  { id: '2', name: 'Men', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&q=80', filter: 'men' },
  { id: '3', name: 'Women', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240&q=80', filter: 'women' },
  { id: '4', name: 'Bespoke', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=240&q=80', filter: 'bespoke' },
  { id: '5', name: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=240&q=80', filter: 'Hoodies' },
  { id: '6', name: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=240&q=80', filter: 'Jackets' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const { shareWithFriend } = useShare();

  const [activeSlide, setActiveSlide] = useState(0);
  const heroScrollRef = useRef<ScrollView>(null);

  // Countdown timer for flash drop
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll hero banner carousel
  useEffect(() => {
    const autoScroll = setInterval(() => {
      setActiveSlide(current => {
        const next = (current + 1) % HERO_SLIDES.length;
        heroScrollRef.current?.scrollTo({
          x: next * SCREEN_WIDTH,
          animated: true,
        });
        return next;
      });
    }, 4500);

    return () => clearInterval(autoScroll);
  }, []);

  const handleHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slide !== activeSlide && slide >= 0 && slide < HERO_SLIDES.length) {
      setActiveSlide(slide);
    }
  };

  const handleQuickAdd = async (product: Product) => {
    await CartService.addItem(product, product.sizes[0] || 'M', 1);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Top Announcement Marquee Bar in Gold ── */}
      <View style={styles.topMarquee}>
        <Text style={styles.marqueeText} numberOfLines={1}>
          ✦ DUAL-FUNNEL HYBRID FASHION ✦ 24H EXPRESS DISPATCH &amp; BESPOKE 3D TAILORING ✦ CODE NOVA10 ✦
        </Text>
      </View>

      {/* ── Brand Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoMain}>NOVA <Text style={styles.logoGold}>STREET</Text></Text>
          <Text style={styles.logoSub}>HYBRID BESPOKE ATELIER · 2026</Text>
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
        {/* ── STORIES / QUICK CATEGORIES BUBBLES ── */}
        <View style={styles.storiesWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          >
            {STORY_BUBBLES.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.storyItem}
                activeOpacity={0.8}
                onPress={() => router.push('/shop')}
              >
                <View style={styles.storyRing}>
                  <Image source={{ uri: item.image }} style={styles.storyImage} />
                </View>
                <Text style={styles.storyName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── HERO BANNER: AUTO-SCROLLING EDITORIAL CAROUSEL ── */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={heroScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleHeroScroll}
            style={styles.carouselScroll}
          >
            {HERO_SLIDES.map(slide => (
              <TouchableOpacity
                key={slide.id}
                activeOpacity={0.95}
                style={styles.slide}
                onPress={() => router.push(slide.link as any)}
              >
                <Image source={{ uri: slide.image }} style={styles.slideImage} />
                <View style={styles.slideOverlay}>
                  <View style={styles.slideTag}>
                    <Text style={styles.slideTagText}>{slide.tag}</Text>
                  </View>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideSub}>{slide.sub}</Text>
                  <View style={styles.exploreBtn}>
                    <Text style={styles.exploreBtnText}>EXPLORE PIECES →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {HERO_SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === activeSlide && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* ── FLASH DROP COUNTDOWN BAR ── */}
        <View style={styles.countdownCard}>
          <View style={styles.countdownHeader}>
            <View style={styles.countdownTitleRow}>
              <Text style={styles.countdownBolt}>⚡</Text>
              <Text style={styles.countdownTitle}>LIMITED BESPOKE DROP CLOSES IN</Text>
            </View>
            <Text style={styles.countdownCode}>CODE: NOVA10</Text>
          </View>

          <View style={styles.timerRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeVal}>
                {String(timeLeft.hours).padStart(2, '0')}
              </Text>
              <Text style={styles.timeUnit}>HOURS</Text>
            </View>
            <Text style={styles.timeColon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeVal}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </Text>
              <Text style={styles.timeUnit}>MINS</Text>
            </View>
            <Text style={styles.timeColon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeVal}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </Text>
              <Text style={styles.timeUnit}>SECS</Text>
            </View>
          </View>
        </View>

        {/* ── FEATURED RELEASES: HORIZONTAL RAIL (Souled Store / Zara Style) ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>01 + CURATED</Text>
            <Text style={styles.sectionTitle}>FEATURED RELEASES</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/shop')}>
            <Text style={styles.seeAllText}>VIEW ALL →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalProductsScroll}
        >
          {FEATURED_PRODUCTS.map(product => (
            <View key={product.id} style={styles.horizontalCardWrap}>
              <ProductCard
                product={product}
                onQuickAdd={handleQuickAdd}
                cardWidth={210}
              />
            </View>
          ))}
        </ScrollView>

        {/* ── TRENDING NOW: TOP 3 RANKED PIECES ── */}
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeaderNoPad}>
            <View>
              <Text style={styles.sectionEyebrow}>02 + HIGH DEMAND</Text>
              <Text style={styles.sectionTitle}>TRENDING RIGHT NOW</Text>
            </View>
          </View>

          <View style={styles.trendingList}>
            {FEATURED_PRODUCTS.slice(0, 3).map((prod, index) => (
              <TouchableOpacity
                key={prod.id}
                activeOpacity={0.88}
                onPress={() => router.push('/product/' + prod.id as any)}
                style={styles.trendingCard}
              >
                <Text style={styles.rankNum}>0{index + 1}</Text>
                <Image source={{ uri: prod.images[0] }} style={styles.trendingThumb} />
                <View style={styles.trendingInfo}>
                  <Text style={styles.trendingFabric}>{prod.fabric}</Text>
                  <Text style={styles.trendingName} numberOfLines={1}>{prod.name}</Text>
                  <Text style={styles.trendingPrice}>₹{prod.price.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.trendingArrowBtn}>
                  <Text style={styles.trendingArrow}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── CTA BANNER: AI Try-On Studio Spotlight ── */}
        <View style={styles.tryOnPromoCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80' }}
            style={styles.tryOnBgImage}
          />
          <View style={styles.tryOnOverlay}>
            <Badge label="3D GENERATIVE AI" variant="white" size="sm" />
            <Text style={styles.tryOnPromoTitle}>
              Virtual 360° Try-On &amp; Exact Fit Simulator
            </Text>
            <Text style={styles.tryOnPromoSub}>
              Preview garments in live 360° motion on customizable 3D models tailored to your millimeter proportions.
            </Text>
            <GoldButton
              title="LAUNCH 3D STUDIO ✂️"
              onPress={() => router.push('/tryon')}
              size="md"
              style={{ alignSelf: 'flex-start', marginTop: 14 }}
            />
          </View>
        </View>

        {/* ── BRAND PILLARS ── */}
        <View style={styles.pillarsSection}>
          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>⚡</Text>
            <Text style={styles.pillarTitle}>24H EXPRESS DISPATCH</Text>
            <Text style={styles.pillarSub}>
              Curated ready-to-wear ships within 24 hours from Ahmedabad ateliers.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>🌿</Text>
            <Text style={styles.pillarTitle}>GOTS ORGANIC COTTON</Text>
            <Text style={styles.pillarSub}>
              Heavyweight 320–450 GSM pure combed natural textiles.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>✂️</Text>
            <Text style={styles.pillarTitle}>UNIT-OF-ONE BESPOKE</Text>
            <Text style={styles.pillarSub}>
              Precision laser cut to your exact AI-calculated measurements.
            </Text>
          </View>
        </View>

        {/* ── SHARE APP WITH VIP FRIEND ── */}
        <View style={styles.sharePromoCard}>
          <Text style={styles.sharePromoTitle}>INVITE AN INSIDER</Text>
          <Text style={styles.sharePromoSub}>
            Share Nova Street with fellow tastemakers to unlock bespoke tailoring credits.
          </Text>
          <GoldButton
            title="SHARE ATELIER PASS 📤"
            variant="outline"
            onPress={shareWithFriend}
            size="md"
            style={{ marginTop: 12, alignSelf: 'stretch' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topMarquee: {
    backgroundColor: '#D4AF37',
    paddingVertical: 6,
    alignItems: 'center',
  },
  marqueeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#050505',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  logoMain: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    fontFamily: 'Cinzel',
  },
  logoGold: {
    color: '#D4AF37',
  },
  logoSub: {
    fontSize: 8,
    fontWeight: '700',
    color: '#737373',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  locationDot: {
    fontSize: 8,
    color: '#22C55E',
  },
  locationCity: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#F5F5F0',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 48,
  },

  /* Stories */
  storiesWrap: {
    backgroundColor: '#070707',
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
    paddingVertical: 12,
  },
  storiesScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    gap: 6,
  },
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#D4AF37',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  storyName: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#CCCCCC',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  /* Carousel */
  carouselContainer: {
    position: 'relative',
    height: HERO_HEIGHT,
    backgroundColor: '#000000',
  },
  carouselScroll: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  slideOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 32,
  },
  slideTag: {
    backgroundColor: '#D4AF37',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    marginBottom: 8,
  },
  slideTagText: {
    color: '#000000',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  slideTitle: {
    fontFamily: 'Cinzel',
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    lineHeight: 32,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  slideSub: {
    fontSize: 12,
    color: '#E0E0E0',
    marginTop: 6,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  exploreBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  exploreBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#D4AF37',
  },

  /* Countdown Card */
  countdownCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: RADIUS.md,
  },
  countdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countdownTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countdownBolt: {
    fontSize: 14,
    color: '#D4AF37',
  },
  countdownTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  countdownCode: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  timeBox: {
    backgroundColor: '#171717',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
    minWidth: 64,
  },
  timeVal: {
    fontFamily: 'Cinzel',
    fontSize: 20,
    fontWeight: '900',
    color: '#D4AF37',
  },
  timeUnit: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#888888',
    letterSpacing: 1,
    marginTop: 2,
  },
  timeColon: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D4AF37',
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionHeaderNoPad: {
    marginBottom: 14,
  },
  sectionEyebrow: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#D4AF37',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    fontFamily: 'Cinzel',
  },
  seeAllText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D4AF37',
    letterSpacing: 0.8,
  },

  /* Horizontal Products */
  horizontalProductsScroll: {
    paddingHorizontal: 16,
    gap: 14,
  },
  horizontalCardWrap: {
    width: 210,
  },

  /* Trending Section */
  trendingSection: {
    paddingHorizontal: 16,
    marginTop: 28,
  },
  trendingList: {
    gap: 10,
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 12,
  },
  rankNum: {
    fontFamily: 'Cinzel',
    fontSize: 22,
    fontWeight: '900',
    color: '#D4AF37',
    width: 32,
  },
  trendingThumb: {
    width: 52,
    height: 64,
    borderRadius: RADIUS.sm,
    backgroundColor: '#1A1A1A',
  },
  trendingInfo: {
    flex: 1,
  },
  trendingFabric: {
    fontSize: 8,
    fontWeight: '800',
    color: '#888888',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  trendingName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  trendingPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D4AF37',
    marginTop: 4,
  },
  trendingArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingArrow: {
    color: '#D4AF37',
    fontSize: 14,
  },

  /* Try-on Promo */
  tryOnPromoCard: {
    margin: 16,
    marginTop: 28,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    height: 240,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  tryOnBgImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tryOnOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(5, 5, 5, 0.78)',
    padding: 20,
    justifyContent: 'center',
  },
  tryOnPromoTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 10,
    lineHeight: 22,
    fontFamily: 'Cinzel',
  },
  tryOnPromoSub: {
    fontSize: 11,
    color: '#C0C0C0',
    lineHeight: 16,
    marginTop: 6,
  },

  /* Pillars */
  pillarsSection: {
    padding: 16,
    gap: 10,
    marginTop: 12,
  },
  pillarCard: {
    backgroundColor: '#0C0C0C',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: RADIUS.md,
    padding: 16,
  },
  pillarIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  pillarTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 1.2,
  },
  pillarSub: {
    fontSize: 10.5,
    color: '#8A8580',
    marginTop: 3,
    lineHeight: 16,
  },

  /* Share */
  sharePromoCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.md,
    padding: 20,
    alignItems: 'center',
  },
  sharePromoTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    fontFamily: 'Cinzel',
  },
  sharePromoSub: {
    fontSize: 11,
    color: '#999999',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 16,
  },
});
