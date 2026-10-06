'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, Sparkles } from 'lucide-react';
import { CartItem as CartItemType } from '@coded-fit/shared';
import { useCartStore } from '@/store/cartStore';

interface Props {
  item: CartItemType;
}

export const CartItem: React.FC<Props> = ({ item }) => {
  const { updateQty, removeItem } = useCartStore();
  const isBespoke = item.type === 'made-to-measure' || Boolean(item.customization);

  return (
    <div className="py-4 border-b border-border-light flex gap-4 items-start">
      {/* Product Image */}
      <div className="w-20 h-24 bg-alabaster rounded-lg overflow-hidden shrink-0 relative border border-border-light">
        <img
          src={item.image || '/images/placeholder.svg'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {isBespoke && (
          <span className="absolute bottom-1 left-1 bg-gold text-obsidian text-[8px] font-mono font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
            <Sparkles size={8} /> BESPOKE
          </span>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-headline font-bold text-sm text-obsidian truncate">
            {item.name}
          </h4>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-vermillion transition-colors p-1"
            title="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Size & Fit Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-gray-600">
          <span>SIZE: <strong className="text-obsidian">{item.size}</strong></span>
          {item.colorName && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                {item.colorHex && (
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-gray-300"
                    style={{ backgroundColor: item.colorHex }}
                  />
                )}
                {item.colorName}
              </span>
            </>
          )}
        </div>

        {/* Customization Details (if Made-To-Measure) */}
        {item.customization && (
          <div className="mt-1.5 p-2 bg-alabaster-card rounded border border-border-light text-[10px] font-mono text-gray-700 space-y-0.5">
            <div className="text-gold-dark font-bold">✦ {item.customization.fabricName}</div>
            {!item.customization.printLayers && <div>Collar: {item.customization.collar} | Cuff: {item.customization.cuff}</div>}
            {!!item.customization.printLayers?.length && <div className="space-y-1"><strong>Custom print · {item.customization.printLayers.length} layers</strong>{item.customization.printLayers.map(layer=><div key={layer.id} className="flex items-center gap-2 break-all">{layer.image && <img src={layer.image} alt="Your uploaded print artwork" className="w-9 h-9 object-contain"/>}<span>{layer.side}: {layer.kind === 'image' ? 'Uploaded artwork' : layer.text}</span></div>)}</div>}
            {item.customization.monogram?.enabled && (
              <div className="text-vermillion">Monogram: &quot;{item.customization.monogram.text}&quot; (Gold Thread)</div>
            )}
          </div>
        )}

        {item.customization?.printLayers && <Link href={`/studio?editItem=${encodeURIComponent(item.id)}`} onClick={() => useCartStore.getState().closeDrawer()} className="inline-block mt-2 py-2 text-xs font-semibold underline underline-offset-4">Edit design</Link>}

        {/* Quantity Controls & Price */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center border border-border-light rounded bg-porcelain">
            <button
              onClick={() => updateQty(item.id, item.qty - 1)}
              className="px-2 py-1 text-gray-500 hover:text-obsidian"
              title="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="px-2.5 text-xs font-mono font-bold text-obsidian">
              {item.qty}
            </span>
            <button
              onClick={() => updateQty(item.id, item.qty + 1)}
              className="px-2 py-1 text-gray-500 hover:text-obsidian"
              title="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="text-right">
            <span className="font-headline font-bold text-sm text-obsidian">
              ₹{(item.price * item.qty).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

