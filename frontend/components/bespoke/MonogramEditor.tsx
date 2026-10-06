'use client';

import React from 'react';
import { useCustomizerStore } from '@/store/customizerStore';

export const MonogramEditor: React.FC = () => {
  const { monogramText, monogramEnabled, setMonogram } = useCustomizerStore();

  return (
    <div className="p-4 bg-alabaster rounded-xl border border-border-light space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-headline font-bold text-xs text-obsidian uppercase">
            UNIT-OF-ONE MONOGRAM
          </h4>
          <p className="text-[10px] font-mono text-gray-500">
            Gold metallic thread shown on the chest (+₹250)
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={monogramEnabled}
            onChange={(e) => setMonogram(monogramText, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
        </label>
      </div>

      {monogramEnabled && (
        <div className="space-y-1.5 animate-fadeIn">
          <label className="text-[10px] font-mono text-gray-600 block">
            INITIALS (MAX 4 CHARACTERS)
          </label>
          <input
            type="text"
            maxLength={4}
            value={monogramText}
            onChange={(e) => setMonogram(e.target.value.toUpperCase(), true)}
            placeholder="e.g. CF"
            className="w-full px-3 py-2 bg-porcelain border border-border-light rounded-lg font-mono font-bold text-sm tracking-widest text-obsidian focus:outline-none focus:border-gold uppercase"
          />
        </div>
      )}
    </div>
  );
};
