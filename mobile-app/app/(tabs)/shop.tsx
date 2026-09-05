/**
 * CODED-FIT / NOVA STREET — Mobile Shop & Collection Screen
 * Ultra-Luxury Haute Couture: Gold Segmented Controls, Pill Badges, Dynamic Filtering & Product Grid
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRODUCTS, Product } from '../../services/products';
import { CartService } from '../../services/cart';
import { ProductCard } from '../../components/ProductCard';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

const CATEGORIES = ['All', 'Tops', 'Outerwear', 'Bottoms', 'Dresses'];

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women'>('all');
  const [funnelFilter, setFunnelFilter] = useState<'all' | 'rtw' | 'custom-made'>('all');

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchGender = genderFilter === 'all' || p.gender === genderFilter || p.gender === 'unisex';
    const matchFunnel = funnelFilter === 'all' || p.funnel === funnelFilter;
    return matchCategory && matchGender && matchFunnel;
  });

  const handleQuickAdd = async (product: Product) => {
    await CartService.addItem(product, product.sizes[0] || 'M', 1);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>COLLECTION <Text style={styles.titleGold}>RELEASES</Text></Text>
        <Text style={styles.subTitle}>
          {filteredProducts.length} Pieces Available · Ahmedabad Ateliers
        </Text>
      </View>

      {/* ── Gender & Funnel Switchers ── */}
      <View style={styles.filterBar}>
        {/* Gender Toggle */}
        <View style={styles.segmentedControl}>
          {(['all', 'men', 'women'] as const).map(g => (
            <TouchableOpacity
              key={g}
              onPress={() => setGenderFilter(g)}
              style={[
                styles.segmentBtn,
                genderFilter === g && styles.segmentBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  genderFilter === g && styles.segmentTextActive,
                ]}
              >
                {g.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Funnel Toggle */}
        <View style={styles.funnelPills}>
          <TouchableOpacity
            onPress={() => setFunnelFilter(current => (current === 'rtw' ? 'all' : 'rtw'))}
            style={[styles.funnelPill, funnelFilter === 'rtw' && styles.funnelPillActive]}
          >
            <Text style={[styles.funnelPillText, funnelFilter === 'rtw' && styles.funnelPillTextActive]}>
              ⚡ 24H RTW
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFunnelFilter(current => (current === 'custom-made' ? 'all' : 'custom-made'))}
            style={[styles.funnelPill, funnelFilter === 'custom-made' && styles.funnelPillActive]}
          >
            <Text style={[styles.funnelPillText, funnelFilter === 'custom-made' && styles.funnelPillTextActive]}>
              ✂️ BESPOKE
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Categories Horizontal Scroll ── */}
      <View style={styles.categoriesWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.catPill,
                selectedCategory === cat && styles.catPillActive,
              ]}
            >
              <Text
                style={[
                  styles.catPillText,
                  selectedCategory === cat && styles.catPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Products Grid ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🧵</Text>
            <Text style={styles.emptyTitle}>NO PIECES FOUND</Text>
            <Text style={styles.emptySub}>Try adjusting your filters.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#050505',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2.5,
    fontFamily: 'Cinzel',
  },
  titleGold: {
    color: '#D4AF37',
  },
  subTitle: {
    fontSize: 9.5,
    color: '#8A8580',
    letterSpacing: 0.8,
    marginTop: 3,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.sm,
    padding: 2,
  },
  segmentBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 2,
  },
  segmentBtnActive: {
    backgroundColor: '#D4AF37',
  },
  segmentText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#737373',
    letterSpacing: 0.8,
  },
  segmentTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  funnelPills: {
    flexDirection: 'row',
    gap: 6,
  },
  funnelPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.sm,
  },
  funnelPillActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: '#D4AF37',
  },
  funnelPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8A8580',
    letterSpacing: 0.5,
  },
  funnelPillTextActive: {
    color: '#D4AF37',
    fontWeight: '900',
  },
  categoriesWrap: {
    backgroundColor: '#070707',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    paddingVertical: 10,
  },
  catScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: RADIUS.full,
  },
  catPillActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  catPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A3A3A3',
    letterSpacing: 0.5,
  },
  catPillTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.4,
  },
  emptyTitle: {
    fontFamily: 'Cinzel',
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  emptySub: {
    fontSize: 12,
    color: '#737373',
    marginTop: 4,
  },
});
