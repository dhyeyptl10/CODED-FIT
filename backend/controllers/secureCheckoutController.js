const Order = require('../models/Order');
const gateway = require('../services/securePayment');
exports.createPaymentOrder = async (req,res,next) => {
  try {
    const order = await Order.findOne({_id:req.body.orderId,userId:req.user._id});
    if (!order) return res.status(404).json({message:'Order not found'});
    if (order.payment.status === 'paid') return res.status(409).json({message:'Order already paid'});
    if (!order.payment.orderId) {
      const locked = await Order.findOneAndUpdate({_id:order._id,'payment.orderId':''},{$set:{'payment.orderId':'creating'}},{new:true});
      if (!locked) return res.status(409).json({message:'Payment initialization in progress. Please retry.'});
      try {
        const intent = await gateway.createOrder({amount:order.totals.total,receipt:order._id.toString()});
        order.payment.orderId = intent.id;
        await Order.updateOne({_id:order._id},{$set:{'payment.orderId':intent.id}});
      } catch(error) {
        await Order.updateOne({_id:order._id,'payment.orderId':'creating'},{$set:{'payment.orderId':''}});
        throw error;
      }
    }
    if (order.payment.orderId === 'creating') return res.status(409).json({message:'Payment initialization in progress. Please retry.'});
    res.json({success:true,orderId:order.payment.orderId,amount:Math.round(order.totals.total*100),currency:'INR',keyId:process.env.RAZORPAY_KEY_ID});
  } catch(error) {next(error);}
};
exports.verifyPayment = async (req,res,next) => {
  try {
    const {orderId,razorpayPaymentId,razorpayOrderId,razorpaySignature} = req.body;
    const order = await Order.findOne({_id:orderId,userId:req.user._id});
    if (!order) return res.status(404).json({message:'Order not found'});
    if (order.payment.orderId !== razorpayOrderId || !gateway.verifySignature({orderId:order.payment.orderId,paymentId:razorpayPaymentId,signature:razorpaySignature})) return res.status(400).json({message:'Invalid payment verification'});
    if (order.payment.status === 'paid') return res.json({success:true,order});
    const payment = await gateway.fetchPayment(razorpayPaymentId);
    if (payment.order_id !== order.payment.orderId || payment.amount !== Math.round(order.totals.total*100) || payment.currency !== 'INR' || payment.status !== 'captured') return res.status(409).json({message:'Payment is not captured yet. Check your orders before retrying.'});
    const updated = await Order.findOneAndUpdate({_id:order._id,'payment.status':{$ne:'paid'}},{$set:{'payment.status':'paid','payment.id':razorpayPaymentId,'payment.paidAt':new Date(),status:'PAYMENT_CONFIRMED'}},{new:true});
    res.json({success:true,order:updated || await Order.findById(order._id)});
  } catch(error) {next(error);}
};
