/**
 * CODED FIT — Environment & API key validator.
 * Run: npm run check-env  (from server/)
 * Fails loudly with exact fix instructions instead of silent runtime faults.
 * Never print secret values — only which keys are missing/invalid.
 */
const REQUIRED = [
  { key: 'MONGODB_URI', how: 'Local: mongodb://127.0.0.1:27017/coded_fit | Atlas: connection string from cloud.mongodb.com' },
  { key: 'JWT_SECRET', how: 'Generate: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))" (min 32 chars, never commit)' },
];

const OPTIONAL = [
  { key: 'RAZORPAY_KEY_ID', how: 'Get LIVE/TEST key at dashboard.razorpay.com → Settings → API Keys. Never use test keys in production.' },
  { key: 'RAZORPAY_KEY_SECRET', how: 'Same Razorpay API Keys page. Server-side only, never in frontend/APK.' },
  { key: 'YOUCAM_API_KEY', how: 'Apply at developer.perfectcorp.com → YouCam AI Virtual Try-On. Photo try-on stays server-side via /api/try-on.' },
  { key: 'YOUCAM_SECRET_KEY', how: 'Same Perfect Corp portal. Rotate immediately if ever pasted into frontend, mobile code, or git.' },
];

function check() {
  require('dotenv').config();
  let fatal = 0;
  console.log('— CODED FIT env check —');
  for (const r of REQUIRED) {
    const v = process.env[r.key];
    if (!v || v.length < 8 || /change_in_production|dummy/i.test(v)) {
      fatal++;
      console.error(`[MISSING] ${r.key} — ${r.how}`);
    } else {
      console.log(`[OK] ${r.key} set (${v.length} chars, value hidden)`);
    }
  }
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    fatal++;
    console.error('[WEAK] JWT_SECRET must be 32+ chars. Regenerate with crypto.randomBytes.');
  }
  for (const o of OPTIONAL) {
    const v = process.env[o.key];
    if (!v) console.warn(`[WARN] ${o.key} not set — ${o.how}`);
    else console.log(`[OK] ${o.key} set (value hidden)`);
  }
  if (!process.env.MONGODB_URI) console.warn('[WARN] No MONGODB_URI — server will fail to connect. Start local mongod or set Atlas URI.');
  if (fatal > 0) {
    console.error(`\nENV CHECK FAILED (${fatal}). Copy server/.env.example → server/.env and fill real keys.`);
    process.exit(1);
  }
  console.log('\nENV CHECK PASSED. No secrets printed, none belong in git.');
}

if (require.main === module) check();
module.exports = { check };
