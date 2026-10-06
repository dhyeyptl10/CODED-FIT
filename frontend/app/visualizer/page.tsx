'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Save, Check, UserCheck, Shield } from 'lucide-react';
import { BodyArchetype } from '@coded-fit/shared';
import { useFitStore } from '@/store/fitStore';
import { useAuthStore } from '@/store/authStore';
import {AvatarViewer} from '@/components/bespoke/AvatarViewer';
import { BMIRadialGauge } from '@/components/visualizer/BMIRadialGauge';
import { api } from '@/services/api';

const ARCHETYPES: { id: BodyArchetype; label: string; desc: string }[] = [
  { id: 'athletic', label: 'Athletic V-Taper', desc: 'Broad shoulders tapering to narrow waist' },
  { id: 'hourglass', label: 'Balanced Hourglass', desc: 'Symmetrical shoulder and hip proportions' },
  { id: 'rectangle', label: 'Lean Rectangle', desc: 'Uniform vertical silhouette' },
  { id: 'pear', label: 'Pear / Triangle', desc: 'Graduated hip and thigh width' },
  { id: 'inverted_triangle', label: 'Inverted Triangle', desc: 'Pronounced chest and upper lats' },
  { id: 'plus', label: 'Curvy / Plus Figure', desc: 'Fuller silhouette with relaxed ease' }
];

export default function VisualizerPage() {
  const {
    heightCm,
    weightKg,
    chestIn,
    waistIn,
    hipIn,
    shoulderIn,
    inseamIn,
    bodyShape,
    setMeasurement,
    setArchetype,
    verifyByUser,
    getProfileSnapshot
  } = useFitStore();

  const { isAuthenticated, openLoginModal } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!isAuthenticated) {
      openLoginModal('otp');
      return;
    }

    try {
      setSaving(true);
      verifyByUser();
      const snapshot = getProfileSnapshot();
      await api.saveFitProfile(snapshot);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Could not save fit profile. Profile cached locally.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Page Header */}
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-mono font-bold text-gold-dark tracking-widest uppercase flex items-center gap-1.5">
          <Sparkles size={14} /> ANTHROPOMETRIC CALIBRATION
        </span>
        <h1 className="font-headline font-black text-3xl sm:text-4xl text-obsidian tracking-tight uppercase">
          AI BODY VISUALIZER &amp; FIT PROFILE
        </h1>
        <p className="text-sm font-body text-gray-600 leading-relaxed">
          Calibrate your biometric measurements for millimeter-accurate garment draping. Your sizing parameters are stored in your profile and automatically applied to both ready-to-wear sizing recommendations and bespoke tailoring patterns.
        </p>
      </div>

      {/* 2. Main Content 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 bg-porcelain p-6 sm:p-8 rounded-2xl border border-border-light shadow-xs space-y-8">
          {/* Height & Weight */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-sm text-obsidian uppercase tracking-wider">
              1. BASIC STATS (HEIGHT &amp; WEIGHT)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-600">Height:</span>
                  <span className="text-obsidian">{heightCm} cm ({Math.floor(heightCm / 30.48)}&apos;{Math.round((heightCm % 30.48) / 2.54)}&quot;)</span>
                </div>
                <input
                  type="range"
                  min={140}
                  max={215}
                  value={heightCm}
                  onChange={(e) => setMeasurement('heightCm', Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-600">Weight:</span>
                  <span className="text-obsidian">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={150}
                  value={weightKg}
                  onChange={(e) => setMeasurement('weightKg', Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>
            </div>
          </div>

          {/* Core Body Measurements */}
          <div className="space-y-4 pt-4 border-t border-border-light">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-sm text-obsidian uppercase tracking-wider">
                2. BIOMETRIC CIRCUMFERENCES (INCHES)
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                USER CALIBRATED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Chest */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-600">Chest Circumference:</span>
                  <span className="text-obsidian">{chestIn}&quot;</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={56}
                  step={0.5}
                  value={chestIn}
                  onChange={(e) => setMeasurement('chestIn', Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>

              {/* Waist */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-600">Waist (Narrowest point):</span>
                  <span className="text-obsidian">{waistIn}&quot;</span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={52}
                  step={0.5}
                  value={waistIn}
                  onChange={(e) => setMeasurement('waistIn', Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>

              {/* Hips */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-600">Hip Circumference:</span>
                  <span className="text-obsidian">{hipIn}&quot;</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={56}
                  step={0.5}
                  value={hipIn}
                  onChange={(e) => setMeasurement('hipIn', Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>

              {/* Shoulders */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-600">Shoulder Width (Point-to-Point):</span>
                  <span className="text-obsidian">{shoulderIn}&quot;</span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={24}
                  step={0.5}
                  value={shoulderIn}
                  onChange={(e) => setMeasurement('shoulderIn', Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>
            </div>
          </div>

          {/* Archetype Grid */}
          <div className="space-y-4 pt-4 border-t border-border-light">
            <h3 className="font-headline font-bold text-sm text-obsidian uppercase tracking-wider">
              3. SELECT BODY ARCHETYPE
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ARCHETYPES.map((arch) => {
                const isSelected = bodyShape === arch.id;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setArchetype(arch.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-gold bg-gold/10 shadow-xs'
                        : 'border-border-light bg-alabaster hover:border-gray-400'
                    }`}
                  >
                    <span className="font-headline font-bold text-xs text-obsidian block">
                      {arch.label}
                    </span>
                    <p className="text-[10px] font-mono text-gray-500 mt-0.5 line-clamp-2">
                      {arch.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save CTA */}
          <div className="pt-4 border-t border-border-light flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              <span>{saved ? 'FIT PROFILE SAVED' : saving ? 'SAVING...' : 'SAVE BIOMETRIC PROFILE'}</span>
            </button>

            <Link
              href="/bespoke"
              className="bg-gold hover:bg-gold-light text-obsidian px-6 py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              <span>APPLY TO 3D ATELIER</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right Column: Radial Gauge & Sizing Output */}
        <div className="lg:col-span-5 space-y-6">
          <div className="h-[620px]"><AvatarViewer /></div>
            <p className="text-xs text-gray-500">Measurement-based illustration. Real-person photo try-on is available on the Try-On page; accuracy depends on the image and provider.</p>
            <BMIRadialGauge />

          <div className="p-5 bg-alabaster rounded-2xl border border-border-light text-xs font-mono space-y-3">
            <span className="font-bold text-obsidian uppercase block">HOW CODED FIT USES THIS DATA</span>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              1. <strong>Ready-to-Wear</strong>: Automatically selects and highlights your ideal size chip across every product page.
            </p>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              2. <strong>Bespoke Customizer</strong>: Seeds exact centimeter parameters into our digital pattern cutter for single-needle tailoring.
            </p>
            <div className="pt-2 flex items-center gap-2 text-emerald-700 text-[10px] font-bold">
              <Shield size={13} />
              <span>Encrypted biometric privacy guaranteed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
