const fs=require('fs');const edit=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));
fs.writeFileSync('frontend/components/common/Footer.tsx',"export {StoreFooter as Footer} from './StoreFooter';\n");
edit('frontend/components/common/Header.tsx',s=>s.replace('AHMEDABAD GOTS ORGANIC TEXTILES ✦ PRECISION BESPOKE ATELIER','CODED FIT / YOUR EVERYDAY WARDROBE').replace('FREE EXPRESS AIR SHIPPING OVER ₹2,999','FREE SHIPPING FROM ₹2,999').replace('DOORSTEP TRIAL PROTOCOL INCLUDED','DESIGN YOUR OWN LOOK').replace("href: '/shop?type=rtw'","href: '/shop?type=ready-to-wear'"));
edit('frontend/app/layout.tsx',s=>s.replace("India's premier dual-funnel fashion label fusing Ahmedabad GOTS Organic Textiles with Unit-of-One Bespoke Tailoring and Generative AI Virtual Try-On.",'Discover clothing, personalize your wardrobe, and explore 3D and photo try-on with CODED FIT.'));
edit('frontend/components/tryon/TryOnViewer.tsx',s=>s.replace(/      if \(videoRef.current\) \{\s*videoRef.current.srcObject = stream;\s*videoRef.current.play\(\);\s*setCameraActive\(true\);\s*\}/,'      setCameraActive(true);').replace("  const startCamera = async () => {", "  useEffect(()=>{if(cameraActive && videoRef.current && streamRef.current){videoRef.current.srcObject=streamRef.current;void videoRef.current.play().catch(()=>setProviderNotice('Camera playback failed.'));}},[cameraActive]);\n\n  const startCamera = async () => {").replace('className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto p-4 sm:p-6"','className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 sm:p-6"').replace('className="p-4 bg-white rounded-xl space-y-3"','className="p-4 bg-white rounded-xl space-y-3 lg:col-span-2"'));
for(const [file,path] of Object.entries({'(tabs)/index':'/','(tabs)/profile':'/account'})){
  const source='mobile-app/app/'+file+'.tsx';fs.copyFileSync(source,'mobile-app/legacy/'+file.replace('(tabs)/','')+'.tsx');fs.writeFileSync(source,`import React from 'react';\nimport Storefront from '../../components/Storefront';\nexport default function Screen(){return <Storefront path="${path}" />;}\n`);
}
edit('backend/seed.js',s=>s.slice(0,s.indexOf('const seedDatabase ='))+`// Add missing catalog records only. Never reset users, orders, prices or stock.
async function seedDatabase(){
 try{
  await mongoose.connect(mongoUri);
  for(const fabric of initialFabrics)await Fabric.updateOne({fabricId:fabric.fabricId},{$setOnInsert:fabric},{upsert:true});
  for(const product of initialProducts)await Product.updateOne({slug:product.slug},{$setOnInsert:product},{upsert:true});
  console.log('Missing sample catalog records added. Existing records preserved. No users or paid orders created.');
 }catch(error){console.error('Catalog seed failed. Check database and schema.');process.exitCode=1;}finally{await mongoose.disconnect();}
}
seedDatabase();
`);
edit('backend/utils/validateEnv.js',s=>s.replaceAll('server/','backend/').replace("if (!v) console.warn", "if (!v || /placeholder|your_|dummy|example|paste_/i.test(v)) console.warn"));
fs.writeFileSync('backend/services/providers/paymentProvider.js',`const gateway=require('../securePayment');
class RazorpayPaymentProvider {
 async createOrder({amountInPaise,currency='INR',receipt}){const order=await gateway.createOrder({amount:amountInPaise/100,currency,receipt});return {orderId:order.id,amount:order.amount,currency:order.currency,keyId:process.env.RAZORPAY_KEY_ID};}
 verifySignature(payload){return gateway.verifySignature(payload);}
}
module.exports={RazorpayPaymentProvider,getPaymentProvider:()=>new RazorpayPaymentProvider()};
`);
