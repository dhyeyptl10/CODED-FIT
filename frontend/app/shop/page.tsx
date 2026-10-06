'use client';

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import {useSearchParams} from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, Search, Sparkles } from 'lucide-react';
import {useCatalog} from '@/lib/useCatalog';
import { ProductGrid } from '@/components/ecommerce/ProductGrid';
import { FilterDrawer } from '@/components/ecommerce/FilterDrawer';

export default function ShopPage() {
  return <Suspense fallback={<p className="p-10" role="status">Loading collection…</p>}><ShopCollection/></Suspense>;
}
function ShopCollection() {
  const params=useSearchParams();
  const {products,loading,error,retry}=useCatalog();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    category: '',
    gender: 'all',
    fit: 'all',
    fabric: '',
    maxPrice: 15000,
    sort: 'featured'
  });

  useEffect(()=>{
    setSearchQuery(params.get('search') || '');
    setFilters(previous=>({...previous,category:params.get('category') || '',gender:['men','women','unisex'].includes(params.get('gender') || '')?params.get('gender')!:'all'}));
  },[params]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const searchable=[p.name,p.fabric,p.description,p.category,...p.colors.map(c=>c.name)].join(' ').toLowerCase();
      if (searchQuery.trim() && !searchQuery.toLowerCase().trim().split(/\s+/).every(word=>searchable.includes(word))) {
        return false;
      }
      if (filters.category && p.category !== filters.category) {
        return false;
      }
      if (filters.gender !== 'all' && p.gender !== filters.gender && p.gender !== 'unisex') {
        return false;
      }
      if (filters.fit !== 'all' && !searchable.includes(filters.fit)) return false;
      if (filters.fabric && filters.fabric !== 'all' && !p.fabric.toLowerCase().includes(filters.fabric.toLowerCase())) {
        return false;
      }
      if (p.price > filters.maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price;
      if (filters.sort === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [searchQuery, filters, products]);

  const handleResetFilters = () => {
    setFilters({
      category: '',
      gender: 'all',
      fit: 'all',
      fabric: '',
      maxPrice: 15000,
      sort: 'featured'
    });
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {loading && <p role="status">Loading collection…</p>}{error && <div role="alert">The collection couldn’t load. <button className="underline" onClick={retry}>Try again</button></div>}
      {/* 1. Header & Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border-light">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold-dark font-bold mb-1">
            <Sparkles size={13} />
            <span>ATELIER ARCHIVE CATALOG</span>
          </div>
          <h1 className="font-headline font-black text-3xl sm:text-4xl text-obsidian uppercase tracking-tight">
            COLLECTIONS &amp; CAPSULES
          </h1>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              aria-label="Search garments and fabrics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search garments, fabrics..."
              className="w-full pl-9 pr-3 py-2 bg-porcelain border border-border-light rounded-lg text-xs font-mono text-obsidian focus:outline-none focus:border-gold"
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-1.5 bg-obsidian text-porcelain px-3 py-2 rounded-lg text-xs font-mono font-bold"
          >
            <SlidersHorizontal size={14} />
            <span>FILTER</span>
          </button>
        </div>
      </div>

      {/* 2. Main Shop Layout: Desktop Sidebar Filters + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (Left Col) */}
        <aside className="hidden md:block md:col-span-3 space-y-6 bg-porcelain p-5 rounded-2xl border border-border-light text-xs font-mono">
          <div className="flex justify-between items-center pb-3 border-b border-border-light font-bold">
            <span className="uppercase text-obsidian">REFINE CATALOG</span>
            <button
              onClick={handleResetFilters}
              className="text-gray-400 hover:text-obsidian text-[11px]"
            >
              Reset
            </button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <span className="font-bold text-gray-700 block uppercase">Category</span>
            {['', 'Shirts', 'T-Shirts', 'Bottoms', 'Hoodies'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters({ ...filters, category: cat })}
                className={`block w-full text-left py-1 transition-colors ${
                  filters.category === cat
                    ? 'font-bold text-obsidian text-gold-dark'
                    : 'text-gray-500 hover:text-obsidian'
                }`}
              >
                {cat === '' ? '✦ All Garments' : cat}
              </button>
            ))}
          </div>

          {/* Gender */}
          <div className="space-y-2 pt-3 border-t border-border-light">
            <span className="font-bold text-gray-700 block uppercase">Gender</span>
            <div className="grid grid-cols-2 gap-1.5">
              {['all', 'men', 'women', 'unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => setFilters({ ...filters, gender: g })}
                  className={`py-1.5 rounded border uppercase transition-colors ${
                    filters.gender === g
                      ? 'bg-obsidian text-porcelain border-obsidian'
                      : 'bg-alabaster text-obsidian border-border-light hover:border-obsidian'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-2 pt-3 border-t border-border-light">
            <div className="flex justify-between font-bold">
              <span className="uppercase">Max Price</span>
              <span className="text-gold-dark">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-gold"
            />
          </div>
        </aside>

        {/* Product Grid Area (Right Col) */}
        <div className="md:col-span-9 space-y-6">
          {/* Top Bar Sort Dropdown */}
          <div className="flex justify-between items-center text-xs font-mono bg-alabaster p-3 rounded-xl border border-border-light">
            <span className="text-gray-500">
              SHOWING <strong className="text-obsidian">{filteredProducts.length}</strong> PIECES
            </span>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 hidden sm:inline">SORT BY:</span>
              <select
                aria-label="Sort products"
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="bg-porcelain border border-border-light rounded px-2.5 py-1 text-obsidian focus:outline-none focus:border-gold font-bold"
              >
                <option value="featured">Featured Atelier Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {!loading && !error && <ProductGrid products={filteredProducts} columns={3} />}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
}
