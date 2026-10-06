import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartTotals } from '@coded-fit/shared';

interface CartStore {
  items: CartItem[];
  totals: CartTotals;
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  replaceItem: (id: string, item: Omit<CartItem, 'id'>) => boolean;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const calculateTotals = (items: CartItem[], couponDiscountPercent = 0): CartTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = Math.round((subtotal * couponDiscountPercent) / 100);
  const taxable = Math.max(0, subtotal - discount);
  const tax = 0; // 12% GST
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 150;
  const total = taxable + tax + shipping;

  return {
    subtotal,
    shipping,
    discount,
    tax,
    total,
    appliedCoupon: couponDiscountPercent > 0 ? {
      code: couponDiscountPercent === 10 ? 'NOVA10' : 'CODEDFIT',
      discountPercent: couponDiscountPercent,
      discountAmount: discount
    } : undefined
  };
};

const initialItems: CartItem[] = [];

export const useCartStore = create<CartStore>()(persist((set, get) => ({
  items: initialItems,
  totals: calculateTotals(initialItems),
  isDrawerOpen: false,

  addItem: (itemData) => {
    const { items, totals } = get();
    // Unique ID combining product, size, and custom properties
    const customKey = itemData.customization
      ? JSON.stringify(itemData.customization)
      : 'standard';
    const existingIndex = items.findIndex(i => i.productId === itemData.productId && i.size === itemData.size && i.colorHex === itemData.colorHex && (i.customization ? JSON.stringify(i.customization) : 'standard') === customKey);
    const id = existingIndex >= 0 ? items[existingIndex].id : `cart_${globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}`;
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = items.map((it, idx) =>
        idx === existingIndex ? { ...it, qty: it.qty + itemData.qty } : it
      );
    } else {
      updated = [...items, { ...itemData, id }];
    }

    const discountPercent = totals.appliedCoupon?.discountPercent || 0;
    set({
      items: updated,
      totals: calculateTotals(updated, discountPercent),
      isDrawerOpen: true
    });
  },

  replaceItem: (id, itemData) => {
    const { items, totals } = get();
    if (!items.some(item => item.id === id)) return false;
    const updated = items.map(item => item.id === id ? { ...itemData, id } : item);
    set({ items: updated, totals: calculateTotals(updated, totals.appliedCoupon?.discountPercent || 0), isDrawerOpen: true });
    return true;
  },

  removeItem: (id) => {
    const { items, totals } = get();
    const updated = items.filter((i) => i.id !== id);
    const discountPercent = totals.appliedCoupon?.discountPercent || 0;
    set({
      items: updated,
      totals: calculateTotals(updated, discountPercent)
    });
  },

  updateQty: (id, qty) => {
    if (qty <= 0) {
      get().removeItem(id);
      return;
    }
    const { items, totals } = get();
    const updated = items.map((i) => (i.id === id ? { ...i, qty } : i));
    const discountPercent = totals.appliedCoupon?.discountPercent || 0;
    set({
      items: updated,
      totals: calculateTotals(updated, discountPercent)
    });
  },

  clearCart: () => {
    set({ items: [], totals: calculateTotals([]) });
  },

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  applyCoupon: (code) => {
    const clean = code.trim().toUpperCase();
    let percent = 0;
    if (clean === 'NOVA10') percent = 10;
    
    else {
      return { success: false, message: 'Invalid promotional coupon code.' };
    }

    const { items } = get();
    set({ totals: calculateTotals(items, percent) });
    return { success: true, message: `Coupon ${clean} applied (${percent}% Off).` };
  },

  removeCoupon: () => {
    const { items } = get();
    set({ totals: calculateTotals(items, 0) });
  }
}), {name:'coded-fit-cart-v2', partialize: ({items,totals}) => ({items,totals})}));

