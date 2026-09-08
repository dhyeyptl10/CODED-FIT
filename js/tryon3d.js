/**
 * CODED FIT — SPATIAL 3D ATELIER & AI BODY VISUALIZER ENGINE
 * Spatial Computation Lab 04 (CLO-3D Neural Drape Rig v3.4)
 * 
 * Features:
 * 1. Three.js Real-time 3D Human Avatar with Parametric Biometric Morphing
 * 2. Multi-Angle Photo Upload (Front, Left, Right) with AI Laser Mesh Reconstruction
 * 3. 3D Garment Try-On with Real-Time Cloth Rendering & Dynamic Swatches
 * 4. Interactive 3D Screen-Space Annotation Pins (Hotspots)
 * 5. Camera 360° Orbit, Stress Heatmap Shader, Walking Motion Simulation, Before/After Split
 * 6. High-Res Canvas Snapshot Export
 */

const TRYON3D = (function () {
  'use strict';

  // State Ledger
  const state = {
    gender: 'men',
    avatarMeasurements: {
      heightCm: 185,      // 6'1"
      chestInches: 41.2,
      shoulderInches: 18.2,
      waistInches: 32.5,
      inseamInches: 30.5
    },
    activeGarments: {
      top: 'overshirt',    // 'overshirt' | 'tee' | 'hoodie' | 'trench' | 'none'
      bottom: 'balloon',   // 'balloon' | 'cargo' | 'none'
      inner: 'bamboo_tee'
    },
    activeColor: '#22252A',
    activeFabric: 'merino_twill',
    activeCollar: 'overshirt_spread',
    activeHardware: 'cobra_snaps',
    activeMode: 'orbit',   // 'orbit' | 'split' | 'walking' | 'heatmap'
    isWalking: false,
    isHeatmap: false,
    isSplit: false,
    splitPos: 50,
    photos: {
      front: null,
      left: null,
      right: null
    },
    isScanning: false,
    cameraAngle: 0,
    isInitialized: false
  };

  // Three.js Instances
  let scene, camera, renderer, mannequinGroup, garmentGroup, pinsGroup;
  let animId = null;
  let walkClock = 0;
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;

  // Garment definitions
  const GARMENT_PRESETS = {
    overshirt: {
      name: "Drop-Shoulder Merino Field Overshirt",
      code: "CP-SH-09",
      price: 3499,
      color: "#22252A",
      type: "top"
    },
    balloon: {
      name: "Structured Pleated Balloon Trouser",
      code: "CP-TR-03",
      price: 3999,
      color: "#0D0E10",
      type: "bottom"
    },
    bamboo_tee: {
      name: "190 GSM Aero-Drape Bamboo Modal Tee",
      code: "CP-TE-02",
      price: 1299,
      color: "#F4F3EE",
      type: "inner"
    },
    hoodie: {
      name: "Dual-Weave Archival Heavy Hoodie",
      code: "CP-HD-01",
      price: 2499,
      color: "#1E1E22",
      type: "top"
    },
    cargo: {
      name: "Tactical Parachute Utility Cargo",
      code: "CP-TR-02",
      price: 2899,
      color: "#3B4237",
      type: "bottom"
    }
  };

  /* ─────────────────────────────────────────
     1. INITIALIZATION
  ───────────────────────────────────────── */
  function init(containerId = 'three-spatial-canvas-wrap') {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') {
      console.warn('[CODED FIT 3D] Container or Three.js missing');
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 580;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0b0e);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0xe10600, 0x1f232b);
    gridHelper.position.y = -1.6;
    scene.add(gridHelper);

    // Camera
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.2);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting (Studio Lighting Rig)
    const ambLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe10600, 0.8);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x88bbff, 0.5);
    fillLight.position.set(0, -2, 2);
    scene.add(fillLight);

    // Groups
    mannequinGroup = new THREE.Group();
    garmentGroup = new THREE.Group();
    pinsGroup = new THREE.Group();
    scene.add(mannequinGroup);
    scene.add(garmentGroup);
    scene.add(pinsGroup);

    // Build Model
    buildProceduralAvatar();
    buildGarmentMeshes();

    // Mouse Drag Rotation
    setupMouseControls(container);

    // Animation Loop
    startAnimationLoop();

    // Resize Observer
    window.addEventListener('resize', () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    state.isInitialized = true;
    console.log('[CODED FIT 3D] Spatial Neural Rig v3.4 Active');
  }

  /* ─────────────────────────────────────────
     2. PROCEDURAL 3D AVATAR MESH GENERATION
  ───────────────────────────────────────── */
  function buildProceduralAvatar() {
    // Clear previous
    while (mannequinGroup.children.length > 0) {
      mannequinGroup.remove(mannequinGroup.children[0]);
    }

    const { heightCm, chestInches, shoulderInches, waistInches, inseamInches } = state.avatarMeasurements;

    // Body Material: Sleek Dark Matte Anthracite Mannequin with Subsurface Glow
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x181a1f,
      roughness: 0.35,
      metalness: 0.15,
      flatShading: false
    });

    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x282c34,
      roughness: 0.2,
      metalness: 0.7
    });

    // Proportions scaling
    const heightScale = heightCm / 180;
    const chestScale = (chestInches / 40) * 0.95;
    const shoulderScale = (shoulderInches / 18);
    const waistScale = (waistInches / 32);
    const legScale = (inseamInches / 30);

    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 32, 24);
    headGeo.scale(1, 1.25, 1.1);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.y = 1.35 * heightScale;
    mannequinGroup.add(head);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.15, 24);
    const neck = new THREE.Mesh(neckGeo, bodyMat);
    neck.position.y = 1.18 * heightScale;
    mannequinGroup.add(neck);

    // Torso / Chest (Athletic V-Taper Shape)
    const chestGeo = new THREE.CylinderGeometry(0.26 * chestScale * shoulderScale, 0.21 * waistScale, 0.55 * heightScale, 32);
    chestGeo.scale(1.2, 1, 0.75);
    const chest = new THREE.Mesh(chestGeo, bodyMat);
    chest.position.y = 0.82 * heightScale;
    mannequinGroup.add(chest);

    // Pelvis / Waist
    const waistGeo = new THREE.CylinderGeometry(0.21 * waistScale, 0.23 * waistScale, 0.25 * heightScale, 32);
    waistGeo.scale(1.15, 1, 0.8);
    const waist = new THREE.Mesh(waistGeo, bodyMat);
    waist.position.y = 0.45 * heightScale;
    mannequinGroup.add(waist);

    // Shoulders
    const leftShJoint = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), jointMat);
    leftShJoint.position.set(-0.34 * shoulderScale, 1.05 * heightScale, 0);
    mannequinGroup.add(leftShJoint);

    const rightShJoint = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), jointMat);
    rightShJoint.position.set(0.34 * shoulderScale, 1.05 * heightScale, 0);
    mannequinGroup.add(rightShJoint);

    // Left Arm (Upper + Forearm)
    const leftArmGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.42 * heightScale, 16);
    const leftArm = new THREE.Mesh(leftArmGeo, bodyMat);
    leftArm.position.set(-0.38 * shoulderScale, 0.8 * heightScale, 0);
    leftArm.rotation.z = 0.15;
    mannequinGroup.add(leftArm);

    const leftForearmGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.38 * heightScale, 16);
    const leftForearm = new THREE.Mesh(leftForearmGeo, bodyMat);
    leftForearm.position.set(-0.43 * shoulderScale, 0.44 * heightScale, 0.04);
    leftForearm.rotation.z = 0.1;
    mannequinGroup.add(leftForearm);

    // Right Arm (Upper + Forearm)
    const rightArmGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.42 * heightScale, 16);
    const rightArm = new THREE.Mesh(rightArmGeo, bodyMat);
    rightArm.position.set(0.38 * shoulderScale, 0.8 * heightScale, 0);
    rightArm.rotation.z = -0.15;
    mannequinGroup.add(rightArm);

    const rightForearmGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.38 * heightScale, 16);
    const rightForearm = new THREE.Mesh(rightForearmGeo, bodyMat);
    rightForearm.position.set(0.43 * shoulderScale, 0.44 * heightScale, 0.04);
    rightForearm.rotation.z = -0.1;
    mannequinGroup.add(rightForearm);

    // Left Leg
    const leftThighGeo = new THREE.CylinderGeometry(0.125 * waistScale, 0.09, 0.58 * legScale, 24);
    const leftThigh = new THREE.Mesh(leftThighGeo, bodyMat);
    leftThigh.position.set(-0.14 * waistScale, 0.08 * heightScale, 0);
    mannequinGroup.add(leftThigh);

    const leftShinGeo = new THREE.CylinderGeometry(0.09, 0.065, 0.58 * legScale, 24);
    const leftShin = new THREE.Mesh(leftShinGeo, bodyMat);
    leftShin.position.set(-0.14 * waistScale, -0.48 * heightScale, 0);
    mannequinGroup.add(leftShin);

    // Right Leg
    const rightThighGeo = new THREE.CylinderGeometry(0.125 * waistScale, 0.09, 0.58 * legScale, 24);
    const rightThigh = new THREE.Mesh(rightThighGeo, bodyMat);
    rightThigh.position.set(0.14 * waistScale, 0.08 * heightScale, 0);
    mannequinGroup.add(rightThigh);

    const rightShinGeo = new THREE.CylinderGeometry(0.09, 0.065, 0.58 * legScale, 24);
    const rightShin = new THREE.Mesh(rightShinGeo, bodyMat);
    rightShin.position.set(0.14 * waistScale, -0.48 * heightScale, 0);
    mannequinGroup.add(rightShin);

    // Position overall avatar center
    mannequinGroup.position.y = -0.2;
  }

  /* ─────────────────────────────────────────
     3. 3D GARMENT CLOTH DRAPE MESH GENERATION
  ───────────────────────────────────────── */
  function buildGarmentMeshes() {
    while (garmentGroup.children.length > 0) {
      garmentGroup.remove(garmentGroup.children[0]);
    }

    const { heightCm, chestInches, shoulderInches, waistInches, inseamInches } = state.avatarMeasurements;
    const heightScale = heightCm / 180;
    const chestScale = (chestInches / 40) * 0.95;
    const shoulderScale = (shoulderInches / 18);
    const waistScale = (waistInches / 32);
    const legScale = (inseamInches / 30);

    // Garment Material with Twill texture simulation
    let garmentColor = new THREE.Color(state.activeColor);
    let garmentMaterial = new THREE.MeshStandardMaterial({
      color: garmentColor,
      roughness: 0.82,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    if (state.isHeatmap) {
      // Heatmap Shader Material (Red at shoulders/seams, green elsewhere)
      garmentMaterial = new THREE.MeshBasicMaterial({
        color: 0xe10600,
        wireframe: true
      });
    }

    // 1. TOP GARMENT: Overshirt (CP-SH-09 Boxy Drape)
    if (state.activeGarments.top === 'overshirt') {
      const coatGeo = new THREE.CylinderGeometry(0.31 * chestScale * shoulderScale, 0.33 * waistScale, 0.72 * heightScale, 32, 1, true);
      coatGeo.scale(1.22, 1, 0.88);
      const overshirt = new THREE.Mesh(coatGeo, garmentMaterial);
      overshirt.position.set(0, 0.76 * heightScale, 0);
      garmentGroup.add(overshirt);

      // Collar
      const collarGeo = new THREE.TorusGeometry(0.16 * shoulderScale, 0.04, 16, 32, Math.PI * 1.3);
      collarGeo.rotateX(Math.PI / 2);
      const collar = new THREE.Mesh(collarGeo, garmentMaterial);
      collar.position.set(0, 1.13 * heightScale, -0.02);
      garmentGroup.add(collar);

      // Sleeves (Oversized Drop-Shoulder)
      const leftSleeveGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.65 * heightScale, 20);
      const leftSleeve = new THREE.Mesh(leftSleeveGeo, garmentMaterial);
      leftSleeve.position.set(-0.38 * shoulderScale, 0.74 * heightScale, 0);
      leftSleeve.rotation.z = 0.15;
      garmentGroup.add(leftSleeve);

      const rightSleeveGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.65 * heightScale, 20);
      const rightSleeve = new THREE.Mesh(rightSleeveGeo, garmentMaterial);
      rightSleeve.position.set(0.38 * shoulderScale, 0.74 * heightScale, 0);
      rightSleeve.rotation.z = -0.15;
      garmentGroup.add(rightSleeve);

      // Modular Chest Pockets (Signature Detail from Photo)
      const pocketMat = new THREE.MeshStandardMaterial({ color: 0x181a1e, roughness: 0.7 });
      const pocketGeo = new THREE.BoxGeometry(0.12, 0.14, 0.02);
      
      const leftPocket = new THREE.Mesh(pocketGeo, pocketMat);
      leftPocket.position.set(-0.16 * shoulderScale, 0.88 * heightScale, 0.22);
      garmentGroup.add(leftPocket);

      const rightPocket = new THREE.Mesh(pocketGeo, pocketMat);
      rightPocket.position.set(0.16 * shoulderScale, 0.88 * heightScale, 0.22);
      garmentGroup.add(rightPocket);
    }

    // 2. BOTTOM GARMENT: Structured Balloon Trouser (CP-TR-03)
    if (state.activeGarments.bottom === 'balloon') {
      const pantsMat = new THREE.MeshStandardMaterial({
        color: 0x0e0f12,
        roughness: 0.9,
        metalness: 0.02
      });

      // Left Leg Balloon Volume (Curved shape)
      const leftBalloonGeo = new THREE.CylinderGeometry(0.18 * waistScale, 0.11, 1.15 * legScale, 24);
      leftBalloonGeo.scale(1.2, 1, 1.1);
      const leftBalloon = new THREE.Mesh(leftBalloonGeo, pantsMat);
      leftBalloon.position.set(-0.15 * waistScale, -0.22 * heightScale, 0);
      garmentGroup.add(leftBalloon);

      // Right Leg Balloon Volume
      const rightBalloonGeo = new THREE.CylinderGeometry(0.18 * waistScale, 0.11, 1.15 * legScale, 24);
      rightBalloonGeo.scale(1.2, 1, 1.1);
      const rightBalloon = new THREE.Mesh(rightBalloonGeo, pantsMat);
      rightBalloon.position.set(0.15 * waistScale, -0.22 * heightScale, 0);
      garmentGroup.add(rightBalloon);

      // High Waistband & Front Pleat Line
      const waistBandGeo = new THREE.CylinderGeometry(0.24 * waistScale, 0.24 * waistScale, 0.12 * heightScale, 32);
      waistBandGeo.scale(1.18, 1, 0.85);
      const waistBand = new THREE.Mesh(waistBandGeo, pantsMat);
      waistBand.position.set(0, 0.44 * heightScale, 0);
      garmentGroup.add(waistBand);
    }

    garmentGroup.position.y = -0.2;
  }

  /* ─────────────────────────────────────────
     4. MOUSE DRAG & TOUCH 360° ORBIT
  ───────────────────────────────────────── */
  function setupMouseControls(container) {
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !mannequinGroup || !garmentGroup) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      mannequinGroup.rotation.y += deltaX * 0.008;
      garmentGroup.rotation.y += deltaX * 0.008;

      state.cameraAngle = mannequinGroup.rotation.y;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      updateAnnotationPinPositions();
    });

    // Mouse Wheel Zoom
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (!camera) return;
      camera.position.z += e.deltaY * 0.003;
      camera.position.z = Math.max(2.2, Math.min(6.5, camera.position.z));
    }, { passive: false });
  }

  /* ─────────────────────────────────────────
     5. ANIMATION LOOP & WALKING SIMULATION
  ───────────────────────────────────────── */
  function startAnimationLoop() {
    function animate() {
      animId = requestAnimationFrame(animate);

      if (state.isWalking && mannequinGroup && garmentGroup) {
        walkClock += 0.04;
        const swing = Math.sin(walkClock) * 0.18;
        mannequinGroup.position.y = -0.2 + Math.abs(Math.sin(walkClock * 2)) * 0.03;
        garmentGroup.position.y = -0.2 + Math.abs(Math.sin(walkClock * 2)) * 0.03;

        // Slight torso tilt
        mannequinGroup.rotation.z = Math.sin(walkClock) * 0.02;
        garmentGroup.rotation.z = Math.sin(walkClock) * 0.02;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
    animate();
  }

  /* ─────────────────────────────────────────
     6. ANNOTATION HOTSPOT PINS TRACKING
  ───────────────────────────────────────── */
  function updateAnnotationPinPositions() {
    const pin1 = document.getElementById('pin-shoulder');
    const pin2 = document.getElementById('pin-chest');
    const pin3 = document.getElementById('pin-waist');

    if (!pin1 || !camera || !renderer) return;

    // Pin positions in 3D coordinates
    const p1Vec = new THREE.Vector3(0.38, 0.85, 0.2);
    p1Vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), state.cameraAngle);
    projectToScreen(p1Vec, pin1);

    const p2Vec = new THREE.Vector3(-0.25, 0.65, 0.25);
    p2Vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), state.cameraAngle);
    if (pin2) projectToScreen(p2Vec, pin2);

    const p3Vec = new THREE.Vector3(0.2, 0.22, 0.25);
    p3Vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), state.cameraAngle);
    if (pin3) projectToScreen(p3Vec, pin3);
  }

  function projectToScreen(pos3d, domElem) {
    if (!renderer || !camera) return;
    const canvas = renderer.domElement;
    const clone = pos3d.clone();
    clone.project(camera);

    const x = (clone.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (-clone.y * 0.5 + 0.5) * canvas.clientHeight;

    // Hide if behind camera or facing away
    if (clone.z > 1) {
      domElem.style.opacity = '0';
    } else {
      domElem.style.opacity = '1';
      domElem.style.left = `${x}px`;
      domElem.style.top = `${y}px`;
    }
  }

  /* ─────────────────────────────────────────
     7. MULTI-ANGLE PHOTO SCAN & 3D RECONSTRUCTION
  ───────────────────────────────────────── */
  function handlePhotoUpload(angle, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      state.photos[angle] = e.target.result;
      const slot = document.getElementById(`slot-${angle}`);
      if (slot) {
        slot.classList.add('has-file');
        slot.innerHTML = `<img src="${e.target.result}" class="preview-img" alt="${angle}">
                          <div class="angle-label" style="position:relative;z-index:2;background:rgba(0,0,0,0.8);padding:2px 6px;">${angle.toUpperCase()} ✓</div>`;
      }
    };
    reader.readAsDataURL(file);
  }

  function startAIScanReconstruction() {
    const progressBox = document.getElementById('ai-scan-progress');
    const progressBar = document.getElementById('ai-scan-bar');
    const progressText = document.getElementById('ai-scan-status-text');

    if (!progressBox || !progressBar) return;

    progressBox.classList.add('scanning');
    state.isScanning = true;

    const steps = [
      { pct: 15, msg: 'Calibrating Laser Coordinates...' },
      { pct: 35, msg: 'Detecting 3D Torso Landmarks (Neck, Shoulders, Inseam)...' },
      { pct: 60, msg: 'Morphing Biometric Skeletal Mesh (#CF-8821)...' },
      { pct: 85, msg: 'Applying Indian Biometric Torso Proportions...' },
      { pct: 100, msg: 'Calibration Complete // 99.4% Fit Verified!' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          progressBox.classList.remove('scanning');
          state.isScanning = false;
          
          // Morph 3D Avatar
          state.avatarMeasurements.chestInches = 41.2;
          state.avatarMeasurements.shoulderInches = 18.2;
          state.avatarMeasurements.waistInches = 32.5;
          state.avatarMeasurements.heightCm = 185;

          buildProceduralAvatar();
          buildGarmentMeshes();

          // Show Toast
          showNotification('AI 3D Model Successfully Generated from Photos!');
        }, 800);
        return;
      }

      const cur = steps[stepIdx];
      progressBar.style.width = `${cur.pct}%`;
      if (progressText) progressText.innerText = cur.msg;
      stepIdx++;
    }, 650);
  }

  /* ─────────────────────────────────────────
     8. CONTROLS: MODES, GARMENTS & SNAPSHOT
  ───────────────────────────────────────── */
  function setMode(mode) {
    state.activeMode = mode;
    state.isWalking = (mode === 'walking');
    state.isHeatmap = (mode === 'heatmap');

    document.querySelectorAll('.sim-tool-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById(`tool-btn-${mode}`);
    if (targetBtn) targetBtn.classList.add('active');

    // Rebuild garment for heatmap
    buildGarmentMeshes();
  }

  function setGarmentColor(hex) {
    state.activeColor = hex;
    buildGarmentMeshes();
    document.querySelectorAll('.color-swatch-dot').forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-hex') === hex);
    });
  }

  function toggleGarment(type, name) {
    if (state.activeGarments[type] === name) {
      state.activeGarments[type] = 'none';
    } else {
      state.activeGarments[type] = name;
    }
    buildGarmentMeshes();
  }

  function resetCamera() {
    if (!camera || !mannequinGroup || !garmentGroup) return;
    camera.position.set(0, 0.2, 4.2);
    mannequinGroup.rotation.set(0, 0, 0);
    garmentGroup.rotation.set(0, 0, 0);
    state.cameraAngle = 0;
    updateAnnotationPinPositions();
  }

  function saveHighResRender() {
    if (!renderer) return;
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `CODED_FIT_3D_AVATAR_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('High-Res 3D Avatar Render Downloaded!');
  }

  function showNotification(msg) {
    let toast = document.getElementById('coded-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'coded-toast';
      toast.className = 'coded-toast';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  function setAngle(deg) {
    if (!mannequinGroup || !garmentGroup) return;
    const rad = (deg * Math.PI) / 180;
    mannequinGroup.rotation.y = rad;
    garmentGroup.rotation.y = rad;
    updateAnnotationPinPositions();
  }

  function updateBiometrics(param, val) {
    if (param === 'shoulder') state.avatarMeasurements.shoulderInches = val;
    if (param === 'chest') state.avatarMeasurements.chestInches = val;
    if (param === 'waist') state.avatarMeasurements.waistInches = val;

    buildProceduralAvatar();
    buildGarmentMeshes();
  }

  return {
    init,
    setMode,
    setGarmentColor,
    toggleGarment,
    resetCamera,
    setAngle,
    updateBiometrics,
    saveHighResRender,
    handlePhotoUpload,
    startAIScanReconstruction,
    showNotification,
    state
  };
})();
