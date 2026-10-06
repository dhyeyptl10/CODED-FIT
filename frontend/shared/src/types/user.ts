/**
 * CODED FIT — User Domain Types
 */

import { FitProfile } from './fitProfile';

export type UserRole = 'customer' | 'admin' | 'tailor';

export interface UserAddress {
  id: string;
  isDefault: boolean;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  gender?: 'men' | 'women' | 'unisex' | 'other';
  fitProfile?: FitProfile;
  addresses?: UserAddress[];
  wishlist?: string[]; // Product IDs
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
