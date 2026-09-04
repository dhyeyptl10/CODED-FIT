import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { CartService } from '../../services/cart';
import { COLORS } from '../../constants/theme';

function TabIcon({ icon, label, focused, badgeCount }: { icon: string; label: string; focused: boolean; badgeCount?: number }) {
  return (
    <View style={styles.iconContainer}>
      <View style={{ position: 'relative' }}>
        <Text style={[styles.iconText, focused && styles.iconTextActive]}>{icon}</Text>
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.labelText, focused && styles.labelTextActive]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    loadCartCount();
    const interval = setInterval(loadCartCount, 2500);
    return () => clearInterval(interval);
  }, []);

  const loadCartCount = async () => {
    try {
      const count = await CartService.getItemCount();
      setCartCount(count);
    } catch (_) {}
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="✦" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="◈" label="Shop" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tryon"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📸" label="AI Try-On" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👜" label="Bag" focused={focused} badgeCount={cartCount} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="VIP" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    height: 60,
    paddingBottom: 4,
    paddingTop: 6,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#737373',
  },
  iconTextActive: {
    color: '#FFFFFF',
  },
  labelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#737373',
    letterSpacing: 0.8,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  labelTextActive: {
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900',
  },
});
