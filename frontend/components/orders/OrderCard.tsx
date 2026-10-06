'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Order, ORDER_STATUS_LABELS, BESPOKE_STAGE_LABELS } from '@coded-fit/shared';

interface Props {
  order: Order;
  onOpenFeedback?: (orderId: string) => void;
}

export const OrderCard: React.FC<Props> = ({ order, onOpenFeedback }) => {
  const [expanded, setExpanded] = useState(false);
  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
  const bespokeLabel = order.productionStatus ? BESPOKE_STAGE_LABELS[order.productionStatus] || order.productionStatus : null;

  return (
    <div className="bg-porcelain rounded-2xl border border-border-light overflow-hidden shadow-xs hover:border-gold/50 transition-colors">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-alabaster border-b border-border-light flex flex-wrap justify-between items-center gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">ORDER NUMBER</span>
          <strong className="font-mono font-bold text-sm text-obsidian tracking-wider">
            {order.orderNumber}
          </strong>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-gray-500 block text-[10px]">DISPATCH STATUS</span>
            <span className="font-bold text-obsidian bg-porcelain px-2.5 py-1 rounded border border-border-light inline-block">
              {statusLabel}
            </span>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px]">TOTAL</span>
            <strong className="font-headline font-bold text-obsidian">
              ₹{order.totals.total.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>
      </div>

      {/* Production Stage Callout (for Made-To-Measure) */}
      {bespokeLabel && (
        <div className="px-5 py-2.5 bg-gold/10 border-b border-gold/20 flex items-center justify-between text-xs font-mono">
          <span className="text-gold-dark font-bold flex items-center gap-1.5">
            <RefreshCw size={13} className="animate-spin" />
            ATELIER BESPOKE STAGE: {bespokeLabel}
          </span>
          {order.tracking?.number && (
            <span className="text-gray-600">
              Air Waybill: <strong>{order.tracking.number}</strong>
            </span>
          )}
        </div>
      )}

      {/* Items Summary */}
      <div className="p-5 divide-y divide-border-light">
        {order.items.slice(0, expanded ? order.items.length : 2).map((item, i) => (
          <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
            <div className="w-14 h-16 bg-alabaster rounded-lg overflow-hidden shrink-0 border border-border-light">
              <img src={item.image || '/images/hero-men.png'} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-headline font-bold text-xs text-obsidian truncate">{item.name}</h4>
              <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                Qty: {item.qty} • Size: {item.size} {item.colorName ? `• ${item.colorName}` : ''}
              </p>
              {item.customization && (
                <span className="text-[9px] font-mono text-gold-dark font-bold">
                  ✦ Bespoke Specifications Calibrated
                </span>
              )}
            </div>
            <div className="text-right font-mono text-xs font-bold text-obsidian">
              ₹{(item.price * item.qty).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-alabaster border-t border-border-light flex flex-wrap justify-between items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-gray-500">
          <Truck size={14} className="text-emerald-600" />
          <span>Carrier: {order.tracking?.carrier || 'BlueDart Express Air'}</span>
        </div>

        <div className="flex items-center gap-3">
          {order.firstGarmentTrial?.isFirstTrial && !order.firstGarmentTrial.feedbackSubmitted && onOpenFeedback && (
            <button
              onClick={() => onOpenFeedback(order.id)}
              className="bg-vermillion text-porcelain px-3 py-1.5 rounded text-[11px] font-bold tracking-wider uppercase hover:bg-vermillion-glow transition-colors"
            >
              DOORSTEP TRIAL FEEDBACK
            </button>
          )}

          {order.items.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-obsidian flex items-center gap-1 text-[11px]"
            >
              <span>{expanded ? 'Show Less' : `+${order.items.length - 2} More Items`}</span>
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
