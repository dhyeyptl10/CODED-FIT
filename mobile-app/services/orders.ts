/**
 * CODED FIT — On-device order history.
 * Checkout records real orders here (items snapshot + totals + date).
 * The Profile tab reads this — no fake orders are ever shown.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './cart';

const ORDERS_KEY = '@CODED_FIT_ORDERS_V1';
export const MEASUREMENTS_KEY = '@CODED_FIT_MEASUREMENTS_V1';

export interface OrderRecord {
  orderId: string;
  date: number;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number;
  itemCount: number;
}

export interface BodyMeasurements {
  heightCm: number;
  weightKg: number;
  chestIn: number;
  waistIn: number;
  hipIn: number;
  updatedAt: number;
}

export async function saveOrder(items: CartItem[], total: number): Promise<OrderRecord> {
  const record: OrderRecord = {
    orderId: 'CF-' + Date.now().toString(36).toUpperCase(),
    date: Date.now(),
    items: items.map(i => ({
      name: i.product.name,
      size: i.size,
      qty: i.qty,
      price: i.product.price,
    })),
    total,
    itemCount: items.reduce((n, i) => n + i.qty, 0),
  };
  try {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    const list: OrderRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(list.slice(0, 20)));
  } catch (_) {}
  return record;
}

export async function getOrders(): Promise<OrderRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export async function saveMeasurements(m: Omit<BodyMeasurements, 'updatedAt'>): Promise<void> {
  try {
    await AsyncStorage.setItem(
      MEASUREMENTS_KEY,
      JSON.stringify({ ...m, updatedAt: Date.now() })
    );
  } catch (_) {}
}

export async function getMeasurements(): Promise<BodyMeasurements | null> {
  try {
    const raw = await AsyncStorage.getItem(MEASUREMENTS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}
