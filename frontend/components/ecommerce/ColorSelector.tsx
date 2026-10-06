'use client';

import React from 'react';
import { ProductColor } from '@coded-fit/shared';

interface Props {
  colors: ProductColor[];
  selectedColor: ProductColor;
  onSelect: (color: ProductColor) => void;
}

export const ColorSelector: React.FC<Props> = ({
  colors,
  selectedColor,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-gray-500 font-bold uppercase">COLORWAY:</span>
        <span className="text-obsidian font-bold">{selectedColor.name}</span>
      </div>

      <div className="flex items-center gap-2.5">
        {colors.map((c) => {
          const isSelected = selectedColor.hex === c.hex;
          return (
            <button
              key={c.hex}
              type="button"
              onClick={() => onSelect(c)}
              className={`w-8 h-8 rounded-full p-0.5 border-2 transition-all ${
                isSelected ? 'border-obsidian scale-110' : 'border-transparent hover:scale-105'
              }`}
              title={c.name}
            >
              <div
                className="w-full h-full rounded-full border border-gray-300"
                style={{ backgroundColor: c.hex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
