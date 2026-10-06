require('dotenv').config();
const mongoose=require('mongoose');
const Product=require('./models/Product');
const products=require('./catalog/studio');
async function run(){try{await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/coded_fit');let added=0;for(const {studioType,illustrationColor,...p} of products){const result=await Product.updateOne({slug:p.slug},{$setOnInsert:p},{upsert:true,runValidators:true});added+=result.upsertedCount;}console.log(`${added} studio products added; existing products, prices and inventory preserved. Catalog now contains ${await Product.countDocuments({status:'active'})} active products.`);}finally{await mongoose.disconnect();}}
run().catch(()=>{console.error('Studio catalog could not be added. Check the database connection.');process.exitCode=1;});
