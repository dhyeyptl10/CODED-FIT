/**
 * CODED FIT — Unified API Service Client (/api/v1)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

async function fetchJSON<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('coded_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `API Error: ${res.status}`);
  }
  return data as T;
}

export const api = {
  getAddresses:()=>fetchJSON<{addresses:any[]}>('/customer/addresses'),
  addAddress:(address:any)=>fetchJSON<{addresses:any[]}>('/customer/addresses',{method:'POST',body:JSON.stringify(address)}),
  removeAddress:(id:string)=>fetchJSON<{addresses:any[]}>('/customer/addresses/'+id,{method:'DELETE'}),
  getWishlist:()=>fetchJSON<{products:any[]}>('/customer/wishlist'),
  setWishlist:(id:string,saved:boolean)=>fetchJSON<{wishlist:string[]}>('/customer/wishlist/'+id,{method:'PUT',body:JSON.stringify({saved})}),
  getReturns:()=>fetchJSON<{requests:any[]}>('/customer/returns'),
  requestReturn:(payload:any)=>fetchJSON<any>('/customer/returns',{method:'POST',body:JSON.stringify(payload)}),
  getCustomizationOptions: () => fetchJSON<any>('/customizations/options'),
  saveDesign: (payload:any) => fetchJSON<any>('/designs',{method:'POST',body:JSON.stringify(payload)}),
  getDesigns: () => fetchJSON<{designs:any[]}>('/designs'),
  // Auth
  sendOtp: (phone: string) => fetchJSON<{ success: boolean; message: string; devCode?: string }>('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone })
  }),

  verifyOtp: (phone: string, code: string, name?: string) => fetchJSON<{ success: boolean; token: string; user: any }>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, code, name })
  }),

  getMe: () => fetchJSON<{ success: boolean; user: any }>('/auth/me'),

  // Products
  getProducts: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return fetchJSON<{ success: boolean; products: any[]; total: number }>(`/products${qs ? `?${qs}` : ''}`);
  },

  getProductBySlug: (slug: string) => fetchJSON<{ success: boolean; product: any }>(`/products/${slug}`),

  // Orders & Tracking
  createOrder: (payload: any) => fetchJSON<{ success: boolean; order: any }>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getMyOrders: () => fetchJSON<{ success: boolean; orders: any[] }>('/orders/my-orders'),

  trackOrder: (orderNumber: string) => fetchJSON<{ success: boolean; orderNumber: string; status: string; productionStatus: string; tracking: any }>(`/production/tracker/${orderNumber}`),

  submitFitFeedback: (orderId: string, feedback: any) => fetchJSON<{ success: boolean; message: string }>(`/orders/${orderId}/fit-feedback`, {
    method: 'POST',
    body: JSON.stringify(feedback)
  }),

  // Checkout & Payments
  createPaymentIntent: (orderId: string) => fetchJSON<{ success: boolean; orderId: string; amount: number; keyId: string; currency: string }>('/checkout/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({ orderId })
  }),

  verifyPayment: (payload: { orderId: string; razorpayPaymentId: string; razorpayOrderId:string; razorpaySignature: string }) => fetchJSON<{ success: boolean; message: string }>('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // AI & Voice Command (GPT Astra)
  sendAICommand: (prompt: string, context?: any) => fetchJSON<{
    success: boolean;
    action: string;
    reply: string;
    spokenReply?: string;
    changes?: any;
    productSuggestions?: any[];
    suggestedPrompts?: string[];
  }>('/ai/command', {
    method: 'POST',
    body: JSON.stringify({ prompt, context })
  }),

  // Try On
  createTryOnTask: (payload: { userImage: string; garmentImage?: string; garmentType?: string }) => fetchJSON<{ success: boolean; taskId?: string; unavailable?: boolean; message?: string }>('/tryon', {
    method: 'POST',
    body: JSON.stringify({modelImageBase64:payload.userImage,garmentImageUrl:payload.garmentImage,garmentType:payload.garmentType})
  }),

  getTryOnStatus: (taskId: string) => fetchJSON<{ success: boolean; status: string; resultImageUrl?: string }>(`/tryon/${taskId}`),

  // Fit Profile
  saveFitProfile: (profile: any) => fetchJSON<{ success: boolean; fitProfile: any }>('/fit-profile', {
    method: 'POST',
    body: JSON.stringify(profile)
  }),

  getFitProfile: () => fetchJSON<{ success: boolean; fitProfile: any }>('/fit-profile/me')
};
