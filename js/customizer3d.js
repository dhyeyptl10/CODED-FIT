/**
 * CODED FIT — 8-STEP 3D BESPOKE CUSTOMIZATION STUDIO
 * Seamlessly integrates with Three.js PBR rendering and backend price calculation
 */

const BESPOKE_STUDIO = (function () {
  'use strict';

  const config = {
    currentStep: 1,
    basePrice: 2499,
    fabric: { id: 'gots_cotton', name: 'Ahmedabad GOTS Organic Cotton', priceAdd: 0, previewColor: '#F5F2E7', origin: 'Gujarat, India' },
    colorHex: '#F5F2E7',
    colorName: 'Ivory Off-White',
    collar: { id: 'cutaway', name: 'Cutaway Spread Collar', priceAdd: 0 },
    cuff: { id: 'single_barrel', name: 'Single-Barrel Classic Cuff', priceAdd: 0 },
    button: { id: 'mother_pearl', name: 'Natural Mother-of-Pearl', priceAdd: 400 },
    fit: { id: 'regular', name: 'Classic Regular Fit', priceAdd: 0 },
    monogram: '',
    measurements: {
      chest: 40,
      waist: 32,
      shoulder: 18,
      sleeve: 25,
      neck: 15.5
    }
  };

  function init() {
    updateSummary();
    bindEvents();
    console.log('[CODED FIT 3D] Bespoke Customization Studio Online');
  }

  function goToStep(step) {
    config.currentStep = step;
    document.querySelectorAll('.customizer-step-pane').forEach((pane, idx) => {
      pane.classList.toggle('active', idx + 1 === step);
    });
    document.querySelectorAll('.step-indicator-pill').forEach((pill, idx) => {
      pill.classList.toggle('active', idx + 1 === step);
      pill.classList.toggle('completed', idx + 1 < step);
    });
    updateSummary();
  }

  function nextStep() {
    if (config.currentStep < 8) {
      goToStep(config.currentStep + 1);
    }
  }

  function prevStep() {
    if (config.currentStep > 1) {
      goToStep(config.currentStep - 1);
    }
  }

  function selectFabric(id, name, priceAdd, colorHex, origin) {
    config.fabric = { id, name, priceAdd: Number(priceAdd), previewColor: colorHex, origin };
    config.colorHex = colorHex;
    if (typeof LENSKART3D !== 'undefined') {
      LENSKART3D.setColor(colorHex);
    }
    document.querySelectorAll('.fabric-card-opt').forEach(el => {
      el.classList.toggle('selected', el.dataset.id === id);
    });
    updateSummary();
  }

  function selectColor(hex, name) {
    config.colorHex = hex;
    config.colorName = name;
    if (typeof LENSKART3D !== 'undefined') {
      LENSKART3D.setColor(hex);
    }
    document.querySelectorAll('.color-dot-opt').forEach(el => {
      el.classList.toggle('selected', el.dataset.hex === hex);
    });
    updateSummary();
  }

  function selectCollar(id, name, priceAdd) {
    config.collar = { id, name, priceAdd: Number(priceAdd) };
    document.querySelectorAll('.collar-opt-btn').forEach(el => {
      el.classList.toggle('selected', el.dataset.id === id);
    });
    updateSummary();
  }

  function selectCuff(id, name, priceAdd) {
    config.cuff = { id, name, priceAdd: Number(priceAdd) };
    document.querySelectorAll('.cuff-opt-btn').forEach(el => {
      el.classList.toggle('selected', el.dataset.id === id);
    });
    updateSummary();
  }

  function selectButton(id, name, priceAdd) {
    config.button = { id, name, priceAdd: Number(priceAdd) };
    document.querySelectorAll('.button-opt-btn').forEach(el => {
      el.classList.toggle('selected', el.dataset.id === id);
    });
    updateSummary();
  }

  function selectFit(id, name) {
    config.fit = { id, name, priceAdd: 0 };
    document.querySelectorAll('.fit-opt-btn').forEach(el => {
      el.classList.toggle('selected', el.dataset.id === id);
    });
    updateSummary();
  }

  function setMonogram(text) {
    config.monogram = text.toUpperCase().slice(0, 4);
    updateSummary();
  }

  function calculateTotal() {
    const monogramAdd = config.monogram.length > 0 ? 299 : 0;
    return config.basePrice + (config.fabric.priceAdd || 0) + (config.collar.priceAdd || 0) + (config.cuff.priceAdd || 0) + (config.button.priceAdd || 0) + monogramAdd;
  }

  function updateSummary() {
    const total = calculateTotal();
    const setT = (id, str) => { const el = document.getElementById(id); if (el) el.textContent = str; };

    setT('summary-base-price', `₹${config.basePrice.toLocaleString('en-IN')}`);
    setT('summary-fabric-name', config.fabric.name);
    setT('summary-fabric-add', config.fabric.priceAdd > 0 ? `+₹${config.fabric.priceAdd}` : 'Included');
    setT('summary-collar-name', config.collar.name);
    setT('summary-cuff-name', config.cuff.name);
    setT('summary-button-name', config.button.name);
    setT('summary-fit-name', config.fit.name);
    setT('summary-total-price', `₹${total.toLocaleString('en-IN')}`);

    // Update active customizer HUD badge
    setT('active-customization-hud', `${config.fabric.name} · ${config.collar.name} · ${config.fit.name}`);
  }

  function addBespokeToBag() {
    const total = calculateTotal();
    const item = {
      id: 9001,
      name: `Bespoke Garment (${config.fabric.name})`,
      price: total,
      qty: 1,
      size: 'Custom Fit',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=500&q=80',
      funnel: 'made-to-measure',
      customData: {
        fabric: config.fabric.name,
        collar: config.collar.name,
        cuff: config.cuff.name,
        button: config.button.name,
        fit: config.fit.name,
        monogram: config.monogram || 'None',
        measurements: config.measurements
      }
    };

    let cart = JSON.parse(localStorage.getItem('NOVA_CART') || '[]');
    cart.push(item);
    localStorage.setItem('NOVA_CART', JSON.stringify(cart));

    document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
    if (typeof showToast === 'function') {
      showToast('Bespoke custom garment added to your shopping bag.');
    }
    if (typeof openCartDrawer === 'function') {
      setTimeout(openCartDrawer, 400);
    }
  }

  function bindEvents() {
    const monoInput = document.getElementById('bespoke-monogram-input');
    if (monoInput) {
      monoInput.addEventListener('input', (e) => setMonogram(e.target.value));
    }
  }

  return {
    init,
    goToStep,
    nextStep,
    prevStep,
    selectFabric,
    selectColor,
    selectCollar,
    selectCuff,
    selectButton,
    selectFit,
    setMonogram,
    calculateTotal,
    addBespokeToBag,
    getConfig: () => config
  };
})();
