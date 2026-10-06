'use client';

import React from 'react';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import {
  BespokeProductionStage,
  BESPOKE_PRODUCTION_STAGES,
  BESPOKE_STAGE_LABELS
} from '@coded-fit/shared';

interface Props {
  currentStage: BespokeProductionStage;
  orderNumber: string;
}

export const OrderTracker: React.FC<Props> = ({ currentStage, orderNumber }) => {
  const stages: BespokeProductionStage[] = [
    BESPOKE_PRODUCTION_STAGES.PLACED,
    BESPOKE_PRODUCTION_STAGES.FIT_VERIFIED,
    BESPOKE_PRODUCTION_STAGES.PATTERN_CREATED,
    BESPOKE_PRODUCTION_STAGES.CUTTING,
    BESPOKE_PRODUCTION_STAGES.STITCHING,
    BESPOKE_PRODUCTION_STAGES.QC,
    BESPOKE_PRODUCTION_STAGES.TRIAL,
    BESPOKE_PRODUCTION_STAGES.ALTERATION,
    BESPOKE_PRODUCTION_STAGES.FINAL_PRODUCTION,
    BESPOKE_PRODUCTION_STAGES.SHIPPED
  ];

  const currentIdx = stages.indexOf(currentStage);

  return (
    <div className="p-6 bg-porcelain rounded-2xl border border-border-light shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
            LIVE ATELIER PIPELINE TRACKER
          </span>
          <h3 className="font-headline font-black text-lg text-obsidian tracking-tight uppercase">
            ORDER {orderNumber}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-gold-dark font-bold flex items-center gap-1">
            <Sparkles size={12} /> {BESPOKE_STAGE_LABELS[currentStage] || currentStage}
          </span>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-light">
        {stages.map((stg, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          const label = BESPOKE_STAGE_LABELS[stg];

          return (
            <div key={stg} className="relative flex items-center gap-4">
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-gold border-gold text-obsidian animate-pulse'
                    : 'bg-porcelain border-gray-300 text-gray-300'
                }`}
              >
                {isDone ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
              </div>

              <div>
                <h4
                  className={`text-xs font-mono uppercase tracking-wider ${
                    isCurrent ? 'font-black text-obsidian' : isDone ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {label}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
