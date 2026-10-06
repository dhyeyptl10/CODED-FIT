import type {GarmentType} from '@coded-fit/shared';
export type PrintSide='front'|'back';
export interface PrintLayer {id:string;kind:'text'|'art'|'image';side:PrintSide;text:string;color:string;font:'sans-serif'|'serif'|'monospace';x:number;y:number;scale:number;rotation:number;image?:string;}
export interface StudioDesign {garmentType:GarmentType;productId:string;colorHex:string;colorName:string;fit:'slim'|'regular'|'relaxed'|'oversized';size:string;fabricId:string;layers:PrintLayer[];}
export const INITIAL_DESIGN:StudioDesign={garmentType:'tshirt',productId:'',colorHex:'#ffffff',colorName:'White',fit:'regular',size:'M',fabricId:'gots_cotton',layers:[]};
export const GARMENTS=[{id:'tshirt',name:'T-shirt',category:'T-Shirts'},{id:'oversized-tee',name:'Oversized tee',category:'T-Shirts'},{id:'hoodie',name:'Hoodie',category:'Hoodies'},{id:'shirt',name:'Shirt',category:'Shirts'},{id:'jacket',name:'Jacket',category:'Jackets'},{id:'pants',name:'Trousers',category:'Bottoms'}] as const;
export const COLORS=[['White','#ffffff'],['Black','#171717'],['Signal red','#e5192b'],['Stone','#d6d2ca'],['Slate','#575b60'],['Navy','#17243d'],['Forest','#314a3a'],['Pink','#eac5cb']];
export const ART=['✳','★','♥','☻','⚡','CF'];
export const PRINT_PRICE=199;
export function printedSides(layers:PrintLayer[]){return new Set(layers.filter(l=>l.kind==='image'?!!l.image:!!l.text.trim()).map(l=>l.side)).size;}
export function isStudioDesign(value:unknown):value is StudioDesign {
 const d=value as StudioDesign;
 return !!d&&GARMENTS.some(g=>g.id===d.garmentType)&&typeof d.productId==='string'&&typeof d.colorName==='string'&&/^#[a-f0-9]{6}$/i.test(d.colorHex)&&['slim','regular','relaxed','oversized'].includes(d.fit)&&typeof d.size==='string'&&typeof d.fabricId==='string'&&Array.isArray(d.layers)&&d.layers.length<=8&&new Set(d.layers.map(l=>l?.id)).size===d.layers.length&&d.layers.every(l=>!!l&&typeof l.id==='string'&&l.id.length>0&&l.id.length<=100&&['text','art','image'].includes(l.kind)&&['front','back'].includes(l.side)&&typeof l.text==='string'&&l.text.length<=60&&/^#[a-f0-9]{6}$/i.test(l.color)&&['sans-serif','serif','monospace'].includes(l.font)&&[l.x,l.y,l.scale,l.rotation].every(Number.isFinite)&&l.x>=20&&l.x<=80&&l.y>=20&&l.y<=80&&l.scale>=10&&l.scale<=80&&Math.abs(l.rotation)<=180&&(l.kind!=='image'||(typeof l.image==='string'&&l.image.length<750000&&/^data:image\/(png|jpeg|webp);base64,/.test(l.image))));
}
