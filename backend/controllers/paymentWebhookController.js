const crypto=require('crypto');
const Order=require('../models/Order');
exports.handle=async(req,res,next)=>{
  const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
  if(!secret)return res.status(503).json({message:'Webhook not configured'});
  const signature=req.get('x-razorpay-signature');
  if(typeof signature!=='string' || !/^[a-f0-9]{64}$/i.test(signature))return res.sendStatus(400);
  const expected=crypto.createHmac('sha256',secret).update(req.body).digest();
  if(!crypto.timingSafeEqual(expected,Buffer.from(signature,'hex')))return res.sendStatus(400);
  try{
    const event=JSON.parse(req.body.toString('utf8'));
    if(event.event!=='payment.captured')return res.json({received:true});
    const payment=event.payload?.payment?.entity;
    if(!payment || payment.status!=='captured' || payment.currency!=='INR')return res.sendStatus(400);
    const order=await Order.findOne({'payment.orderId':payment.order_id});
    if(!order)return res.status(404).json({message:'Order not found'});
    if(payment.amount!==Math.round(order.totals.total*100))return res.sendStatus(400);
    await Order.updateOne({_id:order._id,'payment.status':{$ne:'paid'}},{$set:{'payment.status':'paid','payment.id':payment.id,'payment.paidAt':new Date(),status:'PAYMENT_CONFIRMED'}});
    return res.json({received:true});
  }catch(error){next(error);}
};
