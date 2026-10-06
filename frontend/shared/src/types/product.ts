/**
 * CODED FIT — Product Domain Types
 */

export type ProductCategory =
  | 'T-Shirts'
  | 'Shirts'
  | 'Bottoms'
  | 'Jackets'
  | 'Hoodies'
  | 'Tops'
  | 'Dresses'
  | 'Accessories';

export type ProductGender = 'men' | 'women' | 'unisex' | 'kids';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CustomOptionItem {
  id: string;
  name: string;
  priceAdd: number;
}

export interface ProductCustomizationConfig {
  collars: CustomOptionItem[];
  cuffs: CustomOptionItem[];
  buttons: CustomOptionItem[];
  monogramAllowed: boolean;
}

export interface ProductInventory {
  stock: number;
  reserved: number;
  available: number;
  isLowStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  gender: ProductGender;
  price: number;
  compareAtPrice?: number;
  images: string[];
  fabric: string;
  fabricDetails?: {
    gsm?: string;
    origin?: string;
    composition?: string;
  };
  colors: ProductColor[];
  sizes: string[];
  inventory: ProductInventory;
  customizationOptions?: ProductCustomizationConfig;
  type: 'ready-to-wear' | 'made-to-measure' | 'hybrid';
  status: 'active' | 'draft' | 'archived';
  badge?: string;
  dispatchTime?: string;
  ratings?: {
    average: number;
    count: number;
  };
}
