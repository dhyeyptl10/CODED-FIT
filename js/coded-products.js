/**
 * CODED FIT — Central product model (STEP 2 of the real-fashion upgrade).
 *
 * ONE model for Shop, Bespoke, Editor and Try-On. It does NOT duplicate data:
 * it normalizes the two existing sources (PRODUCTS catalogue + GARMENTS studio
 * blocks, bridged by product-flow.js) into the target schema with:
 *   - images resolved from /assets/ when the manifest lists them,
 *     otherwise today's existing sources (behaviour unchanged),
 *   - printAreas normalized to 0–1 coordinates (transferable to photos),
 *   - per-area print pricing derived from the studio rate card.
 *
 * ASSET MANIFEST: CODED_ASSET_MANIFEST.files maps local asset paths to true.
 * It is the single contract for "photography exists". Today it is empty
 * (only images/fashion-hero.mp4 exists on disk), so every resolver falls
 * back to legacy sources and NOTHING on screen changes. When real photos
 * land in /assets/, add their paths here (or regenerate this block) and the
 * whole platform switches to photography with zero code changes.
 * NEVER invent URLs here — every fallback below is an already-existing source.
 */
(function (root) {
  'use strict';

  var CODED_ASSET_MANIFEST = {
    version: 1,
    // path (relative to site root) -> true. Empty until the photo shoot lands.
    files: {
      // e.g. 'assets/products/tshirts/cf-cp-te-01/black-front.jpg': true
    }
  };

  function slug(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function normId(p) {
    return 'cf-' + slug(p.code || p.name);
  }

  function taxonomy(p) {
    var hay = ((p.category || '') + ' ' + (p.subCategory || '')).toLowerCase();
    if (/trouser|pant|bottom|jean|denim|cargo|jogger|short/.test(hay)) return 'pants';
    if (/hoodie|fleece|sweatshirt|crewneck/.test(hay)) return 'hoodies';
    if (/jacket|blazer|trench|bomber|coat|overshirt/.test(hay)) return 'jackets';
    if (/shirt|poplin|oxford|cuban|kurta/.test(hay) && !/t-shirt|tshirt|tee/.test(hay)) return 'shirts';
    if (/tee|t-shirt|tshirt|polo|tank|top/.test(hay)) return 'tshirts';
    return slug(p.category || 'apparel');
  }

  function fitOf(p) {
    var d = String(p.drapeProfile || p.fit || '');
    if (/oversized|boxy|relaxed|balloon/i.test(d)) return 'oversized';
    if (/slim/i.test(d)) return 'slim';
    return 'regular';
  }

  function studioGarment(p) {
    try {
      if (root.CF_FLOW && typeof root.CF_FLOW.productToGarment === 'function') {
        var g = root.CF_FLOW.productToGarment(p);
        if (g && g.printAreas) return g;
      }
    } catch (e) {}
    try {
      if (typeof getGarmentById === 'function') {
        var list = (typeof GARMENTS !== 'undefined') ? GARMENTS : [];
        for (var i = 0; i < list.length; i++) {
          if (list[i] && list[i].printAreas) return list[i];
        }
      }
    } catch (e2) {}
    return null;
  }

  function assetIf(path) {
    return CODED_ASSET_MANIFEST.files[path] === true ? '/' + path : null;
  }

  function assetDir(np) {
    return 'assets/products/' + np.category + '/' + np.id;
  }

  // Normalized 0–1 print zones, derived from the studio block's pixel zones.
  // Same geometry the Fabric.js boundary validation uses today.
  function areasOf(p, g) {
    var out = [];
    if (!g || !g.printAreas || !g.svgViewBox) return out;
    var vb = g.svgViewBox;
    function norm(key, r) {
      if (!r) return;
      out.push({
        key: key,
        x: r.x / vb.w, y: r.y / vb.h,
        w: r.w / vb.w, h: r.h / vb.h
      });
    }
    norm('front', g.printAreas.front);
    norm('back', g.printAreas.back);
    norm('leftSleeve', g.printAreas.leftSleeve);
    norm('rightSleeve', g.printAreas.rightSleeve);
    norm('hood', g.printAreas.hood);
    norm('leftLeg', g.printAreas.leftLeg);
    norm('rightLeg', g.printAreas.rightLeg);
    return out;
  }

  function priceTable(p, g) {
    var flat = (g && g.printPrice) || 0;
    return {
      base: p.price || 0,
      perArea: {
        front: flat,
        back: flat,
        leftSleeve: Math.round(flat / 2),
        rightSleeve: Math.round(flat / 2),
        hood: Math.round(flat / 2),
        leftLeg: Math.round(flat / 2),
        rightLeg: Math.round(flat / 2)
      },
      // NOTE: sleeve/leg rates are derived (50% of the studio side rate),
      // not supplier quotes. Revisit when the price list is confirmed.
      derived: true
    };
  }

  function normalize(p) {
    var g = studioGarment(p);
    var id = normId(p);
    var cat = taxonomy(p);
    var dir = 'assets/products/' + cat + '/' + id;
    var legacy = p.images || [];
    var np = {
      id: id,
      sku: p.code || '',
      legacyId: p.id,
      name: p.name || '',
      category: cat,
      gender: p.gender || 'unisex',
      fit: fitOf(p),
      fabric: p.fabric || '',
      fabricDensity: p.fabricDensity || '',
      description: p.description || p.tagline || '',
      price: p.price || 0,
      mrp: p.mrp || p.price || 0,
      badge: p.badge || '',
      sizes: (p.sizes || []).slice(),
      colors: [{
        name: p.colorway || 'Studio',
        value: p.colorHex || '#17181b',
        images: {}
      }],
      images: {
        front: assetIf(dir + '/front.jpg') || legacy[0] || '',
        back: assetIf(dir + '/back.jpg') || legacy[1] || legacy[0] || '',
        lifestyle: assetIf(dir + '/lifestyle.jpg') || legacy[2] || legacy[0] || '',
        detail: assetIf(dir + '/detail.jpg') || legacy[0] || ''
      },
      imageSource: {
        front: assetIf(dir + '/front.jpg') ? 'assets' : 'legacy',
        back: assetIf(dir + '/back.jpg') ? 'assets' : 'legacy',
        lifestyle: assetIf(dir + '/lifestyle.jpg') ? 'assets' : 'legacy',
        detail: assetIf(dir + '/detail.jpg') ? 'assets' : 'legacy'
      },
      printAreas: areasOf(p, g),
      pricing: priceTable(p, g),
      tryOnImage: assetIf('assets/tryon/' + id + '.jpg') || legacy[0] || '',
      tryOnSource: assetIf('assets/tryon/' + id + '.jpg') ? 'assets' : 'legacy',
      customizable: !!(g && g.printAreas),
      studioGarmentId: g ? g.id : null
    };
    return np;
  }

  var cache = null;
  function all() {
    if (cache) return cache;
    var src = [];
    try {
      if (typeof PRODUCTS !== 'undefined' && PRODUCTS && PRODUCTS.length) src = PRODUCTS;
    } catch (e) {}
    cache = src.map(normalize);
    return cache;
  }

  function get(id) {
    var list = all();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id || String(list[i].legacyId) === String(id)) return list[i];
    }
    return null;
  }

  function byCategory(cat) {
    return all().filter(function (p) { return p.category === cat; });
  }

  function priceQuote(np, areasUsed) {
    var lines = [];
    var total = np.pricing.base;
    (areasUsed || []).forEach(function (key) {
      var fee = np.pricing.perArea[key];
      if (fee) {
        lines.push({ area: key, price: fee });
        total += fee;
      }
    });
    return { base: np.pricing.base, lines: lines, total: total };
  }

  // Pixels for a rendered image box (w×h): normalized zone → px rect.
  function areaPx(area, boxW, boxH) {
    return {
      x: area.x * boxW, y: area.y * boxH,
      w: area.w * boxW, h: area.h * boxH
    };
  }

  var CodedProducts = {
    manifest: CODED_ASSET_MANIFEST,
    all: all,
    get: get,
    byCategory: byCategory,
    priceQuote: priceQuote,
    areaPx: areaPx
  };

  root.CodedProducts = CodedProducts;
  root.CODED_ASSET_MANIFEST = CODED_ASSET_MANIFEST;
  if (typeof module !== 'undefined' && module.exports) module.exports = CodedProducts;
})(typeof window !== 'undefined' ? window : globalThis);
