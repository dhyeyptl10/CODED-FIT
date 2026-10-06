const {test}=require('node:test');
const assert=require('node:assert/strict');
const {validatePrintLayers,quoteCustomization}=require('../services/quote');
const Fabric=require('../models/Fabric');
const layer={id:'test-layer',kind:'text',side:'front',text:'MY CODE',font:'sans-serif',color:'#e5192b',x:50,y:45,scale:50,rotation:0};
test('print data rejects remote URLs, invalid placements and oversized or forged artwork',()=>{
 assert.throws(()=>validatePrintLayers([{...layer,x:1000}]),/outside/);
 assert.throws(()=>validatePrintLayers([{...layer,kind:'image',image:'https://example.test/art.png'}]),/uploaded/);
 assert.throws(()=>validatePrintLayers([{...layer,kind:'image',image:'data:image/png;base64,SGVsbG8='}]),/contents/);
 assert.throws(()=>validatePrintLayers([{...layer,text:'x'.repeat(61)}]),/60 characters/);
 assert.throws(()=>validatePrintLayers(Array(9).fill(layer)),/8 print layers/);
 assert.throws(()=>validatePrintLayers([layer,layer]),/layer ID/);
 assert.deepEqual(validatePrintLayers([layer]),[layer]);
});
test('server prices unique printed sides and preserves artwork instead of trusting client prices',async t=>{
 const original=Fabric.findOne;Fabric.findOne=async()=>({name:'Cotton',priceAdd:0});t.after(()=>{Fabric.findOne=original;});
 const design={garmentType:'tshirt',fit:'regular',colorHex:'#ffffff',collar:'spread',cuff:'barrel',button:'standard',fabricId:'cotton',printPriceAdd:-9999,printLayers:[layer,{...layer,id:'second',text:'MORE'},{...layer,id:'back',side:'back'}]};
 const quote=await quoteCustomization({category:'T-Shirts',price:999},design);
 assert.equal(quote.price,1397);assert.equal(quote.design.printPriceAdd,398);assert.equal(quote.design.printLayers.length,3);
 assert.equal(quote.design.printLayers[2].side,'back');
 const blank=await quoteCustomization({category:'T-Shirts',price:999},{...design,printLayers:[{...layer,text:'   '}]});assert.equal(blank.price,999);
});
