'use client';

import React from 'react';
import { CollarStyle } from '@coded-fit/shared';
import { useCustomizerStore } from '@/store/customizerStore';

const COLLAR_OPTIONS: { id: CollarStyle; name: string; desc: string; priceAdd: number }[] = [
  { id: 'spread', name: 'Milanese Spread', desc: 'Versatile contemporary spread for casual or formal', priceAdd: 0 },
  { id: 'band', name: 'Mandarin / Band', desc: 'Clean architectural collar without lapel points', priceAdd: 150 },
  { id: 'cuban', name: 'Cuban Camp Resort', desc: 'Relaxed open notch collar for summer luxury', priceAdd: 150 },
  { id: 'cutaway', name: 'Haute Cutaway', desc: 'Wide horizontal angle emphasizing neck structure', priceAdd: 150 }
];

export const CollarSelector: React.FC = () => {
  const { collar, setCollar } = useCustomizerStore();

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-mono font-bold text-gray-700 uppercase block">
        COLLAR ARCHITECTURE
      </label>
      <div className="grid grid-cols-2 gap-2">
        {COLLAR_OPTIONS.map((c) => {
          const isSelected = collar === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCollar(c.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-gold bg-gold/5 shadow-xs'
                  : 'border-border-light bg-porcelain hover:border-gray-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-headline font-bold text-xs text-obsidian">{c.name}</span>
                <span className="text-[10px] font-mono text-gray-500">
                  {c.priceAdd === 0 ? 'INC' : `+₹${c.priceAdd}`}
                </span>
              </div>
              <p className="text-[10px] font-mono text-gray-500 mt-1 line-clamp-2">{c.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
