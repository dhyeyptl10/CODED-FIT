import { Product } from '@coded-fit/shared';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'cf-prod-01',
    name: 'Alabaster Crisp GOTS Linen Shirt',
    slug: 'alabaster-crisp-gots-linen-shirt',
    description: 'Artisanal long-staple organic linen woven at Ahmedabad Mill #4. Features mother-of-pearl buttons, single-needle lockstitch seams, and a relaxed Milanese spread collar.',
    category: 'Shirts',
    gender: 'men',
    price: 3499,
    compareAtPrice: 4499,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=80'
    ],
    fabric: 'Ahmedabad GOTS Organic Linen',
    fabricDetails: {
      gsm: '210 GSM',
      origin: 'Ahmedabad Mill #4',
      composition: '100% Organic Belgian Flax'
    },
    colors: [
      { name: 'Alabaster', hex: '#FAF8F5' },
      { name: 'Obsidian', hex: '#0B0C0F' },
      { name: 'Deep Navy', hex: '#1E3A8A' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'Custom Bespoke'],
    inventory: { stock: 24, reserved: 2, available: 22, isLowStock: false },
    type: 'hybrid',
    status: 'active',
    badge: 'BESTSELLER',
    dispatchTime: 'Ships in 24 Hours'
  },
  {
    id: 'cf-prod-02',
    name: '240 GSM Heavy Combed Boxy Tee',
    slug: '240-gsm-heavy-combed-boxy-tee',
    description: 'Unit-of-one drop-shoulder oversized tee crafted from 100% Gujarat organic cotton. Reinforced 1x1 rib collar with high tensile recovery.',
    category: 'T-Shirts',
    gender: 'unisex',
    price: 1899,
    compareAtPrice: 2499,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80'
    ],
    fabric: '100% GOTS Organic Cotton',
    fabricDetails: {
      gsm: '240 GSM',
      origin: 'Gujarat Co-operative Mills',
      composition: '100% Combed Cotton'
    },
    colors: [
      { name: 'Obsidian Black', hex: '#0B0C0F' },
      { name: 'Porcelain White', hex: '#FFFFFF' },
      { name: 'Charcoal', hex: '#282B30' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inventory: { stock: 50, reserved: 4, available: 46, isLowStock: false },
    type: 'ready-to-wear',
    status: 'active',
    badge: 'NEW ARRIVAL',
    dispatchTime: 'Ships in 24 Hours'
  },
  {
    id: 'cf-prod-03',
    name: 'Atelier 420 GSM Thermal Loopback Hoodie',
    slug: 'atelier-420-gsm-thermal-loopback-hoodie',
    description: 'Ultra-dense 420 GSM unbrushed organic loopback fleece with double-lined hood and bespoke kangaroo pocket framing. Engineered for structured streetwear drape.',
    category: 'Hoodies',
    gender: 'unisex',
    price: 4299,
    compareAtPrice: 5299,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&q=80'
    ],
    fabric: 'Thermal Loopback Fleece',
    fabricDetails: {
      gsm: '420 GSM',
      origin: 'Ahmedabad Knitting Unit',
      composition: '100% Organic French Terry'
    },
    colors: [
      { name: 'Charcoal Slate', hex: '#282B30' },
      { name: 'Obsidian Black', hex: '#0B0C0F' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inventory: { stock: 15, reserved: 1, available: 14, isLowStock: false },
    type: 'hybrid',
    status: 'active',
    badge: 'BESPOKE ATELIER',
    dispatchTime: 'Ships in 48 Hours'
  },
  {
    id: 'cf-prod-04',
    name: 'Ahmedabad Indigo Pleated Trouser',
    slug: 'ahmedabad-indigo-pleated-trouser',
    description: 'Architectural forward double-pleated trouser with adjustable side-cinches and clean break hemline. Tailored in heavy organic twill.',
    category: 'Bottoms',
    gender: 'men',
    price: 3899,
    compareAtPrice: 4899,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80'
    ],
    fabric: 'Organic Cotton Twill',
    fabricDetails: {
      gsm: '290 GSM',
      origin: 'Ahmedabad Weaving Mills',
      composition: '98% Organic Cotton, 2% Elastane'
    },
    colors: [
      { name: 'Deep Indigo', hex: '#1E3A8A' },
      { name: 'Obsidian', hex: '#0B0C0F' }
    ],
    sizes: ['30', '32', '34', '36', 'Custom Inseam'],
    inventory: { stock: 18, reserved: 3, available: 15, isLowStock: false },
    type: 'hybrid',
    status: 'active',
    badge: 'HAUTE TAILORING',
    dispatchTime: 'Ships in 24 Hours'
  },
  {
    id: 'cf-prod-05',
    name: 'Atelier Bamboo Silk Camp Collar Shirt',
    slug: 'atelier-bamboo-silk-camp-collar-shirt',
    description: 'Fluid drape resort shirt woven from organic bamboo silk satin. Features Cuban notch collar and antique brass metal buttons.',
    category: 'Shirts',
    gender: 'women',
    price: 3999,
    compareAtPrice: 4999,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80'
    ],
    fabric: 'Atelier Bamboo Silk',
    fabricDetails: {
      gsm: '180 GSM',
      origin: 'Bengaluru Looms',
      composition: '70% Bamboo, 30% Mulberry Silk'
    },
    colors: [
      { name: 'Champagne Gold', hex: '#C9A84C' },
      { name: 'Porcelain White', hex: '#FFFFFF' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inventory: { stock: 20, reserved: 1, available: 19, isLowStock: false },
    type: 'hybrid',
    status: 'active',
    badge: 'LUXURY SILK',
    dispatchTime: 'Ships in 24 Hours'
  },
  {
    id: 'cf-prod-06',
    name: 'Structured Canvas Chore Overshirt',
    slug: 'structured-canvas-chore-overshirt',
    description: 'Utilitarian workwear silhouette cut from 340 GSM heavy combed duck canvas with triple-needle reinforced stress points.',
    category: 'Jackets',
    gender: 'men',
    price: 4599,
    compareAtPrice: 5599,
    images: [
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80'
    ],
    fabric: 'Heavy Combed Duck Canvas',
    fabricDetails: {
      gsm: '340 GSM',
      origin: 'Ahmedabad Mills',
      composition: '100% GOTS Organic Cotton'
    },
    colors: [
      { name: 'Forest Olive', hex: '#0F766E' },
      { name: 'Obsidian', hex: '#0B0C0F' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inventory: { stock: 12, reserved: 2, available: 10, isLowStock: false },
    type: 'hybrid',
    status: 'active',
    badge: 'LIMITED DROP',
    dispatchTime: 'Ships in 24 Hours'
  }
];
