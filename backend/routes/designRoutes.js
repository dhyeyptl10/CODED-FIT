const router=require('express').Router();
const Design=require('../models/Design');
router.use(require('../middleware/auth').protect);
router.get('/',async(req,res,next)=>{try{res.json({success:true,designs:await Design.find({userId:req.user._id}).sort({createdAt:-1}).limit(50)});}catch(e){next(e);}});
router.post('/',async(req,res,next)=>{try{
  const {configuration,name}=req.body;
  if (!configuration || typeof configuration !== 'object' || JSON.stringify(configuration).length>20000) return res.status(400).json({message:'Invalid design configuration'});
  const design=await Design.create({userId:req.user._id,name,configuration});res.status(201).json({success:true,design});
}catch(e){next(e);}});
router.delete('/:id',async(req,res,next)=>{try{const design=await Design.findOneAndDelete({_id:req.params.id,userId:req.user._id});res.status(design?200:404).json({success:!!design});}catch(e){next(e);}});
module.exports=router;
