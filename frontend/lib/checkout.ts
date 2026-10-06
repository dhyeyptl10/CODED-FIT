export async function openCheckout(intent: {keyId:string;orderId:string;amount:number;currency:string}, prefill: {name:string;contact:string}): Promise<{razorpay_payment_id:string;razorpay_order_id:string;razorpay_signature:string}> {
  if (!(window as any).Razorpay) await new Promise<void>((resolve,reject) => {
    const script=document.createElement('script');script.src='https://checkout.razorpay.com/v1/checkout.js';
    script.onload=()=>resolve();script.onerror=()=>reject(new Error('Could not load payment gateway. Please retry.'));document.head.appendChild(script);
  });
  return new Promise((resolve,reject)=>{
    const checkout=new (window as any).Razorpay({key:intent.keyId,order_id:intent.orderId,amount:intent.amount,currency:intent.currency,name:'CODED FIT',prefill,handler:resolve,modal:{ondismiss:()=>reject(new Error('Payment cancelled. Your bag is saved.'))}});
    checkout.on('payment.failed',()=>reject(new Error('Payment failed. Your order remains unpaid.')));checkout.open();
  });
}
