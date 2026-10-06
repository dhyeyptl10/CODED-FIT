import { create } from 'zustand';
import {
  GarmentType,
  CollarStyle,
  CuffStyle,
  ButtonStyle,
  PocketStyle,
  GarmentCustomization,
  CustomizationChanges
} from '@coded-fit/shared';

interface CustomizerStore {
  garmentType: GarmentType;
  fabricId: string;
  fabricName: string;
  fabricPriceAdd: number;
  colorHex: string;
  colorName: string;
  collar: CollarStyle;
  cuff: CuffStyle;
  button: ButtonStyle;
  pocket: PocketStyle;
  fit: 'slim' | 'regular' | 'relaxed' | 'oversized';
  monogramText: string;
  monogramEnabled: boolean;
  basePrice: number;
  activeTab: 'garment' | 'fabric' | 'color' | 'fit' | 'details' | 'ai';

  setGarmentType: (type: GarmentType) => void;
  setFabric: (id: string, name: string, priceAdd: number) => void;
  setColor: (hex: string, name: string) => void;
  setCollar: (collar: CollarStyle) => void;
  setCuff: (cuff: CuffStyle) => void;
  setButton: (button: ButtonStyle) => void;
  setPocket: (pocket: PocketStyle) => void;
  setFit: (fit: 'slim' | 'regular' | 'relaxed' | 'oversized') => void;
  setMonogram: (text: string, enabled: boolean) => void;
  setActiveTab: (tab: 'garment' | 'fabric' | 'color' | 'fit' | 'details' | 'ai') => void;
  applyAIChanges: (changes: CustomizationChanges) => void;
  getCustomizationSnapshot: () => GarmentCustomization;
}

export const useCustomizerStore = create<CustomizerStore>((set, get) => ({
  garmentType: 'shirt',
  fabricId: 'gots_cotton',
  fabricName: 'Cotton',
  fabricPriceAdd: 0,
  colorHex: '#0B0C0F',
  colorName: 'Obsidian Atelier',
  collar: 'spread',
  cuff: 'barrel',
  button: 'matte-obsidian',
  pocket: 'none',
  fit: 'regular',
  monogramText: '',
  monogramEnabled: false,
  basePrice: 2899,
  activeTab: 'garment',

  setGarmentType: (garmentType) => set({ garmentType }),
  setFabric: (fabricId, fabricName, fabricPriceAdd) => set({ fabricId, fabricName, fabricPriceAdd }),
  setColor: (colorHex, colorName) => set({ colorHex, colorName }),
  setCollar: (collar) => set({ collar }),
  setCuff: (cuff) => set({ cuff }),
  setButton: (button) => set({ button }),
  setPocket: (pocket) => set({ pocket }),
  setFit: (fit) => set({ fit }),
  setMonogram: (monogramText, monogramEnabled) => set({ monogramText, monogramEnabled }),
  setActiveTab: (activeTab) => set({ activeTab }),

  applyAIChanges: (changes) => {
    set((state) => ({
      garmentType: (changes.garmentType as GarmentType) || state.garmentType,
      colorHex: changes.color || state.colorHex,
      collar: (changes.collar as CollarStyle) || state.collar,
      cuff: (changes.cuff as CuffStyle) || state.cuff,
      button: (changes.buttons as ButtonStyle) || state.button,
      fit: changes.fit || state.fit,
      monogramText: changes.monogram !== undefined ? changes.monogram : state.monogramText,
      monogramEnabled: changes.monogram ? true : state.monogramEnabled
    }));
  },

  getCustomizationSnapshot: () => {
    const s = get();
    const optionsPrice = (s.monogramEnabled ? 250 : 0) + (s.collar !== 'spread' ? 150 : 0);
    return {
      garmentType: s.garmentType,
      fabricId: s.fabricId,
      fabricName: s.fabricName,
      fabricPriceAdd: s.fabricPriceAdd,
      colorHex: s.colorHex,
      colorName: s.colorName,
      collar: s.collar,
      cuff: s.cuff,
      button: s.button,
      pocket: s.pocket,
      fit: s.fit,
      monogram: s.monogramEnabled
        ? {
            enabled: true,
            text: s.monogramText,
            placement: 'chest',
            threadColorHex: '#C9A84C',
            fontFamily: 'Syne',
            priceAdd: 250
          }
        : undefined,
      optionsPriceAdd: optionsPrice,
      totalCustomPrice: s.basePrice + s.fabricPriceAdd + optionsPrice
    };
  }
}));
