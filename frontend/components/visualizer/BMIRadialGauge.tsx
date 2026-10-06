'use client';

import React from 'react';
import { Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { useFitStore } from '@/store/fitStore';

export const BMIRadialGauge: React.FC = () => {
  const { bmi, recommendedSize, confidenceScore, isAIEstimated, verifiedByUser } = useFitStore();

  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: 'Lean / Underweight', color: '#3B82F6' };
    if (val <= 24.9) return { label: 'Optimal Fit Archetype', color: '#10B981' };
    if (val <= 29.9) return { label: 'Athletic Plus Archetype', color: '#F59E0B' };
    return { label: 'Curvy Plus Archetype', color: '#C9A84C' };
  };

  const category = getBMICategory(bmi);

  return (
    <div className="p-5 bg-porcelain rounded-2xl border border-border-light shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
            BIOMETRIC RADIAL CALIBRATION
          </span>
          <h4 className="font-headline font-black text-lg text-obsidian uppercase">
            {category.label}
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-gray-500 block">BMI SCORE</span>
          <span className="font-headline font-black text-2xl text-obsidian">{bmi}</span>
        </div>
      </div>

      {/* Radial Bar Gauge */}
      <div className="space-y-1.5">
        <div className="w-full bg-alabaster-card h-3 rounded-full overflow-hidden flex">
          <div className="w-1/4 bg-blue-400 opacity-60" title="Lean (<18.5)" />
          <div className="w-2/4 bg-emerald-500 opacity-80" title="Optimal (18.5 - 24.9)" />
          <div className="w-1/4 bg-amber-500 opacity-80" title="Athletic Plus (>25)" />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-gray-500">
          <span>16 (LEAN)</span>
          <span>22 (OPTIMAL)</span>
          <span>32+ (PLUS)</span>
        </div>
      </div>

      {/* Recommended Sizing Box */}
      <div className="p-4 bg-alabaster rounded-xl border border-border-light flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">RECOMMENDED PATTERN</span>
          <strong className="font-headline font-black text-xl text-obsidian">
            SIZE {recommendedSize}
          </strong>
        </div>
        <div className="text-right font-mono text-xs">
          <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
            <Sparkles size={12} /> {confidenceScore > 0 ? `${confidenceScore}% PROVIDER SCORE` : 'SIZE ESTIMATE'}
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5 block">
            {verifiedByUser ? 'User entered' : 'Default measurements'}
          </span>
        </div>
      </div>

      {/* Honest Medical Disclaimer */}
      <div className="flex items-start gap-2 p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-[10px] font-mono text-amber-900 leading-normal">
        <AlertCircle size={14} className="shrink-0 text-amber-600 mt-0.5" />
        <span>
          Honest atelier notice: Body metrics and BMI calculations are calibrated exclusively for garment draping and bespoke tailoring. They do not constitute medical or clinical health assessments.
        </span>
      </div>
    </div>
  );
};
