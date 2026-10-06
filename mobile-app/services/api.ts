/**
 * CODED FIT — Unified Native Mobile API Client (/api/v1)
 * Shares API contracts with the Web Next.js frontend.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default localhost for Android emulator (10.0.2.2) or iOS simulator (localhost)
const DEFAULT_API_BASE = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1');

export async function getApiBaseUrl(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem('@CODED_FIT_API_URL');
    return saved || DEFAULT_API_BASE;
  } catch {
    return DEFAULT_API_BASE;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const base = await getApiBaseUrl();
  const token = await AsyncStorage.getItem('@CODED_FIT_TOKEN');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${base}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `HTTP Error ${res.status}`);
  }
  return data as T;
}

export const mobileApi = {
  // Phone OTP Authentication
  sendOtp: (phone: string) => request<{ success: boolean; message: string; devCode?: string }>('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone })
  }),

  verifyOtp: (phone: string, code: string, name?: string) => request<{ success: boolean; token: string; user: any }>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, code, name })
  }),

  // Products
  getProducts: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ success: boolean; products: any[] }>(`/products${qs ? `?${qs}` : ''}`);
  },

  // AI & Voice Assistant (GPT Astra)
  sendAICommand: (prompt: string) => request<{
    success: boolean;
    action: string;
    reply: string;
    spokenReply?: string;
    changes?: any;
    productSuggestions?: any[];
  }>('/ai/command', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  }),

  // Orders
  createOrder: (payload: any) => request<{ success: boolean; order: any }>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  trackOrder: (orderNumber: string) => request<{
    success: boolean;
    orderNumber: string;
    status: string;
    productionStatus: string;
    tracking: any;
  }>(`/production/tracker/${orderNumber}`),

  // Fit Profile
  saveFitProfile: (profile: any) => request<{ success: boolean; fitProfile: any }>('/fit-profile', {
    method: 'POST',
    body: JSON.stringify(profile)
  })
};
