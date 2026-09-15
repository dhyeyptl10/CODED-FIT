/* ===== NOVA STREET - UR PICKS & LIMITED DEALS STUDIO ENGINE ===== */

// Sound FX Synthesizer (Web Audio API)
class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.audioCtx = new AudioContext();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch(e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch(e) {}
  }
}

const SFX = new SoundEngine();

// Interactive Outfit Builder State
const outfitState = {
  top: null,
  bottom: null,
  jacket: null
};

function initOutfitState() {
  if (typeof PRODUCTS !== 'undefined' && PRODUCTS.length) {
    if (!outfitState.top) outfitState.top = PRODUCTS.find(p => p.type === 'top') || PRODUCTS[0];
    if (!outfitState.bottom) outfitState.bottom = PRODUCTS.find(p => p.type === 'bottom') || PRODUCTS[1];
    if (!outfitState.jacket) outfitState.jacket = PRODUCTS.find(p => p.type === 'jacket') || PRODUCTS[2];
  }
}

function renderOutfitStudio() {
  initOutfitState();
  if (!outfitState.top || !outfitState.bottom) return;

  const previewTop = document.getElementById("outfit-img-top");
  const previewBottom = document.getElementById("outfit-img-bottom");
  const previewJacket = document.getElementById("outfit-img-jacket");

  if (previewTop) previewTop.src = outfitState.top.images[0];
  if (previewBottom) previewBottom.src = outfitState.bottom.images[0];
  if (previewJacket) previewJacket.src = outfitState.jacket.images[0];

  // Update total calculation
  const totalOriginal = outfitState.top.mrp + outfitState.bottom.mrp + (outfitState.jacket ? outfitState.jacket.mrp : 0);
  const totalOutfitPrice = outfitState.top.price + outfitState.bottom.price + (outfitState.jacket ? outfitState.jacket.price : 0);
  const bundleDiscounted = Math.round(totalOutfitPrice * 0.85); // Extra 15% off UR PICKS bundle discount!
  const savings = totalOriginal - bundleDiscounted;

  const priceEl = document.getElementById("outfit-price-total");
  const origEl = document.getElementById("outfit-price-orig");
  const saveEl = document.getElementById("outfit-savings");

  if (priceEl) priceEl.textContent = `₹${bundleDiscounted.toLocaleString('en-IN')}`;
  if (origEl) origEl.textContent = `₹${totalOriginal.toLocaleString('en-IN')}`;
  if (saveEl) saveEl.textContent = `SAVE ₹${savings.toLocaleString('en-IN')} (15% UR PICKS BUNDLE OFF)`;
}

function selectOutfitItem(type, productId) {
  SFX.playClick();
  const item = getProductById(productId);
  if (!item) return;

  outfitState[type] = item;
  renderOutfitStudio();

  // Highlight selected UI pill
  document.querySelectorAll(`.outfit-picker[data-type="${type}"] .outfit-pill`).forEach(pill => {
    pill.classList.toggle("active", Number(pill.dataset.id) === Number(productId));
  });
}

function addOutfitBundleToCart() {
  SFX.playSuccess();
  const sizeTop = outfitState.top.sizes[0] || 'M';
  const sizeBottom = outfitState.bottom.sizes[0] || '32';
  const sizeJacket = outfitState.jacket ? (outfitState.jacket.sizes[0] || 'M') : null;

  addToCart(outfitState.top.id, sizeTop, 1);
  addToCart(outfitState.bottom.id, sizeBottom, 1);
  if (outfitState.jacket) {
    addToCart(outfitState.jacket.id, sizeJacket, 1);
  }

  showToast(" UR PICKS OUTFIT BUNDLE ADDED TO BAG WITH 15% EXTRA OFF!");
}

// Drop Countdown Radar
function startDropTimer() {
  const targetDate = new Date().getTime() + (3 * 3600 * 1000 + 42 * 60 * 1000 + 15 * 1000);

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) return;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const hEl = document.getElementById("drop-h");
    const mEl = document.getElementById("drop-m");
    const sEl = document.getElementById("drop-s");

    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// Live Sales Ticker Feed
const LOCATIONS = ["Mumbai", "Tokyo", "London", "New York", "Berlin", "Paris", "Seoul", "Dubai", "Delhi", "Sydney"];
const NAMES = ["Aarav S.", "Elena R.", "Kenji M.", "Liam K.", "Chloe B.", "Dev P.", "Zoe W.", "Carlos M."];

function startLiveTicker() {
  const tickerEl = document.getElementById("live-ticker-feed");
  if (!tickerEl) return;

  function pushOrder() {
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];

    const itemHtml = `<div class="ticker-item"><span class="ticker-dot"></span> <strong>${name}</strong> from <em>${loc}</em> copped UR PICK <span class="ticker-highlight">${prod.name}</span> (₹${prod.price})</div>`;

    tickerEl.insertAdjacentHTML("afterbegin", itemHtml);
    if (tickerEl.children.length > 6) {
      tickerEl.removeChild(tickerEl.lastElementChild);
    }
  }

  pushOrder();
  setInterval(pushOrder, 4500);
}

// Theme & Customizer Controller
function toggleThemeMode(mode) {
  SFX.playClick();
  document.body.classList.remove("theme-cream", "theme-dark", "theme-cyber");
  document.body.classList.add(`theme-${mode}`);

  document.querySelectorAll(".theme-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.mode === mode);
  });
}

function toggleGrain(btn) {
  SFX.playClick();
  document.body.classList.toggle("no-grain");
  btn.classList.toggle("active");
  btn.textContent = document.body.classList.contains("no-grain") ? "GRAIN: OFF" : "GRAIN: ON";
}

if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    renderOutfitStudio();
    startDropTimer();
    startLiveTicker();
  });
}
