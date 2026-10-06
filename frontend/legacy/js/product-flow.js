/**
 * CODED FIT — Central product-flow layer (Phase 5).
 *
 * There is exactly ONE product catalogue (js/products.js → PRODUCTS) and ONE
 * garment catalogue (js/editor-products.js → GARMENTS). This file does NOT
 * create another dataset: it only maps between the two and standardises the
 * cross-page handoffs (shop → product → bespoke/design → try-on → cart → edit).
 *
 * Handoff keys (all device-local, same-tab or same-browser):
 *   CF_BESPOKE_V1        bespoke draft { kind:'bespoke', ...spec }
 *   CF_BESPOKE_EDIT      bespoke edit request { ...spec }
 *   CF_DESIGN_TRYON_V1   design try-on payload (session, has refImage)
 *   CF_DESIGN_TRYON_SLIM_V1 design payload without image (local)
 *   CF_DESIGN_EDIT       design edit request (session)
 *   CF_TRYON_PHOTO       fit-studio photo handoff (session)
 *
 * Cart item kinds: 'standard' (catalogue) | 'bespoke' | 'design'.
 * Custom kinds carry item.custom = full restore object + preview image.
 */
(function (root) {
  'use strict';

  // Studio garment → closest catalogue product (stable catalogue IDs).
  var GARMENT_TO_PRODUCT = {
    'tee-classic': 10,    // 190 GSM Aero-Drape Bamboo Modal Tee
    'oversized-tee': 4,   // Nocturne Boxy Oversized Tee
    'hoodie-heavy': 7,    // Dual-Weave Archival Heavy Hoodie
    'boxy-shirt': 8,      // Minimalist Oversized Poplin Shirt
    'cargo-pants': 5      // Tactical Parachute Utility Cargo
  };

  function hayOf(p) {
    if (!p) return '';
    return ((p.category || '') + ' ' + (p.subCategory || '') + ' ' + (p.name || '')).toLowerCase();
  }

  // Catalogue product → closest studio garment. Approximation is documented
  // in the UI wherever it matters (e.g. try-on bespoke reference note).
  function productToGarmentId(p) {
    var hay = hayOf(p);
    if (/cargo|trouser|pant|bottom|jean|denim/.test(hay) && !/jacket/.test(hay)) return 'cargo-pants';
    if (/hoodie/.test(hay)) return 'hoodie-heavy';
    if (/blazer|trench|jacket|bomber|coat/.test(hay)) return 'hoodie-heavy'; // heavyweight top block
    if (/oversized/.test(hay) && /\btee\b/.test(hay)) return 'oversized-tee';
    if (/shirt|poplin|oxford|cuban|kurta/.test(hay)) return 'boxy-shirt';
    if (/\btee\b|t-shirt/.test(hay)) return 'tee-classic';
    if (/oversized/.test(hay)) return 'oversized-tee';
    return 'tee-classic';
  }

  function productToGarment(p) {
    var id = productToGarmentId(p);
    try {
      if (typeof getGarmentById === 'function') {
        var g = getGarmentById(id);
        if (g && g.id) return g;
      }
    } catch (e) {}
    return { id: id };
  }

  function garmentToProductId(garmentId) {
    return GARMENT_TO_PRODUCT[garmentId] || null;
  }

  function garmentToProduct(garmentId) {
    var pid = garmentToProductId(garmentId);
    if (pid == null) return null;
    try {
      if (typeof getProductById === 'function') return getProductById(pid) || null;
    } catch (e) {}
    return { id: pid };
  }

  function readJSON(key, useSession) {
    try {
      var store = useSession ? sessionStorage : localStorage;
      return JSON.parse(store.getItem(key) || 'null');
    } catch (e) {
      return null;
    }
  }

  function writeJSON(key, value, useSession) {
    try {
      var store = useSession ? sessionStorage : localStorage;
      store.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function queryParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  var CF_FLOW = {
    GARMENT_TO_PRODUCT: GARMENT_TO_PRODUCT,
    productToGarmentId: productToGarmentId,
    productToGarment: productToGarment,
    garmentToProductId: garmentToProductId,
    garmentToProduct: garmentToProduct,
    readJSON: readJSON,
    writeJSON: writeJSON,
    queryParam: queryParam
  };

  root.CF_FLOW = CF_FLOW;
  if (typeof module !== 'undefined' && module.exports) module.exports = CF_FLOW;
})(typeof window !== 'undefined' ? window : globalThis);
