const Fabric=require('../models/Fabric');
const categories={shirt:'Shirts',tshirt:'T-Shirts','oversized-tee':'T-Shirts',hoodie:'Hoodies',pants:'Bottoms',jacket:'Jackets'};
function invalid(message){throw Object.assign(new Error(message),{statusCode:400,isOperational:true});}
function validatePrintLayers(input){
 if(input===undefined)return [];
 if(!Array.isArray(input)||input.length>8)invalid('A design can contain at most 8 print layers.');
 const ids=new Set();
 return input.map(layer=>{
  if(!layer||typeof layer.id!=='string'||layer.id.length>100||ids.has(layer.id))invalid('Invalid print layer ID.');ids.add(layer.id);
  if(!['front','back'].includes(layer.side)||!['text','art','image'].includes(layer.kind))invalid('Invalid print area or artwork type.');
  if(typeof layer.text!=='string'||layer.text.length>60)invalid('Print text must be at most 60 characters.');
  if(!/^#[a-f\d]{6}$/i.test(layer.color||''))invalid('Invalid print colour.');
  if(!['sans-serif','serif','monospace'].includes(layer.font))invalid('Invalid print font.');
  for(const [field,min,max] of [['x',20,80],['y',20,80],['scale',10,80],['rotation',-180,180]])if(typeof layer[field]!=='number'||!Number.isFinite(layer[field])||layer[field]<min||layer[field]>max)invalid('Artwork placement is outside the print area.');
  const result={id:layer.id,kind:layer.kind,side:layer.side,text:layer.text.trim(),color:layer.color,font:layer.font,x:layer.x,y:layer.y,scale:layer.scale,rotation:layer.rotation};
  if(layer.kind==='art'&&!['✳','★','♥','☻','⚡','CF'].includes(layer.text))invalid('Unknown library artwork.');
  if(layer.kind==='image'){
   if(typeof layer.image!=='string'||layer.image.length>=750000)invalid('Uploaded artwork is too large.');
   const match=/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(layer.image);if(!match)invalid('Artwork must be an uploaded PNG, JPEG or WebP image.');
   const bytes=Buffer.from(match[2],'base64');
   const valid=match[1]==='png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):match[1]==='jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
   if(!valid)invalid('Invalid artwork file contents.');result.image=layer.image;
  }
  return result;
 });
}
exports.validatePrintLayers=validatePrintLayers;
exports.quoteCustomization=async(product,design)=>{
 if(!design)return {price:product.price};
 if(categories[design.garmentType]!==product.category)invalid('Garment does not match the catalog product.');
 if(!['slim','regular','relaxed','oversized'].includes(design.fit))invalid('Invalid fit.');
 if(!/^#[a-f\d]{6}$/i.test(design.colorHex||''))invalid('Invalid garment color.');
 if(!['spread','band','cuban','cutaway','classic','button-down'].includes(design.collar))invalid('Invalid collar.');
 if(!['barrel','french','mitered','rounded','ribbed'].includes(design.cuff))invalid('Invalid cuff.');
 if(!['mother-of-pearl','matte-obsidian','horn','antique-brass','standard'].includes(design.button))invalid('Invalid buttons.');
 const printLayers=validatePrintLayers(design.printLayers);
 const fabric=await Fabric.findOne({fabricId:design.fabricId,inStock:true});
 if(!fabric)invalid('Selected fabric is unavailable. Choose a fabric from the catalog.');
 const text=design.monogram?.enabled?String(design.monogram.text||'').trim():'';
 if(text.length>12)invalid('Monogram must be at most 12 characters.');
 const printPriceAdd=new Set(printLayers.filter(l=>l.kind==='image'||l.text).map(l=>l.side)).size*199;
 const optionsPriceAdd=(design.collar==='spread'?0:150)+(text?250:0)+printPriceAdd;
 const customization={fabric:fabric.name,collar:design.collar,cuff:design.cuff,button:design.button,monogram:text,fit:design.fit,fabricPriceAdd:fabric.priceAdd,optionsPriceAdd};
 return {price:product.price+fabric.priceAdd+optionsPriceAdd,customization,design:{garmentType:design.garmentType,colorHex:design.colorHex,colorName:String(design.colorName||'').slice(0,60),pocket:design.pocket,printLayers,printPriceAdd,...customization}};
};
