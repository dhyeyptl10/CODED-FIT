/**
 * CODED-FIT / NOVA STREET — Bottom Tab Bar Navigation Layout
 * Haute-Couture White Theme: 5 Tabs (Home, Shop, AI Try-On, UR PICKS, Bag)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { CartService } from '../../services/cart';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

export default function TabLayout() {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = async () => {
      const items = await CartService.getCart();
      const count = items.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(count);
    };
    updateCount();
    const interval = setInterval(updateCount, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          ...SHADOWS.card,
        },
        tabBarActiveTintColor: COLORS.goldDark,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 20, color }}>{focused ? '🏠' : '⌂'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 20, color }}>{focused ? '🛍️' : '◻'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="tryon"
        options={{
          title: 'AI Try-On',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tryOnTabWrap, focused && styles.tryOnTabWrapActive]}>
              <Text style={{ fontSize: 18 }}>📸</Text>
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '900',
            color: COLORS.goldDark,
          },
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'UR PICKS',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 20, color }}>{focused ? '⚡' : '◇'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Bag',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: 20, color }}>{focused ? '👜' : '💼'}</Text>
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tryOnTabWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF8F0',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,
  },
  tryOnTabWrapActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.goldDark,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.gold,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
});
