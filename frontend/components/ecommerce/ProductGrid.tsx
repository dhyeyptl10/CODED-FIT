'use client';

import React from 'react';
import { Product } from '@coded-fit/shared';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export const ProductGrid: React.FC<Props> = ({ products, columns = 4 }) => {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 font-mono text-sm">
        No garments found matching your criteria.
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${colClasses[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
