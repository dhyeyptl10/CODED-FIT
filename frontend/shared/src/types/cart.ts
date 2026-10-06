/**
 * CODED FIT — Cart Domain Types
 */

import { GarmentCustomization } from './customization';
import { BodyMeasurements } from './fitProfile';

export interface CartItem {
  id: string; // Unique cart line item ID
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  qty: number;
  size: string;
  image: string;
  colorName?: string;
  colorHex?: string;
  type: 'ready-to-wear' | 'made-to-measure';
  customization?: GarmentCustomization;
  measurementsSnapshot?: BodyMeasurements;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  appliedCoupon?: {
    code: string;
    discountPercent: number;
    discountAmount: number;
  };
}

export interface CartState {
  items: CartItem[];
  totals: CartTotals;
  isDrawerOpen: boolean;
}
