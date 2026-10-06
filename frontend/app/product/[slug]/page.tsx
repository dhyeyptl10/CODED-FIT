'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {useCatalog} from '@/lib/useCatalog';
import { ProductGallery } from '@/components/ecommerce/ProductGallery';
import { ProductDetails } from '@/components/ecommerce/ProductDetails';
import { ProductCarousel } from '@/components/ecommerce/ProductCarousel';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const {products,loading,error}=useCatalog();
  const product=products.find(p=>p.slug===slug);
  if(loading)return <p className="p-12">Loading product…</p>;
  if(!product)return <p className="p-12">{error || 'Product not found.'} <Link href="/shop">Back to shop</Link></p>;
  const relatedProducts = products.filter((p) => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
        <Link href="/shop" className="hover:text-obsidian flex items-center gap-1">
          <ArrowLeft size={12} />
          <span>BACK TO CATALOG</span>
        </Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-obsidian font-bold truncate">{product.name}</span>
      </div>

      {/* Main PDP 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Col: Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Right Col: Details, Options, & Actions */}
        <div className="lg:col-span-5">
          <ProductDetails product={product} />
        </div>
      </div>

      {/* Related Products Carousel */}
      <div className="pt-8 border-t border-border-light">
        <ProductCarousel
          title="RECOMMENDED CAPSULES"
          subtitle="Pair with these tailored pieces for a unified atelier silhouette"
          products={relatedProducts}
        />
      </div>
    </div>
  );
}
