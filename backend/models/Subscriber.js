const mongoose=require('mongoose');
module.exports=mongoose.model('Subscriber',new mongoose.Schema({email:{type:String,required:true,unique:true,lowercase:true,trim:true},consent:{type:Boolean,required:true},status:{type:String,default:'requested',enum:['requested','confirmed','unsubscribed']}},{timestamps:true}));
