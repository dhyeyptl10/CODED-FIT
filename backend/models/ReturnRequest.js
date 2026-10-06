const mongoose = require('mongoose');
module.exports = mongoose.model('ReturnRequest', new mongoose.Schema({
  orderId: {type:mongoose.Schema.Types.ObjectId,ref:'Order',required:true},
  userId: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
  reason: {type:String,required:true,maxLength:2000},
  type: {type:String,enum:['return','alteration'],default:'return'},
  status: {type:String,enum:['requested','approved','rejected','resolved'],default:'requested'}
},{timestamps:true}));
