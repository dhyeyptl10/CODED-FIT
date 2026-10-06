/**
 * CODED FIT — Order Domain Types
 */

import { CartItem } from './cart';
import { OrderStatus, BespokeProductionStage } from '../constants/orderStatus';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  id?: string;
  orderId?: string;
  method: 'razorpay' | 'cod' | 'upi';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  signature?: string;
  paidAt?: string;
}

export interface FirstGarmentTrial {
  isFirstTrial: boolean;
  feedbackSubmitted: boolean;
  fitRating?: 'too_tight' | 'perfect' | 'too_loose' | 'needs_adjustment';
  areaFeedback?: {
    chest?: string;
    shoulder?: string;
    sleeve?: string;
    waist?: string;
    length?: string;
  };
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: CartItem[];
  type: 'ready-to-wear' | 'made-to-measure' | 'hybrid';
  shippingAddress: ShippingAddress;
  payment: PaymentDetails;
  status: OrderStatus;
  productionStatus?: BespokeProductionStage;
  firstGarmentTrial?: FirstGarmentTrial;
  tracking?: {
    carrier: string;
    number: string;
    estimatedDelivery?: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    tax: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
}
