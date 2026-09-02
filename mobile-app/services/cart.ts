/**
 * CODED-FIT / NOVA STREET — Shopping Bag & Order Service
 * AsyncStorage Persistent Cart with Promo Engine & Biometric Checkout Support
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from './products';

const CART_STORAGE_KEY = '@CODED_FIT_CART_V1';

export interface CartItem {
  cartId: string;
  product: Product;
  size: string;
  qty: number;
  selectedColor?: string;
  bodyMetrics?: {
    heightCm?: number;
    weightKg?: number;
    bmi?: number;
    chest?: number;
    waist?: number;
  };
  monogram?: string;
  isBespoke?: boolean;
  addedAt: number;
}

export interface CartTotals {
  subtotal: number;
  savings: number;
  shipping: number;
  discount: number;
  discountLabel: string;
  total: number;
  itemCount: number;
  freeShippingQualified: boolean;
  amountNeededForFreeShipping: number;
}

export class CartService {
  /**
   * Fetch all items in the user's shopping bag
   */
  static async getCart(): Promise<CartItem[]> {
    try {
      const json = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.error('[CartService] Error loading cart:', e);
      return [];
    }
  }

  /**
   * Add a product or custom bespoke outfit to the shopping bag
   */
  static async addItem(
    product: Product,
    size: string = 'M',
    qty: number = 1,
    selectedColor?: string,
    bodyMetrics?: CartItem['bodyMetrics'],
    monogram?: string
  ): Promise<CartItem[]> {
    try {
      const cart = await this.getCart();
      const existingIdx = cart.findIndex(
        item => item.product.id === product.id && item.size === size && !item.isBespoke
      );

      if (existingIdx > -1 && !bodyMetrics) {
        cart[existingIdx].qty += qty;
      } else {
        const newItem: CartItem = {
          cartId: `${product.id}_${size}_${Date.now()}`,
          product,
          size,
          qty,
          selectedColor,
          bodyMetrics,
          monogram,
          isBespoke: !!bodyMetrics,
          addedAt: Date.now(),
        };
        cart.unshift(newItem);
      }

      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return cart;
    } catch (e) {
      console.error('[CartService] Error adding to cart:', e);
      return [];
    }
  }

  /**
   * Update quantity of a specific cart item
   */
  static async updateQty(cartId: string, qty: number): Promise<CartItem[]> {
    try {
      let cart = await this.getCart();
      if (qty <= 0) {
        cart = cart.filter(item => item.cartId !== cartId);
      } else {
        const item = cart.find(i => i.cartId === cartId);
        if (item) item.qty = qty;
      }
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return cart;
    } catch (e) {
      console.error('[CartService] Error updating quantity:', e);
      return [];
    }
  }

  /**
   * Remove item from shopping bag
   */
  static async removeItem(cartId: string): Promise<CartItem[]> {
    try {
      const cart = await this.getCart();
      const updated = cart.filter(item => item.cartId !== cartId);
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('[CartService] Error removing item:', e);
      return [];
    }
  }

  /**
   * Clear all items in shopping bag
   */
  static async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error('[CartService] Error clearing cart:', e);
    }
  }

  /**
   * Calculate subtotal, savings, shipping, discounts, and total
   */
  static calculateTotals(cart: CartItem[], promoCode?: string): CartTotals {
    let subtotal = 0;
    let mrpTotal = 0;
    let itemCount = 0;

    cart.forEach(item => {
      subtotal += item.product.price * item.qty;
      mrpTotal += item.product.mrp * item.qty;
      itemCount += item.qty;
    });

    const savings = Math.max(0, mrpTotal - subtotal);
    const freeShippingThreshold = 2999;
    const freeShippingQualified = subtotal >= freeShippingThreshold || subtotal === 0;
    const shipping = freeShippingQualified ? 0 : 199;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    let discount = 0;
    let discountLabel = '';

    if (promoCode) {
      const clean = promoCode.trim().toUpperCase();
      if (clean === 'NOVA10') {
        discount = Math.round(subtotal * 0.1);
        discountLabel = '10% VIP Launch Offer';
      } else if (clean === 'CODED500' && subtotal >= 2500) {
        discount = 500;
        discountLabel = '₹500 Creator Credit';
      } else if (clean === 'FIRSTTRIAL') {
        discount = Math.round(subtotal * 0.15);
        discountLabel = '15% First Garment Trial';
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      savings,
      shipping,
      discount,
      discountLabel,
      total,
      itemCount,
      freeShippingQualified,
      amountNeededForFreeShipping,
    };
  }
}
