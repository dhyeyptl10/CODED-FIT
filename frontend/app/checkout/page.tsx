'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { openCheckout } from '@/lib/checkout';
import { api } from '@/services/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, clearCart } = useCartStore();
  const { user, isAuthenticated, openLoginModal } = useAuthStore();
  const pending = useRef<{key:string;order:any} | null>(null);
  const [error, setError] = useState('');

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'cod'>('razorpay');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  const handlePayAndPlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {openLoginModal('email');return;}
    if (!items.length || processing) return;
    setError('');
    if (!shipping.fullName || !shipping.street || !shipping.phone || !shipping.postalCode) {
      alert('Please fill in complete delivery details.');
      return;
    }

    try {
      setProcessing(true);

      const payload = {items, shippingAddress:shipping, discountCode:totals.appliedCoupon?.code};
      const key = JSON.stringify(payload);
      if (pending.current?.key !== key) {
        const created = await api.createOrder(payload);
        pending.current = {key,order:created.order};
      }
      const order = pending.current!.order;
      const intent = await api.createPaymentIntent(order._id);
      const result = await openCheckout(intent,{name:shipping.fullName,contact:shipping.phone});
      await api.verifyPayment({orderId:order._id,razorpayPaymentId:result.razorpay_payment_id,razorpayOrderId:result.razorpay_order_id,razorpaySignature:result.razorpay_signature});
      clearCart();
      setOrderComplete(order);
    } catch (e: any) {
      setError(e.message || 'Payment or order placement failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 size={40} />
        </div>
        <span className="text-xs font-mono font-bold text-gold-dark tracking-widest uppercase block">
          ATELIER ORDER CONFIRMED
        </span>
        <h1 className="font-headline font-black text-3xl text-obsidian tracking-tight uppercase">
          ORDER #{orderComplete.orderNumber}
        </h1>
        <p className="text-sm font-body text-gray-600 max-w-md mx-auto leading-relaxed">
          Payment confirmed. Your unit-of-one garment order has been entered into the atelier production queue.
        </p>

        <div className="p-4 bg-alabaster rounded-xl border border-border-light max-w-md mx-auto text-xs font-mono text-left space-y-1.5">
          <div className="flex justify-between">
            <span className="text-gray-500">Dispatch Protocol:</span>
            <strong className="text-obsidian">Standard delivery</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Carrier:</span>
            <strong className="text-obsidian">Assigned after fulfilment</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Delivery:</span>
            <strong className="text-obsidian">Confirmed after dispatch</strong>
          </div>
        </div>

        <div className="pt-4 flex gap-4 justify-center">
          <Link
            href="/account/orders"
            className="bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian px-6 py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-colors"
          >
            TRACK LIVE PRODUCTION
          </Link>
          <Link
            href="/shop"
            className="bg-alabaster hover:bg-gray-200 text-obsidian px-6 py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase border border-border-light transition-colors"
          >
            CONTINUE BROWSING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-4 border-b border-border-light">
        <span className="text-[10px] font-mono font-bold text-gold-dark tracking-widest uppercase block mb-1">
          CHECKOUT PIPELINE ✦ STEP 02 OF 02
        </span>
        <h1 className="font-headline font-black text-3xl text-obsidian tracking-tight uppercase">
          SECURE ATELIER CHECKOUT
        </h1>
      </div>

      {error && <p role="alert" className="p-4 bg-red-50 text-red-700 rounded-xl">{error}</p>}
      <form onSubmit={handlePayAndPlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Col: Shipping Address & Delivery */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Form */}
          <div className="bg-porcelain p-6 rounded-2xl border border-border-light shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-obsidian uppercase tracking-wider">
              1. SHIPPING DESTINATION
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-gray-700 font-bold block">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  placeholder="Arjun Mehta"
                  className="w-full px-3 py-2.5 bg-alabaster border border-border-light rounded-lg text-obsidian focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-bold block">PHONE NUMBER</label>
                <input
                  type="tel"
                  required
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 bg-alabaster border border-border-light rounded-lg text-obsidian focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-gray-700 font-bold block">STREET ADDRESS / RESIDENCE</label>
                <input
                  type="text"
                  required
                  value={shipping.street}
                  onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                  placeholder="Apartment, Studio, Street No."
                  className="w-full px-3 py-2.5 bg-alabaster border border-border-light rounded-lg text-obsidian focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-bold block">CITY</label>
                <input
                  type="text"
                  required
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="w-full px-3 py-2.5 bg-alabaster border border-border-light rounded-lg text-obsidian focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-bold block">PIN CODE</label>
                <input
                  type="text"
                  required
                  value={shipping.postalCode}
                  onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                  placeholder="560001"
                  className="w-full px-3 py-2.5 bg-alabaster border border-border-light rounded-lg text-obsidian focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-porcelain p-6 rounded-2xl border border-border-light shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-obsidian uppercase tracking-wider">
              2. PAYMENT GATEWAY (SERVER ENCRYPTED)
            </h3>

            <div className="space-y-2">
              <label
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'razorpay' ? 'border-gold bg-gold/5' : 'border-border-light'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-gold" />
                  <div>
                    <span className="font-headline font-bold text-xs text-obsidian block">
                      RAZORPAY SECURE (CARDS, NETBANKING, UPI)
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      HMAC SHA-256 Verified Server Transaction
                    </span>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => {}} className="accent-gold" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Order Snapshot & Pay CTA */}
        <div className="lg:col-span-5 bg-porcelain p-6 rounded-2xl border border-border-light shadow-xs space-y-6">
          <h3 className="font-headline font-bold text-sm text-obsidian uppercase tracking-wider">
            BAG SUMMARY ({items.length} ITEMS)
          </h3>

          <div className="space-y-3 divide-y divide-border-light max-h-60 overflow-y-auto">
            {items.map((i) => (
              <div key={i.id} className="pt-2 first:pt-0 flex justify-between text-xs font-mono">
                <div>
                  <strong className="text-obsidian block truncate max-w-xs">{i.name}</strong>
                  <span className="text-gray-500 text-[10px]">Qty: {i.qty} • Size: {i.size}</span>
                </div>
                <span className="font-bold text-obsidian">₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs font-mono pt-3 border-t border-border-light">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount</span>
                <span>-₹{totals.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Additional tax</span>
              <span>₹{totals.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Express Air Delivery</span>
              <span>{totals.shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${totals.shipping}`}</span>
            </div>
            <div className="pt-3 border-t border-border-light flex justify-between font-headline font-bold text-base text-obsidian">
              <span>TOTAL PAYABLE</span>
              <span className="text-gold-dark">₹{totals.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing || !items.length}
            className="w-full bg-vermillion hover:bg-vermillion-glow text-porcelain py-4 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Lock size={15} />
            <span>{processing ? 'CALIBRATING PAYMENT...' : `PAY ₹${totals.total.toLocaleString('en-IN')}`}</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>256-Bit Encrypted Atelier Transaction</span>
          </div>
        </div>
      </form>
    </div>
  );
}
