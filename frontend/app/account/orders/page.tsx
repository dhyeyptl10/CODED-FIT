'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Sparkles } from 'lucide-react';
import { Order } from '@coded-fit/shared';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderTracker } from '@/components/orders/OrderTracker';
import { api } from '@/services/api';

export default function AccountOrdersPage() {
  const [orders,setOrders]=useState<Order[]>([]);
  const [error,setError]=useState('');
  useEffect(() => {
    // Attempt backend sync
    api.getMyOrders()
      .then((res) => {
        setOrders(res.orders.map(o=>({...o,id:o._id || o.id,items:o.items.map((i:any)=>({...i,id:i._id || i.id}))}))); 
      })
      .catch(e => setError(e.message));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-border-light">
        <Link
          href="/account"
          className="p-2 text-gray-500 hover:text-obsidian rounded-lg hover:bg-alabaster transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-[10px] font-mono font-bold text-gold-dark uppercase tracking-widest block">
            ATELIER CLIENT PORTAL
          </span>
          <h1 className="font-headline font-black text-2xl text-obsidian tracking-tight uppercase">
            MY ORDERS &amp; PRODUCTION PIPELINE
          </h1>
        </div>
      </div>

      {/* Active Bespoke Order Live Timeline Tracker */}
      {orders[0]?.productionStatus && (
        <OrderTracker
          orderNumber={orders[0].orderNumber}
          currentStage={orders[0].productionStatus}
        />
      )}

      {error && <p role="alert">{error}</p>}{!error && !orders.length && <p>No orders yet. <Link href="/shop">Explore the collection</Link></p>}
      {/* Orders List */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-gray-500">
          ORDER HISTORY ({orders.length})
        </h3>
        {orders.map((ord) => (
          <OrderCard key={ord.id} order={ord} />
        ))}
      </div>
    </div>
  );
}
