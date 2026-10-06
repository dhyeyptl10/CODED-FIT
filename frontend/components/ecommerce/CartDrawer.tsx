'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from './CartItem';

export const CartDrawer: React.FC = () => {
  const { items, totals, isDrawerOpen, closeDrawer, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-porcelain flex flex-col shadow-2xl border-l border-border-light">
          {/* Header */}
          <div className="px-6 py-5 bg-alabaster border-b border-border-light flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-obsidian" />
              <h3 className="font-headline font-black text-lg text-obsidian tracking-tight uppercase">
                ATELIER BAG ({items.reduce((s, i) => s + i.qty, 0)})
              </h3>
            </div>
            <button aria-label="Close bag"
              onClick={closeDrawer}
              className="p-1.5 text-gray-500 hover:text-obsidian rounded-md hover:bg-gray-200/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body: Items or Empty State */}
          <div className="flex-1 overflow-y-auto px-6 divide-y divide-border-light">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-alabaster-card flex items-center justify-center text-gray-400 mb-4 border border-border-light">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="font-headline font-bold text-base text-obsidian">Your bag is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1">
                  Explore our ready-to-wear capsule or enter the 3D Bespoke Studio to tailor your garment.
                </p>
                <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
                  <Link
                    href="/shop"
                    onClick={closeDrawer}
                    className="bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian py-2.5 px-4 rounded text-xs font-mono font-bold tracking-wider text-center transition-colors"
                  >
                    EXPLORE READY-TO-WEAR
                  </Link>
                  <Link
                    href="/bespoke"
                    onClick={closeDrawer}
                    className="bg-alabaster hover:bg-gold/10 text-obsidian border border-border-light py-2.5 px-4 rounded text-xs font-mono font-bold tracking-wider text-center transition-colors"
                  >
                    ENTER BESPOKE STUDIO
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.id} item={item} />)
            )}
          </div>

          {/* Footer & Order Calculation */}
          {items.length > 0 && (
            <div className="p-6 bg-alabaster border-t border-border-light space-y-4">
              {/* Promo Coupon Form */}
              <div>
                {totals.appliedCoupon ? (
                  <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded text-xs font-mono">
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      <Tag size={12} /> {totals.appliedCoupon.code} (-₹{totals.appliedCoupon.discountAmount})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-500 hover:text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promotional code (e.g. NOVA10)"
                      className="bg-porcelain border border-border-light px-3 py-1.5 text-xs text-obsidian font-mono uppercase focus:outline-none focus:border-gold rounded flex-1"
                    />
                    <button
                      type="submit"
                      className="bg-obsidian text-porcelain hover:bg-gold hover:text-obsidian px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[11px] font-mono mt-1 ${couponMsg.isError ? 'text-vermillion' : 'text-emerald-700'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-gray-600">
                  <span>Bag Subtotal</span>
                  <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Applied</span>
                    <span>-₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (12% Included)</span>
                  <span>₹{totals.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Express Air Shipping</span>
                  <span>{totals.shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${totals.shipping}`}</span>
                </div>
                <div className="pt-2 border-t border-border-light flex justify-between font-headline font-bold text-base text-obsidian">
                  <span>ESTIMATED TOTAL</span>
                  <span className="text-gold-dark">₹{totals.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full bg-vermillion hover:bg-vermillion-glow text-porcelain py-3.5 px-4 rounded font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight size={15} />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-500">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>256-Bit Encrypted Atelier Dispatch Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


