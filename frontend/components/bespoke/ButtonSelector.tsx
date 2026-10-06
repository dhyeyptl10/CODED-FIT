'use client';

import React from 'react';
import { ButtonStyle } from '@coded-fit/shared';
import { useCustomizerStore } from '@/store/customizerStore';

const BUTTON_OPTIONS: { id: ButtonStyle; name: string; hex: string; desc: string }[] = [
  { id: 'matte-obsidian', name: 'Matte Obsidian', hex: '#14151A', desc: 'Minimalist stealth industrial finish' },
  { id: 'mother-of-pearl', name: 'Mother of Pearl', hex: '#F4EFEA', desc: 'Natural iridescent luxury sheen' },
  { id: 'horn', name: 'Organic Horn', hex: '#5C4033', desc: 'Warm artisanal striated texture' },
  { id: 'antique-brass', name: 'Antique Brass', hex: '#C9A84C', desc: 'Heavy metallic heritage look' }
];

export const ButtonSelector: React.FC = () => {
  const { button, setButton } = useCustomizerStore();

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-mono font-bold text-gray-700 uppercase block">
        BUTTON MATERIAL
      </label>
      <div className="grid grid-cols-2 gap-2">
        {BUTTON_OPTIONS.map((btn) => {
          const isSelected = button === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => setButton(btn.id)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                isSelected
                  ? 'border-gold bg-gold/5 shadow-xs'
                  : 'border-border-light bg-porcelain hover:border-gray-400'
              }`}
            >
              <div
                className="w-5 h-5 rounded-full border border-gray-400 shrink-0 shadow-xs"
                style={{ backgroundColor: btn.hex }}
              />
              <div>
                <span className="font-headline font-bold text-xs text-obsidian block">{btn.name}</span>
                <p className="text-[10px] font-mono text-gray-500 mt-0.5">{btn.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
