/**
 * CODED-FIT / NOVA STREET — Shopping Bag Item Card
 * Sharp Monochrome Architecture
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { CartItem as CartItemType } from '../services/cart';
import { Badge } from './ui/Badge';
import { COLORS, RADIUS } from '../constants/theme';

interface CartItemProps {
  item: CartItemType;
  onUpdateQty: (productId: string, size: string, color: string | undefined, qty: number) => void;
  onRemove: (productId: string, size: string, color?: string) => void;
}

export function CartItem({ item, onUpdateQty, onRemove }: CartItemProps) {
  const { product, size, color, qty } = item;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.details}>
        <View style={styles.topRow}>
          <Badge
            label={product.funnel === 'rtw' ? '24H EXPRESS' : 'BESPOKE 3D'}
            variant="dark"
            size="sm"
          />
          <TouchableOpacity
            onPress={() => {
              try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (_) {}
              onRemove(product.id, size, color);
            }}
          >
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.meta}>Size: {size} {color ? '· ' + color : ''}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{(product.price * qty).toLocaleString('en-IN')}</Text>

          {/* Qty Counter */}
          <View style={styles.qtyControl}>
            <TouchableOpacity
              onPress={() => onUpdateQty(product.id, size, color, qty - 1)}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyVal}>{qty}</Text>
            <TouchableOpacity
              onPress={() => onUpdateQty(product.id, size, color, qty + 1)}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.sm, // 0 sharp edges
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 100,
    backgroundColor: '#0D0D0D',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 14,
    color: '#737373',
    padding: 2,
  },
  name: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  meta: {
    fontSize: 10,
    color: '#A3A3A3',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#000000',
  },
  qtyBtn: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  qtyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  qtyVal: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
});
