/**
 * CODED FIT — Global Order Statuses & Bespoke Production Stages
 */

export const ORDER_STATUSES = {
  PLACED: 'PLACED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  PROCESSING: 'PROCESSING',
  CUSTOMIZATION_CONFIRMED: 'CUSTOMIZATION_CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  QUALITY_CHECK: 'QUALITY_CHECK',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  RETURN_REQUESTED: 'RETURNED_REQUESTED',
  RETURNED: 'RETURNED',
  REFUNDED: 'REFUNDED'
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

export const BESPOKE_PRODUCTION_STAGES = {
  PLACED: 'PLACED',
  FIT_VERIFIED: 'FIT_VERIFIED',
  PATTERN_CREATED: 'PATTERN_CREATED',
  CUTTING: 'CUTTING',
  STITCHING: 'STITCHING',
  QC: 'QC',
  TRIAL: 'TRIAL',
  ALTERATION: 'ALTERATION',
  FINAL_PRODUCTION: 'FINAL_PRODUCTION',
  SHIPPED: 'SHIPPED'
} as const;

export type BespokeProductionStage = typeof BESPOKE_PRODUCTION_STAGES[keyof typeof BESPOKE_PRODUCTION_STAGES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PLACED: 'Order Placed',
  PAYMENT_CONFIRMED: 'Payment Confirmed',
  PROCESSING: 'Processing in Atelier',
  CUSTOMIZATION_CONFIRMED: 'Specs Confirmed',
  IN_PRODUCTION: 'In Production',
  QUALITY_CHECK: 'Precision QC Inspection',
  SHIPPED: 'Dispatched via Air Express',
  OUT_FOR_DELIVERY: 'Out for Doorstep Delivery',
  DELIVERED: 'Delivered',
  RETURNED_REQUESTED: 'Return / Alteration Requested',
  RETURNED: 'Returned to Atelier',
  REFUNDED: 'Refund Completed'
};

export const BESPOKE_STAGE_LABELS: Record<BespokeProductionStage, string> = {
  PLACED: 'Bespoke Order Received',
  FIT_VERIFIED: '3D Fit Profile Calibrated',
  PATTERN_CREATED: 'Bespoke Unit-of-One Pattern Cut',
  CUTTING: 'Laser Fabric Cutting',
  STITCHING: 'Artisanal Single-Needle Stitching',
  QC: 'Micron-Level QC & Dimensional Audit',
  TRIAL: 'Doorstep Trial Garment Dispatched',
  ALTERATION: 'Micro-Adjustments Applied',
  FINAL_PRODUCTION: 'Master Garment Crafted',
  SHIPPED: 'Final Garment Dispatched'
};
