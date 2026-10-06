'use client';

import React from 'react';
import {useCatalog} from '@/lib/useCatalog';
import { Sparkles, ShoppingBag, Check } from 'lucide-react';
import { GarmentType } from '@coded-fit/shared';
import { useCustomizerStore } from '@/store/customizerStore';
import { useCartStore } from '@/store/cartStore';
import { useFitStore } from '@/store/fitStore';
import { FabricSelector } from './FabricSelector';
import { CollarSelector } from './CollarSelector';
import { CuffSelector } from './CuffSelector';
import { ButtonSelector } from './ButtonSelector';
import { MonogramEditor } from './MonogramEditor';

const GARMENT_TYPES: { id: GarmentType; label: string }[] = [
  { id: 'shirt', label: 'Bespoke Shirt' },
  { id: 'tshirt', label: 'Fitted Tee' },
  { id: 'oversized-tee', label: 'Boxy Tee' },
  { id: 'hoodie', label: 'Atelier Hoodie' },
  { id: 'pants', label: 'Pleated Trouser' }
];

const COLOR_PALETTE = [
  { name: 'Obsidian Black', hex: '#0B0C0F' },
  { name: 'Pure Porcelain', hex: '#FFFFFF' },
  { name: 'Alabaster Cream', hex: '#FAF8F5' },
  { name: 'Deep Navy', hex: '#1E3A8A' },
  { name: 'Atelier Red', hex: '#7F1D1D' },
  { name: 'Ahmedabad Gold', hex: '#C9A84C' },
  { name: 'Charcoal Slate', hex: '#282B30' },
  { name: 'Forest Olive', hex: '#0F766E' }
];

const FIT_OPTIONS = ['slim', 'regular', 'relaxed', 'oversized'] as const;

export const CustomizerPanel: React.FC = () => {
  const {
    garmentType,
    colorHex,
    colorName,
    fit,
    activeTab,
    setGarmentType,
    setColor,
    setFit,
    setActiveTab,
    getCustomizationSnapshot
  } = useCustomizerStore();

  const {products}=useCatalog();
  const categories:Record<string,string>={shirt:'Shirts',tshirt:'T-Shirts','oversized-tee':'T-Shirts',hoodie:'Hoodies',pants:'Bottoms',jacket:'Jackets'};
  const product=products.find(p=>p.category===categories[garmentType]);
  React.useEffect(()=>{if(product)useCustomizerStore.setState({basePrice:product.price});},[product?.id,product?.price]);
  const { addItem } = useCartStore();
  const { recommendedSize, getProfileSnapshot } = useFitStore();
  const [added, setAdded] = React.useState(false);

  const snapshot = getCustomizationSnapshot();

  const handleAddCustomToBag = () => {
    if(!product) return;
    const customSnapshot = getCustomizationSnapshot();
    const fitSnapshot = getProfileSnapshot();

    addItem({
      productId: product.id,
      name: `Bespoke ${garmentType.toUpperCase()} [${colorName}]`,
      price: customSnapshot.totalCustomPrice,
      qty: 1,
      size: product.sizes.includes(recommendedSize)?recommendedSize:product.sizes[0],
      image: product.images[0],
      colorName,
      colorHex,
      type: 'made-to-measure',
      customization: customSnapshot,
      measurementsSnapshot: fitSnapshot
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-porcelain rounded-2xl border border-border-light shadow-sm overflow-hidden">
      {/* 1. Header with Garment Type Pills */}
      <div className="p-4 bg-alabaster border-b border-border-light">
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-2">
          SELECT GARMENT ARCHETYPE
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {GARMENT_TYPES.map((g) => (
            <button
              key={g.id}
              onClick={() => setGarmentType(g.id)}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold whitespace-nowrap transition-colors border ${
                garmentType === g.id
                  ? 'bg-obsidian text-porcelain border-obsidian'
                  : 'bg-porcelain text-obsidian border-border-light hover:border-obsidian'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Customization Tabs */}
      <div className="flex border-b border-border-light text-xs font-mono bg-porcelain">
        {(['garment', 'fabric', 'color', 'details'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 font-bold uppercase transition-colors text-center ${
              activeTab === tab
                ? 'text-obsidian border-b-2 border-gold bg-alabaster/40'
                : 'text-gray-400 hover:text-obsidian'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Tab Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Garment Fit Tab */}
        {(activeTab === 'garment' || activeTab === 'details') && (
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-gray-700 uppercase block">
              DRAPE &amp; SILHOUETTE FIT
            </label>
            <div className="grid grid-cols-4 gap-2">
              {FIT_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFit(f)}
                  className={`py-2 rounded-lg font-mono text-xs font-bold uppercase border transition-colors ${
                    fit === f
                      ? 'bg-gold text-obsidian border-gold'
                      : 'bg-alabaster text-obsidian border-border-light hover:border-obsidian'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Palette */}
        {(activeTab === 'color' || activeTab === 'garment') && (
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-500 font-bold uppercase">ATELIER COLORWAY:</span>
              <strong className="text-obsidian">{colorName}</strong>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex, c.name)}
                  className={`w-9 h-9 rounded-full p-0.5 border-2 transition-all mx-auto ${
                    colorHex === c.hex ? 'border-obsidian scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                  }`}
                  title={c.name}
                >
                  <div
                    className="w-full h-full rounded-full border border-gray-300"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fabric Selector */}
        {(activeTab === 'fabric' || activeTab === 'garment') && <FabricSelector />}

        {/* Tailoring Details */}
        {(activeTab === 'details' || activeTab === 'garment') && (
          <div className="space-y-5 pt-2">
            <CollarSelector />
            <CuffSelector />
            <ButtonSelector />
            <MonogramEditor />
          </div>
        )}
      </div>

      {/* 4. Bottom Order Drawer Summary */}
      <div className="p-5 bg-alabaster border-t border-border-light space-y-3">
        <div className="flex justify-between items-baseline font-mono text-xs">
          <span className="text-gray-500">ESTIMATED PRICE:</span>
          <span className="font-headline font-black text-xl text-obsidian">
            ₹{snapshot.totalCustomPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          disabled={!product}
          onClick={handleAddCustomToBag}
          className="w-full bg-vermillion hover:bg-vermillion-glow text-porcelain py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
        >
          {added ? <Check size={16} /> : <ShoppingBag size={16} />}
          <span>{added ? 'ADDED TO BAG' : 'SAVE BESPOKE PIECE TO BAG'}</span>
        </button>

        <p className="text-[10px] font-mono text-gray-500 text-center">
          {product?'Final price and fabric availability are validated at checkout.':'This garment is not currently in the catalog. You can still save the design.'}
        </p>
      </div>
    </div>
  );
};
