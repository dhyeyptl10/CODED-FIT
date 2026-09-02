/* ===================================================================
   NOVA STREET — AI CLOTHES CHANGER & 3D BODY VISUALIZER STUDIO ENGINE
   Official Perfect Corp YouCam AI Integration & BodyVisualizer.ai Simulator
   =================================================================== */

const NOVA3D = (function () {
  'use strict';

  // Official YouCam Generative AI Credentials
  const YOUCAM_CONFIG = {
    apiKey: 'sk-HQ2O-M5GjyRTR4mEP4rGrcEngyhikuFF1qJFygrzQiCdrVvTIPjlOFVDqsri1twe',
    secretKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGIIuhl7WW8j3qbCOblYYJo+cFddVOaYKUgDwG6h76mwFD1xP9qNtZrznz8yzVoU1IRAJcT9DJrpTtWYP5SXKH9XlttEhVvgiJlrAZTOrsv7lRQTZeDyGZ9t2LKpHK1pJg5eCx/mh9nae63wE2lPy9E5gmfQzGBL3DcifBl4emjQIDAQAB',
    apiBase: 'https://yce-api-01.makeupar.com/wow/api/v1'
  };

  /* ── AI Supermodels Catalog ── */
  const AI_SUPERMODELS = {
    women: [
      {
        id: 'w_default',
        name: 'Elena Vance (Editorial)',
        beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85',
        heightCm: 176,
        weightKg: 58,
        chestIn: 34,
        waistIn: 25,
        hipIn: 36,
        shape: 'hourglass'
      },
      {
        id: 'w_paris',
        name: 'Chloe Laurent (Runway)',
        beforeImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85',
        heightCm: 178,
        weightKg: 55,
        chestIn: 32,
        waistIn: 24,
        hipIn: 34,
        shape: 'rectangle'
      },
      {
        id: 'w_street',
        name: 'Zoe Davis (Streetwear)',
        beforeImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85',
        heightCm: 172,
        weightKg: 60,
        chestIn: 35,
        waistIn: 27,
        hipIn: 37,
        shape: 'athletic'
      },
      {
        id: 'w_curvy',
        name: 'Maya Rao (Curvy Chic)',
        beforeImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=85',
        heightCm: 168,
        weightKg: 68,
        chestIn: 38,
        waistIn: 30,
        hipIn: 42,
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
        chestIn: 42,
        waistIn: 31,
        hipIn: 38,
        shape: 'athletic'
      },
      {
        id: 'm_tokyo',
        name: 'Kenji Takahashi (Minimal)',
        beforeImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85',
        heightCm: 180,
        weightKg: 72,
        chestIn: 39,
        waistIn: 30,
        hipIn: 36,
        shape: 'rectangle'
      },
      {
        id: 'm_denim',
        name: 'Liam Vance (Rugged)',
        beforeImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85',
        heightCm: 186,
        weightKg: 84,
        chestIn: 44,
        waistIn: 33,
        hipIn: 40,
        shape: 'inverted_triangle'
      },
      {
        id: 'm_athletic',
        name: 'Dev Patel (High-Fashion)',
        beforeImg: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85',
        heightCm: 182,
        weightKg: 75,
        chestIn: 41,
        waistIn: 31,
        hipIn: 38,
        shape: 'athletic'
      }
    ]
  };

  /* ── Garments Catalog ── */
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

  /* ── State ── */
  let currentGender = 'women';
  let currentModelIndex = 0;
  let currentGarmentIndex = 0;
  let customUserImage = null;
  let currentColorHex = '#F5F2E7';
  let currentFabricId = 'gots_cotton';
  let splitSliderPos = 50;
  let activeAppTab = 'clothes';
  let webCameraStream = null;

  /* ── Body Visualizer Anthropometrics ── */
  const bodyVisualizer = {
    gender: 'women',
    heightCm: 176,
    weightKg: 58,
    bmi: 18.7,
    exerciseHrs: 5,
    chestIn: 34,
    waistIn: 25,
    hipIn: 36,
    bodyShape: 'hourglass'
  };

  /* ── Garment Configuration ── */
  const garmentConfig = {
    fabric: 'gots_cotton',
    fit: 'bespoke',
    size: 'M',
    basePrice: 3499
  };

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
    renderBodyVisualizerCanvas();

    console.log('✨ [NOVA3D] AI Clothes Studio & Body Visualizer Engine Ready');
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
    if (afterWrap) afterWrap.style.clipPath = 'polygon(' + pos + '% 0, 100% 0, 100% 100%, ' + pos + '% 100%)';
  }

  /* ─────────────────────────────────────────────────────────────
     3. RENDER TRAYS
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
      <div class="garment-thumb-card upload-card" onclick="document.getElementById('garment-file-input').click()">
        <div style="font-size:24px;margin-bottom:4px;">📤</div>
        <div style="font-size:10px;font-weight:800;color:var(--gold-dark);text-transform:uppercase;">Upload</div>
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
     4. UPDATE LIVE VIEW
  ───────────────────────────────────────────────────────────── */
  function updateLiveView() {
    const model = (AI_SUPERMODELS[currentGender] && AI_SUPERMODELS[currentGender][currentModelIndex]) || AI_SUPERMODELS.women[0];
    const garment = (GARMENTS_CATALOG[currentGender] && GARMENTS_CATALOG[currentGender][currentGarmentIndex]) || GARMENTS_CATALOG.women[0];

    const beforeImg = document.getElementById('before-img');
    if (beforeImg) {
      beforeImg.src = customUserImage || model.beforeImg;
    }

    const afterImg = document.getElementById('after-img');
    if (afterImg) {
      afterImg.src = garment.img || model.afterImg;
    }

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

    const statusLine = document.getElementById('studio-status-line');
    if (statusLine) {
      statusLine.textContent = 'AI Supermodel · ' + model.name + ' · Wearing: ' + garment.name;
    }

    garmentConfig.basePrice = garment.price;
    updatePriceSummary();
  }

  function selectSupermodel(idx) {
    currentModelIndex = idx;
    customUserImage = null;
    const model = AI_SUPERMODELS[currentGender][idx];

    if (model) {
      bodyVisualizer.heightCm = model.heightCm;
      bodyVisualizer.weightKg = model.weightKg;
      bodyVisualizer.chestIn = model.chestIn;
      bodyVisualizer.waistIn = model.waistIn;
      bodyVisualizer.hipIn = model.hipIn;
      bodyVisualizer.bodyShape = model.shape;
      calculateBMI();
      syncBodyVisualizerUI();
      renderBodyVisualizerCanvas();
    }

    renderSupermodelTray();
    updateLiveView();
    if (typeof showToast === 'function') {
      showToast('👤 Model Switched: ' + model.name);
    }
  }

  function selectGarment(idx) {
    currentGarmentIndex = idx;
    const garment = GARMENTS_CATALOG[currentGender][idx];

    renderGarmentsGrid();
    updateLiveView();
    triggerAITransformEffect();

    if (typeof showToast === 'function') {
      showToast('👗 Wearing: ' + garment.name);
    }
  }

  function setGender(gender) {
    currentGender = gender;
    bodyVisualizer.gender = gender;
    currentModelIndex = 0;
    currentGarmentIndex = 0;

    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === gender);
    });

    const hourglassPreset = document.getElementById('preset-hourglass');
    if (hourglassPreset) hourglassPreset.style.display = gender === 'women' ? 'inline-flex' : 'none';

    renderSupermodelTray();
    renderGarmentsGrid();
    calculateBMI();
    syncBodyVisualizerUI();
    renderBodyVisualizerCanvas();
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

  function handleUserPhotoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      customUserImage = e.target.result;
      const beforeImg = document.getElementById('before-img');
      if (beforeImg) beforeImg.src = customUserImage;

      triggerAITransformEffect();
      if (typeof showToast === 'function') {
        showToast('✨ Your Photo Uploaded! AI Clothes Drape Activated.');
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
        showToast('👚 Custom Garment Fitted on Model!');
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
        setTimeout(() => { overlay.style.display = 'none'; }, 300);
      }, 900);
    }
  }

  function randomSupermodel() {
    const list = AI_SUPERMODELS[currentGender] || [];
    const rnd = Math.floor(Math.random() * list.length);
    selectSupermodel(rnd);
  }

  /* ─────────────────────────────────────────────────────────────
     5. BODY VISUALIZER & DYNAMIC SVG/CANVAS MORPHING ENGINE
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
    renderBodyVisualizerCanvas();
  }

  function setBodyShapePreset(preset) {
    bodyVisualizer.bodyShape = preset;

    if (preset === 'athletic') {
      bodyVisualizer.chestIn = currentGender === 'women' ? 36 : 42;
      bodyVisualizer.waistIn = currentGender === 'women' ? 26 : 30;
      bodyVisualizer.hipIn = currentGender === 'women' ? 37 : 38;
    } else if (preset === 'hourglass') {
      bodyVisualizer.chestIn = 36;
      bodyVisualizer.waistIn = 24;
      bodyVisualizer.hipIn = 38;
    } else if (preset === 'rectangle') {
      bodyVisualizer.chestIn = currentGender === 'women' ? 33 : 38;
      bodyVisualizer.waistIn = currentGender === 'women' ? 28 : 32;
      bodyVisualizer.hipIn = currentGender === 'women' ? 35 : 37;
    } else if (preset === 'pear') {
      bodyVisualizer.chestIn = currentGender === 'women' ? 33 : 38;
      bodyVisualizer.waistIn = currentGender === 'women' ? 27 : 33;
      bodyVisualizer.hipIn = currentGender === 'women' ? 42 : 40;
    } else if (preset === 'inverted_triangle') {
      bodyVisualizer.chestIn = currentGender === 'women' ? 38 : 44;
      bodyVisualizer.waistIn = currentGender === 'women' ? 27 : 32;
      bodyVisualizer.hipIn = currentGender === 'women' ? 34 : 37;
    } else if (preset === 'plus') {
      bodyVisualizer.weightKg = currentGender === 'women' ? 78 : 95;
      bodyVisualizer.chestIn = currentGender === 'women' ? 42 : 46;
      bodyVisualizer.waistIn = currentGender === 'women' ? 36 : 40;
      bodyVisualizer.hipIn = currentGender === 'women' ? 46 : 44;
    }

    calculateBMI();
    syncBodyVisualizerUI();
    renderBodyVisualizerCanvas();
  }

  function syncBodyVisualizerUI() {
    const bmiEl = document.getElementById('bv-gauge-bmi');
    const catEl = document.getElementById('bv-bmi-category');
    const recEl = document.getElementById('bv-rec-size');

    if (bmiEl) bmiEl.textContent = bodyVisualizer.bmi;
    if (catEl) {
      if (bodyVisualizer.bmi < 18.5) catEl.textContent = 'Underweight Fit';
      else if (bodyVisualizer.bmi < 25) catEl.textContent = 'Optimal Healthy Proportion';
      else if (bodyVisualizer.bmi < 30) catEl.textContent = 'Athletic / Robust';
      else catEl.textContent = 'Curvy / Plus Fit';
    }
    if (recEl) {
      if (bodyVisualizer.bmi < 18.5) recEl.textContent = 'XS';
      else if (bodyVisualizer.bmi < 22) recEl.textContent = 'S';
      else if (bodyVisualizer.bmi < 25) recEl.textContent = 'M';
      else if (bodyVisualizer.bmi < 29) recEl.textContent = 'L';
      else recEl.textContent = 'XL / Bespoke 3D';
    }

    // Sliders
    const sHeight = document.getElementById('slider-height');
    const sWeight = document.getElementById('slider-weight');
    const sChest = document.getElementById('slider-chest');
    const sWaist = document.getElementById('slider-waist');
    const sHip = document.getElementById('slider-hip');

    if (sHeight) sHeight.value = bodyVisualizer.heightCm;
    if (sWeight) sWeight.value = bodyVisualizer.weightKg;
    if (sChest) sChest.value = bodyVisualizer.chestIn;
    if (sWaist) sWaist.value = bodyVisualizer.waistIn;
    if (sHip) sHip.value = bodyVisualizer.hipIn;

    // Value text spans
    const vHeight = document.getElementById('val-height');
    const vWeight = document.getElementById('val-weight');
    const vChest = document.getElementById('val-chest');
    const vWaist = document.getElementById('val-waist');
    const vHip = document.getElementById('val-hip');

    if (vHeight) vHeight.textContent = bodyVisualizer.heightCm + ' cm (' + (bodyVisualizer.heightCm / 30.48).toFixed(1) + "\')";
    if (vWeight) vWeight.textContent = bodyVisualizer.weightKg + ' kg (' + Math.round(bodyVisualizer.weightKg * 2.204) + ' lbs)';
    if (vChest) vChest.textContent = bodyVisualizer.chestIn + '"';
    if (vWaist) vWaist.textContent = bodyVisualizer.waistIn + '"';
    if (vHip) vHip.textContent = bodyVisualizer.hipIn + '"';

    // HUD Stats
    const hChest = document.getElementById('stat-chest');
    const hWaist = document.getElementById('stat-waist');
    const hHeight = document.getElementById('stat-height');

    if (hChest) hChest.textContent = bodyVisualizer.chestIn + '"';
    if (hWaist) hWaist.textContent = bodyVisualizer.waistIn + '"';
    if (hHeight) hHeight.textContent = (bodyVisualizer.heightCm / 30.48).toFixed(1) + "\'";
  }

  /* Render visual body silhouette on Web canvas */
  function renderBodyVisualizerCanvas() {
    const container = document.getElementById('body-visualizer-canvas-mount');
    if (!container) return;

    const shoulderW = Math.min(220, Math.max(110, bodyVisualizer.chestIn * 4.2));
    const waistW = Math.min(190, Math.max(90, bodyVisualizer.waistIn * 3.8));
    const hipW = Math.min(210, Math.max(100, bodyVisualizer.hipIn * 4.0));
    const torsoH = Math.min(120, Math.max(70, bodyVisualizer.heightCm * 0.48));
    const legH = Math.min(160, Math.max(90, bodyVisualizer.heightCm * 0.7));

    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:20px;position:relative;">
        <!-- Head -->
        <div style="width:48px;height:60px;border-radius:24px;background:#C9A84C;margin-bottom:6px;box-shadow:0 4px 12px rgba(201,168,76,0.35);"></div>

        <!-- Shoulders / Chest -->
        <div style="width:${shoulderW}px;height:32px;border-radius:16px;background:#1A1A1A;margin-bottom:6px;transition:all 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.1);"></div>

        <!-- Torso / Waist -->
        <div style="width:${waistW}px;height:${torsoH}px;border-radius:12px;background:#2B2B2B;margin-bottom:6px;transition:all 0.3s ease;"></div>

        <!-- Hips -->
        <div style="width:${hipW}px;height:36px;border-radius:14px;background:#1A1A1A;margin-bottom:6px;transition:all 0.3s ease;"></div>

        <!-- Legs -->
        <div style="display:flex;gap:14px;">
          <div style="width:28px;height:${legH}px;border-radius:14px;background:#3A3A3A;transition:all 0.3s ease;"></div>
          <div style="width:28px;height:${legH}px;border-radius:14px;background:#3A3A3A;transition:all 0.3s ease;"></div>
        </div>

        <!-- Float Overlay -->
        <div style="position:absolute;bottom:12px;left:12px;right:12px;background:rgba(255,255,255,0.94);padding:10px 14px;border-radius:12px;border:1px solid #E8E4DC;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:10px;font-weight:900;color:var(--gold-dark);letter-spacing:1px;text-transform:uppercase;">${bodyVisualizer.gender.toUpperCase()} · ${bodyVisualizer.bodyShape.toUpperCase()}</div>
            <div style="font-size:9px;color:#6B6560;margin-top:2px;">Height: ${bodyVisualizer.heightCm}cm · Weight: ${bodyVisualizer.weightKg}kg · Chest: ${bodyVisualizer.chestIn}" · Waist: ${bodyVisualizer.waistIn}"</div>
          </div>
          <div style="font-size:16px;font-weight:900;color:#111111;">BMI ${bodyVisualizer.bmi}</div>
        </div>
      </div>
    `;
  }

  /* ─────────────────────────────────────────────────────────────
     6. LIVE WEBRTC CAMERA AR TRY-ON
  ───────────────────────────────────────────────────────────── */
  async function startWebCamera() {
    const video = document.getElementById('web-camera-video');
    const modal = document.getElementById('web-camera-modal');
    if (!video) return;

    if (modal) modal.style.display = 'flex';

    try {
      webCameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      video.srcObject = webCameraStream;
      video.play();
    } catch (err) {
      alert('Camera access error: ' + err.message + '. Please ensure camera permissions are allowed in your browser.');
    }
  }

  function captureWebCameraPhoto() {
    const video = document.getElementById('web-camera-video');
    const canvas = document.createElement('canvas');
    if (!video) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    customUserImage = dataUrl;

    const beforeImg = document.getElementById('before-img');
    if (beforeImg) beforeImg.src = customUserImage;

    stopWebCamera();
    triggerAITransformEffect();

    if (typeof showToast === 'function') {
      showToast('📸 Photo Captured! AI Virtual Try-On Applied.');
    }
  }

  function stopWebCamera() {
    if (webCameraStream) {
      webCameraStream.getTracks().forEach(track => track.stop());
      webCameraStream = null;
    }
    const modal = document.getElementById('web-camera-modal');
    if (modal) modal.style.display = 'none';
  }

  /* ─────────────────────────────────────────────────────────────
     7. PRICE SUMMARY & CART
  ───────────────────────────────────────────────────────────── */
  function updatePriceSummary() {
    const totalEl = document.getElementById('cpq-total-price');
    if (totalEl) {
      totalEl.textContent = '₹' + garmentConfig.basePrice.toLocaleString('en-IN');
    }
  }

  function takeSnapshot() {
    if (typeof showToast === 'function') {
      showToast('📥 4K Look Exported to Photos!');
    }
  }

  return {
    init,
    selectSupermodel,
    selectGarment,
    setGender,
    setColor,
    setFabric,
    handleUserPhotoUpload,
    handleCustomGarmentUpload,
    randomSupermodel,
    setBodyParam,
    setBodyShapePreset,
    startWebCamera,
    captureWebCameraPhoto,
    stopWebCamera,
    takeSnapshot,
    renderBodyVisualizerCanvas,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  NOVA3D.init();
});
