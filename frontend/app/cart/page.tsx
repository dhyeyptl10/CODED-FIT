'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck, Tag, Trash2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/components/ecommerce/CartItem';

export default function CartPage() {
  const { items, totals, applyCoupon, removeCoupon, clearCart } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError?: boolean } | null>(null);

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

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-alabaster mx-auto flex items-center justify-center text-gray-400 border border-border-light">
          <ShoppingBag size={36} />
        </div>
        <h1 className="font-headline font-black text-2xl text-obsidian uppercase">
          YOUR ATELIER BAG IS EMPTY
        </h1>
        <p className="text-sm font-mono text-gray-500 max-w-sm mx-auto">
          Add items from our ready-to-wear catalog or calibrate a bespoke piece in the 3D studio.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Link
            href="/shop"
            className="bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian px-6 py-3 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-colors"
          >
            SHOP READY-TO-WEAR
          </Link>
          <Link
            href="/bespoke"
            className="bg-alabaster hover:bg-gold/10 text-obsidian border border-border-light px-6 py-3 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-colors"
          >
            ENTER 3D STUDIO
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap gap-4 justify-between items-end pb-4 border-b border-border-light">
        <div>
          <span className="text-[10px] font-mono font-bold text-gold-dark tracking-widest uppercase block mb-1">
            CHECKOUT PIPELINE ✦ STEP 01 OF 02
          </span>
          <h1 className="font-headline font-black text-3xl text-obsidian tracking-tight uppercase">
            YOUR ATELIER BAG ({items.reduce((s, i) => s + i.qty, 0)})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-mono text-gray-400 hover:text-vermillion flex items-center gap-1 transition-colors"
        >
          <Trash2 size={13} />
          <span>Clear Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Col: Cart Items */}
        <div className="lg:col-span-8 bg-porcelain p-3 sm:p-6 rounded-2xl border border-border-light shadow-xs divide-y divide-border-light">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Right Col: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-porcelain p-6 rounded-2xl border border-border-light shadow-xs space-y-5">
            <h3 className="font-headline font-bold text-sm text-obsidian uppercase tracking-wider">
              ORDER SUMMARY
            </h3>

            {/* Coupon Box */}
            <div>
              {totals.appliedCoupon ? (
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 px-3 py-2 rounded text-xs font-mono">
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <Tag size={13} /> {totals.appliedCoupon.code} (-₹{totals.appliedCoupon.discountAmount})
                  </span>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promotional code"
                    className="bg-alabaster border border-border-light px-3 py-2 text-xs font-mono text-obsidian uppercase rounded flex-1 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian px-3.5 py-2 text-xs font-mono font-bold rounded transition-colors"
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

            {/* Line items totals */}
            <div className="space-y-2 text-xs font-mono pt-3 border-t border-border-light">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Discount</span>
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
              <div className="pt-3 border-t border-border-light flex justify-between font-headline font-bold text-base text-obsidian">
                <span>TOTAL AMOUNT</span>
                <span className="text-gold-dark">₹{totals.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full bg-vermillion hover:bg-vermillion-glow text-porcelain py-4 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={16} />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-500 pt-2">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Doorstep Trial Guarantee • Free Alterations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
