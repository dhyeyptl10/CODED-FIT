const fs=require('fs');const edit=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));
fs.writeFileSync('backend/controllers/paymentController.js',"module.exports = require('./secureCheckoutController');\n");
fs.writeFileSync('backend/services/razorpayService.js',"module.exports = require('./securePayment');\n");
edit('frontend/services/api.ts',s=>s.replace("createPaymentIntent: (amount: number, receipt?: string)","createPaymentIntent: (orderId: string)").replace('keyId: string; isDevMock?: boolean','keyId: string; currency: string').replace('JSON.stringify({ amount, receipt })','JSON.stringify({ orderId })').replace('orderId: string; paymentId: string; signature: string','orderId: string; razorpayPaymentId: string; razorpayOrderId:string; razorpaySignature: string').replace('/trial-feedback','/fit-feedback'));
edit('frontend/app/checkout/page.tsx',s=>s.replace("import React, { useState }", "import React, { useState, useRef }").replace("import { api }", "import { openCheckout } from '@/lib/checkout';\nimport { api }").replace('const { user } = useAuthStore();','const { user, isAuthenticated, openLoginModal } = useAuthStore();\n  const pending = useRef<{key:string;order:any} | null>(null);\n  const [error, setError] = useState(\'\');').replace('    e.preventDefault();','    e.preventDefault();\n    if (!isAuthenticated) {openLoginModal(\'email\');return;}\n    if (!items.length || processing) return;\n    setError(\'\');').replace(/      \/\/ 1. Create payment intent[\s\S]*?      setOrderComplete\(created.order[^\n]*;/,`      const payload = {items, shippingAddress:shipping, discountCode:totals.appliedCoupon?.code};
      const key = JSON.stringify(payload);
      if (pending.current?.key !== key) {
        const created = await api.createOrder(payload);
        pending.current = {key,order:created.order};
      }
      const order = pending.current!.order;
      const intent = await api.createPaymentIntent(order._id);
      const result = await openCheckout(intent,{name:shipping.fullName,contact:shipping.phone});
      await api.verifyPayment({orderId:order._id,razorpayPaymentId:result.razorpay_payment_id,razorpayOrderId:result.razorpay_order_id,razorpaySignature:result.razorpay_signature});
      clearCart();
      setOrderComplete(order);`).replace("alert(e.message || 'Payment or order placement failed.');", "setError(e.message || 'Payment or order placement failed.');").replace('<form onSubmit={handlePayAndPlaceOrder}',"{error && <p role=\"alert\" className=\"p-4 bg-red-50 text-red-700 rounded-xl\">{error}</p>}\n      <form onSubmit={handlePayAndPlaceOrder}").replace('disabled={processing}','disabled={processing || !items.length}').replace('GST (12% Included)','Additional tax').replace('BlueDart Express Air','Assigned after fulfilment').replace('3–4 Business Days','Confirmed after dispatch').replace('Doorstep Trial Included','Standard delivery'));
edit('frontend/next.config.mjs',s=>s.replace("'http://localhost:5000/api/:path*'","`${process.env.API_ORIGIN || 'http://localhost:5000'}/api/:path*`").replace('  async rewrites()',`  async redirects() {
    return Object.entries({'index':'/','shop':'/shop','product':'/shop','auth':'/account','cart':'/cart','order-success':'/account/orders','body-visualizer':'/visualizer','fit-profile':'/visualizer','onboarding':'/visualizer','customize':'/bespoke','editor':'/bespoke','tryon':'/try-on','dashboard':'/account','concierge':'/bespoke','admin':'/admin','qr':'/'}).map(([from,to])=>({source:'/'+from+'.html',destination:to,permanent:false}));
  },
  async rewrites()`));
