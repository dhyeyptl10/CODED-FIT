'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';

interface FilterState {
  category: string;
  gender: string;
  fit: string;
  fabric: string;
  maxPrice: number;
  sort: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const FilterDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset
}) => {
  if (!isOpen) return null;

  const categories = ['All', 'T-Shirts', 'Shirts', 'Bottoms', 'Jackets', 'Hoodies'];
  const genders = ['all', 'men', 'women', 'unisex'];
  const fits = ['all', 'slim', 'regular', 'relaxed', 'oversized'];
  const fabrics = ['all', 'GOTS Cotton', 'Linen', 'Heavy Fleece', 'Bamboo Silk'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-obsidian/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-porcelain flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-4 bg-alabaster border-b border-border-light flex justify-between items-center">
            <h3 className="font-headline font-black text-base text-obsidian uppercase tracking-wider">
              FILTERS &amp; REFINE
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={onReset}
                className="text-xs font-mono text-gray-500 hover:text-obsidian flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-obsidian">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Filter Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
            {/* Category */}
            <div>
              <label className="font-bold text-gray-700 block mb-2 uppercase">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onChange({ ...filters, category: cat === 'All' ? '' : cat })}
                    className={`px-3 py-1.5 rounded-full border transition-colors ${
                      (cat === 'All' && !filters.category) || filters.category === cat
                        ? 'bg-obsidian text-porcelain border-obsidian'
                        : 'bg-alabaster text-obsidian border-border-light hover:border-obsidian'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="font-bold text-gray-700 block mb-2 uppercase">Gender</label>
              <div className="grid grid-cols-2 gap-1.5">
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => onChange({ ...filters, gender: g })}
                    className={`py-2 rounded border uppercase transition-colors ${
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

            {/* Drape & Fit */}
            <div>
              <label className="font-bold text-gray-700 block mb-2 uppercase">Drape / Fit Profile</label>
              <div className="flex flex-wrap gap-1.5">
                {fits.map((fit) => (
                  <button
                    key={fit}
                    onClick={() => onChange({ ...filters, fit })}
                    className={`px-3 py-1.5 rounded border capitalize transition-colors ${
                      filters.fit === fit
                        ? 'bg-gold text-obsidian border-gold font-bold'
                        : 'bg-alabaster text-obsidian border-border-light hover:border-obsidian'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Mill */}
            <div>
              <label className="font-bold text-gray-700 block mb-2 uppercase">Textile Archive</label>
              <div className="flex flex-wrap gap-1.5">
                {fabrics.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => onChange({ ...filters, fabric: fab === 'all' ? '' : fab })}
                    className={`px-3 py-1.5 rounded border transition-colors ${
                      (fab === 'all' && !filters.fabric) || filters.fabric === fab
                        ? 'bg-obsidian text-porcelain border-obsidian'
                        : 'bg-alabaster text-obsidian border-border-light hover:border-obsidian'
                    }`}
                  >
                    {fab}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <div className="flex justify-between font-bold mb-2">
                <span className="uppercase">Maximum Price</span>
                <span className="text-gold-dark">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={15000}
                step={500}
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-gold"
              />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 bg-alabaster border-t border-border-light">
            <button
              onClick={onClose}
              className="w-full bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian py-3 rounded-lg font-mono font-bold text-xs tracking-wider uppercase transition-colors"
            >
              SHOW RESULTS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
