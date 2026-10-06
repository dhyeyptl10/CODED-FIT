'use client';

import React from 'react';
import Link from 'next/link';
import { User, Package, Ruler, Scissors, Heart, Shield, LogOut, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AccountOverviewPage() {
  const { user, isAuthenticated, openLoginModal, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-alabaster mx-auto flex items-center justify-center text-gray-400 border border-border-light">
          <User size={28} />
        </div>
        <h2 className="font-headline font-black text-xl text-obsidian uppercase">
          SIGN IN TO YOUR ATELIER ACCOUNT
        </h2>
        <p className="text-xs font-mono text-gray-500">
          Access your biometric fit profile, saved 3D bespoke designs, and order history.
        </p>
        <button
          onClick={() => openLoginModal('email')}
          className="bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian px-6 py-3 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-colors"
        >
          SIGN IN
        </button>
      </div>
    );
  }

  const sections = [
    { title: 'MY ORDERS & LIVE TRACKING', desc: 'Track unit-of-one garment production & doorstep trial protocol', icon: Package, href: '/account/orders' },
    { title: 'MY BIOMETRIC FIT PROFILE', desc: 'Manage your 3D avatar anthropometrics & BMI calibration', icon: Ruler, href: '/visualizer' },
    { title: 'BESPOKE 3D STUDIO', desc: 'Design new made-to-measure pieces with Ahmedabad textiles', icon: Scissors, href: '/bespoke' },
    { title: 'SAVED WISHLIST', desc: 'Curated ready-to-wear pieces and seasonal capsules', icon: Heart, href: '/shop' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="p-6 bg-porcelain rounded-2xl border border-border-light shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold/15 text-gold-dark font-headline font-black text-xl flex items-center justify-center border border-gold/40">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-headline font-black text-xl text-obsidian uppercase">
              {user.name}
            </h1>
            <p className="text-xs font-mono text-gray-500 mt-0.5">
              {user.phone ? `+91 ${user.phone}` : user.email} • Client ID #{user.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs font-mono text-gray-500 hover:text-vermillion flex items-center gap-1.5 p-2 rounded-lg hover:bg-alabaster transition-colors"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.title}
              href={s.href}
              className="p-6 bg-porcelain rounded-2xl border border-border-light hover:border-gold shadow-xs flex justify-between items-center group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-alabaster flex items-center justify-center text-obsidian group-hover:text-gold transition-colors">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xs text-obsidian uppercase tracking-wider">
                    {s.title}
                  </h3>
                  <p className="text-[11px] font-mono text-gray-500 mt-0.5 max-w-xs">{s.desc}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-gold transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
