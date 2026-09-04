/**
 * CODED-FIT / NOVA STREET — Mobile Shop & Collection Screen
 * Haute-Couture Black & White: Dual-Funnel Filter, Categories, Dynamic Grid
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
        <Text style={styles.title}>COLLECTION</Text>
        <Text style={styles.subTitle}>
          {filteredProducts.length} Bespoke & RTW Releases Available
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
              24H RTW
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFunnelFilter(current => (current === 'custom-made' ? 'all' : 'custom-made'))}
            style={[styles.funnelPill, funnelFilter === 'custom-made' && styles.funnelPillActive]}
          >
            <Text style={[styles.funnelPillText, funnelFilter === 'custom-made' && styles.funnelPillTextActive]}>
              BESPOKE
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
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: 'Cinzel',
  },
  subTitle: {
    fontSize: 9,
    color: '#A3A3A3',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: RADIUS.sm, // 0 sharp
  },
  segmentBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#737373',
  },
  segmentTextActive: {
    color: '#000000',
  },
  funnelPills: {
    flexDirection: 'row',
    gap: 6,
  },
  funnelPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.sm,
  },
  funnelPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  funnelPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A3A3A3',
  },
  funnelPillTextActive: {
    color: '#000000',
  },
  categoriesWrap: {
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    paddingVertical: 8,
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
    borderColor: '#262626',
    borderRadius: RADIUS.sm,
  },
  catPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  catPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A3A3A3',
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
});
