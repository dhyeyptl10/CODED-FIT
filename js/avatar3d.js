/* ===================================================================
   NOVA STREET — AI CLOTHES CHANGER & BODY VISUALIZER STUDIO ENGINE
   Inspired by Vidnoz AI Clothes Changer & BodyVisualizer.ai
   Photorealistic AI Supermodels · Real Human Clothes Changer
   Before/After Visual Comparison · BMI & Anthropometric Body Simulator
   =================================================================== */

const NOVA3D = (function () {
  'use strict';

  /* ── AI Supermodels Catalog (Male & Female) ── */
  const AI_SUPERMODELS = {
    women: [
      {
        id: 'w_default',
        name: 'Elena Vance (Editorial)',
        beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85',
        heightCm: 176,
        weightKg: 58,
        shape: 'hourglass'
      },
      {
        id: 'w_paris',
        name: 'Chloe Laurent (Runway)',
        beforeImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85',
        heightCm: 178,
        weightKg: 55,
        shape: 'rectangle'
      },
      {
        id: 'w_street',
        name: 'Zoe Davis (Streetwear)',
        beforeImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85',
        heightCm: 172,
        weightKg: 60,
        shape: 'athletic'
      },
      {
        id: 'w_curvy',
        name: 'Maya Rao (Curvy Chic)',
        beforeImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=85',
        heightCm: 168,
        weightKg: 68,
        shape: 'pear'
      }
    ],
    men: [
      {
        id: 'm_default',
        name: 'Marcus Sterling (V-Taper)',
        beforeImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85',
        heightCm: 184,
        weightKg: 78,
        shape: 'athletic'
      },
      {
        id: 'm_tokyo',
        name: 'Kenji Takahashi (Minimal)',
        beforeImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85',
        heightCm: 180,
        weightKg: 72,
        shape: 'rectangle'
      },
      {
        id: 'm_denim',
        name: 'Liam Vance (Rugged)',
        beforeImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85',
        heightCm: 186,
        weightKg: 84,
        shape: 'inverted_triangle'
      },
      {
        id: 'm_athletic',
        name: 'Dev Patel (High-Fashion)',
        beforeImg: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85',
        heightCm: 182,
        weightKg: 75,
        shape: 'athletic'
      }
    ]
  };

  /* ── Garment Outfits for Changing ── */
  const GARMENTS_CATALOG = {
    women: [
      { id: 'w_purple_midi', name: 'Purple Tailored Midi Dress', category: 'Dresses', tag: 'HOT', price: 3499, mrp: 4999, fabric: 'TENCEL™ Lyocell Blend', colorHex: '#4C1D95', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85' },
      { id: 'w_strapless', name: 'Strapless Peplum Top', category: 'Tops', tag: 'Party', price: 1899, mrp: 2799, fabric: 'Ahmedabad GOTS Organic Cotton', colorHex: '#141414', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85' },
      { id: 'w_gold_midi', name: 'Gold Silk Fluid Midi', category: 'Dresses', tag: 'Party', price: 4299, mrp: 5999, fabric: 'Pure Organic Italian Linen', colorHex: '#C9A84C', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85' },
      { id: 'w_selvedge_jeans', name: 'Straight-Leg Selvedge Jeans', category: 'Bottoms', tag: 'Daily', price: 2899, mrp: 3999, fabric: 'Japanese Selvedge Denim', colorHex: '#1c2536', img: 'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=900&q=85' },
      { id: 'w_black_dress', name: 'Flowy Black Maxi Gown', category: 'Dresses', tag: 'HOT', price: 3899, mrp: 5499, fabric: 'TENCEL™ Lyocell Blend', colorHex: '#18181B', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85' },
      { id: 'w_tailored_blazer', name: 'Onyx Tailored Blazer & Pants', category: 'Outerwear', tag: 'Bespoke', price: 5499, mrp: 7499, fabric: 'Italian Wool-Cotton Blend', colorHex: '#09090B', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85' },
      { id: 'w_crop_tee', name: 'Aura Fitted Crop Tee', category: 'Tops', tag: 'Daily', price: 1299, mrp: 1999, fabric: '220 GSM GOTS Organic Cotton', colorHex: '#F5F2E7', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85' },
      { id: 'w_linen_pants', name: 'Soleil High-Waist Linen Trousers', category: 'Bottoms', tag: 'Daily', price: 2499, mrp: 3499, fabric: 'Pure Organic Italian Linen', colorHex: '#E8E3DA', img: 'https://images.unsplash.com/photo-1594938298603-b8ff3ddb5777?w=900&q=85' },
      { id: 'w_sage_hoodie', name: 'Cloud French Terry Sage Hoodie', category: 'Tops', tag: 'Daily', price: 3299, mrp: 4699, fabric: '380 GSM Organic French Terry', colorHex: '#4A7C6F', img: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=900&q=85' }
    ],
    men: [
      { id: 'm_oversized_tee', name: 'Aether Oversized Drop-Shoulder Tee', category: 'Tops', tag: 'HOT', price: 1499, mrp: 2499, fabric: '280 GSM Ahmedabad GOTS Cotton', colorHex: '#F5F2E7', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85' },
      { id: 'm_denim_jacket', name: 'Obsidian Boxy Selvedge Jacket', category: 'Outerwear', tag: 'HOT', price: 4299, mrp: 5999, fabric: '14.5oz Japanese Selvedge Denim', colorHex: '#18181B', img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85' },
      { id: 'm_terracotta_hoodie', name: 'Vortex Heavy Fleece Hoodie', category: 'Tops', tag: 'HOT', price: 3499, mrp: 4999, fabric: '450 GSM Heavy French Terry', colorHex: '#EECDAF', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=85' },
      { id: 'm_cargo_pants', name: 'Tactical Cargo Utility Trousers', category: 'Bottoms', tag: 'Daily', price: 2899, mrp: 3999, fabric: '320 GSM Ripstop Cotton Twill', colorHex: '#27272A', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85' },
      { id: 'm_linen_shirt', name: 'Biella Bespoke Linen Shirt', category: 'Tops', tag: 'Bespoke', price: 2799, mrp: 3999, fabric: '210 GSM Biella Italian Linen', colorHex: '#93C5FD', img: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85' },
      { id: 'm_rib_polo', name: 'Cipher Ribbed Knit Polo', category: 'Tops', tag: 'Daily', price: 1899, mrp: 2699, fabric: 'Fine Gauge Ribbed Knit', colorHex: '#1E3A8A', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85' },
      { id: 'm_puffer_jacket', name: 'Apex Matte Puffer Overshirt', category: 'Outerwear', tag: 'Daily', price: 4999, mrp: 6999, fabric: 'Recycled Matte Nylon', colorHex: '#09090B', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85' },
      { id: 'm_sand_chinos', name: 'Monolith Tailored Chinos', category: 'Bottoms', tag: 'Bespoke', price: 2199, mrp: 3299, fabric: 'GOTS Organic Twill', colorHex: '#D4C5B5', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&q=85' }
    ]
  };

  /* ── Current Simulator State ── */
  let currentGender = 'men';            // 'men' | 'women'
  let currentModelIndex = 0;
  let currentGarmentIndex = 0;
  let customUserImage = null;           // User uploaded image URL if any
  let currentColorHex = '#F5F2E7';
  let currentFabricId = 'gots_cotton';
  let splitSliderPos = 50;              // 0 to 100%

  /* ── Body Visualizer Anthropometrics ── */
  const bodyVisualizer = {
    gender: 'men',
    heightCm: 180,
    weightKg: 74,
    bmi: 22.8,
    exerciseHrs: 5,
    chestIn: 40,
    waistIn: 32,
    hipIn: 38,
    bodyShape: 'athletic'
  };

  /* ── CPQ Garment Configuration ── */
  const garmentConfig = {
    fabric: 'gots_cotton',
    collar: 'cutaway',
    cuff: 'single_barrel',
    button: 'mother_pearl',
    monogram: '',
    fit: 'regular',
    size: 'M',
    basePrice: 1999
  };

  /* ── Price Lookups ── */
  const FABRIC_PRICES = { gots_cotton: 0, selvedge_denim: 1200, french_terry: 800, italian_linen: 1500, tencel_blend: 1000, merino_rib: 1800 };
  const COLLAR_PRICES = { cutaway: 0, button_down: 150, mandarin: 200 };
  const CUFF_PRICES = { single_barrel: 0, french_cuff: 350, angled_cuff: 200 };
  const BUTTON_PRICES = { mother_pearl: 400, horn: 300, matte_black: 250 };

  /* ─────────────────────────────────────────────────────────────
     1. INITIALIZATION
  ───────────────────────────────────────────────────────────── */
  function init() {
    setupSplitSlider();
    renderSupermodelTray();
    renderGarmentsGrid();
    calculateBMI();
    updateLiveView();
    updatePriceSummary();

    console.log('✨ [NOVA3D] AI Clothes Changer & Supermodel Studio Online');
  }

  /* ─────────────────────────────────────────────────────────────
     2. BEFORE / AFTER COMPARISON SLIDER SETUP
  ───────────────────────────────────────────────────────────── */
  function setupSplitSlider() {
    const container = document.getElementById('comparison-container');
    const divider = document.getElementById('comparison-divider');
    if (!container || !divider) return;

    let isDragging = false;

    function onMove(e) {
      if (!isDragging) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      setSplitPosition(pos);
    }

    divider.addEventListener('mousedown', () => { isDragging = true; });
    container.addEventListener('mousedown', (e) => { isDragging = true; onMove(e); });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', () => { isDragging = false; });

    divider.addEventListener('touchstart', () => { isDragging = true; });
    container.addEventListener('touchstart', (e) => { isDragging = true; onMove(e); });
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', () => { isDragging = false; });
  }

  function setSplitPosition(pos) {
    splitSliderPos = pos;
    const divider = document.getElementById('comparison-divider');
    const afterWrap = document.getElementById('after-img-wrap');
    if (divider) divider.style.left = pos + '%';
    if (afterWrap) afterWrap.style.clipPath = `polygon(${pos}% 0, 100% 0, 100% 100%, ${pos}% 100%)`;
  }

  /* ─────────────────────────────────────────────────────────────
     3. RENDER SUPERMODELS & GARMENT SELECTION TRAY
  ───────────────────────────────────────────────────────────── */
  function renderSupermodelTray() {
    const tray = document.getElementById('supermodels-tray');
    if (!tray) return;

    const list = AI_SUPERMODELS[currentGender] || [];
    tray.innerHTML = list.map((m, idx) => `
      <div class="model-thumb-card ${idx === currentModelIndex ? 'active' : ''}" onclick="NOVA3D.selectSupermodel(${idx})">
        <img src="${m.beforeImg}" alt="${m.name}">
        <div class="model-thumb-name">${m.name.split(' ')[0]}</div>
      </div>
    `).join('');
  }

  function renderGarmentsGrid(filterCategory = 'All') {
    const grid = document.getElementById('garments-grid');
    if (!grid) return;

    const list = GARMENTS_CATALOG[currentGender] || [];
    const filtered = (filterCategory === 'All') ? list : list.filter(g => g.category === filterCategory || g.tag === filterCategory);

    grid.innerHTML = `
      <!-- Upload Custom Garment Option -->
      <div class="garment-thumb-card upload-card" onclick="document.getElementById('garment-file-input').click()">
        <div style="font-size:24px;margin-bottom:4px;">📤</div>
        <div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;">Upload</div>
        <div style="font-size:9px;color:#8A8580;">Your Clothes</div>
      </div>
    ` + filtered.map((g, idx) => {
      const realIdx = list.findIndex(item => item.id === g.id);
      return `
        <div class="garment-thumb-card ${realIdx === currentGarmentIndex ? 'active' : ''}" onclick="NOVA3D.selectGarment(${realIdx})">
          <img src="${g.img}" alt="${g.name}">
          ${g.tag ? `<span class="garment-tag-badge">${g.tag}</span>` : ''}
          <div class="garment-thumb-info">
            <div class="garment-thumb-name">${g.name}</div>
            <div class="garment-thumb-price">₹${g.price.toLocaleString('en-IN')}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ─────────────────────────────────────────────────────────────
     4. UPDATE LIVE VIEW (BEFORE / AFTER COMPARISON)
  ───────────────────────────────────────────────────────────── */
  function updateLiveView() {
    const model = (AI_SUPERMODELS[currentGender] && AI_SUPERMODELS[currentGender][currentModelIndex]) || AI_SUPERMODELS.women[0];
    const garment = (GARMENTS_CATALOG[currentGender] && GARMENTS_CATALOG[currentGender][currentGarmentIndex]) || GARMENTS_CATALOG.women[0];

    // 1. Before Image (Original Human Model)
    const beforeImg = document.getElementById('before-img');
    if (beforeImg) {
      beforeImg.src = customUserImage || model.beforeImg;
    }

    // 2. After Image (Model in Selected Garment)
    const afterImg = document.getElementById('after-img');
    if (afterImg) {
      afterImg.src = garment.img || model.afterImg;
    }

    // 3. Color Overlay (Tint Fabric)
    const tint = document.getElementById('garment-color-tint');
    if (tint) {
      if (currentColorHex && currentColorHex !== '#F5F2E7') {
        tint.style.background = currentColorHex;
        tint.style.opacity = '0.22';
        tint.style.mixBlendMode = 'multiply';
      } else {
        tint.style.opacity = '0';
      }
    }

    // 4. Update Status Label
    const statusLine = document.getElementById('studio-status-line');
    if (statusLine) {
      statusLine.textContent = `AI Supermodel · ${model.name} · Wearing: ${garment.name}`;
    }

    // 5. Update Base Price for CPQ
    garmentConfig.basePrice = garment.price;
    updatePriceSummary();
  }

  /* ─────────────────────────────────────────────────────────────
     5. SELECTIONS: SUPERMODEL, GARMENT, GENDER, FABRIC, COLOR
  ───────────────────────────────────────────────────────────── */
  function selectSupermodel(idx) {
    currentModelIndex = idx;
    customUserImage = null;
    const model = AI_SUPERMODELS[currentGender][idx];

    // Sync body metrics from model
    if (model) {
      bodyVisualizer.heightCm = model.heightCm;
      bodyVisualizer.weightKg = model.weightKg;
      bodyVisualizer.bodyShape = model.shape;
      calculateBMI();
      syncBodyVisualizerUI();
    }

    renderSupermodelTray();
    updateLiveView();
    if (typeof showToast === 'function') {
      showToast(`👤 Model Switched: ${model.name}`);
    }
  }

  function selectGarment(idx) {
    currentGarmentIndex = idx;
    const garment = GARMENTS_CATALOG[currentGender][idx];

    renderGarmentsGrid();
    updateLiveView();

    if (typeof showToast === 'function') {
      showToast(`👗 Wearing: ${garment.name}`);
    }
  }

  function setGender(gender) {
    currentGender = gender;
    bodyVisualizer.gender = gender;
    currentModelIndex = 0;
    currentGarmentIndex = 0;

    // UI Buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === gender);
    });

    const hourglassPreset = document.getElementById('preset-hourglass');
    if (hourglassPreset) hourglassPreset.style.display = gender === 'women' ? 'inline-flex' : 'none';

    renderSupermodelTray();
    renderGarmentsGrid();
    calculateBMI();
    syncBodyVisualizerUI();
    updateLiveView();
  }

  function setColor(hex, name) {
    currentColorHex = hex;
    const nameEl = document.getElementById('selected-color-name');
    if (nameEl) nameEl.textContent = name || 'Custom';
    updateLiveView();
  }

  function setFabric(fabricId) {
    currentFabricId = fabricId;
    garmentConfig.fabric = fabricId;
    updatePriceSummary();
  }

  /* ─────────────────────────────────────────────────────────────
     6. USER CUSTOM IMAGE / GARMENT UPLOAD
  ───────────────────────────────────────────────────────────── */
  function handleUserPhotoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      customUserImage = e.target.result;
      const beforeImg = document.getElementById('before-img');
      if (beforeImg) beforeImg.src = customUserImage;

      // Animate AI transformation effect
      triggerAITransformEffect();
      if (typeof showToast === 'function') {
        showToast('✨ Your Photo Uploaded! AI Clothes Changer Activated.');
      }
    };
    reader.readAsDataURL(file);
  }

  function handleCustomGarmentUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const customGarmentSrc = e.target.result;
      const afterImg = document.getElementById('after-img');
      if (afterImg) afterImg.src = customGarmentSrc;

      triggerAITransformEffect();
      if (typeof showToast === 'function') {
        showToast('👚 Custom Garment Uploaded & Fitted on Model!');
      }
    };
    reader.readAsDataURL(file);
  }

  function triggerAITransformEffect() {
    const overlay = document.getElementById('ai-transform-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
      }, 1200);
    }
  }

  function randomSupermodel() {
    const list = AI_SUPERMODELS[currentGender] || [];
    const rnd = Math.floor(Math.random() * list.length);
    selectSupermodel(rnd);
  }

  /* ─────────────────────────────────────────────────────────────
     7. BODY VISUALIZER & BMI ENGINE
  ───────────────────────────────────────────────────────────── */
  function calculateBMI() {
    const heightM = bodyVisualizer.heightCm / 100;
    bodyVisualizer.bmi = parseFloat((bodyVisualizer.weightKg / (heightM * heightM)).toFixed(1));
    return bodyVisualizer.bmi;
  }

  function setBodyParam(param, val) {
    bodyVisualizer[param] = parseFloat(val);
    calculateBMI();
    syncBodyVisualizerUI();
  }

  function setBodyShapePreset(preset) {
    bodyVisualizer.bodyShape = preset;

    if (preset === 'athletic') {
      bodyVisualizer.exerciseHrs = 8;
      bodyVisualizer.chestIn = currentGender === 'women' ? 36 : 42;
      bodyVisualizer.waistIn = 29;
      bodyVisualizer.hipIn = 37;
    } else if (preset === 'hourglass') {
      bodyVisualizer.chestIn = 38;
      bodyVisualizer.waistIn = 25;
      bodyVisualizer.hipIn = 40;
    } else if (preset === 'pear') {
      bodyVisualizer.chestIn = 34;
      bodyVisualizer.waistIn = 28;
      bodyVisualizer.hipIn = 42;
    } else if (preset === 'inverted_triangle') {
      bodyVisualizer.chestIn = 44;
      bodyVisualizer.waistIn = 32;
      bodyVisualizer.hipIn = 36;
    } else if (preset === 'plus') {
      bodyVisualizer.weightKg = 88;
      bodyVisualizer.chestIn = 46;
      bodyVisualizer.waistIn = 40;
      bodyVisualizer.hipIn = 46;
    } else {
      bodyVisualizer.chestIn = 38;
      bodyVisualizer.waistIn = 32;
      bodyVisualizer.hipIn = 38;
    }

    calculateBMI();
    syncBodyVisualizerUI();
  }

  function syncBodyVisualizerUI() {
    const setT = (id, str) => { const el = document.getElementById(id); if (el) el.textContent = str; };
    const setV = (id, str) => { const el = document.getElementById(id); if (el) el.value = str; };

    const bmiVal = calculateBMI();

    setT('bv-bmi-value', bmiVal);
    setT('bv-gauge-bmi', bmiVal);
    setT('stat-chest', bodyVisualizer.chestIn + '"');
    setT('stat-waist', bodyVisualizer.waistIn + '"');
    setT('stat-height', (bodyVisualizer.heightCm / 30.48).toFixed(1) + "' (" + bodyVisualizer.heightCm + "cm)");

    setV('slider-height', bodyVisualizer.heightCm);
    setT('val-height', bodyVisualizer.heightCm + ' cm (' + (bodyVisualizer.heightCm / 30.48).toFixed(1) + "')");

    setV('slider-weight', bodyVisualizer.weightKg);
    setT('val-weight', bodyVisualizer.weightKg + ' kg (' + Math.round(bodyVisualizer.weightKg * 2.204) + ' lbs)');

    setV('slider-chest', bodyVisualizer.chestIn);
    setT('val-chest', bodyVisualizer.chestIn + '"');

    setV('slider-waist', bodyVisualizer.waistIn);
    setT('val-waist', bodyVisualizer.waistIn + '"');

    setV('slider-hip', bodyVisualizer.hipIn);
    setT('val-hip', bodyVisualizer.hipIn + '"');

    setV('slider-exercise', bodyVisualizer.exerciseHrs);
    setT('val-exercise', bodyVisualizer.exerciseHrs + ' hrs/wk');

    // Category Label
    const catEl = document.getElementById('bv-bmi-category');
    if (catEl) {
      if (bmiVal < 18.5) { catEl.textContent = 'Underweight'; catEl.style.color = '#3B82F6'; }
      else if (bmiVal < 25) { catEl.textContent = 'Optimal Healthy Weight'; catEl.style.color = '#10B981'; }
      else if (bmiVal < 30) { catEl.textContent = 'Athletic / Strong'; catEl.style.color = '#F59E0B'; }
      else { catEl.textContent = 'Plus Size / Full Body'; catEl.style.color = '#EF4444'; }
    }

    // Recommended Size
    const recSizeEl = document.getElementById('bv-rec-size');
    if (recSizeEl) {
      let s = 'M';
      if (bodyVisualizer.chestIn < 36) s = 'XS';
      else if (bodyVisualizer.chestIn < 39) s = 'S';
      else if (bodyVisualizer.chestIn < 42) s = 'M';
      else if (bodyVisualizer.chestIn < 45) s = 'L';
      else if (bodyVisualizer.chestIn < 48) s = 'XL';
      else s = 'XXL';
      recSizeEl.textContent = s;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. CPQ LIVE PRICING
  ───────────────────────────────────────────────────────────── */
  function updateConfig(key, value) {
    garmentConfig[key] = value;
    if (key === 'fabric') setFabric(value);
    updatePriceSummary();
  }

  function updatePriceSummary() {
    const base = garmentConfig.basePrice || 1999;
    const fabricAdd = FABRIC_PRICES[garmentConfig.fabric] || 0;
    const collarAdd = COLLAR_PRICES[garmentConfig.collar] || 0;
    const cuffAdd = CUFF_PRICES[garmentConfig.cuff] || 0;
    const btnAdd = BUTTON_PRICES[garmentConfig.button] || 0;
    const monoAdd = (garmentConfig.monogram && garmentConfig.monogram.length > 0) ? 299 : 0;
    const optionsAdd = collarAdd + cuffAdd + btnAdd;
    const total = base + fabricAdd + optionsAdd + monoAdd;

    const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setT('cpq-base-price', '₹' + base.toLocaleString('en-IN'));
    setT('cpq-fabric-add', fabricAdd === 0 ? '₹0' : '₹' + fabricAdd.toLocaleString('en-IN'));
    setT('cpq-options-add', optionsAdd === 0 ? '₹0' : '₹' + optionsAdd.toLocaleString('en-IN'));
    setT('cpq-total-price', '₹' + total.toLocaleString('en-IN'));

    return total;
  }

  function takeSnapshot() {
    const afterImg = document.getElementById('after-img');
    if (!afterImg) return;
    const a = document.createElement('a');
    a.href = afterImg.src;
    a.download = `nova-street-ai-clothes-look.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (typeof showToast === 'function') {
      showToast('📥 Supermodel Lookbook Image Saved in HD!');
    }
  }

  /* ─────────────────────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────────────────────── */
  return {
    init,
    setGender,
    selectSupermodel,
    selectGarment,
    setColor,
    setFabric,
    setBodyParam,
    setBodyShapePreset,
    handleUserPhotoUpload,
    handleCustomGarmentUpload,
    randomSupermodel,
    updateConfig,
    updatePriceSummary,
    takeSnapshot,
    renderGarmentsGrid,
    getBodyVisualizer: () => bodyVisualizer,
    getConfig: () => garmentConfig,
    get currentGender() { return currentGender; }
  };

})();

/* ─────────────────────────────────────────────────────────────
   GLOBAL HELPERS
───────────────────────────────────────────────────────────── */
function openAIScannerModal() {
  const modal = document.getElementById('ai-scanner-modal');
  if (modal) modal.classList.add('open');
}

function closeAIScannerModal() {
  const modal = document.getElementById('ai-scanner-modal');
  if (modal) modal.classList.remove('open');
}

function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 450);
  }, 3500);
}
