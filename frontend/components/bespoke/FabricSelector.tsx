'use client';

import React from 'react';
import {api} from '@/services/api';
import { Sparkles, Check } from 'lucide-react';
import { useCustomizerStore } from '@/store/customizerStore';

interface FabricItem {
  id: string;
  name: string;
  composition: string;
  origin: string;
  gsm: number;
  priceAdd: number;
  hex: string;
}

const FABRIC_CATALOG: FabricItem[] = [
  {
    id: 'gots-linen-01',
    name: 'Ahmedabad GOTS Organic Linen',
    composition: '100% Belgian Flax woven in Ahmedabad',
    origin: 'Ahmedabad Mill #4',
    gsm: 210,
    priceAdd: 450,
    hex: '#e4e2dd'
  },
  {
    id: 'gots-cotton-01',
    name: 'GOTS Combed Compact Cotton',
    composition: '100% Organic Long-Staple Cotton',
    origin: 'Gujarat Co-operative Mills',
    gsm: 240,
    priceAdd: 0,
    hex: '#0b0c0f'
  },
  {
    id: 'bamboo-silk-01',
    name: 'Atelier Bamboo Silk Satin',
    composition: '70% Organic Bamboo, 30% Mulberry Silk',
    origin: 'Bengaluru Silk Looms',
    gsm: 180,
    priceAdd: 850,
    hex: '#c9a84c'
  },
  {
    id: 'heavy-fleece-01',
    name: '420 GSM Thermal Loopback Fleece',
    composition: '100% Unbrushed Organic French Terry',
    origin: 'Ahmedabad Knitting Unit',
    gsm: 420,
    priceAdd: 600,
    hex: '#282b30'
  }
];

export const FabricSelector: React.FC = () => {
  const { fabricId, setFabric } = useCustomizerStore();
  const [fabrics,setFabrics]=React.useState<FabricItem[]>([]);
  React.useEffect(()=>{api.getCustomizationOptions().then(({options})=>setFabrics(options.fabrics.map((f:any)=>({id:f.fabricId,name:f.name,composition:f.composition,origin:f.origin,gsm:f.gsm,priceAdd:f.priceAdd,hex:f.previewColor})))).catch(()=>{});},[]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-gray-500 font-bold uppercase">AHMEDABAD MILL ARCHIVE</span>
        <span className="text-gold font-bold flex items-center gap-1">
          <Sparkles size={11} /> FABRIC CATALOG
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {fabrics.map((fab) => {
          const isSelected = fabricId === fab.id;

          return (
            <button
              key={fab.id}
              type="button"
              onClick={() => setFabric(fab.id, fab.name, fab.priceAdd)}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                isSelected
                  ? 'border-gold bg-gold/5 shadow-xs'
                  : 'border-border-light bg-porcelain hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border border-gray-300 shrink-0 shadow-xs"
                  style={{ backgroundColor: fab.hex }}
                />
                <div>
                  <h4 className="font-headline font-bold text-xs text-obsidian">
                    {fab.name}
                  </h4>
                  <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                    {fab.composition} • {fab.gsm}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-obsidian block">
                  {fab.priceAdd === 0 ? 'INCLUDED' : `+₹${fab.priceAdd}`}
                </span>
                {isSelected && (
                  <span className="text-[10px] text-gold font-mono font-bold flex items-center justify-end gap-0.5 mt-0.5">
                    <Check size={11} /> SELECTED
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
