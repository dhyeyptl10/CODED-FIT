'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@coded-fit/shared';
import { ProductCard } from './ProductCard';

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
}

export const ProductCarousel: React.FC<Props> = ({ title, subtitle, products }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.75;
      containerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-headline font-black text-2xl tracking-tight text-obsidian uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs font-mono text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Carousel controls */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-full border border-border-light bg-porcelain flex items-center justify-center hover:border-obsidian transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-full border border-border-light bg-porcelain flex items-center justify-center hover:border-obsidian transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={containerRef}
        className="flex gap-5 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-68 sm:w-72 shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
