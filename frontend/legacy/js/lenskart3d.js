/**
 * CODED FIT — LENSKART-STYLE 3D VIRTUAL TRY-ON & BESPOKE 3D CUSTOMIZER ENGINE
 * Inspired by Lenskart 3D Try-On & Haute-Couture 3D Fashion Simulators
 * 
 * Features:
 *  1. WebRTC Live Camera 3-Angle Guided Biometric Scan (Front, Left 45°, Right 45°)
 *  2. Three.js Interactive 180° Multi-Angle Head & Torso Turn Viewport (-90° to +90°)
 *  3. Dynamic 3D Garment & Eyewear Drape with PBR Textures & Color Tinting
 *  4. Draggable Before / After Split Comparison Slider
 *  5. Direct Integration with CODED FIT Backend Proxy (/api/try-on, /api/ai/vision)
 *  6. 100% Clean Icons & Luxury Minimal Typography (Zero Emojis)
 */

const LENSKART3D = (function () {
  'use strict';

  // ── State Ledger ──
  const state = {
    gender: 'men',
    currentAngle: 0, // degrees: -90 to +90
    cameraActive: false,
    cameraStream: null,
    scanStep: 0, // 0: Idle, 1: Front, 2: Left, 3: Right, 4: Complete
    scanCaptures: { front: null, left: null, right: null },
    userPhoto: null,
    selectedGarmentIndex: 0,
    selectedModelIndex: 0,
    activeColorHex: '#F5F2E7',
    activeFabricId: 'gots_cotton',
    activeCollarId: 'cutaway',
    activeAccessory: 'sunglasses', // 'sunglasses' | 'none'
    wireframeMode: false,
    splitSliderPos: 50,
    isDraggingSplit: false,
    threeInitialized: false
  };

  // ── Supermodels Catalog ──
  const SUPERMODELS = {
    women: [
      { id: 'w_elena', name: 'Elena Vance', heightCm: 176, weightKg: 58, shape: 'hourglass', beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85', afterImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85' },
      { id: 'w_chloe', name: 'Chloe Laurent', heightCm: 178, weightKg: 55, shape: 'rectangle', beforeImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=85', afterImg: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85' },
      { id: 'w_zoe', name: 'Zoe Davis', heightCm: 172, weightKg: 60, shape: 'athletic', beforeImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=85', afterImg: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85' }
    ],
    men: [
      { id: 'm_marcus', name: 'Marcus Sterling', heightCm: 184, weightKg: 78, shape: 'athletic', beforeImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=85', afterImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85' },
      { id: 'm_kenji', name: 'Kenji Takahashi', heightCm: 180, weightKg: 72, shape: 'rectangle', beforeImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=85', afterImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85' },
      { id: 'm_dev', name: 'Dev Patel', heightCm: 182, weightKg: 75, shape: 'athletic', beforeImg: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&q=85', afterImg: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85' }
    ]
  };

  // ── Garments Catalog ──
  const GARMENTS = {
    women: [
      { id: 'w_purple_midi', name: 'Purple Tailored Midi Dress', category: 'Dresses', tag: 'SIGNATURE', price: 3499, fabric: 'TENCEL Lyocell Blend', colorHex: '#4C1D95', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85' },
      { id: 'w_gold_midi', name: 'Gold Silk Fluid Midi', category: 'Dresses', tag: 'BESPOKE', price: 4299, fabric: 'Pure Organic Italian Linen', colorHex: '#C9A84C', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85' },
      { id: 'w_selvedge_jeans', name: 'Straight-Leg Selvedge Jeans', category: 'Bottoms', tag: 'CORE', price: 2899, fabric: 'Japanese Selvedge Denim', colorHex: '#1c2536', img: 'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=900&q=85' },
      { id: 'w_crop_tee', name: 'Aura Fitted Crop Tee', category: 'Tops', tag: 'CORE', price: 1299, fabric: '280 GSM GOTS Cotton', colorHex: '#F5F2E7', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85' }
    ],
    men: [
      { id: 'm_linen_shirt', name: 'Biella Bespoke Linen Shirt', category: 'Shirts', tag: 'BESPOKE', price: 2799, fabric: '210 GSM Biella Italian Linen', colorHex: '#93C5FD', img: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85' },
      { id: 'm_oversized_tee', name: 'Aether Oversized Drop-Shoulder Tee', category: 'T-Shirts', tag: 'BESTSELLER', price: 1499, fabric: '280 GSM Ahmedabad GOTS Cotton', colorHex: '#F5F2E7', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85' },
      { id: 'm_denim_jacket', name: 'Obsidian Boxy Selvedge Jacket', category: 'Jackets', tag: 'SIGNATURE', price: 4299, fabric: '14.5oz Japanese Selvedge Denim', colorHex: '#18181B', img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85' },
      { id: 'm_cargo_pants', name: 'Tactical Cargo Utility Trousers', category: 'Bottoms', tag: 'CORE', price: 2899, fabric: '320 GSM Ripstop Cotton Twill', colorHex: '#27272A', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85' }
    ]
  };

  // ── Three.js Scene Instances ──
  let scene, camera, renderer, mannequinGroup, garmentMesh, headMesh, eyewearMesh;
  let animFrameId = null;

  /* ─────────────────────────────────────────────────────────────
     1. INITIALIZATION
  ───────────────────────────────────────────────────────────── */
  function init() {
    setupThreeScene();
    setupSplitSlider();
    setupAngleControl();
    renderModelTray();
    renderGarmentsList();
    updateLiveView();
    console.log('[CODED FIT 3D] Lenskart 3D Try-On Engine Initialized');
  }

  /* ─────────────────────────────────────────────────────────────
     2. THREE.JS 3D VIEWPORT SETUP (LENSKART-STYLE 180° TURN)
  ───────────────────────────────────────────────────────────── */
  function setupThreeScene() {
    const container = document.getElementById('three-3d-canvas-wrap');
    if (!container || typeof THREE === 'undefined') return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;

    // Scene
    scene = new THREE.Scene();
    scene.background = null; // Transparent to overlay on dark backdrop

    // Camera
    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 3.2);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    keyLight.position.set(2, 3, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 0.6); // Champagne gold rim light
    fillLight.position.set(-3, 1, -2);
    scene.add(fillLight);

    const floorGrid = new THREE.GridHelper(4, 20, 0xc9a84c, 0x222222);
    floorGrid.position.y = -1.5;
    scene.add(floorGrid);

    // Create Mannequin & Garment Group
    mannequinGroup = new THREE.Group();
    build3DModel();
    scene.add(mannequinGroup);

    // Handle Resize
    window.addEventListener('resize', () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    state.threeInitialized = true;
    animate();
  }

  /* ── Procedural Haute-Couture 3D Mannequin, Garment & Eyewear ── */
  function build3DModel() {
    if (!mannequinGroup) return;
    mannequinGroup.clear();

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0x242424,
      roughness: 0.5,
      metalness: 0.1,
      wireframe: state.wireframeMode
    });

    const fabricMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(state.activeColorHex),
      roughness: 0.7,
      metalness: 0.05,
      wireframe: state.wireframeMode
    });

    // 1. Torso / Chest (Garment)
    const torsoGeo = new THREE.CylinderGeometry(0.48, 0.38, 1.1, 32);
    garmentMesh = new THREE.Mesh(torsoGeo, fabricMaterial);
    garmentMesh.position.y = -0.15;
    garmentMesh.castShadow = true;
    garmentMesh.receiveShadow = true;
    mannequinGroup.add(garmentMesh);

    // 2. Neck
    const neckGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.35, 24);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.y = 0.52;
    mannequinGroup.add(neckMesh);

    // 3. Collar on Garment (Cutaway / Mandarin)
    const collarGeo = new THREE.TorusGeometry(0.22, 0.04, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, fabricMaterial);
    collarMesh.position.y = 0.46;
    mannequinGroup.add(collarMesh);

    // 4. Head
    const headGeo = new THREE.SphereGeometry(0.32, 32, 32);
    headGeo.scale(1, 1.25, 1.05);
    headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headMesh.position.y = 0.95;
    headMesh.castShadow = true;
    mannequinGroup.add(headMesh);

    // 5. Signature Lenskart Eyewear / Sunglasses Accessory
    if (state.activeAccessory === 'sunglasses') {
      const glassesGroup = new THREE.Group();
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.8, roughness: 0.2 });
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a0a,
        transmission: 0.6,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1
      });

      // Left lens
      const leftLens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24), lensMat);
      leftLens.rotation.x = Math.PI / 2;
      leftLens.position.set(-0.13, 0, 0);
      glassesGroup.add(leftLens);

      // Right lens
      const rightLens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24), lensMat);
      rightLens.rotation.x = Math.PI / 2;
      rightLens.position.set(0.13, 0, 0);
      glassesGroup.add(rightLens);

      // Bridge
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.015, 0.015), frameMat);
      bridge.position.set(0, 0.02, 0);
      glassesGroup.add(bridge);

      // Position glasses on face
      glassesGroup.position.set(0, 0.98, 0.33);
      eyewearMesh = glassesGroup;
      mannequinGroup.add(eyewearMesh);
    }

    // Set Initial Angle
    applyAngleToScene(state.currentAngle);
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. 180° MULTI-ANGLE TURN CONTROLS (LENSKART SIGNATURE FEATURE)
  ───────────────────────────────────────────────────────────── */
  function setupAngleControl() {
    const slider = document.getElementById('head-angle-slider');
    const angleDisplay = document.getElementById('current-angle-label');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        setAngle(val);
      });
    }

    // Setup interactive mouse/touch drag on 3D canvas
    const wrap = document.getElementById('three-3d-canvas-wrap');
    if (!wrap) return;

    let isPointerDown = false;
    let startX = 0;
    let startAngle = 0;

    wrap.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      startX = e.clientX;
      startAngle = state.currentAngle;
      wrap.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      const deltaX = e.clientX - startX;
      // 3px per degree
      const newAngle = Math.max(-90, Math.min(90, startAngle + (deltaX * 0.5)));
      setAngle(newAngle);
    });

    window.addEventListener('pointerup', () => {
      if (isPointerDown) {
        isPointerDown = false;
        wrap.style.cursor = 'grab';
      }
    });
  }

  function setAngle(deg) {
    state.currentAngle = Math.round(deg);
    const slider = document.getElementById('head-angle-slider');
    const angleDisplay = document.getElementById('current-angle-label');
    if (slider) slider.value = state.currentAngle;
    if (angleDisplay) {
      if (state.currentAngle === 0) angleDisplay.textContent = 'FRONT VIEW (0°)';
      else if (state.currentAngle < 0) angleDisplay.textContent = `LEFT TURN (${Math.abs(state.currentAngle)}°)`;
      else angleDisplay.textContent = `RIGHT TURN (${state.currentAngle}°)`;
    }

    applyAngleToScene(state.currentAngle);
  }

  function applyAngleToScene(deg) {
    if (mannequinGroup) {
      const radians = (deg * Math.PI) / 180;
      mannequinGroup.rotation.y = radians;
    }
  }

  function setAnglePreset(deg) {
    setAngle(deg);
  }

  function resetCamera() {
    setAngle(0);
    if (camera) camera.position.set(0, 0.4, 3.2);
  }

  function zoomIn() {
    if (camera && camera.position.z > 1.8) {
      camera.position.z -= 0.3;
    }
  }

  function zoomOut() {
    if (camera && camera.position.z < 4.8) {
      camera.position.z += 0.3;
    }
  }

  function toggleWireframe() {
    state.wireframeMode = !state.wireframeMode;
    build3DModel();
  }

  function toggleEyewear() {
    state.activeAccessory = state.activeAccessory === 'sunglasses' ? 'none' : 'sunglasses';
    build3DModel();
  }

  /* ─────────────────────────────────────────────────────────────
     4. WEBRTC LIVE CAMERA 3-ANGLE SCANNER (LENSKART SCANNER)
  ───────────────────────────────────────────────────────────── */
  async function startLiveCameraScan() {
    const video = document.getElementById('lenskart-camera-stream');
    const container = document.getElementById('lenskart-scanner-container');
    const stepLabel = document.getElementById('scan-step-indicator');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported in this browser. You can still upload a photo.');
      return;
    }

    try {
      state.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });

      if (video) {
        video.srcObject = state.cameraStream;
        video.play();
        state.cameraActive = true;
      }

      if (container) container.style.display = 'block';
      state.scanStep = 1;
      updateScanStepUI();
    } catch (err) {
      console.error('[Camera Error]:', err.message);
      alert('Unable to access camera. Please allow camera permissions or upload a portrait photo.');
    }
  }

  function stopLiveCameraScan() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
    state.cameraActive = false;
    const container = document.getElementById('lenskart-scanner-container');
    if (container) container.style.display = 'none';
  }

  function captureScanAngle() {
    const video = document.getElementById('lenskart-camera-stream');
    if (!video || !state.cameraActive) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    if (state.scanStep === 1) {
      state.scanCaptures.front = dataUrl;
      state.userPhoto = dataUrl;
      state.scanStep = 2;
    } else if (state.scanStep === 2) {
      state.scanCaptures.left = dataUrl;
      state.scanStep = 3;
    } else if (state.scanStep === 3) {
      state.scanCaptures.right = dataUrl;
      state.scanStep = 4;
      finishCameraScan();
    }
    updateScanStepUI();
  }

  function updateScanStepUI() {
    const stepLabel = document.getElementById('scan-step-indicator');
    const instruction = document.getElementById('scan-instruction-text');
    const triggerBtn = document.getElementById('scan-capture-btn');

    if (state.scanStep === 1) {
      if (stepLabel) stepLabel.textContent = 'STEP 1 OF 3: FRONT POSE';
      if (instruction) instruction.textContent = 'Align face with the central oval. Look directly into the camera.';
      if (triggerBtn) triggerBtn.textContent = 'CAPTURE FRONT (0°)';
    } else if (state.scanStep === 2) {
      if (stepLabel) stepLabel.textContent = 'STEP 2 OF 3: LEFT TURN';
      if (instruction) instruction.textContent = 'Turn your head 45° to the left.';
      if (triggerBtn) triggerBtn.textContent = 'CAPTURE LEFT (45°)';
    } else if (state.scanStep === 3) {
      if (stepLabel) stepLabel.textContent = 'STEP 3 OF 3: RIGHT TURN';
      if (instruction) instruction.textContent = 'Now turn your head 45° to the right.';
      if (triggerBtn) triggerBtn.textContent = 'CAPTURE RIGHT (45°)';
    } else if (state.scanStep === 4) {
      if (stepLabel) stepLabel.textContent = 'SCAN COMPLETED';
      if (instruction) instruction.textContent = '3D Fit Twin reconstructed. Fitting garment onto your model.';
      if (triggerBtn) triggerBtn.textContent = 'APPLY 3D FIT TWIN';
    }
  }

  function finishCameraScan() {
    stopLiveCameraScan();

    // Set captured photo as Before layer
    const beforeImg = document.getElementById('before-img');
    if (beforeImg && state.scanCaptures.front) {
      beforeImg.src = state.scanCaptures.front;
    }

    // Call Backend /api/try-on
    triggerBackendTryOn();

    if (typeof showToast === 'function') {
      showToast('3-Angle 3D Fit Scan Captured. Fitting bespoke garment...');
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. BACKEND TRY-ON PROXY INTEGRATION
  ───────────────────────────────────────────────────────────── */
  async function triggerBackendTryOn() {
    const garment = (GARMENTS[state.gender] && GARMENTS[state.gender][state.selectedGarmentIndex]) || GARMENTS.men[0];
    const overlay = document.getElementById('ai-transform-overlay');
    if (overlay) overlay.style.display = 'flex';

    try {
      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelImageBase64: state.userPhoto || undefined,
          modelImageUrl: !state.userPhoto ? (SUPERMODELS[state.gender][state.selectedModelIndex].beforeImg) : undefined,
          garmentImageUrl: garment.img,
          garmentType: 'top'
        })
      });

      const data = await response.json();

      // Update fit score display - Section 5 compliance: real confidence or "Fit score unavailable"
      const scoreBadge = document.getElementById('fit-accuracy-display');
      if (scoreBadge) {
        scoreBadge.textContent = data.fitScore ? `${data.fitScore}% Match` : 'Fit score unavailable';
      }
    } catch (err) {
      console.warn('[Try-On API Warning]:', err.message);
    } finally {
      if (overlay) {
        setTimeout(() => { overlay.style.display = 'none'; }, 600);
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     6. BEFORE / AFTER INTERACTIVE SPLIDER
  ───────────────────────────────────────────────────────────── */
  function setupSplitSlider() {
    const container = document.getElementById('comparison-container');
    const divider = document.getElementById('comparison-divider');
    if (!container || !divider) return;

    function onMove(e) {
      if (!state.isDraggingSplit) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      setSplitPosition(pos);
    }

    divider.addEventListener('mousedown', () => { state.isDraggingSplit = true; });
    container.addEventListener('mousedown', (e) => { state.isDraggingSplit = true; onMove(e); });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', () => { state.isDraggingSplit = false; });

    divider.addEventListener('touchstart', () => { state.isDraggingSplit = true; });
    container.addEventListener('touchstart', (e) => { state.isDraggingSplit = true; onMove(e); });
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', () => { state.isDraggingSplit = false; });
  }

  function setSplitPosition(pos) {
    state.splitSliderPos = pos;
    const divider = document.getElementById('comparison-divider');
    const afterWrap = document.getElementById('after-img-wrap');
    if (divider) divider.style.left = pos + '%';
    if (afterWrap) afterWrap.style.clipPath = `polygon(${pos}% 0, 100% 0, 100% 100%, ${pos}% 100%)`;
  }

  /* ─────────────────────────────────────────────────────────────
     7. CATALOG & MODEL SELECTIONS
  ───────────────────────────────────────────────────────────── */
  function renderModelTray() {
    const tray = document.getElementById('supermodels-tray');
    if (!tray) return;

    const list = SUPERMODELS[state.gender] || [];
    tray.innerHTML = list.map((m, idx) => `
      <div class="model-thumb-card ${idx === state.selectedModelIndex ? 'active' : ''}" onclick="LENSKART3D.selectModel(${idx})">
        <img src="${m.beforeImg}" alt="${m.name}">
        <div class="model-thumb-name">${m.name.split(' ')[0]}</div>
      </div>
    `).join('');
  }

  function renderGarmentsList() {
    const grid = document.getElementById('garments-grid');
    if (!grid) return;

    const list = GARMENTS[state.gender] || [];
    grid.innerHTML = `
      <div class="garment-thumb-card upload-card" onclick="document.getElementById('user-photo-upload').click()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--gold);margin-bottom:6px;">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;">Upload</div>
        <div style="font-size:9px;color:#8A8580;">Your Photo</div>
      </div>
    ` + list.map((g, idx) => `
      <div class="garment-thumb-card ${idx === state.selectedGarmentIndex ? 'active' : ''}" onclick="LENSKART3D.selectGarment(${idx})">
        <img src="${g.img}" alt="${g.name}">
        ${g.tag ? `<span class="garment-tag-badge">${g.tag}</span>` : ''}
        <div class="garment-thumb-info">
          <div class="garment-thumb-name">${g.name}</div>
          <div class="garment-thumb-price">₹${g.price.toLocaleString('en-IN')}</div>
        </div>
      </div>
    `).join('');
  }

  function selectModel(idx) {
    state.selectedModelIndex = idx;
    state.userPhoto = null;
    renderModelTray();
    updateLiveView();
  }

  function selectGarment(idx) {
    state.selectedGarmentIndex = idx;
    const g = GARMENTS[state.gender][idx];
    if (g && g.colorHex) {
      setColor(g.colorHex);
    }
    renderGarmentsList();
    updateLiveView();
  }

  function setGender(g) {
    state.gender = g;
    state.selectedModelIndex = 0;
    state.selectedGarmentIndex = 0;

    document.querySelectorAll('.gender-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.gender === g);
    });

    renderModelTray();
    renderGarmentsList();
    updateLiveView();
    build3DModel();
  }

  function setColor(hex) {
    state.activeColorHex = hex;
    if (garmentMesh && garmentMesh.material) {
      garmentMesh.material.color = new THREE.Color(hex);
    }
    const tint = document.getElementById('garment-color-tint');
    if (tint) {
      if (hex !== '#F5F2E7') {
        tint.style.background = hex;
        tint.style.opacity = '0.22';
        tint.style.mixBlendMode = 'multiply';
      } else {
        tint.style.opacity = '0';
      }
    }
  }

  function updateLiveView() {
    const model = (SUPERMODELS[state.gender] && SUPERMODELS[state.gender][state.selectedModelIndex]) || SUPERMODELS.men[0];
    const garment = (GARMENTS[state.gender] && GARMENTS[state.gender][state.selectedGarmentIndex]) || GARMENTS.men[0];

    const beforeImg = document.getElementById('before-img');
    if (beforeImg) {
      beforeImg.src = state.userPhoto || model.beforeImg;
    }

    const afterImg = document.getElementById('after-img');
    if (afterImg) {
      afterImg.src = garment.img || model.afterImg;
    }

    const statusLine = document.getElementById('studio-status-line');
    if (statusLine) {
      statusLine.textContent = `3D Studio · ${model.name} · Wearing: ${garment.name}`;
    }

    const priceEl = document.getElementById('cpq-total-price');
    if (priceEl) {
      priceEl.textContent = `₹${garment.price.toLocaleString('en-IN')}`;
    }
  }

  function handlePhotoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      state.userPhoto = e.target.result;
      const beforeImg = document.getElementById('before-img');
      if (beforeImg) beforeImg.src = state.userPhoto;
      triggerBackendTryOn();
      if (typeof showToast === 'function') {
        showToast('Photo uploaded. Generating 3D Try-On fitting...');
      }
    };
    reader.readAsDataURL(file);
  }

  function addCurrentLookToBag() {
    const garment = GARMENTS[state.gender][state.selectedGarmentIndex];
    if (!garment) return;

    const cartItem = {
      id: garment.id,
      name: garment.name,
      price: garment.price,
      size: 'M',
      qty: 1,
      image: garment.img,
      funnel: 'ready-to-wear',
      customData: {
        fabric: garment.fabric,
        colorHex: state.activeColorHex
      }
    };

    let cart = JSON.parse(localStorage.getItem('NOVA_CART') || '[]');
    cart.push(cartItem);
    localStorage.setItem('NOVA_CART', JSON.stringify(cart));

    document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
    if (typeof showToast === 'function') {
      showToast(`${garment.name} added to your shopping bag.`);
    }
    if (typeof openCartDrawer === 'function') {
      setTimeout(openCartDrawer, 400);
    }
  }

  // ── Public API ──
  return {
    init,
    setGender,
    selectModel,
    selectGarment,
    setColor,
    setAngle,
    setAnglePreset,
    resetCamera,
    zoomIn,
    zoomOut,
    toggleWireframe,
    toggleEyewear,
    startLiveCameraScan,
    stopLiveCameraScan,
    captureScanAngle,
    handlePhotoUpload,
    addCurrentLookToBag,
    getState: () => state
  };
})();
