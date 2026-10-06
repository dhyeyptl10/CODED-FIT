'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@coded-fit/shared';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const { addItem } = useCartStore();
  const { user, toggleWishlist, openLoginModal } = useAuthStore();

  const isWishlisted = user?.wishlist?.includes(product.id) || false;
  const primaryImage = product.images[0] || '/images/placeholder.svg';
  const canQuickAdd = product.inventory?.available > 0 && product.sizes.length > 0 && product.type !== 'made-to-measure';
  const secondaryImage = product.images[1] || primaryImage;
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canQuickAdd) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.compareAtPrice,
      qty: 1,
      size: selectedSize,
      image: primaryImage,
      colorName: product.colors[0]?.name,
      colorHex: product.colors[0]?.hex,
      type: product.type === 'made-to-measure' ? 'made-to-measure' : 'ready-to-wear'
    });
    setQuickAddOpen(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openLoginModal('email');
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div
      className="cf-product-card group relative flex flex-col bg-porcelain rounded-xl border border-border-light hover:border-gold/60 transition-all duration-300 hover:shadow-lg overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {/* 1. Image Viewport with Hover Flip */}
      <div className="relative block overflow-hidden bg-alabaster">
      <Link href={`/product/${product.slug}`} className="block aspect-[3/4]">
        <img
          src={hovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          loading="lazy"
          onError={e=>{e.currentTarget.src='/images/placeholder.svg';}}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </Link>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-obsidian/90 backdrop-blur-xs text-porcelain text-[9px] font-mono font-bold tracking-wider px-2 py-1 rounded">
            {product.badge}
          </span>
        )}

        {discountPercent > 0 && !product.badge && (
          <span className="absolute top-12 right-2.5 bg-vermillion text-porcelain text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isWishlisted ? 'bg-vermillion text-white' : 'bg-porcelain/80 text-obsidian hover:bg-porcelain hover:text-vermillion'
          }`}
          title="Add to Wishlist"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Action Overlay buttons on hover */}
        <div className="cf-product-actions absolute bottom-2.5 left-2.5 flex items-center gap-1.5 transition-opacity duration-200">
          <button
            disabled={!canQuickAdd}
            aria-expanded={quickAddOpen}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickAddOpen(!quickAddOpen);
            }}
            className="bg-obsidian/90 hover:bg-obsidian text-porcelain text-[10px] font-mono font-bold px-2.5 py-1.5 rounded flex items-center gap-1"
          >
            <ShoppingBag size={12} />
            <span>{product.type === 'made-to-measure' ? 'CUSTOM FIT' : canQuickAdd ? 'QUICK ADD' : 'SOLD OUT'}</span>
          </button>

          <Link
            href={`/bespoke?productId=${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-gold/90 hover:bg-gold text-white text-[10px] font-mono font-bold px-2 py-1.5 rounded flex items-center gap-1"
            title="Open in 3D Bespoke Studio"
          >
            <Sparkles size={12} />
            <span>CUSTOMIZE</span>
          </Link>
        </div>
      </div>

      {/* Quick Add Size Tray */}
      {quickAddOpen && (
        <div className="p-3 bg-alabaster border-b border-border-light flex flex-col gap-2 animate-fadeIn">
          <span className="text-[10px] font-mono font-bold text-gray-500">SELECT SIZE:</span>
          <div className="flex gap-1.5 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-2 py-1 text-xs font-mono font-bold rounded border transition-colors ${
                  selectedSize === s
                    ? 'bg-obsidian text-porcelain border-obsidian'
                    : 'bg-porcelain text-obsidian border-border-light hover:border-obsidian'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={handleQuickAdd}
            className="w-full mt-1 bg-vermillion text-porcelain py-1.5 rounded text-[11px] font-mono font-bold tracking-wider"
          >
            ADD {selectedSize} TO BAG
          </button>
        </div>
      )}

      {/* 2. Meta info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-0.5">
            {product.fabric}
          </span>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-headline font-bold text-sm text-obsidian line-clamp-1 hover:text-gold transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-headline font-black text-sm text-obsidian">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {!!product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs font-mono text-gray-400 line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-border-light"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] font-mono text-gray-400">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



