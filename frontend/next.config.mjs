/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  async redirects() {
    return Object.entries({'index':'/','shop':'/shop','product':'/shop','auth':'/account','cart':'/cart','order-success':'/account/orders','body-visualizer':'/visualizer','fit-profile':'/visualizer','onboarding':'/visualizer','customize':'/bespoke','editor':'/bespoke','tryon':'/try-on','dashboard':'/account','concierge':'/bespoke','admin':'/admin','qr':'/'}).map(([from,to])=>({source:'/'+from+'.html',destination:to,permanent:false}));
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_ORIGIN || 'http://localhost:5000'}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
