const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ReturnRequest = require('../models/ReturnRequest');
router.use(require('../middleware/auth').protect);
router.get('/wishlist',async(req,res,next)=>{
  try {const user=await User.findById(req.user._id).populate('wishlist');res.json({success:true,products:user.wishlist});}catch(error){next(error);}
});
router.put('/wishlist/:productId',async(req,res,next)=>{
  try {
    if(!await Product.exists({_id:req.params.productId,status:'active'}))return res.status(404).json({message:'Product not found'});
    const update=req.body.saved===false?{$pull:{wishlist:req.params.productId}}:{$addToSet:{wishlist:req.params.productId}};
    const user=await User.findByIdAndUpdate(req.user._id,update,{new:true});
    res.json({success:true,wishlist:user.wishlist});
  }catch(error){next(error);}
});
router.get('/addresses',async(req,res,next)=>{
  try{const user=await User.findById(req.user._id);res.json({success:true,addresses:user.addresses});}catch(error){next(error);}
});
router.post('/addresses',async(req,res,next)=>{
  try{
    const fields=['fullName','phone','street','city','state','postalCode'];
    if(fields.some(key=>typeof req.body[key]!=='string' || !req.body[key].trim() || req.body[key].length>300))return res.status(400).json({message:'Complete address details are required.'});
    if(!/^\d{6}$/.test(req.body.postalCode))return res.status(400).json({message:'Enter a six-digit PIN code.'});
    const address=Object.fromEntries(fields.map(key=>[key,req.body[key].trim()]));address.country='India';
    const user=await User.findOneAndUpdate({_id:req.user._id,'addresses.9':{$exists:false}},{$push:{addresses:address}},{new:true,runValidators:true});
    if(!user)return res.status(409).json({message:'Maximum ten addresses. Remove an old address first.'});
    res.status(201).json({success:true,addresses:user.addresses});
  }catch(error){next(error);}
});
router.delete('/addresses/:id',async(req,res,next)=>{
  try{const user=await User.findByIdAndUpdate(req.user._id,{$pull:{addresses:{_id:req.params.id}}},{new:true});res.json({success:true,addresses:user.addresses});}catch(error){next(error);}
});
router.get('/returns',async(req,res,next)=>{
  try{res.json({success:true,requests:await ReturnRequest.find({userId:req.user._id}).sort({createdAt:-1})});}catch(error){next(error);}
});
router.post('/returns',async(req,res,next)=>{
  try{
    const order=await Order.findOne({orderNumber:req.body.orderNumber,userId:req.user._id});
    if(!order)return res.status(404).json({message:'Order not found'});
    if(order.payment.status!=='paid' || !['DELIVERED','completed'].includes(order.status))return res.status(409).json({message:'Return or alteration requests are available after delivery.'});
    if(typeof req.body.reason!=='string' || req.body.reason.trim().length<10)return res.status(400).json({message:'Describe the issue in at least ten characters.'});
    const request=await ReturnRequest.create({orderId:order._id,userId:req.user._id,reason:req.body.reason.trim(),type:req.body.type || 'return'});
    res.status(201).json({success:true,request,message:'Request saved for store review. Approval and refund are not yet confirmed.'});
  }catch(error){next(error);}
});
module.exports=router;
