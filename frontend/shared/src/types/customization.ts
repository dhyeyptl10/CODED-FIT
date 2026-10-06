/**
 * CODED FIT — Bespoke Customization Domain Models
 */

export type GarmentType = 'tshirt' | 'oversized-tee' | 'shirt' | 'hoodie' | 'pants' | 'jacket';

export type CollarStyle = 'spread' | 'band' | 'cuban' | 'cutaway' | 'classic' | 'button-down';
export type CuffStyle = 'barrel' | 'french' | 'mitered' | 'rounded' | 'ribbed';
export type ButtonStyle = 'mother-of-pearl' | 'matte-obsidian' | 'horn' | 'antique-brass' | 'standard';
export type PocketStyle = 'none' | 'single-chest' | 'flap' | 'double-workwear' | 'kangaroo';
export type MonogramPlacement = 'cuff' | 'chest' | 'hem' | 'collar-interior' | 'none';

export interface FabricOption {
  id: string;
  name: string;
  code: string;
  category: string;
  composition: string;
  weightGsm: number;
  origin: string;
  priceAdd: number;
  textureUrl?: string;
  hexPreview: string;
}

export interface GarmentCustomization {
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
  monogram?: {
    enabled: boolean;
    text: string;
    placement: MonogramPlacement;
    threadColorHex: string;
    fontFamily: string;
    priceAdd: number;
  };
  optionsPriceAdd: number;
  totalCustomPrice: number;
  previewCanvasDataUrl?: string;
  printLayers?: {
    id: string;
    kind: 'text' | 'art' | 'image';
    side: 'front' | 'back';
    text: string;
    color: string;
    font: 'sans-serif' | 'serif' | 'monospace';
    x: number;
    y: number;
    scale: number;
    rotation: number;
    image?: string;
  }[];
  printPriceAdd?: number;
}
