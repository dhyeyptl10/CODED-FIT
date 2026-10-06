'use client';

import React from 'react';
import Link from 'next/link';
import { Ruler, Sparkles } from 'lucide-react';

interface Props {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
  recommendedSize?: string;
}

export const SizeSelector: React.FC<Props> = ({
  sizes,
  selectedSize,
  onSelect,
  recommendedSize
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-gray-500 font-bold uppercase">SELECT SIZE</span>
        <div className="flex items-center gap-3">
          {recommendedSize && (
            <span className="text-gold font-bold flex items-center gap-1">
              <Sparkles size={11} /> AI FIT RECOMMENDS: {recommendedSize}
            </span>
          )}
          <Link
            href="/visualizer"
            className="text-obsidian hover:text-gold flex items-center gap-1 underline underline-offset-2"
          >
            <Ruler size={12} /> Sizing Guide
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isRecommended = recommendedSize === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              className={`py-3 rounded-lg font-mono text-xs font-bold transition-all relative border ${
                isSelected
                  ? 'bg-obsidian text-porcelain border-obsidian shadow-sm'
                  : 'bg-porcelain text-obsidian border-border-light hover:border-obsidian'
              }`}
            >
              {size}
              {isRecommended && (
                <span className="absolute -top-1.5 -right-1 w-2 h-2 rounded-full bg-gold border border-porcelain" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
