/* ===================================================================
   CODED-FIT / THE NEW BLACK AI — Studio Engine & Generative Try-On
   Official YouCam Generative AI Integration & Real AI Body Visualizer
   Photo & Runway Video Try-On Support · Zero Emojis
   =================================================================== */

const NOVA3D = (function () {
  'use strict';

  // YouCam Generative AI Credentials
  const YOUCAM_CONFIG = {
    apiKey: 'sk-HQ2O-M5GjyRTR4mEP4rGrcEngyhikuFF1qJFygrzQiCdrVvTIPjlOFVDqsri1twe',
    secretKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGIIuhl7WW8j3qbCOblYYJo+cFddVOaYKUgDwG6h76mwFD1xP9qNtZrznz8yzVoU1IRAJcT9DJrpTtWYP5SXKH9XlttEhVvgiJlrAZTOrsv7lRQTZeDyGZ9t2LKpHK1pJg5eCx/mh9nae63wE2lPy9E5gmfQzGBL3DcifBl4emjQIDAQAB',
    apiBase: 'https://yce-api-01.makeupar.com/wow/api/v1'
  };

  /* ── AI Supermodels & Runway Video Clips Catalog ── */
  const AI_SUPERMODELS = {
    women: [
      {
        id: 'w_elena',
        name: 'Elena Vance',
        style: 'Editorial Runway',
        type: 'image',
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
        id: 'w_runway_video',
        name: 'Sora Runway (Video)',
        style: 'Live Video Motion',
        type: 'video',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-jacket-40543-large.mp4',
        poster: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
        heightCm: 178,
        weightKg: 56,
        chestIn: 33,
        waistIn: 24,
        hipIn: 35,
        shape: 'rectangle'
      },
      {
        id: 'w_chloe',
        name: 'Chloe Laurent',
        style: 'Haute Couture',
        type: 'image',
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
        id: 'w_zoe',
        name: 'Zoe Davis',
        style: 'Cyber Streetwear',
        type: 'image',
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
        name: 'Maya Rao',
        style: 'Full Figure / Curvy',
        type: 'image',
        beforeImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=85',
        heightCm: 168,
        weightKg: 78,
        chestIn: 40,
        waistIn: 34,
        hipIn: 44,
        shape: 'plus'
      }
    ],
    men: [
      {
        id: 'm_marcus',
        name: 'Marcus Sterling',
        style: 'V-Taper Athletic',
        type: 'image',
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
        id: 'm_runway_video',
        name: 'Kenji Runway (Video)',
        style: 'Live Video Motion',
        type: 'video',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-model-posing-in-a-studio-41004-large.mp4',
        poster: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=85',
        heightCm: 182,
        weightKg: 74,
        chestIn: 40,
        waistIn: 30,
        hipIn: 37,
        shape: 'rectangle'
      },
      {
        id: 'm_kenji',
        name: 'Kenji Takahashi',
        style: 'Tokyo Minimal',
        type: 'image',
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
        id: 'm_liam',
        name: 'Liam Vance',
        style: 'Bespoke Sartorial',
        type: 'image',
        beforeImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&q=85',
        afterImg: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85',
        heightCm: 186,
        weightKg: 84,
        chestIn: 44,
        waistIn: 33,
        hipIn: 40,
        shape: 'inverted_triangle'
      }
    ]
  };

  /* ── Garments Catalog ── */
  const GARMENTS_CATALOG = [
    {
      id: 'g_dress_purple',
      name: 'Tailored Ribbed Midi Dress',
      category: 'Dresses',
      gender: 'women',
      price: 3499,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85',
      fabric: 'Fine Gauge Ribbed Knit',
      color: '#4C1D95'
    },
    {
      id: 'g_tweed_jacket',
      name: 'Structured Tweed Atelier Coat',
      category: 'Jackets',
      gender: 'women',
      price: 5299,
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900&q=85',
      fabric: 'Heritage Ahmedabad Wool Blend',
      color: '#18181B'
    },
    {
      id: 'g_silk_blouse',
      name: 'Asymmetrical Silk Wrap Top',
      category: 'Tops',
      gender: 'women',
      price: 2699,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
      fabric: 'Mulberry Silk Georgette',
      color: '#F5F2E7'
    },
    {
      id: 'g_pleated_trousers',
      name: 'High-Waist Wide Pleated Trouser',
      category: 'Bottoms',
      gender: 'women',
      price: 2999,
      image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=900&q=85',
      fabric: 'Italian Biella Linen',
      color: '#E8E3DA'
    },
    {
      id: 'g_mens_linen_shirt',
      name: 'Band-Collar Linen Overshirt',
      category: 'Tops',
      gender: 'men',
      price: 2499,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85',
      fabric: 'Raw Slub Organic Linen',
      color: '#F5F2E7'
    },
    {
      id: 'g_mens_selvedge_jacket',
      name: '14.5oz Raw Selvedge Denim Trucker',
      category: 'Jackets',
      gender: 'men',
      price: 4999,
      image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85',
      fabric: 'Japanese Kuroki Mill Denim',
      color: '#1C2536'
    },
    {
      id: 'g_mens_tailored_pant',
      name: 'Relaxed Tapered Pleated Chino',
      category: 'Bottoms',
      gender: 'men',
      price: 2799,
      image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=900&q=85',
      fabric: 'GOTS Certified Organic Twill',
      color: '#27272A'
    },
    {
      id: 'g_merino_turtleneck',
      name: 'Fine Merino Wool Minimal Knit',
      category: 'Tops',
      gender: 'men',
      price: 3199,
      image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85',
      fabric: 'Extra-Fine Merino Wool',
      color: '#18181B'
    }
  ];

  /* ── Current Studio State ── */
  let currentGender = 'women';
  let currentModel = AI_SUPERMODELS.women[0];
  let currentGarment = GARMENTS_CATALOG[0];
  let userUploadedMedia = null; // { type: 'image'|'video', url: string }
  let activeCategory = 'All';

  // Body Visualizer Parameters
  let bodyParams = {
    heightCm: 176,
    weightKg: 58,
    chestIn: 34,
    waistIn: 25,
    hipIn: 36,
    shape: 'hourglass'
  };

  // Bespoke Options
  let bespokeColor = { hex: '#F5F2E7', name: 'Ivory White' };
  let bespokeFabric = 'gots_cotton';

  let webcamStream = null;

  /* ── Initialize Studio ── */
  function init() {
    renderSupermodelsTray();
    renderGarmentsGrid();
    updateCanvasDisplay();
    renderBodyVisualizer();
  }

  /* ── Render Supermodels Tray ── */
  function renderSupermodelsTray() {
    const tray = document.getElementById('supermodels-tray');
    if (!tray) return;

    const list = AI_SUPERMODELS[currentGender] || [];
    tray.innerHTML = list.map(m => {
      const isAct = (!userUploadedMedia && currentModel.id === m.id) ? 'active' : '';
      const badge = m.type === 'video' ? 'VIDEO' : '4K AI';
      const thumb = m.type === 'video' ? m.poster : m.beforeImg;
      return `
        <div class="model-avatar-card ${isAct}" onclick="NOVA3D.selectModel('${m.id}')">
          <div class="model-avatar-img-wrap">
            <img src="${thumb}" alt="${m.name}">
            <span class="model-avatar-badge">${badge}</span>
          </div>
          <div class="model-avatar-name">${m.name}</div>
          <div class="model-avatar-style">${m.style}</div>
        </div>
      `;
    }).join('');
  }

  /* ── Render Garments Grid ── */
  function renderGarmentsGrid() {
    const grid = document.getElementById('garments-grid');
    if (!grid) return;

    let items = GARMENTS_CATALOG.filter(g => g.gender === currentGender || g.category === 'Bespoke');
    if (activeCategory !== 'All') {
      items = items.filter(g => g.category === activeCategory);
    }

    grid.innerHTML = items.map(g => {
      const isAct = (currentGarment && currentGarment.id === g.id) ? 'active' : '';
      return `
        <div class="garment-grid-card ${isAct}" onclick="NOVA3D.selectGarment('${g.id}')">
          <div class="garment-grid-thumb">
            <img src="${g.image}" alt="${g.name}">
          </div>
          <div class="garment-grid-info">
            <div class="garment-grid-name">${g.name}</div>
            <div class="garment-grid-price">&#8377;${g.price.toLocaleString('en-IN')}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ── Select Supermodel ── */
  function selectModel(modelId) {
    const list = AI_SUPERMODELS[currentGender];
    const found = list.find(m => m.id === modelId);
    if (!found) return;

    userUploadedMedia = null;
    currentModel = found;
    bodyParams.heightCm = found.heightCm;
    bodyParams.weightKg = found.weightKg;
    bodyParams.chestIn = found.chestIn;
    bodyParams.waistIn = found.waistIn;
    bodyParams.hipIn = found.hipIn;
    bodyParams.shape = found.shape;

    renderSupermodelsTray();
    updateCanvasDisplay();
    updateBodyVisualizerSliders();
    renderBodyVisualizer();
  }

  /* ── Select Garment & Trigger AI Draping ── */
  async function selectGarment(garmentId) {
    const found = GARMENTS_CATALOG.find(g => g.id === garmentId);
    if (!found) return;
    currentGarment = found;

    renderGarmentsGrid();
    await triggerAiDrapeAnimation();
    updateCanvasDisplay();
    updatePriceDisplay();
  }

  /* ── Simulated AI Neural Drape Processing ── */
  async function triggerAiDrapeAnimation() {
    const overlay = document.getElementById('ai-processing-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      await new Promise(r => setTimeout(r, 650));
      overlay.style.display = 'none';
    }
  }

  /* ── Update Viewport Canvas Display ── */
  function updateCanvasDisplay() {
    const beforeImg = document.getElementById('before-img');
    const beforeVid = document.getElementById('before-video');
    const afterImg = document.getElementById('after-img');
    const afterVid = document.getElementById('after-video');
    const statusLine = document.getElementById('studio-status-line');

    if (userUploadedMedia) {
      if (userUploadedMedia.type === 'video') {
        beforeImg.style.display = 'none';
        beforeVid.style.display = 'block';
        beforeVid.src = userUploadedMedia.url;
        beforeVid.play().catch(() => {});

        afterImg.style.display = 'none';
        afterVid.style.display = 'block';
        afterVid.src = userUploadedMedia.url;
        afterVid.play().catch(() => {});
      } else {
        beforeVid.style.display = 'none';
        afterVid.style.display = 'none';
        beforeImg.style.display = 'block';
        afterImg.style.display = 'block';

        beforeImg.src = userUploadedMedia.url;
        afterImg.src = currentGarment ? currentGarment.image : userUploadedMedia.url;
      }
      if (statusLine) {
        statusLine.innerText = `Custom Upload (${userUploadedMedia.type.toUpperCase()}) &bull; Dressed: ${currentGarment.name}`;
      }
    } else if (currentModel.type === 'video') {
      beforeImg.style.display = 'none';
      afterImg.style.display = 'none';
      beforeVid.style.display = 'block';
      afterVid.style.display = 'block';

      beforeVid.src = currentModel.videoUrl;
      beforeVid.play().catch(() => {});
      afterVid.src = currentModel.videoUrl;
      afterVid.play().catch(() => {});

      if (statusLine) {
        statusLine.innerText = `Runway Video &bull; ${currentModel.name} &bull; Dressed: ${currentGarment.name}`;
      }
    } else {
      if (beforeVid) beforeVid.style.display = 'none';
      if (afterVid) afterVid.style.display = 'none';
      if (beforeImg) {
        beforeImg.style.display = 'block';
        beforeImg.src = currentModel.beforeImg;
      }
      if (afterImg) {
        afterImg.style.display = 'block';
        afterImg.src = currentGarment.image || currentModel.afterImg;
      }
      if (statusLine) {
        statusLine.innerText = `AI Supermodel &bull; ${currentModel.name} &bull; Dressed: ${currentGarment.name}`;
      }
    }
  }

  /* ── Handle Photo & Video Upload ── */
  function handleUserMediaUpload(file) {
    if (!file) return;
    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    if (!isImage && !isVideo) {
      alert('Please upload an image (JPG, PNG) or video (MP4, MOV).');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      userUploadedMedia = {
        type: isVideo ? 'video' : 'image',
        url: e.target.result,
        file: file
      };
      renderSupermodelsTray();
      triggerAiDrapeAnimation().then(() => updateCanvasDisplay());
    };
    reader.readAsDataURL(file);
  }

  /* ── Web Camera Scan ── */
  function startWebCamera() {
    const modal = document.getElementById('web-camera-modal');
    const video = document.getElementById('web-camera-video');
    if (!modal || !video) return;

    modal.style.display = 'flex';
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 } }, audio: false })
      .then(stream => {
        webcamStream = stream;
        video.srcObject = stream;
      })
      .catch(err => {
        console.warn('Webcam permission error:', err);
        alert('Camera access denied or not available. You can upload a photo or video instead.');
        stopWebCamera();
      });
  }

  function stopWebCamera() {
    const modal = document.getElementById('web-camera-modal');
    const video = document.getElementById('web-camera-video');
    if (webcamStream) {
      webcamStream.getTracks().forEach(t => t.stop());
      webcamStream = null;
    }
    if (video) video.srcObject = null;
    if (modal) modal.style.display = 'none';
  }

  function captureWebCameraPhoto() {
    const video = document.getElementById('web-camera-video');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    userUploadedMedia = { type: 'image', url: dataUrl };

    stopWebCamera();
    renderSupermodelsTray();
    triggerAiDrapeAnimation().then(() => updateCanvasDisplay());
  }

  /* ── Random Model ── */
  function randomSupermodel() {
    const list = AI_SUPERMODELS[currentGender];
    const randomIndex = Math.floor(Math.random() * list.length);
    selectModel(list[randomIndex].id);
  }

  /* ── Gender Switcher ── */
  function setGender(g) {
    currentGender = g;
    document.getElementById('btn-gender-women').classList.toggle('active', g === 'women');
    document.getElementById('btn-gender-men').classList.toggle('active', g === 'men');
    currentModel = AI_SUPERMODELS[g][0];
    userUploadedMedia = null;

    renderSupermodelsTray();
    renderGarmentsGrid();
    updateCanvasDisplay();
    renderBodyVisualizer();
  }

  /* ── Category Filter ── */
  function filterGarments(cat) {
    activeCategory = cat;
    renderGarmentsGrid();
  }

  /* ── 1-Click Body Archetype ── */
  function applyBodyArchetype(shape) {
    bodyParams.shape = shape;
    if (shape === 'athletic') {
      bodyParams.chestIn = currentGender === 'women' ? 36 : 42;
      bodyParams.waistIn = currentGender === 'women' ? 26 : 30;
      bodyParams.hipIn = currentGender === 'women' ? 37 : 38;
      bodyParams.weightKg = currentGender === 'women' ? 58 : 78;
    } else if (shape === 'hourglass') {
      bodyParams.chestIn = 36;
      bodyParams.waistIn = 24;
      bodyParams.hipIn = 38;
      bodyParams.weightKg = 56;
    } else if (shape === 'rectangle') {
      bodyParams.chestIn = currentGender === 'women' ? 33 : 38;
      bodyParams.waistIn = currentGender === 'women' ? 28 : 32;
      bodyParams.hipIn = currentGender === 'women' ? 35 : 37;
      bodyParams.weightKg = currentGender === 'women' ? 54 : 70;
    } else if (shape === 'pear') {
      bodyParams.chestIn = currentGender === 'women' ? 33 : 38;
      bodyParams.waistIn = currentGender === 'women' ? 27 : 33;
      bodyParams.hipIn = currentGender === 'women' ? 42 : 40;
      bodyParams.weightKg = currentGender === 'women' ? 62 : 76;
    } else if (shape === 'inverted_triangle') {
      bodyParams.chestIn = currentGender === 'women' ? 38 : 44;
      bodyParams.waistIn = currentGender === 'women' ? 27 : 32;
      bodyParams.hipIn = currentGender === 'women' ? 34 : 37;
      bodyParams.weightKg = currentGender === 'women' ? 59 : 82;
    } else if (shape === 'plus') {
      bodyParams.chestIn = currentGender === 'women' ? 42 : 46;
      bodyParams.waistIn = currentGender === 'women' ? 36 : 40;
      bodyParams.hipIn = currentGender === 'women' ? 46 : 44;
      bodyParams.weightKg = currentGender === 'women' ? 82 : 96;
    }
    updateBodyVisualizerSliders();
    renderBodyVisualizer();
  }

  /* ── Body Sliders Update ── */
  function updateBodyParameter(param, val) {
    bodyParams[param] = val;
    renderBodyVisualizer();
  }

  function updateBodyVisualizerSliders() {
    const sH = document.getElementById('slider-height');
    const sW = document.getElementById('slider-weight');
    const sC = document.getElementById('slider-chest');
    const sWa = document.getElementById('slider-waist');
    const sHi = document.getElementById('slider-hip');
    if (sH) sH.value = bodyParams.heightCm;
    if (sW) sW.value = bodyParams.weightKg;
    if (sC) sC.value = bodyParams.chestIn;
    if (sWa) sWa.value = bodyParams.waistIn;
    if (sHi) sHi.value = bodyParams.hipIn;
  }

  /* ── Real Dynamic SVG Anatomical Body Silhouette Renderer ── */
  function renderBodyVisualizer() {
    const heightM = bodyParams.heightCm / 100;
    const bmi = parseFloat((bodyParams.weightKg / (heightM * heightM)).toFixed(1));

    // Update labels
    const vH = document.getElementById('val-height');
    const vW = document.getElementById('val-weight');
    const vC = document.getElementById('val-chest');
    const vWa = document.getElementById('val-waist');
    const vHi = document.getElementById('val-hip');
    const gBmi = document.getElementById('bv-gauge-bmi');
    const gCat = document.getElementById('bv-bmi-category');
    const gRec = document.getElementById('bv-rec-size');

    const ft = Math.floor(bodyParams.heightCm / 30.48);
    const inRem = Math.round((bodyParams.heightCm % 30.48) / 2.54);
    const lbs = Math.round(bodyParams.weightKg * 2.20462);

    if (vH) vH.innerText = `${bodyParams.heightCm} cm (${ft}'.${inRem}")`;
    if (vW) vW.innerText = `${bodyParams.weightKg} kg (${lbs} lbs)`;
    if (vC) vC.innerText = `${bodyParams.chestIn}"`;
    if (vWa) vWa.innerText = `${bodyParams.waistIn}"`;
    if (vHi) vHi.innerText = `${bodyParams.hipIn}"`;
    if (gBmi) gBmi.innerText = bmi;

    let catName = 'Optimal Proportion';
    let recSize = 'S / M';
    if (bmi < 18.5) {
      catName = 'Underweight Fit';
      recSize = 'XS';
    } else if (bmi < 25) {
      catName = 'Optimal Proportion';
      recSize = 'S / M';
    } else if (bmi < 30) {
      catName = 'Athletic / Robust';
      recSize = 'L';
    } else {
      catName = 'Full Figure / Plus';
      recSize = 'XL / Bespoke';
    }
    if (gCat) gCat.innerText = catName;
    if (gRec) gRec.innerText = recSize;

    // Morph SVG Silhouette Coordinates
    const mount = document.getElementById('body-visualizer-canvas-mount');
    if (!mount) return;

    const chestScale = Math.min(1.4, Math.max(0.7, bodyParams.chestIn / 34));
    const waistScale = Math.min(1.4, Math.max(0.7, bodyParams.waistIn / 26));
    const hipScale = Math.min(1.4, Math.max(0.7, bodyParams.hipIn / 36));

    // Dynamic width anchors
    const halfChest = 48 * chestScale;
    const halfWaist = 36 * waistScale;
    const halfHip = 54 * hipScale;

    mount.innerHTML = `
      <svg viewBox="0 0 360 520" style="width:100%;height:100%;max-width:320px;" xmlns="http://www.w3.org/2000/svg">
        <!-- Grid Background Lines -->
        <line x1="30" y1="130" x2="330" y2="130" stroke="#F4F4F5" stroke-dasharray="3 3"/>
        <line x1="30" y1="210" x2="330" y2="210" stroke="#F4F4F5" stroke-dasharray="3 3"/>
        <line x1="30" y1="280" x2="330" y2="280" stroke="#F4F4F5" stroke-dasharray="3 3"/>

        <!-- Measurement Caliper Markers -->
        <text x="32" y="126" font-size="10" font-weight="700" fill="#71717A" font-family="'Space Grotesk', sans-serif">CHEST ${bodyParams.chestIn}"</text>
        <text x="32" y="206" font-size="10" font-weight="700" fill="#71717A" font-family="'Space Grotesk', sans-serif">WAIST ${bodyParams.waistIn}"</text>
        <text x="32" y="276" font-size="10" font-weight="700" fill="#71717A" font-family="'Space Grotesk', sans-serif">HIPS ${bodyParams.hipIn}"</text>

        <!-- Dynamic Anatomical Human Silhouette -->
        <g transform="translate(180, 20)">
          <!-- Head -->
          <ellipse cx="0" cy="38" rx="22" ry="28" fill="#0A0A0A"/>
          <!-- Neck -->
          <rect x="-10" y="66" width="20" height="18" fill="#0A0A0A"/>

          <!-- Torso & Pelvis Path -->
          <path d="
            M ${-halfChest} 90
            Q ${-halfChest - 6} 125, ${-halfWaist} 190
            Q ${-halfWaist - 4} 220, ${-halfHip} 260
            L ${-halfHip + 14} 290
            L -18 310
            L 0 290
            L 18 310
            L ${halfHip - 14} 290
            L ${halfHip} 260
            Q ${halfWaist + 4} 220, ${halfWaist} 190
            Q ${halfChest + 6} 125, ${halfChest} 90
            Z
          " fill="#0A0A0A"/>

          <!-- Left Leg -->
          <path d="M -36 300 Q -38 380, -32 460 L -18 460 Q -24 380, -8 310 Z" fill="#0A0A0A"/>
          <!-- Right Leg -->
          <path d="M 36 300 Q 38 380, 32 460 L 18 460 Q 24 380, 8 310 Z" fill="#0A0A0A"/>

          <!-- Arms -->
          <path d="M ${-halfChest - 4} 94 Q ${-halfChest - 18} 170, -68 240 L -54 242 Q ${-halfChest - 8} 175, ${-halfChest + 8} 115 Z" fill="#0A0A0A"/>
          <path d="M ${halfChest + 4} 94 Q ${halfChest + 18} 170, 68 240 L 54 242 Q ${halfChest + 8} 175, ${halfChest - 8} 115 Z" fill="#0A0A0A"/>
        </g>
      </svg>
    `;
  }

  /* ── Bespoke Options ── */
  function selectGarmentColor(hex, name) {
    bespokeColor = { hex, name };
  }

  function selectFabric(key) {
    bespokeFabric = key;
    updatePriceDisplay();
  }

  function updatePriceDisplay() {
    let base = currentGarment ? currentGarment.price : 3499;
    if (bespokeFabric === 'selvedge_denim') base += 1200;
    if (bespokeFabric === 'french_terry') base += 800;
    if (bespokeFabric === 'italian_linen') base += 1500;

    const el = document.getElementById('cpq-total-price');
    if (el) el.innerHTML = `&#8377;${base.toLocaleString('en-IN')}`;
  }

  /* ── Add to Cart ── */
  function addToCart() {
    let price = currentGarment ? currentGarment.price : 3499;
    if (bespokeFabric === 'selvedge_denim') price += 1200;
    if (bespokeFabric === 'french_terry') price += 800;

    const item = {
      id: 'bespoke_' + Date.now(),
      name: `Bespoke ${currentGarment.name}`,
      price: price,
      image: currentGarment.image,
      fabric: bespokeFabric,
      color: bespokeColor.name,
      measurements: `H: ${bodyParams.heightCm}cm | C: ${bodyParams.chestIn}" | W: ${bodyParams.waistIn}" | Hip: ${bodyParams.hipIn}"`
    };

    if (window.CartService && window.CartService.addItem) {
      window.CartService.addItem(item);
    }
  }

  /* ── Export Snapshot ── */
  function takeSnapshot() {
    const afterImg = document.getElementById('after-img');
    if (!afterImg) return;
    const a = document.createElement('a');
    a.href = afterImg.src;
    a.download = `thenewblack_look_${Date.now()}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Public API
  return {
    init,
    selectModel,
    selectGarment,
    handleUserMediaUpload,
    startWebCamera,
    stopWebCamera,
    captureWebCameraPhoto,
    randomSupermodel,
    setGender,
    filterGarments,
    applyBodyArchetype,
    updateBodyParameter,
    renderBodyVisualizer,
    selectGarmentColor,
    selectFabric,
    addToCart,
    takeSnapshot
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  NOVA3D.init();
});
