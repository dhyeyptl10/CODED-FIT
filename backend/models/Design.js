const mongoose=require('mongoose');
module.exports=mongoose.model('Design',new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},name:{type:String,maxLength:100,default:'My outfit'},configuration:{type:mongoose.Schema.Types.Mixed,required:true}},{timestamps:true}));
