'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Camera, ShieldCheck, Truck, RefreshCw, Star, Heart, Check } from 'lucide-react';
import { Product, ProductColor } from '@coded-fit/shared';
import { SizeSelector } from './SizeSelector';
import { ColorSelector } from './ColorSelector';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useFitStore } from '@/store/fitStore';

interface Props {
  product: Product;
}

export const ProductDetails: React.FC<Props> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Obsidian', hex: '#0B0C0F' }
  );
  const [added, setAdded] = useState(false);

  const { addItem } = useCartStore();
  const { user, toggleWishlist, openLoginModal } = useAuthStore();
  const { recommendedSize } = useFitStore();

  const isWishlisted = user?.wishlist?.includes(product.id) || false;
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToBag = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.compareAtPrice,
      qty: 1,
      size: selectedSize,
      image: product.images[0] || '/images/hero-men.png',
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      type: 'ready-to-wear'
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    if (!user) {
      openLoginModal('otp');
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* 1. Header Info */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.badge && (
            <span className="bg-gold text-obsidian text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              {product.badge}
            </span>
          )}
          <span className="text-xs font-mono text-gray-500 uppercase">
            {product.fabric}
          </span>
        </div>

        <h1 className="font-headline font-black text-2xl sm:text-3xl text-obsidian tracking-tight uppercase">
          {product.name}
        </h1>

        {/* Rating & Dispatch */}
        <div className="flex items-center gap-4 mt-2 text-xs font-mono text-gray-600">
          <div className="flex items-center gap-1 text-gold-dark font-bold">
            <Star size={14} fill="currentColor" />
            <span>4.9 / 5.0</span>
            <span className="text-gray-400 font-normal">(48 Atelier Reviews)</span>
          </div>
          <span>•</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <Truck size={13} /> {product.dispatchTime || 'Ships in 24 Hours'}
          </span>
        </div>
      </div>

      {/* 2. Price Section */}
      <div className="flex items-baseline gap-3 p-4 bg-alabaster rounded-xl border border-border-light">
        <span className="font-headline font-black text-3xl text-obsidian">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="font-mono text-base text-gray-400 line-through">
            ₹{product.compareAtPrice.toLocaleString('en-IN')}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-vermillion text-porcelain text-xs font-mono font-bold px-2 py-0.5 rounded">
            SAVE {discountPercent}%
          </span>
        )}
        <span className="text-[11px] font-mono text-gray-500 ml-auto">Inclusive of all taxes</span>
      </div>

      {/* 3. Color & Size Selectors */}
      {product.colors && product.colors.length > 0 && (
        <ColorSelector
          colors={product.colors}
          selectedColor={selectedColor}
          onSelect={setSelectedColor}
        />
      )}

      <SizeSelector
        sizes={product.sizes}
        selectedSize={selectedSize}
        onSelect={setSelectedSize}
        recommendedSize={recommendedSize}
      />

      {/* 4. Action Buttons (RTW fast add vs MTM Customizer vs Try-on) */}
      <div className="space-y-3 pt-2">
        {/* Primary: Ready to Wear Add to Bag */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToBag}
            className="flex-1 bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian py-4 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
          >
            {added ? <Check size={16} /> : null}
            <span>{added ? 'ADDED TO BAG' : 'ADD TO BAG (READY TO WEAR)'}</span>
          </button>

          <button
            onClick={handleWishlist}
            className={`w-14 rounded-xl border flex items-center justify-center transition-colors ${
              isWishlisted
                ? 'bg-vermillion/10 border-vermillion text-vermillion'
                : 'border-border-light hover:border-obsidian text-obsidian'
            }`}
            title="Add to Wishlist"
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Secondary: Made-to-Measure & Try-On CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link
            href={`/bespoke?productId=${product.id}`}
            className="bg-alabaster-card hover:bg-gold/10 border border-gold text-obsidian py-3 px-3 rounded-xl font-mono font-bold text-[11px] tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles size={14} className="text-gold" />
            <span>CUSTOMIZE THIS GARMENT</span>
          </Link>

          <Link
            href={`/try-on?productId=${product.id}`}
            className="bg-alabaster hover:bg-gray-200/50 border border-border-light text-obsidian py-3 px-3 rounded-xl font-mono font-bold text-[11px] tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <Camera size={14} />
            <span>AR VIRTUAL TRY-ON</span>
          </Link>
        </div>
      </div>

      {/* 5. Haute Couture Guarantees */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-light text-xs font-mono">
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-alabaster border border-border-light">
          <RefreshCw size={16} className="text-gold shrink-0 mt-0.5" />
          <div>
            <strong className="block text-obsidian">Doorstep Trial Protocol</strong>
            <span className="text-gray-500 text-[10px]">Free home trial &amp; alterations</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-alabaster border border-border-light">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-obsidian">GOTS Organic Certified</strong>
            <span className="text-gray-500 text-[10px]">100% Ahmedabad Mills</span>
          </div>
        </div>
      </div>

      {/* 6. Product Description & Fabric Specifications */}
      <div className="pt-4 border-t border-border-light space-y-4">
        <div>
          <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-obsidian mb-1.5">
            GARMENT SPECIFICATIONS
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {product.fabricDetails && (
          <div className="p-3.5 bg-alabaster rounded-lg border border-border-light space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Fabric Composition:</span>
              <strong className="text-obsidian">{product.fabricDetails.composition || '100% GOTS Organic Cotton'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Origin / Mill:</span>
              <strong className="text-obsidian">{product.fabricDetails.origin || 'Ahmedabad, India'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fabric Weight:</span>
              <strong className="text-obsidian">{product.fabricDetails.gsm || '240 GSM'}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
