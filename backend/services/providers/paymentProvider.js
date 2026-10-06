const gateway=require('../securePayment');
class RazorpayPaymentProvider {
 async createOrder({amountInPaise,currency='INR',receipt}){const order=await gateway.createOrder({amount:amountInPaise/100,currency,receipt});return {orderId:order.id,amount:order.amount,currency:order.currency,keyId:process.env.RAZORPAY_KEY_ID};}
 verifySignature(payload){return gateway.verifySignature(payload);}
}
module.exports={RazorpayPaymentProvider,getPaymentProvider:()=>new RazorpayPaymentProvider()};
