import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CartService } from '../../services/cart';
import { COLORS } from '../../constants/theme';

function TabIcon({
  icon,
  label,
  focused,
  badgeCount,
}: {
  icon: string;
  label: string;
  focused: boolean;
  badgeCount?: number;
}) {
  return (
    <View style={styles.iconContainer}>
      <View style={styles.iconWrapper}>
        <Text style={[styles.iconText, focused && styles.iconTextActive]}>{icon}</Text>
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.labelText, focused && styles.labelTextActive]}>{label}</Text>
      {focused && <View style={styles.activeIndicator} />}
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
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="✦" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="◈" label="Shop" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tryon"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="◎" label="AI Studio" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="⊕"
              label="Bag"
              focused={focused}
              badgeCount={cartCount}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="◉" label="VIP Club" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#050505',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.25)',
    height: Platform.OS === 'ios' ? 76 : 66,
    paddingBottom: Platform.OS === 'ios' ? 14 : 6,
    paddingTop: 8,
    elevation: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    position: 'relative',
    paddingVertical: 2,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  iconText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '600',
  },
  iconTextActive: {
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  labelText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 1.2,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  labelTextActive: {
    color: '#D4AF37',
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 22,
    height: 2,
    backgroundColor: '#D4AF37',
    borderRadius: 1,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: '#050505',
  },
  badgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900',
  },
});
