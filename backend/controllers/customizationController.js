const Fabric = require('../models/Fabric');
const aiTools = require('../services/aiTools');

exports.getCustomizationOptions = async (req, res, next) => {
  try {
    let fabrics = await Fabric.find({ inStock: true });

    if (fabrics.length === 0) {
      fabrics = [
        { fabricId: 'gots_cotton', name: 'Ahmedabad GOTS Organic Cotton', origin: 'Gujarat, India', gsm: '280 GSM', priceAdd: 0, previewColor: '#F5F2E7' },
        { fabricId: 'selvedge_denim', name: 'Japanese Selvedge Denim', origin: 'Okayama / Gujarat Mill', gsm: '14.5 oz', priceAdd: 1200, previewColor: '#1c2536' },
        { fabricId: 'french_terry', name: 'Heavy French Terry Fleece', origin: 'Ahmedabad Mill', gsm: '450 GSM', priceAdd: 800, previewColor: '#EECDAF' },
        { fabricId: 'italian_linen', name: 'Pure Organic Italian Linen', origin: 'Biella / Sourced Hub', gsm: '210 GSM', priceAdd: 1500, previewColor: '#E8E3DA' },
        { fabricId: 'tencel_blend', name: 'TENCEL Lyocell Blend', origin: 'Sustainable Blend', gsm: '240 GSM', priceAdd: 1000, previewColor: '#4C1D95' }
      ];
    }

    const collars = [
      { id: 'cutaway', name: 'Cutaway Spread Collar', priceAdd: 0 },
      { id: 'button_down', name: 'Button-Down Oxford Collar', priceAdd: 150 },
      { id: 'mandarin', name: 'Mandarin Band Collar', priceAdd: 200 }
    ];

    const cuffs = [
      { id: 'single_barrel', name: 'Single-Barrel Classic Cuff', priceAdd: 0 },
      { id: 'french_cuff', name: 'French Double Cuff', priceAdd: 350 },
      { id: 'angled_cuff', name: 'Angled Modern Cuff', priceAdd: 200 }
    ];

    const buttons = [
      { id: 'mother_pearl', name: 'Natural Mother-of-Pearl', priceAdd: 400 },
      { id: 'horn', name: 'Matte Horn Finished', priceAdd: 300 },
      { id: 'matte_black', name: 'Anodized Matte Black', priceAdd: 250 }
    ];

    const fits = [
      { id: 'slim', name: 'Slim Tailored', description: 'Close contour along chest and waist' },
      { id: 'regular', name: 'Classic Regular', description: 'Balanced ease with structured shoulder' },
      { id: 'relaxed', name: 'Relaxed Oversized', description: 'Contemporary streetwear drape' }
    ];

    res.json({
      success: true,
      options: {
        fabrics,
        collars,
        cuffs,
        buttons,
        fits,
        basePrice: 2499
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.calculatePrice = async (req, res, next) => {
  try {
    const { fabricId, collarId, cuffId, buttonId, monogram } = req.body;
    const priceCalculation = await aiTools.calculateCustomPrice({
      fabricId,
      collarId,
      cuffId,
      buttonId,
      monogram
    });

    res.json({
      success: true,
      calculation: priceCalculation
    });
  } catch (err) {
    next(err);
  }
};
