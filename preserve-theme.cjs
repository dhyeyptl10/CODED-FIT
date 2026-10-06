const fs=require('fs');const edit=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));
fs.writeFileSync('frontend/app/page.tsx',"export {default} from '@/components/ReferenceHome';\n");
fs.writeFileSync('frontend/components/common/Header.tsx',"export {ReferenceHeader as Header} from './ReferenceHeader';\n");
fs.writeFileSync('frontend/components/common/Footer.tsx',"export {ReferenceFooter as Footer} from './ReferenceFooter';\n");
edit('frontend/app/globals.css',s=>s.replace('css2?family=Inter','css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Inter').replace("--font-headline: 'Syne'","--font-headline: 'Barlow Condensed'"));
edit('frontend/app/layout.tsx',s=>s.replace("import './globals.css';","import './globals.css';\nimport './reference-theme.css';"));
edit('frontend/tailwind.config.js',s=>s.replaceAll('../shared/','./shared/').replaceAll('#C9A84C','#DC0030').replaceAll('#DFBE68','#F14462').replaceAll('#A38435','#AD0026').replaceAll('#E10600','#DC0030').replaceAll('#FAF8F5','#FAF8F7').replaceAll('#F4EFEA','#F0EDED').replace("headline: ['Syne'","headline: ['Barlow Condensed'"));
edit('frontend/components/bespoke/FabricSelector.tsx',s=>s.replace('100% TRACEABLE','FABRIC CATALOG').replace('{fab.gsm} GSM','{fab.gsm}'));
edit('frontend/components/bespoke/CollarSelector.tsx',s=>s.replace('priceAdd: 200','priceAdd: 150'));
edit('frontend/components/bespoke/MonogramEditor.tsx',s=>s.replace('embroidered onto cuff','shown on the chest'));
edit('frontend/store/customizerStore.ts',s=>s.replace("placement: 'cuff'","placement: 'chest'"));
edit('backend/routes/v1/index.js',s=>s.replace('module.exports = router;',`router.post('/newsletter', require('../../middleware/rateLimiter').authLimiter, async(req,res,next)=>{
  try{
    if(typeof req.body.email!=='string' || req.body.email.length>254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(req.body.email) || req.body.consent!==true)return res.status(400).json({message:'A valid email and consent are required.'});
    await require('../../models/Subscriber').updateOne({email:req.body.email.trim().toLowerCase()},{$set:{consent:true},$setOnInsert:{status:'requested'}},{upsert:true});
    res.json({success:true,message:'Subscription request saved.'});
  }catch(error){next(error);}
});
module.exports = router;`));
edit('frontend/services/api.ts',s=>s.replace('export const api = {',`export const api = {
  getAddresses:()=>fetchJSON<{addresses:any[]}>('/customer/addresses'),
  addAddress:(address:any)=>fetchJSON<{addresses:any[]}>('/customer/addresses',{method:'POST',body:JSON.stringify(address)}),
  removeAddress:(id:string)=>fetchJSON<{addresses:any[]}>('/customer/addresses/'+id,{method:'DELETE'}),
  getWishlist:()=>fetchJSON<{products:any[]}>('/customer/wishlist'),
  setWishlist:(id:string,saved:boolean)=>fetchJSON<{wishlist:string[]}>('/customer/wishlist/'+id,{method:'PUT',body:JSON.stringify({saved})}),
  getReturns:()=>fetchJSON<{requests:any[]}>('/customer/returns'),
  requestReturn:(payload:any)=>fetchJSON<any>('/customer/returns',{method:'POST',body:JSON.stringify(payload)}),`));
