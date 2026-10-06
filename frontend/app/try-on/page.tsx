'use client';

import React from 'react';
import { TryOnViewer } from '@/components/tryon/TryOnViewer';

export default function TryOnPage() {
  return (
    <div className="py-8 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl space-y-2">
        <span className="text-xs font-mono font-bold text-gold-dark tracking-widest uppercase">
          ✦ LIVE AR VIEWFINDER &amp; PHOTO DRAPE ✦
        </span>
        <h1 className="font-headline font-black text-3xl sm:text-4xl text-obsidian tracking-tight uppercase">
          AI VIRTUAL TRY-ON
        </h1>
        <p className="text-sm font-body text-gray-600 leading-relaxed">
          Align your upper body with our biometric silhouette guidelines to preview garments draped in real-time onto your frame.
        </p>
      </div>

      <TryOnViewer />
    </div>
  );
}
