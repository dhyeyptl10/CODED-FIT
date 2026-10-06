'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {ArrowLeft,ArrowUpRight,RotateCcw,RotateCw,Download,Save,ShoppingBag,Upload,Type,Shapes,Trash2,Copy,Plus,Check} from 'lucide-react';
import type {GarmentCustomization} from '@coded-fit/shared';
import {useCatalog} from '@/lib/useCatalog';
import {useCartStore} from '@/store/cartStore';
import {useAuthStore} from '@/store/authStore';
import {api} from '@/services/api';
import {GarmentPreview} from './GarmentPreview';
import {ART,COLORS,GARMENTS,INITIAL_DESIGN,PRINT_PRICE,isStudioDesign,printedSides} from './types';
import type {StudioDesign,PrintLayer,PrintSide} from './types';
interface Fabric {fabricId:string;name:string;priceAdd:number;}
const DRAFT_KEY='coded-fit-print-draft-v1';
const newId=()=>globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
export default function PrintStudio(){
 const params=useSearchParams(),{products,loading,error,retry}=useCatalog();
 const [design,setDesign]=useState<StudioDesign>(INITIAL_DESIGN),[side,setSide]=useState<PrintSide>('front'),[rotate,setRotate]=useState(false),[tab,setTab]=useState('product');
 const editItem=params.get('editItem');
 const [editingId,setEditingId]=useState<string|null>(null);
 const initializedEdit=useRef<string|null>(null);
 const [selected,setSelected]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[quantity,setQuantity]=useState(1);
 const [fabrics,setFabrics]=useState<Fabric[]>([]),[fabricError,setFabricError]=useState(''),[saved,setSaved]=useState<any[]>([]);
 const history=useRef<StudioDesign[]>([]),future=useRef<StudioDesign[]>([]),capture=useRef<null|(()=>string)>(null);
 const [revision,setRevision]=useState(0);const input=useRef<HTMLInputElement>(null),initialized=useRef(false);
 const candidates=products.filter(p=>p.category===GARMENTS.find(g=>g.id===design.garmentType)?.category&&p.gender!=='kids'&&(!p.slug.startsWith('cf-studio-')||p.slug.startsWith(`cf-studio-${design.garmentType}-`)));
 const product=candidates.find(p=>p.id===design.productId)||candidates.find(p=>p.slug===`cf-studio-${design.garmentType}-white`)||candidates[0];
 const fabric=fabrics.find(f=>f.fabricId===design.fabricId);
 const layer=design.layers.find(l=>l.id===selected);
 const printPrice=printedSides(design.layers)*PRINT_PRICE;
 const price=(product?.price||0)+(fabric?.priceAdd||0)+printPrice;
 const maxQuantity=Math.max(1,Math.min(product?.inventory.available||0,10));
 function commit(next:StudioDesign){history.current=[...history.current.slice(-29),design];future.current=[];setDesign(next);setRevision(v=>v+1);}
 function patch(values:Partial<StudioDesign>){commit({...design,...values});}
 function patchLayer(values:Partial<PrintLayer>){if(layer){setSide(values.side||layer.side);setRotate(false);}patch({layers:design.layers.map(l=>l.id===selected?{...l,...values}:l)});}
 function undo(){const previous=history.current.pop();if(previous){future.current.push(design);setDesign(previous);setRevision(v=>v+1);}}
 function redo(){const next=future.current.pop();if(next){history.current.push(design);setDesign(next);setRevision(v=>v+1);}}
 async function loadFabrics(){setFabricError('');try{const data=await api.getCustomizationOptions();setFabrics(data.options.fabrics);}catch{setFabricError('Fabric options couldn’t load.');}}
 useEffect(()=>{void loadFabrics();},[]);
 useEffect(()=>{
  if(!editItem){setEditingId(null);initializedEdit.current=null;return;}
  if(initializedEdit.current===editItem)return;
  const restore=()=>{
   initializedEdit.current=editItem;
   const item=useCartStore.getState().items.find(i=>i.id===editItem),custom=item?.customization;
   const restored=custom&&item?{garmentType:custom.garmentType,productId:item.productId,colorHex:custom.colorHex,colorName:custom.colorName,fit:custom.fit,size:item.size,fabricId:custom.fabricId,layers:custom.printLayers}:null;
   if(item&&isStudioDesign(restored)){
    initialized.current=true;setDesign(restored);setQuantity(item.qty);setEditingId(item.id);setSelected('');history.current=[];future.current=[];setMessage('Editing your bag item. Save your changes with Update bag.');
   }else{setEditingId(null);setMessage('This bag item is no longer available to edit. You can create a new design.');}
  };
  if(useCartStore.persist.hasHydrated()){restore();return;}
  return useCartStore.persist.onFinishHydration(restore);
 },[editItem]);
 useEffect(()=>{if(!loading&&product)setQuantity(q=>Math.min(q,maxQuantity));},[loading,product,maxQuantity]);
 useEffect(()=>{if(!message)return;const timer=setTimeout(()=>setMessage(''),6000);return()=>clearTimeout(timer);},[message]);
 useEffect(()=>{
  if(editItem||initialized.current||!products.length)return;initialized.current=true;
  const requested=products.find(p=>p.id===params.get('productId'));
  if(requested){const garment=GARMENTS.find(g=>requested.slug.startsWith(`cf-studio-${g.id}-`))||GARMENTS.find(g=>g.category===requested.category);if(garment)setDesign(d=>({...d,garmentType:garment.id,productId:requested.id,colorHex:requested.colors[0]?.hex||'#ffffff',colorName:requested.colors[0]?.name||'White',size:requested.sizes.includes('M')?'M':requested.sizes[0]}));}
 },[products,params,editItem]);
 useEffect(()=>{if(product&&!product.sizes.includes(design.size))setDesign(d=>({...d,size:product.sizes[0]||''}));},[product,design.size]);
 function addLayer(kind:PrintLayer['kind'],text='',image?:string){
  if(design.layers.length>=8){setMessage('Use up to 8 layers across front and back.');return;}
  const id=newId();patch({layers:[...design.layers,{id,kind,side,text,color:design.colorHex.toLowerCase()==='#171717'?'#ffffff':'#e5192b',font:'sans-serif',x:50,y:45,scale:50,rotation:0,...(image?{image}:{})}]});setSelected(id);setTab('design');setRotate(false);
 }
 async function upload(file?:File){
  if(!file)return;setMessage('');if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){setMessage('Choose a PNG, JPG or WebP image under 5 MB.');return;}
  setBusy(true);const url=URL.createObjectURL(file);
  try{const image=new Image();image.src=url;await image.decode();const ratio=Math.min(1,900/Math.max(image.width,image.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));canvas.getContext('2d')!.drawImage(image,0,0,canvas.width,canvas.height);const data=canvas.toDataURL('image/webp',.86);if(data.length>=750000)throw new Error('This artwork is too detailed. Please upload a smaller image.');addLayer('image',file.name.slice(0,60),data);setMessage('Artwork added. Use position, scale and rotation below.');}catch(e){setMessage(e instanceof Error?e.message:'This image could not be opened.');}finally{URL.revokeObjectURL(url);setBusy(false);if(input.current)input.current.value='';}
 }
 async function saveDraft(){
  try{localStorage.setItem(DRAFT_KEY,JSON.stringify({...design,productId:product?.id||design.productId}));setMessage('Draft saved on this device.');}catch{setMessage('Device storage is full. Download a preview before leaving.');}
 }
 function restoreDraft(){try{const draft=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');if(!isStudioDesign(draft))throw new Error();commit(draft);setSelected('');setMessage('Saved draft restored.');}catch{setMessage('No compatible saved draft on this device yet.');}}
 async function wardrobe(save:boolean){
  if(!useAuthStore.getState().isAuthenticated){useAuthStore.getState().openLoginModal('email');return;}setBusy(true);
  try{if(save)await api.saveDesign({name:`Custom ${GARMENTS.find(g=>g.id===design.garmentType)?.name}`,configuration:{studioDesign:{...design,productId:product?.id||design.productId}}});const data=await api.getDesigns();setSaved(data.designs.filter((d:any)=>isStudioDesign(d.configuration?.studioDesign)));setMessage(save?'Design saved to your account.':'Your saved studio designs are below.');}catch(e){setMessage(e instanceof Error?e.message:'Unable to reach your wardrobe.');}finally{setBusy(false);}
 }
 function addToBag(){
  if(!product||!fabric||!product.sizes.includes(design.size)||product.inventory.available<quantity)return;
  const customization:GarmentCustomization={garmentType:design.garmentType,fabricId:fabric.fabricId,fabricName:fabric.name,fabricPriceAdd:fabric.priceAdd,colorHex:design.colorHex,colorName:design.colorName,fit:design.fit,collar:'spread',cuff:'barrel',button:'standard',pocket:design.garmentType==='hoodie'?'kangaroo':'none',optionsPriceAdd:printPrice,totalCustomPrice:price,printLayers:design.layers,printPriceAdd:printPrice};
  try{const item={productId:product.id,name:`Custom ${GARMENTS.find(g=>g.id===design.garmentType)?.name} — ${design.colorName}`,price,qty:quantity,size:design.size,image:product.images[0],colorHex:design.colorHex,colorName:design.colorName,type:'made-to-measure' as const,customization};
   const cart=useCartStore.getState();
   if(editingId){if(!cart.replaceItem(editingId,item)){setEditingId(null);setMessage('This item was removed from your bag. Add this design as a new item.');return;}}
   else cart.addItem(item);
   setMessage(editingId?'Your bag item has been updated.':'Your garment, artwork and selected size are in your bag.');}catch{setMessage('Your device storage is full. Reduce image size and try again.');}
 }
 return <div className="print-studio">
  <div className="studio-heading"><div><Link href="/shop" className="studio-back"><ArrowLeft size={15}/> BACK TO SHOP</Link><p className="cf-eyebrow">THE CODED FIT BESPOKE STUDIO</p><h1>YOUR IDEAS. <span>YOUR GARMENT.</span></h1></div><Link href="/bespoke?mode=tailoring" className="studio-tailoring">Body fit & tailoring <ArrowUpRight size={16}/></Link></div>
  <div className="studio-workspace">
   <section className="studio-stage" aria-label="Design preview"><div className="studio-stage-bar"><span>LIVE 3D PREVIEW</span><span>{GARMENTS.find(g=>g.id===design.garmentType)?.name}</span></div><GarmentPreview design={design} side={side} rotate={rotate} captureRef={capture}/><div className="studio-view-controls"><div>{(['front','back'] as const).map(s=><button key={s} aria-pressed={side===s} onClick={()=>{setSide(s);setSelected('');setRotate(false);}}>{s}</button>)}</div><button aria-pressed={rotate} onClick={()=>setRotate(!rotate)}>{rotate?'Pause spin':'360° spin'}</button><button onClick={()=>{const data=capture.current?.();if(data){const a=document.createElement('a');a.href=data;a.download=`coded-fit-${design.garmentType}-${side}.png`;a.click();}else setMessage('Preview export is unavailable until 3D loads.');}} aria-label="Download design preview"><Download size={17}/></button></div><p className="studio-preview-hint">Drag to rotate · pinch or scroll to zoom · illustrative garment preview</p><div className="studio-save-row"><button onClick={saveDraft}><Save size={15}/> Save draft</button><button onClick={restoreDraft}>Load draft</button><button disabled={!history.current.length} onClick={undo} aria-label="Undo design change"><RotateCcw size={16}/></button><button disabled={!future.current.length} onClick={redo} aria-label="Redo design change"><RotateCw size={16}/></button></div></section>
   <section className="studio-editor" aria-label="Garment customization"><div className="studio-tabs" role="tablist" aria-label="Customization steps">{[['product','01','Garment'],['design','02','Design'],['finish','03','Size & finish']].map(([id,n,label])=><button role="tab" aria-selected={tab===id} key={id} onClick={()=>setTab(id)}><small>{n}</small>{label}</button>)}</div>
    <div className="studio-panel" role="tabpanel" aria-label={tab}>
    {tab==='product'&&<><h2>Start with your canvas.</h2><p className="studio-muted">Switch garments anytime. Your artwork stays with you.</p><div className="studio-garments">{GARMENTS.map(g=><button key={g.id} aria-pressed={design.garmentType===g.id} onClick={()=>patch({garmentType:g.id,productId:''})}><span>{g.id==='pants'?'Ⅱ':g.id==='hoodie'?'◉':'✦'}</span>{g.name}</button>)}</div>{loading?<p role="status">Loading garments…</p>:error?<p role="alert">Catalog unavailable. <button onClick={retry}>Retry</button></p>:<label className="studio-field">Base garment<select value={product?.id||''} onChange={e=>patch({productId:e.target.value})}>{candidates.map(p=><option key={p.id} value={p.id}>{p.name} · ₹{p.price.toLocaleString('en-IN')}</option>)}</select>{!candidates.length&&<span>No purchasable garment in this category yet.</span>}</label>}<div className="studio-label">GARMENT COLOUR <strong>{design.colorName}</strong></div><div className="studio-swatches">{COLORS.map(([name,hex])=><button key={hex} aria-label={name} aria-pressed={design.colorHex===hex} style={{background:hex}} onClick={()=>patch({colorHex:hex,colorName:name})}>{design.colorHex===hex&&<Check size={16} color={['#ffffff','#d6d2ca','#eac5cb'].includes(hex)?'#111':'#fff'}/>}</button>)}<label className="studio-custom-color" title="Custom garment colour"><input type="color" aria-label="Custom garment colour" value={design.colorHex} onChange={e=>patch({colorHex:e.target.value,colorName:'Custom colour'})}/><Plus size={17}/></label></div><button className="studio-next" onClick={()=>setTab('design')}>ADD YOUR DESIGN <ArrowUpRight size={16}/></button></>}
    {tab==='design'&&<><h2>Make it unmistakably you.</h2><p className="studio-muted">Editing the <b>{side}</b>. ₹{PRINT_PRICE} per printed side, with up to 8 layers in total.</p><div className="studio-design-actions"><button onClick={()=>addLayer('text','YOUR CODE')}><Type size={20}/>Add text</button><button onClick={()=>input.current?.click()} disabled={busy}><Upload size={20}/>Upload art</button></div><input ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" aria-label="Upload artwork" onChange={e=>void upload(e.target.files?.[0])}/><p className="studio-muted small">PNG, JPG or WebP · up to 5 MB · use artwork you own or have permission to print.</p><div className="studio-label">DESIGN LIBRARY <Shapes size={15}/></div><div className="studio-art-library">{ART.map(art=><button key={art} onClick={()=>addLayer('art',art)} aria-label={`Add ${art} artwork`}>{art}</button>)}</div>
     <div className="studio-label">YOUR LAYERS <span>{design.layers.length}/8</span></div><div className="studio-layers">{!design.layers.length&&<p className="studio-muted">Add text, a symbol or your own image to begin.</p>}{design.layers.map(l=><button key={l.id} aria-pressed={selected===l.id} onClick={()=>{setSelected(l.id);setSide(l.side);setRotate(false);}}><span>{l.kind==='image'?'▧':l.kind==='text'?'T':'✦'} {l.text||'Artwork'}</span><small>{l.side}</small></button>)}</div>
     {layer&&<div className="studio-layer-editor"><div className="studio-label">EDIT SELECTED LAYER <div><button aria-label="Duplicate layer" disabled={design.layers.length>=8} onClick={()=>{const id=newId();patch({layers:[...design.layers,{...layer,id,y:Math.min(80,layer.y+10)}]});setSelected(id);}}><Copy size={15}/></button><button aria-label="Delete layer" onClick={()=>{patch({layers:design.layers.filter(l=>l.id!==selected)});setSelected('');}}><Trash2 size={15}/></button></div></div>{layer.kind==='text'&&<label className="studio-field">Your text<input maxLength={60} value={layer.text} onChange={e=>patchLayer({text:e.target.value})}/></label>}<div className="studio-two-fields"><label className="studio-field">Print side<select value={layer.side} onChange={e=>{const value=e.target.value as PrintSide;patchLayer({side:value});setSide(value);}}><option value="front">Front</option><option value="back">Back</option></select></label>{layer.kind!=='image'&&<label className="studio-field">Ink colour<input type="color" value={layer.color} onChange={e=>patchLayer({color:e.target.value})}/></label>}</div>{layer.kind==='text'&&<label className="studio-field">Font<select value={layer.font} onChange={e=>patchLayer({font:e.target.value as PrintLayer['font']})}><option value="sans-serif">Bold modern</option><option value="serif">Editorial serif</option><option value="monospace">Code mono</option></select></label>}{[{key:'x',label:'Horizontal position',min:20,max:80},{key:'y',label:'Vertical position',min:20,max:80},{key:'scale',label:'Design size',min:10,max:80},{key:'rotation',label:'Rotation',min:-180,max:180}].map(c=><label className="studio-slider" key={c.key}><span>{c.label}<b>{layer[c.key as 'x']}{c.key==='rotation'?'°':'%'}</b></span><input type="range" min={c.min} max={c.max} value={layer[c.key as 'x']} onChange={e=>patchLayer({[c.key]:Number(e.target.value)})}/></label>)}<button className="studio-inline-button" onClick={()=>patchLayer({x:50,y:45,rotation:0})}>Center design</button></div>}<button className="studio-next" onClick={()=>setTab('finish')}>CHOOSE SIZE & FINISH <ArrowUpRight size={16}/></button></>}
    {tab==='finish'&&<><h2>The final details.</h2><div className="studio-label">SELECT SIZE</div><div className="studio-sizes">{product?.sizes.map(size=><button key={size} aria-pressed={design.size===size} onClick={()=>patch({size})}>{size}</button>)}</div><label className="studio-field">Silhouette<select value={design.fit} onChange={e=>patch({fit:e.target.value as StudioDesign['fit']})}><option value="slim">Slim</option><option value="regular">Regular</option><option value="relaxed">Relaxed</option><option value="oversized">Oversized</option></select></label><label className="studio-field">Fabric<select value={design.fabricId} onChange={e=>patch({fabricId:e.target.value})}>{fabrics.map(f=><option key={f.fabricId} value={f.fabricId}>{f.name} (+₹{f.priceAdd})</option>)}</select></label>{fabricError&&<p role="alert">{fabricError} <button onClick={loadFabrics}>Retry</button></p>}<label className="studio-field">Quantity<select value={quantity} onChange={e=>setQuantity(Number(e.target.value))}>{Array.from({length:maxQuantity},(_,i)=><option key={i+1}>{i+1}</option>)}</select></label><div className="studio-price-lines"><span>Garment <b>₹{product?.price.toLocaleString('en-IN')||'—'}</b></span><span>Fabric upgrade <b>₹{fabric?.priceAdd||0}</b></span><span>{printedSides(design.layers)} printed sides <b>₹{printPrice}</b></span></div><p className="studio-muted">Preview is an illustration. Final print placement and material are reviewed before production. For body measurements, use <Link href="/bespoke?mode=tailoring">fit & tailoring</Link>.</p><div className="studio-account-save"><button disabled={busy} onClick={()=>wardrobe(true)}>Save to account</button><button disabled={busy} onClick={()=>wardrobe(false)}>My designs</button></div>{saved.map(item=><button className="studio-saved-design" key={item._id} onClick={()=>{commit(item.configuration.studioDesign);setSelected('');setMessage('Saved design restored.');}}>{item.name} <ArrowUpRight size={15}/></button>)}</>}
    </div><div className="studio-purchase"><div><span>{quantity>1?`${quantity} pieces`:'YOUR CUSTOM PIECE'}</span><strong>₹{(price*quantity).toLocaleString('en-IN')}</strong></div><button disabled={!product||!fabric||!product.sizes.includes(design.size)||product.inventory.available<quantity||busy} onClick={addToBag}><ShoppingBag size={17}/> {editingId?'UPDATE BAG':'ADD TO BAG'}</button><small>{product?.inventory.available===0?'Currently out of stock':!product?'Choose an available garment':'Shipping calculated in your bag. Artwork stays attached to your order.'}</small></div>
   </section>
  </div><p role="status" className={`studio-message ${message?'visible':''}`}>{message}</p>
 </div>;
}



