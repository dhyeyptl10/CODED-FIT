const crypto = require('crypto');
const Razorpay = require('razorpay');
function client() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw Object.assign(new Error('Payments unavailable: configure Razorpay credentials.'), {statusCode:503,isOperational:true});
  return new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
}
exports.createOrder = ({amount,currency='INR',receipt}) => client().orders.create({amount:Math.round(amount*100),currency,receipt});
exports.fetchPayment = id => client().payments.fetch(id);
exports.verifySignature = ({orderId,paymentId,signature}) => {
  if (!process.env.RAZORPAY_KEY_SECRET || typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest();
  return crypto.timingSafeEqual(expected,Buffer.from(signature,'hex'));
};
