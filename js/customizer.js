// Bespoke Customizer State
const bespokeState = {
  basePrice: 2499,
  fabric: null,
  collar: null,
  cuff: null,
  button: null,
  monogramText: "",
  monogramThread: "Gold Thread",
  fitProfile: "Custom AI Fit Profile",
  customMeasurements: null
};

function initBespokeState() {
  if (typeof BESPOKE_CONFIG !== 'undefined') {
    if (!bespokeState.fabric) bespokeState.fabric = BESPOKE_CONFIG.fabrics[0];
    if (!bespokeState.collar) bespokeState.collar = BESPOKE_CONFIG.collars[0];
    if (!bespokeState.cuff) bespokeState.cuff = BESPOKE_CONFIG.cuffs[0];
    if (!bespokeState.button) bespokeState.button = BESPOKE_CONFIG.buttons[0];
  }
}

function calculateBespokeTotal() {
  initBespokeState();
  if (!bespokeState.fabric) return bespokeState.basePrice;

  const total = bespokeState.basePrice 
    + bespokeState.fabric.priceAdd 
    + bespokeState.collar.priceAdd 
    + bespokeState.cuff.priceAdd 
    + bespokeState.button.priceAdd;
  return total;
}

function updateVisualCanvas() {
  initBespokeState();
  if (!bespokeState.fabric) return;
  const canvasImg = document.getElementById("bespoke-render-img");
  const fabricTag = document.getElementById("render-fabric-tag");
  const collarTag = document.getElementById("render-collar-tag");
  const cuffTag = document.getElementById("render-cuff-tag");
  const priceTag = document.getElementById("bespoke-cpq-price");
  const origPriceTag = document.getElementById("bespoke-cpq-orig");

  if (canvasImg) canvasImg.src = bespokeState.fabric.img;
  if (fabricTag) fabricTag.textContent = `${bespokeState.fabric.name} (${bespokeState.fabric.origin})`;
  if (collarTag) collarTag.textContent = bespokeState.collar.name;
  if (cuffTag) cuffTag.textContent = bespokeState.cuff.name;

  const total = calculateBespokeTotal();
  if (priceTag) priceTag.textContent = `₹${total.toLocaleString('en-IN')}`;
  if (origPriceTag) origPriceTag.textContent = `₹${(total + 1500).toLocaleString('en-IN')}`;

  // Update summary breakdown
  const summaryEl = document.getElementById("cpq-breakdown-list");
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="cpq-item"><span>Base Custom Silhouette</span><span>₹${bespokeState.basePrice.toLocaleString('en-IN')}</span></div>
      <div class="cpq-item"><span>${bespokeState.fabric.name}</span><span>${bespokeState.fabric.priceAdd > 0 ? '+₹' + bespokeState.fabric.priceAdd : 'INCLUDED'}</span></div>
      <div class="cpq-item"><span>${bespokeState.collar.name}</span><span>${bespokeState.collar.priceAdd > 0 ? '+₹' + bespokeState.collar.priceAdd : 'INCLUDED'}</span></div>
      <div class="cpq-item"><span>${bespokeState.cuff.name}</span><span>${bespokeState.cuff.priceAdd > 0 ? '+₹' + bespokeState.cuff.priceAdd : 'INCLUDED'}</span></div>
      <div class="cpq-item"><span>${bespokeState.button.name}</span><span>${bespokeState.button.priceAdd > 0 ? '+₹' + bespokeState.button.priceAdd : 'INCLUDED'}</span></div>
      ${bespokeState.monogramText ? `<div class="cpq-item" style="color: var(--rust);"><span>Monogram ("${bespokeState.monogramText}")</span><span>FREE</span></div>` : ''}
      ${bespokeState.customMeasurements ? `<div class="cpq-item" style="color: #10B981;"><span>AI 80-Point Fit Twin</span><span>VERIFIED</span></div>` : ''}
    `;
  }
}

function selectFabricOption(fabricId) {
  if (typeof SFX !== 'undefined') SFX.playClick();
  const fab = BESPOKE_CONFIG.fabrics.find(f => f.id === fabricId);
  if (!fab) return;
  bespokeState.fabric = fab;
  
  document.querySelectorAll(".fabric-swatch-card").forEach(c => {
    c.classList.toggle("active", c.dataset.id === fabricId);
  });
  updateVisualCanvas();
}

function selectCollarOption(collarId) {
  if (typeof SFX !== 'undefined') SFX.playClick();
  const col = BESPOKE_CONFIG.collars.find(c => c.id === collarId);
  if (!col) return;
  bespokeState.collar = col;
  
  document.querySelectorAll(".collar-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.id === collarId);
  });
  updateVisualCanvas();
}

function selectCuffOption(cuffId) {
  if (typeof SFX !== 'undefined') SFX.playClick();
  const cuff = BESPOKE_CONFIG.cuffs.find(c => c.id === cuffId);
  if (!cuff) return;
  bespokeState.cuff = cuff;
  
  document.querySelectorAll(".cuff-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.id === cuffId);
  });
  updateVisualCanvas();
}

function selectButtonOption(buttonId) {
  if (typeof SFX !== 'undefined') SFX.playClick();
  const btn = BESPOKE_CONFIG.buttons.find(b => b.id === buttonId);
  if (!btn) return;
  bespokeState.button = btn;
  
  document.querySelectorAll(".button-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.id === buttonId);
  });
  updateVisualCanvas();
}

function updateMonogram() {
  const textInput = document.getElementById("monogram-input");
  if (textInput) bespokeState.monogramText = textInput.value.toUpperCase().slice(0, 4);
  updateVisualCanvas();
}

// AI Anthropometric Body Measurement Scanner Simulation
function openAIScannerModal() {
  const modal = document.getElementById("ai-scanner-modal");
  if (modal) modal.classList.add("active");
}

function closeAIScannerModal() {
  const modal = document.getElementById("ai-scanner-modal");
  if (modal) modal.classList.remove("active");
}

function runAIScanSimulation() {
  const statusEl = document.getElementById("ai-scan-status");
  const progressFill = document.getElementById("ai-scan-progress");
  const resultsBox = document.getElementById("ai-scan-results");

  if (!statusEl || !progressFill || !resultsBox) return;

  statusEl.textContent = "Scanning Frontal Silhouette & Facial Landmarks...";
  progressFill.style.width = "35%";

  setTimeout(() => {
    statusEl.textContent = "Analyzing 80+ Anthropometric Biometric Points...";
    progressFill.style.width = "75%";
  }, 1200);

  setTimeout(() => {
    statusEl.textContent = "Generating 3D Digital Twin Fit Profile...";
    progressFill.style.width = "100%";

    bespokeState.customMeasurements = {
      chest: "41.2 in",
      shoulder: "18.4 in",
      sleeve: "25.6 in",
      waist: "33.1 in",
      neck: "15.8 in",
      torso: "29.2 in"
    };

    resultsBox.innerHTML = `
      <div class="ai-fit-card">
        <div style="font-size: 11px; font-weight: 800; color: #10B981; margin-bottom: 6px;">
          ✓ DIGITAL TWIN CREATED (99.4% PRECISION MATCH)
        </div>
        <div class="ai-points-grid">
          <div><span>CHEST:</span> <strong>41.2"</strong></div>
          <div><span>SHOULDER:</span> <strong>18.4"</strong></div>
          <div><span>SLEEVE:</span> <strong>25.6"</strong></div>
          <div><span>WAIST:</span> <strong>33.1"</strong></div>
          <div><span>NECK:</span> <strong>15.8"</strong></div>
          <div><span>TORSO:</span> <strong>29.2"</strong></div>
        </div>
        <button class="c-btn filled-black block-btn" style="margin-top: 14px; font-size: 11px;" onclick="applyAIScanToOrder()">
          APPLY DIGITAL TWIN FIT TO ORDER ⚡
        </button>
      </div>`;
    
    if (typeof SFX !== 'undefined') SFX.playSuccess();
  }, 2400);
}

function applyAIScanToOrder() {
  closeAIScannerModal();
  const fitTag = document.getElementById("fit-profile-status");
  if (fitTag) fitTag.textContent = "VERIFIED AI 3D DIGITAL TWIN (80-POINT PATTERN)";
  updateVisualCanvas();
  showToast("✓ AI DIGITAL TWIN FIT APPLIED TO BESPOKE PATTERN!");
}

function addBespokeToCart() {
  if (typeof SFX !== 'undefined') SFX.playSuccess();

  const total = calculateBespokeTotal();
  const customItem = {
    id: 999, // Custom Item Identifier
    name: `Bespoke Garment (${bespokeState.fabric.name})`,
    price: total,
    mrp: total + 1500,
    size: bespokeState.customMeasurements ? "AI Digital Twin" : "Custom Tailored",
    funnel: "custom-made",
    badge: "MADE TO MEASURE",
    images: [bespokeState.fabric.img],
    customDetails: {
      fabric: bespokeState.fabric.name,
      collar: bespokeState.collar.name,
      cuff: bespokeState.cuff.name,
      button: bespokeState.button.name,
      monogram: bespokeState.monogramText || "None"
    }
  };

  // Push to local cart
  const cart = getCart();
  cart.push({ id: customItem.id, size: customItem.size, qty: 1, customData: customItem });
  saveCart(cart);

  showToast("⚡ BESPOKE CUSTOM PIECE ADDED TO BAG! (SHIPS IN 7-14 DAYS)");
  openCartDrawer();
}

if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    updateVisualCanvas();
  });
}
