const {test}=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('crypto');
const gateway=require('../services/securePayment');
const {DevelopmentOtpProvider,SmsGatewayOtpProvider}=require('../services/providers/otpProvider');

test('payment signatures fail closed, including simulated order IDs',()=>{
  const previous=process.env.RAZORPAY_KEY_SECRET;
  delete process.env.RAZORPAY_KEY_SECRET;
  assert.equal(gateway.verifySignature({orderId:'order_sim_1',paymentId:'pay_1',signature:'fake'}),false);
  process.env.RAZORPAY_KEY_SECRET='test-only-secret';
  const signature=crypto.createHmac('sha256','test-only-secret').update('order_1|pay_1').digest('hex');
  assert.equal(gateway.verifySignature({orderId:'order_1',paymentId:'pay_1',signature}),true);
  assert.equal(gateway.verifySignature({orderId:'order_2',paymentId:'pay_1',signature}),false);
  assert.equal(gateway.verifySignature({orderId:'order_1',paymentId:'pay_1',signature:'abc'}),false);
  if(previous===undefined)delete process.env.RAZORPAY_KEY_SECRET;else process.env.RAZORPAY_KEY_SECRET=previous;
});
test('development OTP has no universal code; codes are one-use',async()=>{
  const provider=new DevelopmentOtpProvider();
  assert.equal((await provider.verifyOtp('0000000000','123456')).success,false);
  const result=await provider.sendOtp('0000000000');
  assert.equal((await provider.verifyOtp('0000000000',result.devCode)).success,true);
  assert.equal((await provider.verifyOtp('0000000000',result.devCode)).success,false);
});
test('unimplemented SMS verification cannot authenticate anyone',async()=>{
  await assert.rejects(new SmsGatewayOtpProvider().verifyOtp('0000000000','123456'));
});
