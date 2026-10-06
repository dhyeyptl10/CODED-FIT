'use client';

import React from 'react';
import { CuffStyle } from '@coded-fit/shared';
import { useCustomizerStore } from '@/store/customizerStore';

const CUFF_OPTIONS: { id: CuffStyle; name: string; desc: string }[] = [
  { id: 'barrel', name: 'Single-Button Barrel', desc: 'Crisp angled standard corner' },
  { id: 'french', name: 'Haute French Double', desc: 'Fold-back luxury cuff requiring cufflinks' },
  { id: 'rounded', name: 'Italian Rounded', desc: 'Soft circular edge for comfort' },
  { id: 'mitered', name: 'Precision Mitered', desc: 'Double notched contemporary tailoring' }
];

export const CuffSelector: React.FC = () => {
  const { cuff, setCuff } = useCustomizerStore();

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-mono font-bold text-gray-700 uppercase block">
        CUFF STYLING
      </label>
      <div className="grid grid-cols-2 gap-2">
        {CUFF_OPTIONS.map((item) => {
          const isSelected = cuff === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCuff(item.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-gold bg-gold/5 shadow-xs'
                  : 'border-border-light bg-porcelain hover:border-gray-400'
              }`}
            >
              <span className="font-headline font-bold text-xs text-obsidian block">{item.name}</span>
              <p className="text-[10px] font-mono text-gray-500 mt-0.5">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
