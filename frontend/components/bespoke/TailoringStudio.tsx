'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Ruler, Camera, Scissors } from 'lucide-react';
import { AvatarViewer } from '@/components/bespoke/AvatarViewer';
import { CustomizerPanel } from '@/components/bespoke/CustomizerPanel';
import {SavedLooks} from '@/components/bespoke/SavedLooks';
import { VoiceButton } from '@/components/ai/VoiceButton';

export default function BespokeStudioPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Studio Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border-light">
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="p-2 text-gray-500 hover:text-obsidian rounded-lg hover:bg-alabaster transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-gold-dark uppercase tracking-widest">
              <Sparkles size={12} />
              <span>3D UNIT-OF-ONE TAILORING</span>
            </div>
            <h1 className="font-headline font-black text-2xl text-obsidian tracking-tight uppercase">
              YOUR CHARACTER. YOUR FIT.
            </h1>
          </div>
        </div>

        {/* Quick Links to Fit Profile & Try-On */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <Link
            href="/visualizer"
            className="bg-alabaster hover:bg-gold/10 text-obsidian px-3 py-2 rounded-lg border border-border-light flex items-center gap-1.5 transition-colors"
          >
            <Ruler size={13} className="text-gold" />
            <span>CALIBRATE 3D FIT</span>
          </Link>

          <Link
            href="/try-on"
            className="bg-alabaster hover:bg-gray-200 text-obsidian px-3 py-2 rounded-lg border border-border-light flex items-center gap-1.5 transition-colors"
          >
            <Camera size={13} />
            <span>AR TRY-ON</span>
          </Link>

          <div className="ml-1">
            <VoiceButton />
          </div>
        </div>
      </div>

      <SavedLooks />
      {/* Main 2-Column Bespoke Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[640px]">
        {/* Left: 3D Viewport */}
        <div className="lg:col-span-7 h-[410px] sm:h-[560px] lg:h-[640px]">
          <AvatarViewer />
        </div>

        {/* Right: Customization Controls & Drawer */}
        <div className="lg:col-span-5 min-w-0 lg:h-[640px]">
          <CustomizerPanel />
        </div>
      </div>
    </div>
  );
}
