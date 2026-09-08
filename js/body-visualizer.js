/* CODED FIT — AI Body Visualizer engine (honest, production-oriented)
   Pipeline: photo -> on-device MediaPipe Pose landmarks -> quality gates
   -> estimated measurements + confidence -> parametric Three.js avatar -> garment fit.
   No fake accuracy. No secrets in frontend. Photos stay on-device unless user saves. */
const BV = (function () {
'use strict';
const $ = (id) => document.getElementById(id);
const state = {
  img: null, imgEl: null, landmarks: null, quality: null,
  conf: {}, stream: null, spinning: false,
  garment: 'overshirt', color: '#282b30', size: 'M', collar: 'spread',
  skin: '#c68863',
  sculpt: { thigh: 1, armlen: 1, head: 1, calf: 1 }, // visual-only refinements
  three: null, fitId: 'CF-FIT-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
};
const SIZE_CHART = { S: 38, M: 40.5, L: 43, XL: 46 }; // chest inches, garment
const COLORS = ['#282b30', '#111215', '#4a463e', '#e4e2dd', '#1e3a8a', '#7f1d1d', '#0f766e', '#c9a84c'];
const SKINS = [['Porcelain', '#f1c9a5'], ['Wheat', '#d9a066'], ['Honey', '#c68863'], ['Bronze', '#a0663a'], ['Deep', '#5c3a21']];
const GARMENT_LEN = { overshirt: 0.78, shirt: 0.72, tee: 0.66, kurta: 0.92 };

function toast(m) { if (window.CF_showToast) window.CF_showToast(m); else alert(m); }
function setStep(n) { document.querySelectorAll('#stepper .step').forEach(el => { const s = +el.dataset.s; el.classList.toggle('active', s === n); el.classList.toggle('done', s < n); }); }

/* ---------- photo input ---------- */
function init() {
  $('file').addEventListener('change', (e) => loadFile(e.target.files[0]));
  const sr = $('splitRange'); if (sr) sr.addEventListener('input', () => setSplit(+sr.value));
  // Live avatar: measurement ya body-detail badlo → 3D turant update
  ['m-chest', 'm-waist', 'm-shoulder', 'm-hip', 'm-inseam', 'm-neck'].forEach(id => {
    const el = $(id); if (el) el.addEventListener('input', () => { renderConf(); syncSculptUI(); refresh3D(); });
  });
  ['in-height', 'in-weight', 'in-gender', 'in-fit', 'in-shape'].forEach(id => {
    const el = $(id); if (el) el.addEventListener('change', () => refresh3D());
  });
  $('g-colors').innerHTML = COLORS.map((c, i) => `<div class="sw${i === 0 ? ' sel' : ''}" data-c="${c}" style="background:${c}" onclick="BV.color('${c}',this)"></div>`).join('');
  const st = $('skin-tones');
  if (st) st.innerHTML = SKINS.map(([n, h], i) => `<div class="sw${h === state.skin ? ' sel' : ''}" data-c="${h}" title="${n}" style="background:${h}" onclick="BV.skin('${h}',this)"></div>`).join('');
  document.querySelectorAll('#g-chips .chip').forEach(ch => ch.onclick = () => { document.querySelectorAll('#g-chips .chip').forEach(x => x.classList.remove('sel')); ch.classList.add('sel'); state.garment = ch.dataset.g; refresh3D(); });
  document.querySelectorAll('#g-sizes .chip').forEach(ch => ch.onclick = () => { document.querySelectorAll('#g-sizes .chip').forEach(x => x.classList.remove('sel')); ch.classList.add('sel'); state.size = ch.dataset.s; refresh3D(); });
  document.querySelectorAll('#g-collar .chip').forEach(ch => ch.onclick = () => { document.querySelectorAll('#g-collar .chip').forEach(x => x.classList.remove('sel')); ch.classList.add('sel'); state.collar = ch.dataset.c; refresh3D(); });
  loadSaved(); initThree(); setSplit(50);
  renderSculpt();
  console.log('[BV] ready', state.fitId);
}
function loadFile(f) {
  if (!f) return;
  if (!f.type.startsWith('image/')) return toast('Sirf image file (JPG/PNG) upload karo.');
  if (f.size > 12 * 1024 * 1024) return toast('Photo 12MB se chhoti rakho.');
  const rd = new FileReader();
  rd.onload = (e) => setImage(e.target.result);
  rd.readAsDataURL(f);
}
function setImage(src) {
  state.img = src;
  const cv = $('photo-canvas'), ctx = cv.getContext('2d');
  const im = new Image();
  im.onload = () => {
    const maxW = 640, sc = Math.min(1, maxW / im.width);
    cv.width = im.width * sc; cv.height = im.height * sc;
    ctx.drawImage(im, 0, 0, cv.width, cv.height);
    state.imgEl = im; state.landmarks = null;
    qualityGate(ctx, cv.width, cv.height);
    setStep(2);
    // AUTO PIPELINE: upload → landmarks → measurements → 3D avatar (no clicks needed)
    $('landmark-status').textContent = 'Photo loaded. Auto-detect chalu ho raha hai…';
    setTimeout(() => analyze(), 600);
  };
  im.src = src;
}
async function toggleCamera() {
  const v = $('cam');
  if (state.stream) { state.stream.getTracks().forEach(t => t.stop()); state.stream = null; v.style.display = 'none'; $('btn-snap').style.display = 'none'; $('btn-cam').textContent = '🎥 CAMERA ON'; return; }
  try {
    state.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 720 }, audio: false });
    v.srcObject = state.stream; v.style.display = 'block'; v.play();
    $('btn-snap').style.display = 'block'; $('btn-cam').textContent = '⏹ CAMERA OFF';
  } catch (e) { toast('Camera permission nahi mili. Upload se try karo.'); }
}
function snap() {
  const v = $('cam'); if (!v.videoWidth) return toast('Camera ready nahi hai.');
  const cv = $('photo-canvas'); cv.width = v.videoWidth; cv.height = v.videoHeight;
  cv.getContext('2d').drawImage(v, 0, 0);
  setImage(cv.toDataURL('image/jpeg', 0.9));
}
function qualityGate(ctx, w, h) {
  // brightness check
  const d = ctx.getImageData(0, 0, Math.min(w, 160), Math.min(h, 160)).data;
  let sum = 0; for (let i = 0; i < d.length; i += 16) sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
  const bright = sum / (d.length / 16);
  let html = '';
  if (bright < 45) html += `<div class="err">⚠️ Roshni kam hai (${Math.round(bright)}/255). Ujale me dobara lo — nahi to landmarks weak aayenge.</div>`;
  else html += `<div class="ok">✓ Roshni OK (${Math.round(bright)}/255). Ab “Detect Body Landmarks” dabao.</div>`;
  html += `<div class="hint" style="margin-top:8px">Checklist: poora sharir frame me? ek hi vyakti? seedha khade? — agar pair/sir cut hai to peeche hatke dobara lo.</div>`;
  $('quality').innerHTML = html;
  state.quality = { brightness: Math.round(bright) };
}

/* ---------- real landmark detection (MediaPipe, 3-attempt pipeline) ----------
   Attempt 1: original photo · Attempt 2: brightness-normalized (night/dim photos)
   Attempt 3: normalized + center zoom (subject chhota ho tab). Best score wins. */
function preprocessPhoto(mode) {
  return new Promise((resolve) => {
    const src = $('photo-canvas');
    const cv = document.createElement('canvas');
    const im = new Image();
    im.onload = () => {
      try {
        let sx = 0, sy = 0, sw = im.width, sh = im.height;
        if (mode === 'zoom') { sw = im.width * 0.8; sh = im.height * 0.85; sx = (im.width - sw) / 2; sy = (im.height - sh) * 0.55; }
        const scale = Math.min(1, 640 / sw);
        cv.width = Math.round(sw * scale); cv.height = Math.round(sh * scale);
        const ctx = cv.getContext('2d');
        try { ctx.filter = 'brightness(1.55) contrast(1.18) saturate(1.05)'; } catch (e) {}
        ctx.drawImage(im, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
        const out = new Image();
        out.onload = () => resolve(out);
        out.onerror = () => resolve(null);
        out.src = cv.toDataURL('image/jpeg', 0.92);
      } catch (e) { resolve(null); }
    };
    im.onerror = () => resolve(null);
    im.src = $('photo-canvas').toDataURL('image/jpeg', 0.92);
  });
}
function runPoseOnce(image, conf, ms) {
  return new Promise((resolve, reject) => {
    let done = false;
    const finish = (fn, v) => { if (!done) { done = true; try { pose.close && pose.close(); } catch (e) {} fn(v); } };
    const pose = new Pose({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469240/${f}` });
    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: conf, minTrackingConfidence: 0.4 });
    pose.onResults((r) => finish(resolve, (r && r.poseLandmarks) || null));
    pose.send({ image }).catch((e) => finish(reject, e));
    setTimeout(() => finish(reject, new Error('timeout')), ms || 22000);
  });
}
function poseScore(lm) {
  if (!lm || !lm.length) return 0;
  // shoulders+hips must exist, else reject (prevents half-body false positives)
  const core = [11, 12, 23, 24].every(i => (lm[i].visibility || 0) > 0.22);
  if (!core) return 0;
  const parts = [11, 12, 13, 14, 23, 24, 25, 26, 27, 28, 0].map(i => lm[i].visibility || 0);
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}
async function analyze() {
  if (state.analyzing) return;
  if (!$('consent').checked) return toast('Aage badhne ke liye consent tick karo.');
  if (!state.img) return toast('Pehle photo upload ya capture karo.');
  state.analyzing = true;
  const btn = $('btn-detect');
  if (btn) { btn.textContent = '⏳ ANALYZING PHOTO…'; btn.disabled = true; }
  setStep(3);
  const log = [];
  const showLog = () => { $('landmark-status').innerHTML = log.join('<br>'); };
  try {
    if (typeof Pose === 'undefined') throw new Error('cdn-missing');
    const plans = [
      { label: 'Attempt 1/3 · original photo', mode: 'orig', conf: 0.5 },
      { label: 'Attempt 2/3 · roshni boost (night photo fix)', mode: 'boost', conf: 0.35 },
      { label: 'Attempt 3/3 · boost + zoom (door ka subject)', mode: 'zoom', conf: 0.3 },
    ];
    let best = null, bestScore = 0;
    for (const p of plans) {
      log.push('⏳ ' + p.label + '…'); showLog();
      let img = state.imgEl, note = '';
      if (p.mode !== 'orig') { img = await preprocessPhoto(p.mode); note = ' (preprocessed)'; if (!img) { log[log.length - 1] = '✗ ' + p.label + ' — preprocess fail'; showLog(); continue; } }
      try {
        const lm = await runPoseOnce(img, p.conf, 22000);
        const s = poseScore(lm);
        if (s > bestScore) { bestScore = s; best = lm; }
        log[log.length - 1] = (s > 0.3 ? '✓ ' : '○ ') + p.label + `${note} — score ${Math.round(s * 100)}%`;
        showLog();
        if (s >= 0.62) break; // good enough, stop early
      } catch (e) {
        log[log.length - 1] = '○ ' + p.label + ' — ' + (e.message === 'timeout' ? 'time lag gaya' : 'koi pose nahi mila');
        showLog();
      }
    }
    if (!best || bestScore < 0.3) throw new Error('no-person');
    state.landmarks = best;
    drawPose(best); estimateFromLandmarks(best);
  } catch (e) {
    console.warn('[BV] pose failed', e);
    const dark = state.quality && state.quality.brightness < 60;
    $('landmark-status').innerHTML = `⚠️ 3 attempts ke baad bhi clear full-body pose nahi mila, isliye <b>manual estimate</b> se 3D bana diya hai.`
      + (e.message === 'cdn-missing' ? `<br>• Pose model load nahi hua — internet check karo (CDN block hai to manual hi chalega).` : ``)
      + (dark ? `<br>• Photo bahut <b>dark</b> hai — ujale me ya flash on karke dobara lo.` : ``)
      + `<br>• <b>2–3 meter door</b> se poora sharir (sir se pair tak) frame me lo, haath thode khule, background simple rakho.`
      + `<br>• Measurements neeche edit kar sakte ho — avatar turant update hoga. Koi fake landmarks nahi dikhayenge.`;
    manualMode(true);
  } finally {
    state.analyzing = false;
    if (btn) { btn.textContent = '⟳ RE-DETECT LANDMARKS'; btn.disabled = false; }
  }
}
function drawPose(lm) {
  const src = $('photo-canvas');
  const cv = $('pose-canvas'); cv.width = src.width; cv.height = src.height;
  const ctx = cv.getContext('2d');
  ctx.drawImage(src, 0, 0, cv.width, cv.height);
  const P = (i) => ({ x: lm[i].x * cv.width, y: lm[i].y * cv.height });
  const bones = [[11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28], [27, 29], [28, 30]];
  ctx.lineWidth = 3; ctx.strokeStyle = '#e10600';
  bones.forEach(([a, b]) => { if (lm[a].visibility > 0.4 && lm[b].visibility > 0.4) { ctx.beginPath(); ctx.moveTo(P(a).x, P(a).y); ctx.lineTo(P(b).x, P(b).y); ctx.stroke(); } });
  lm.forEach((p, i) => { if (p.visibility > 0.5) { ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(p.x * cv.width, p.y * cv.height, 3.5, 0, 7); ctx.fill(); } });
  const vis = [11, 12, 23, 24, 25, 26, 27, 28].map(i => lm[i].visibility || 0);
  const avg = vis.reduce((a, b) => a + b, 0) / vis.length;
  const feet = (lm[27].visibility > 0.4 && lm[28].visibility > 0.4);
  const head = (lm[0].visibility > 0.3);
  // subject kitna bada hai frame me? (nose→ankle span)
  let sizeWarn = '';
  try {
    const span = Math.max(lm[27].y, lm[28].y) - lm[0].y;
    state.quality = Object.assign(state.quality || {}, { torsoVis: avg, feet, head, frameSpan: +span.toFixed(2) });
    if (span < 0.55) sizeWarn = ' · ⚠️ tum frame me <b>chhote</b> dikh rahe ho — 2-3m door se full-body dobara lo to accuracy badhegi';
  } catch (e) { state.quality = Object.assign(state.quality || {}, { torsoVis: avg, feet, head }); }
  $('landmark-status').innerHTML = `✓ <b>${lm.length} landmarks</b> mile · torso visibility <b>${Math.round(avg * 100)}%</b> · sir ${head ? '✓' : '✗'} · pair ${feet ? '✓' : '✗ (full-body ke liye peeche hato)'}${sizeWarn}`;
}
function dist(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return Math.hypot(dx, dy); }
function estimateFromLandmarks(lm) {
  const H = parseFloat($('in-height').value) || 172, W = parseFloat($('in-weight').value) || 70;
  // scale: ankle-to-shoulder pixel span ~ 0.78 * height (anthropometric approx)
  const shW = dist(lm[11], lm[12]);
  const torso = dist({ x: (lm[11].x + lm[12].x) / 2, y: (lm[11].y + lm[12].y) / 2 }, { x: (lm[23].x + lm[24].x) / 2, y: (lm[23].y + lm[24].y) / 2 });
  const legPx = (dist(lm[23], lm[25]) + dist(lm[24], lm[26])) / 2 + (dist(lm[25], lm[27]) + dist(lm[26], lm[28])) / 2;
  const bodyPx = torso + legPx + dist(lm[0], lm[11]) * 0.6 || 1;
  const px2cm = (H * 0.96) / bodyPx; // visible-span correction
  const shoulderCm = shW * px2cm * 1.18; // front-width -> arc approx
  const shoulderIn = shoulderCm / 2.54;
  const bmi = W / Math.pow(H / 100, 2);
  let chest = shoulderIn * 2.18 + (bmi - 22) * 0.55;
  const gender = $('in-gender').value;
  let waist = chest * (gender === 'women' ? 0.74 : 0.82);
  let hip = chest * (gender === 'women' ? 1.02 : 0.94);
  let inseam = (legPx * px2cm / 2.54) * 0.92;
  let neck = chest * 0.38;
  chest = clamp(chest, 30, 56); waist = clamp(waist, 24, 52); hip = clamp(hip, 30, 56); inseam = clamp(inseam, 26, 36); neck = clamp(neck, 13, 19);
  const vis = [11, 12, 23, 24, 25, 26].map(i => lm[i].visibility || 0).reduce((a, b) => a + b, 0) / 6;
  const feetBonus = (lm[27].visibility > 0.5 && lm[28].visibility > 0.5) ? 8 : -10;
  const base = Math.round(clamp(vis * 100 + feetBonus, 45, 94));
  // AUTO SHAPE: shoulder-vs-hip pixel ratio se (agar user ne Auto rakha hai)
  try {
    if ($('in-shape').value === 'auto') {
      const hipW = dist(lm[23], lm[24]) || 1;
      const ratio = shW / hipW, gender = $('in-gender').value;
      let shape = 'rectangle';
      if (gender === 'women') shape = ratio < 0.92 ? 'pear' : ratio > 1.08 ? 'inverted_triangle' : (waist < chest * 0.76 ? 'hourglass' : 'rectangle');
      else shape = ratio > 1.12 ? 'athletic' : ratio < 0.92 ? 'pear' : 'rectangle';
      if ((W / Math.pow(H / 100, 2)) > 30) shape = 'plus';
      $('in-shape').value = shape;
      $('landmark-status').innerHTML += `<br>▸ Body shape auto-detect: <b>${shape.replace(/_/g, ' ')}</b> (change kar sakte ho)`;
    }
  } catch (e) {}
  setMeasures({ chest, waist, shoulder: clamp(shoulderIn, 14, 24), hip, inseam, neck }, { chest: base, waist: base - 3, shoulder: Math.min(96, base + 4), hip: base - 5, inseam: base - 6, neck: 60 });
  setStep(4);
  toast('3D avatar taiyaar — tumhari photo wale proportions par. Neeche kapde try karo.');
  buildAvatar('photo');
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function setMeasures(m, c) {
  $('m-chest').value = m.chest.toFixed(1); $('m-waist').value = m.waist.toFixed(1);
  $('m-shoulder').value = m.shoulder.toFixed(1); $('m-hip').value = m.hip.toFixed(1);
  $('m-inseam').value = m.inseam.toFixed(1); $('m-neck').value = m.neck.toFixed(1);
  state.conf = c || { chest: 62, waist: 60, shoulder: 66, hip: 58, inseam: 57, neck: 55 };
  renderConf(); syncSculptUI(); drawDrape();
}
function renderConf() {
  const c = state.conf;
  $('conf-box').innerHTML = ['chest', 'shoulder', 'waist', 'hip', 'inseam', 'neck'].map(k =>
    `<div>${k.toUpperCase()} CONF<b>${c[k] || 60}%</b></div>`).join('');
}
function manualMode(silent) {
  const H = parseFloat($('in-height').value) || 172, W = parseFloat($('in-weight').value) || 70;
  const bmi = W / Math.pow(H / 100, 2);
  // BMI→chest curve calibrated to avg adult range (BMI 22 ≈ 37", BMI 24 ≈ 41")
  const chest = clamp(2.1 * bmi - 9.5, 32, 54);
  setMeasures({ chest, waist: chest * 0.82, shoulder: 15 + chest * 0.08, hip: chest * 0.95, inseam: H * 0.175 / 2.54 * 2.2, neck: 13.5 + (chest - 36) * 0.12 },
    { chest: 60, waist: 58, shoulder: 64, hip: 57, inseam: 55, neck: 52 });
  if (!silent) { $('landmark-status').textContent = 'Manual mode: height/weight chart se estimate. Photo optional hai.'; setStep(4); }
  // Manual me bhi 3D turant banao — user ko wait na karna pade
  setStep(5);
  refresh3D();
  $('hud-left').textContent = '● AVATAR READY — ' + state.fitId + ' (MANUAL ESTIMATE)';}

/* ---------- 3D-only try-on (2D overlay hata diya gaya) ---------- */
function drawDrape() { /* no-op: ab sirf parametric 3D avatar par kapde check hote hain */ }
function setSplit(v) {
  const w = $('afterWrap'); if (w) w.style.clipPath = `polygon(${v}% 0, 100% 0, 100% 100%, ${v}% 100%)`;
}

/* ---------- parametric 3D avatar ---------- */
function M() { return { chest: +$('m-chest').value || 40, waist: +$('m-waist').value || 32, shoulder: +$('m-shoulder').value || 18, hip: +$('m-hip').value || 38, inseam: +$('m-inseam').value || 30, height: +$('in-height').value || 172 }; }
/* Visual morph: body-shape preset avatar silhouette ko refine karta hai (fit math M() par hi hota hai) */
function shapeMorph() {
  const s = ($('in-shape') && $('in-shape').value) || 'auto';
  const table = {
    athletic: { c: 1.04, w: 0.96, h: 0.98 }, rectangle: { c: 1.0, w: 1.0, h: 1.0 },
    pear: { c: 0.97, w: 1.0, h: 1.06 }, inverted_triangle: { c: 1.05, w: 0.98, h: 0.96 },
    hourglass: { c: 1.02, w: 0.93, h: 1.05 }, plus: { c: 1.08, w: 1.1, h: 1.08 },
    auto: { c: 1.0, w: 1.0, h: 1.0 },
  };
  return table[s] || table.auto;
}
function VM() { const m = M(), k = shapeMorph(), s = state.sculpt; return { chest: m.chest * k.c, waist: m.waist * k.w, shoulder: m.shoulder, hip: m.hip * k.h, inseam: m.inseam, height: m.height, thigh: s.thigh, armlen: s.armlen, head: s.head, calf: s.calf }; }

/* ---------- Meta-style sculpt sliders (2-way bound) ---------- */
const SCULPT_DEFS = [
  { id: 'height', label: 'Height', min: 140, max: 200, step: 1, unit: 'cm', bind: 'in-height', live: true },
  { id: 'chest', label: 'Chest Size', min: 30, max: 56, step: 0.5, unit: '"', bind: 'm-chest', live: true },
  { id: 'waist', label: 'Waist Size', min: 24, max: 52, step: 0.5, unit: '"', bind: 'm-waist', live: true },
  { id: 'hip', label: 'Hip Size', min: 30, max: 56, step: 0.5, unit: '"', bind: 'm-hip', live: true },
  { id: 'shoulder', label: 'Shoulder Size', min: 14, max: 24, step: 0.1, unit: '"', bind: 'm-shoulder', live: true },
  { id: 'neck', label: 'Neck Size', min: 12, max: 19, step: 0.1, unit: '"', bind: 'm-neck', live: true },
  { id: 'inseam', label: 'Inseam / Leg', min: 24, max: 38, step: 0.5, unit: '"', bind: 'm-inseam', live: true },
  { id: 'thigh', label: 'Thigh Size', min: 0.8, max: 1.3, step: 0.01, unit: '×', sculpt: 'thigh', live: false },
  { id: 'calf', label: 'Shin Size', min: 0.8, max: 1.3, step: 0.01, unit: '×', sculpt: 'calf', live: false },
  { id: 'armlen', label: 'Arm Length', min: 0.85, max: 1.15, step: 0.01, unit: '×', sculpt: 'armlen', live: false },
  { id: 'head', label: 'Head Size', min: 0.85, max: 1.2, step: 0.01, unit: '×', sculpt: 'head', live: false },
];
function sculptVal(d) {
  if (d.bind) { const el = $(d.bind); return el ? parseFloat(el.value) || d.min : d.min; }
  return state.sculpt[d.sculpt];
}
function renderSculpt() {
  const box = $('sculpt-sliders'); if (!box) return;
  box.innerHTML = SCULPT_DEFS.map(d => `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:10px;color:${d.live ? '#b80500' : '#666'};font-weight:800;">
        <span>${d.live ? '● ' : '○ '}${d.label.toUpperCase()}</span><span id="scv-${d.id}"></span>
      </div>
      <input type="range" id="sc-${d.id}" min="${d.min}" max="${d.max}" step="${d.step}" style="width:100%;accent-color:#e10600;">
    </div>`).join('');
  SCULPT_DEFS.forEach(d => {
    const r = $('sc-' + d.id); if (!r) return;
    r.value = sculptVal(d);
    r.addEventListener('input', () => {
      const v = parseFloat(r.value);
      if (d.bind) { const el = $(d.bind); if (el) el.value = v; }
      else state.sculpt[d.sculpt] = v;
      syncSculptUI(); renderConf(); refresh3D();
    });
  });
  syncSculptUI();
}
function syncSculptUI() {
  SCULPT_DEFS.forEach(d => {
    const r = $('sc-' + d.id), t = $('scv-' + d.id);
    const v = sculptVal(d);
    if (r && document.activeElement !== r) r.value = v;
    if (t) t.textContent = (d.unit === '×' ? '×' + Number(v).toFixed(2) : Number(v).toFixed(d.step < 1 ? 1 : 0) + d.unit);
  });
}
function skyTexture() {
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256;
  const ctx = cv.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0.0, '#6f9ec7'); g.addColorStop(0.52, '#b9cddb');
  g.addColorStop(0.62, '#ddd8cb'); g.addColorStop(1.0, '#cfc3ab');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 256);
  const tx = new THREE.CanvasTexture(cv); return tx;
}
function initThree() {
  const el = $('avatar3d'); if (!el || typeof THREE === 'undefined') return;
  const W = el.clientWidth || 600, H = el.clientHeight || 520;
  const scene = new THREE.Scene();
  scene.background = skyTexture();
  scene.fog = new THREE.Fog(0xd8d2c2, 9, 22);
  // Studio floor: soft shadow catcher + faint grid
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(9, 48),
    new THREE.ShadowMaterial({ opacity: 0.32 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1.34; ground.receiveShadow = true;
  scene.add(ground);
  const slab = new THREE.Mesh(
    new THREE.CircleGeometry(9, 48),
    new THREE.MeshStandardMaterial({ color: 0xd3ccbc, roughness: 0.95, metalness: 0 }));
  slab.rotation.x = -Math.PI / 2; slab.position.y = -1.345; slab.receiveShadow = true;
  scene.add(slab);
  const grid = new THREE.GridHelper(18, 36, 0x8a8f99, 0xb9b2a2);
  grid.position.y = -1.33; grid.material.transparent = true; grid.material.opacity = 0.35;
  scene.add(grid);
  const cam = new THREE.PerspectiveCamera(38, W / H, 0.1, 100); cam.position.set(0, 0.35, 4.6);
  const ren = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  ren.setSize(W, H); ren.setPixelRatio(Math.min(devicePixelRatio, 2));
  ren.shadowMap.enabled = true; ren.shadowMap.type = THREE.PCFSoftShadowMap;
  try { ren.outputEncoding = THREE.sRGBEncoding; ren.toneMapping = THREE.ACESFilmicToneMapping; ren.toneMappingExposure = 1.05; } catch (e) {}
  el.innerHTML = ''; el.appendChild(ren.domElement);
  // Game-studio light rig: sky bounce + warm sun + red rim
  scene.add(new THREE.HemisphereLight(0xcfe0f4, 0x8a7a5f, 0.75));
  const sun = new THREE.DirectionalLight(0xfff2df, 1.35);
  sun.position.set(3.5, 6, 4); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -3; sun.shadow.camera.right = 3;
  sun.shadow.camera.top = 4; sun.shadow.camera.bottom = -2;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xe10600, 0.55); rim.position.set(-4, 2.5, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.35); fill.position.set(-2, 0.5, 4); scene.add(fill);
  const body = new THREE.Group(), gar = new THREE.Group();
  scene.add(body); scene.add(gar);
  state.three = { scene, cam, ren, body, gar, angle: 0, t: 0, refs: {} };
  // drag rotate + zoom
  let drag = false, px = 0;
  ren.domElement.addEventListener('pointerdown', (e) => { drag = true; px = e.clientX; });
  window.addEventListener('pointerup', () => drag = false);
  window.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - px; px = e.clientX; body.rotation.y += dx * 0.009; gar.rotation.y += dx * 0.009; });
  ren.domElement.addEventListener('wheel', (e) => { e.preventDefault(); cam.position.z = clamp(cam.position.z + e.deltaY * 0.003, 2.4, 7); }, { passive: false });
  // Render loop + idle life: breathing + gentle sway (game feel)
  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, ((now || performance.now()) - last) / 1000); last = now || performance.now();
    if (state.three) {
      state.three.t += dt;
      const t = state.three.t, R = state.three.refs;
      const br = Math.sin(t * 1.5);
      if (R.torso) { R.torso.scale.x = R.torso.userData.bx * (1 + 0.007 * br); R.torso.scale.z = R.torso.userData.bz * (1 + 0.009 * br); }
      if (R.head) R.head.position.y = R.head.userData.by + 0.005 * Math.sin(t * 1.5 + 0.4);
      if (R.whole) R.whole.position.y = R.whole.userData.by + 0.008 * Math.sin(t * 1.5);
      if (state.spinning && state.three) { body.rotation.y += dt * 0.9; gar.rotation.y += dt * 0.9; }
      ren.render(scene, cam);
    }
  })();
  window.addEventListener('resize', () => { const w = el.clientWidth, h = el.clientHeight; cam.aspect = w / h; cam.updateProjectionMatrix(); ren.setSize(w, h); });
  refresh3D();
}
function refresh3D() { if (!state.three) return; buildBody(); buildGarment(); fitZones(); drawDrape(); }
function buildAvatar(src) { setStep(5); refresh3D(); $('hud-left').textContent = '● AVATAR READY — ' + state.fitId + (src === 'photo' ? ' · PHOTO-MATCHED' : src === 'manual' ? ' · MANUAL ESTIMATE' : ''); }
function buildBody() {
  const { body, refs } = state.three, m = VM();
  while (body.children.length) body.remove(body.children[0]);
  const gender = ($('in-gender') && $('in-gender').value) || 'men';
  const hs = m.height / 172;
  const K = 0.0377; // inch → scene units (40" chest ≈ 0.24 half-width)
  const R = (circIn) => Math.max(0.02, (circIn / (2 * Math.PI)) * K * 0.94);
  const rChest = R(m.chest), rWaist = R(m.waist), rHip = R(m.hip);
  const rSh = (m.shoulder / 2) * K * 0.96; // shoulder half-width
  const skinMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(state.skin || '#c68863'), roughness: 0.42, metalness: 0.02 });
  const sh = (mesh) => { mesh.castShadow = true; mesh.receiveShadow = false; return mesh; };
  const add = (geo, x, y, z = 0, mat) => { const ms = sh(new THREE.Mesh(geo, mat || skinMat)); ms.position.set(x, y, z); body.add(ms); return ms; };
  // Smooth parametric torso (lathe): hip → waist → chest → shoulder → neck
  const T = 1.02 * hs;
  const prof = [
    [0.00, rHip * 0.94], [0.10, rHip], [0.30, rWaist],
    [0.52, rChest * (gender === 'women' ? 1.05 : 1.0)], [0.68, rChest * 0.96],
    [0.84, rSh * 0.9], [0.95, rSh * 0.6], [1.00, 0.07],
  ].map(([y, r]) => new THREE.Vector2(Math.max(0.012, r), y * T));
  const hipY = -0.28 * hs;
  const torso = sh(new THREE.Mesh(new THREE.LatheGeometry(prof, 32), skinMat));
  torso.scale.z = 0.74; // elliptical cross-section: depth < width
  torso.position.y = hipY;
  torso.userData.bx = 1; torso.userData.bz = 0.74;
  body.add(torso);
  const shY = hipY + T; // shoulder line
  // Buttocks (subtle, both genders read human; kept inside shorts shell)
  const buttR = rHip * 0.45;
  [-1, 1].forEach(s => {
    const b = sh(new THREE.Mesh(new THREE.SphereGeometry(buttR, 18, 14), skinMat));
    b.position.set(s * rHip * 0.42, hipY + T * 0.10, -rHip * 0.55);
    b.scale.set(1, 1.12, 0.7); body.add(b);
  });
  // Bust (women)
  if (gender === 'women') {
    [-1, 1].forEach(s => {
      const b = sh(new THREE.Mesh(new THREE.SphereGeometry(rChest * 0.42, 18, 14), skinMat));
      b.position.set(s * rChest * 0.42, hipY + T * 0.56, rChest * 0.62);
      b.scale.set(1, 1.1, 0.9); body.add(b);
    });
  } else {
    // Pectoral hint (men): flattened wide form
    const pec = sh(new THREE.Mesh(new THREE.SphereGeometry(rChest * 0.62, 20, 14), skinMat));
    pec.position.set(0, hipY + T * 0.58, rChest * 0.42);
    pec.scale.set(1.35, 0.72, 0.62); body.add(pec);
  }
  // Neck + head + hair cap
  add(new THREE.CylinderGeometry(0.068, 0.08, 0.16, 16), 0, shY + 0.05);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.155 * m.head, 24, 18), skinMat);
  head.castShadow = true;
  head.scale.set(0.92, 1.18, 0.98); head.position.set(0, shY + 0.28 * m.head, 0.01); body.add(head);
  const hair = sh(new THREE.Mesh(
    new THREE.SphereGeometry(0.158 * m.head, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45),
    new THREE.MeshStandardMaterial({ color: 0x1a1210, roughness: 0.9 })));
  hair.scale.set(0.94, 1.0, 1.0); hair.position.set(0, shY + 0.30 * m.head, -0.008); body.add(hair);
  // Arms: deltoid + tapered upper + elbow + tapered forearm + hand with fingers hint
  const armL = m.armlen || 1;
  [-1, 1].forEach(s => {
    const shX = rSh * 0.95;
    const delt = sh(new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), skinMat));
    delt.position.set(s * shX, shY - 0.03, 0); delt.scale.set(1, 1.15, 1); body.add(delt);
    const ua = add(new THREE.CylinderGeometry(0.062, 0.05, 0.36 * hs * armL, 14), s * (shX + 0.035), shY - 0.26 * armL); ua.rotation.z = s * -0.09;
    add(new THREE.SphereGeometry(0.048, 12, 10), s * (shX + 0.066), shY - 0.44 * armL);
    const fa = add(new THREE.CylinderGeometry(0.048, 0.037, 0.32 * hs * armL, 14), s * (shX + 0.078), shY - 0.60 * armL); fa.rotation.z = s * -0.05;
    const hand = sh(new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), skinMat));
    hand.scale.set(0.75, 1.3, 0.85); hand.position.set(s * (shX + 0.09), shY - 0.80 * armL, 0.012); body.add(hand);
  });
  // Legs: full thigh + knee + tapered calf + ankle + shaped foot
  const legTop = hipY + 0.06, legK = (m.thigh || 1) * (0.9 + m.hip / 380), inseamK = (m.inseam / 30) * hs;
  const calfK = m.calf || 1;
  [-1, 1].forEach(s => {
    const lx = rHip * 0.52;
    add(new THREE.CylinderGeometry(0.108 * legK, 0.078 * legK, 0.5 * inseamK + 0.12, 18), s * lx, legTop - 0.29);
    add(new THREE.SphereGeometry(0.068 * legK, 14, 12), s * lx, legTop - 0.55, 0.01);
    add(new THREE.CylinderGeometry(0.07 * calfK, 0.05 * calfK, 0.48 * inseamK + 0.1, 18), s * lx, legTop - 0.80);
    const foot = sh(new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.055, 0.26), skinMat));
    foot.position.set(s * lx, legTop - 1.06, 0.07); body.add(foot);
    const toe = sh(new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 10), skinMat));
    toe.scale.set(0.95, 0.6, 1.1); toe.position.set(s * lx, legTop - 1.06, 0.19); body.add(toe);
  });
  body.position.y = 0.12;
  // refs for idle motion + profile for fitted garments
  refs.whole = body; body.userData.by = 0.12;
  refs.torso = torso; refs.head = head; head.userData.by = head.position.y;
  state.three.profile = {
    hipY, shY, T, rChest, rWaist, rHip, rSh, zScale: 0.74, gender, hs,
    frac: [[0, rHip * 0.94], [0.10, rHip], [0.30, rWaist],
      [0.52, rChest * (gender === 'women' ? 1.05 : 1.0)], [0.68, rChest * 0.96],
      [0.84, rSh * 0.9], [0.95, rSh * 0.6], [1.0, 0.07]],
  };
}
/* Fitted garments grown from the body profile (no boxy shells) */
function darken(hex, f) { const c = new THREE.Color(hex); c.multiplyScalar(f); return c; }
function profR(P, y) {
  const F = P.frac, f = (y - P.hipY) / P.T;
  if (f <= F[0][0]) return F[0][1];
  for (let i = 1; i < F.length; i++) {
    if (f <= F[i][0]) {
      const t = (f - F[i - 1][0]) / Math.max(1e-6, F[i][0] - F[i - 1][0]);
      return F[i - 1][1] + (F[i][1] - F[i - 1][1]) * t;
    }
  }
  return F[F.length - 1][1];
}
function shellMesh(stations, offset, mat, zScale) {
  const pts = stations.map(([y, r]) => new THREE.Vector2(Math.max(0.015, r + offset), y));
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(pts, 30), mat);
  mesh.scale.z = zScale; mesh.castShadow = true; mesh.receiveShadow = false;
  return mesh;
}
function buildGarment() {
  const { gar, profile: P } = state.three, m = VM();
  while (gar.children.length) gar.remove(gar.children[0]);
  if (!P) return;
  const ease = state.size === 'Bespoke' ? 1.0 : (SIZE_CHART[state.size] || 40.5) / m.chest;
  const typeEase = { overshirt: 0.055, shirt: 0.035, tee: 0.022, kurta: 0.04 }[state.garment] || 0.035;
  const sizeK = state.size === 'XL' ? 1.12 : state.size === 'S' ? 0.9 : state.size === 'L' ? 1.06 : 1.0;
  const off = Math.max(0.012, typeEase * Math.sqrt(ease) * sizeK);
  const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(state.color), roughness: 0.68, metalness: 0.02, side: THREE.DoubleSide });
  const { hipY, shY, T } = P;
  // ── TOP: hem → shoulder, hugging the torso ──
  const hemFrac = { overshirt: 0.18, shirt: 0.24, tee: 0.38, kurta: 0.06 }[state.garment];
  const hemY = hipY + T * (hemFrac == null ? 0.24 : hemFrac), topY = shY + 0.02;
  const stations = [];
  for (let y = hemY; y <= topY + 0.001; y += 0.055) {
    let extra = 0;
    const f = (y - hipY) / T;
    if (f > 0.44 && f < 0.66) extra = 0.03; // chest ease over bust/pecs
    stations.push([y, profR(P, y) + extra]);
  }
  gar.add(shellMesh(stations, off, mat, 0.78));
  // hem band
  const hem = new THREE.Mesh(new THREE.TorusGeometry(profR(P, hemY) + off, 0.012, 8, 30), mat);
  hem.rotation.x = Math.PI / 2; hem.scale.set(1, 0.78, 1); hem.position.y = hemY; hem.castShadow = true;
  gar.add(hem);
  // sleeves flowing from the shoulder line
  const slLen = ({ overshirt: 0.5, shirt: 0.52, tee: 0.24, kurta: 0.5 })[state.garment] * (m.armlen || 1);
  [-1, 1].forEach(s => {
    const shX = P.rSh * 0.95;
    const sl = new THREE.Mesh(new THREE.CylinderGeometry(0.078 + off * 0.7, 0.066 + off * 0.5, slLen, 16, 1, true), mat);
    sl.castShadow = true;
    sl.position.set(s * (shX + 0.045), shY - 0.05 - slLen / 2 + 0.06, 0);
    sl.rotation.z = s * -0.10;
    gar.add(sl);
  });
  // collar at the neck
  const neckY = shY + 0.11, ss = m.shoulder / 18;
  if (state.collar === 'mandarin' || state.garment === 'kurta') {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.105 * ss + 0.012, 0.115 * ss + 0.012, 0.07, 20, 1, true), mat);
    band.position.set(0, neckY, 0); band.castShadow = true; gar.add(band);
  } else if (state.collar === 'cuban') {
    const c = new THREE.Mesh(new THREE.TorusGeometry(0.125 * ss + 0.012, 0.032, 10, 22, Math.PI), mat);
    c.rotation.x = -0.5; c.position.set(0, neckY, 0.03); c.castShadow = true; gar.add(c);
  } else {
    const c = new THREE.Mesh(new THREE.TorusGeometry(0.115 * ss + 0.012, 0.034, 12, 24, Math.PI * 1.25), mat);
    c.rotation.x = Math.PI / 2; c.position.set(0, neckY, -0.01); c.castShadow = true; gar.add(c);
  }
  // ── BOTTOM: fitted high-waist shorts (reference look), darkened tone ──
  const bMat = new THREE.MeshStandardMaterial({ color: darken(state.color, 0.45), roughness: 0.75, metalness: 0.02, side: THREE.DoubleSide });
  const wTop = hipY + T * 0.30, wBot = hipY - 0.02;
  const bst = [];
  for (let y = wBot; y <= wTop + 0.001; y += 0.05) {
    let extra = 0;
    const f = (y - hipY) / T;
    if (f < 0.22) extra = 0.05; // seat ease over buttocks
    bst.push([y, profR(P, y) + extra]);
  }
  gar.add(shellMesh(bst, 0.02, bMat, 0.78));
  const wb = new THREE.Mesh(new THREE.TorusGeometry(profR(P, wTop) + 0.02, 0.022, 10, 30), bMat);
  wb.rotation.x = Math.PI / 2; wb.scale.set(1, 0.78, 1); wb.position.y = wTop; wb.castShadow = true;
  gar.add(wb);
  const btn = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.35, metalness: 0.3 }));
  btn.position.set(0, wTop - 0.01, (profR(P, wTop) + 0.02) * 0.78 + 0.008); gar.add(btn);
  [-1, 1].forEach(s => {
    const lx = P.rHip * 0.52, thK = m.thigh || 1;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.115 * thK + 0.02, 0.10 * thK + 0.015, 0.24, 16, 1, true), bMat);
    leg.castShadow = true;
    leg.position.set(s * lx, wBot - 0.10, 0); gar.add(leg);
  });
  gar.position.y = 0.12;
  $('hud-size').textContent = 'SIZE ' + state.size + ' · ' + state.garment.toUpperCase();
}
function fitZones() {
  const m = M();
  const gChest = state.size === 'Bespoke' ? m.chest : (SIZE_CHART[state.size] || 40.5);
  const zones = [
    ['CHEST', gChest - m.chest], ['SHOULDER', (gChest / 2.25) - m.shoulder], ['WAIST', (gChest * 0.92) - (m.waist + 6)],
  ];
  $('fit-zones').innerHTML = '<div class="tag">Fit analysis (garment − body, inch)</div>' + zones.map(([n, d]) => {
    const a = Math.abs(d); const cls = a <= 2 ? 'g' : a <= 3.5 ? 'y' : 'r';
    const txt = a <= 2 ? 'GOOD FIT' : (d > 0 ? 'LOOSE' : 'TIGHT');
    return `<div class="hint" style="margin-top:6px"><span class="dot ${cls}"></span><b>${n}</b> ${d >= 0 ? '+' : ''}${d.toFixed(1)}" — ${txt}</div>`;
  }).join('') + `<div class="hint" style="margin-top:6px">Bespoke = aapke exact estimate par cut. Ye size-chart math hai, marketing score nahi.</div>`;
}
function view(v, el) {
  document.querySelectorAll('.camrow button').forEach(b => b.classList.remove('active')); if (el) el.classList.add('active');
  if (!state.three) return;
  const a = v === 'front' ? 0 : v === 'side' ? Math.PI / 2 : Math.PI;
  state.three.body.rotation.y = a; state.three.gar.rotation.y = a;
}
function toggleSpin(el) { state.spinning = !state.spinning; if (el) el.classList.toggle('active', state.spinning); }
function color(c, el) { document.querySelectorAll('#g-colors .sw').forEach(x => x.classList.remove('sel')); if (el) el.classList.add('sel'); state.color = c; refresh3D(); }
function skin(h, el) { document.querySelectorAll('#skin-tones .sw').forEach(x => x.classList.remove('sel')); if (el) el.classList.add('sel'); state.skin = h; refresh3D(); }
function downloadAvatar() {
  if (!state.three) return; const u = state.three.ren.domElement.toDataURL('image/png');
  const a = document.createElement('a'); a.href = u; a.download = state.fitId + '-avatar.png'; a.click();
}

/* ---------- Hinglish fit assistant (rule-based, no fake data) ---------- */
function assistant() {
  const t = ($('ai-in').value || '').toLowerCase(), out = $('ai-out');
  const say = (s) => out.innerHTML = s;
  if (!t) return say('Kuch likho — jaise “mujhe loose fit chahiye”.');
  if (/loose|dheela|relaxed|oversize|oversized/.test(t)) { state.size = state.size === 'S' ? 'M' : state.size === 'M' ? 'L' : 'XL'; syncSize(); refresh3D(); return say(`Samajh gaya — <b>${state.size}</b> par switch kiya (ek step looser). 3D me dekho, pasand na aaye to wapas bolo.`); }
  if (/tight|slim|fitted|fit kar/.test(t)) { state.size = state.size === 'XL' ? 'L' : state.size === 'L' ? 'M' : 'S'; syncSize(); refresh3D(); return say(`OK — <b>${state.size}</b> (ek step slimmer) lagaya. Shoulder/chest zones neeche check karo.`); }
  const col = { black: '#111215', white: '#e4e2dd', navy: '#1e3a8a', blue: '#1e3a8a', green: '#0f766e', olive: '#4a463e', red: '#7f1d1d', gold: '#c9a84c', grey: '#282b30', gray: '#282b30' };
  for (const k in col) if (t.includes(k) || t.includes('kala') && k === 'black') { state.color = col[k]; refresh3D(); return say(`Done — garment <b>${k}</b> kar diya. 3D avatar par turant dikhega.`); }
  if (/mandarin/.test(t)) { state.collar = 'mandarin'; refresh3D(); return say('Mandarin collar lagaya (shirt/kurta par).'); }
  if (/cuban/.test(t)) { state.collar = 'cuban'; refresh3D(); return say('Cuban collar lagaya.'); }
  if (/spread|normal/.test(t)) { state.collar = 'spread'; refresh3D(); return say('Spread collar lagaya.'); }
  if (/peeche|back|pichhe/.test(t)) { view('back'); return say('Back view lagaya — upar 3D me dekho.'); }
  if (/side/.test(t)) { view('side'); return say('Side view lagaya.'); }
  if (/front|samne|aage/.test(t)) { view('front'); return say('Front view lagaya.'); }
  if (/size|fit.*(sahi|good|theek)|kaunsa/.test(t)) { const m = M(); const rec = m.chest < 39 ? 'S' : m.chest < 42 ? 'M' : m.chest < 45 ? 'L' : 'XL'; return say(`Tumhare chest ~${m.chest.toFixed(1)}" ke hisaab se <b>${rec}</b> best rahega (${$('in-fit').value} fit me). Neeche fit zones bhi dekho.`); }
  say('Samajh gaya — try: “loose kar do”, “black kar do”, “mandarin collar”, “back dikhao”, “mere liye kaunsa size sahi hai?”');
}
function syncSize() { document.querySelectorAll('#g-sizes .chip').forEach(x => x.classList.toggle('sel', x.dataset.s === state.size)); }

/* ---------- persistence + privacy ---------- */
function profile() {
  return { fitId: state.fitId, heightCm: +$('in-height').value, weightKg: +$('in-weight').value, gender: $('in-gender').value, preferredFit: $('in-fit').value, chestIn: +$('m-chest').value, waistIn: +$('m-waist').value, shoulderIn: +$('m-shoulder').value, hipIn: +$('m-hip').value, inseamIn: +$('m-inseam').value, neckIn: +$('m-neck').value, confidence: state.conf, source: state.landmarks ? 'camera_scan' : 'manual', updatedAt: new Date().toISOString() };
}
function saveProfile() {
  const p = profile();
  try { localStorage.setItem('CF_FIT_PROFILE_V1', JSON.stringify(p)); } catch (e) {}
  toast('Fit Profile saved on this device (' + state.fitId + ').');
  const token = localStorage.getItem('CF_TOKEN') || localStorage.getItem('CODED_TOKEN');
  if (token) fetch('/api/fit-profile', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(p) }).then(r => r.json()).then(d => toast(d.message || 'Server par bhi save ho gaya.')).catch(() => toast('Device par saved. Server sync login ke baad hoga.'));
  else toast('Device par saved. Login karne par server sync hoga.');
}
function loadSaved() {
  try { const p = JSON.parse(localStorage.getItem('CF_FIT_PROFILE_V1') || 'null'); if (!p) return;
    $('in-height').value = p.heightCm; $('in-weight').value = p.weightKg; $('in-gender').value = p.gender || 'men';
    setMeasures({ chest: p.chestIn, waist: p.waistIn, shoulder: p.shoulderIn, hip: p.hipIn, inseam: p.inseamIn, neck: p.neckIn }, p.confidence || {});
    state.fitId = p.fitId || state.fitId;
  } catch (e) {}
}
function wipe() {
  if (!confirm('Photo + measurements + avatar delete karna hai?')) return;
  ['CF_FIT_PROFILE_V1', 'CF_BODY_PHOTO'].forEach(k => localStorage.removeItem(k));
  state.img = null; state.landmarks = null;
  ['photo-canvas', 'pose-canvas'].forEach(id => { const c = $(id); if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height); });
  ['before-img', 'after-img'].forEach(id => { const el = $(id); if (el) el.src = ''; });
  $('quality').innerHTML = ''; $('conf-box').innerHTML = '';
  toast('Tumhara body data is device se delete ho gaya.');
}
function addToBag() {
  const m = M();
  const item = { id: 'BV-' + state.garment + '-' + state.size, name: `${state.garment.toUpperCase()} · ${state.size} · ${state.fitId}`, price: 2499, size: state.size === 'Bespoke' ? `Bespoke C${m.chest.toFixed(0)}` : state.size, color: state.color, qty: 1, img: state.img || undefined };
  try {
    const cart = JSON.parse(localStorage.getItem('NOVA_CART') || '[]'); cart.push(item);
    localStorage.setItem('NOVA_CART', JSON.stringify(cart));
  } catch (e) {}
  toast('Bag me add ho gaya — ' + item.name);
  if (window.CF_openCartDrawer) window.CF_openCartDrawer();
}
/* ---------- Jarvis voice commands (global orb dispatches here) ---------- */
const JARVIS_HEX = { black: '#111215', white: '#e4e2dd', navy: '#1e3a8a', green: '#0f766e', olive: '#4a463e', red: '#7f1d1d', gold: '#c9a84c', grey: '#282b30' };
const SIZE_ORDER = ['S', 'M', 'L', 'XL'];
window.addEventListener('jarvis-cmd', (e) => {
  const c = (e && e.detail) || {};
  try {
    if (c.action === 'color' && JARVIS_HEX[c.value]) {
      const hex = JARVIS_HEX[c.value]; state.color = hex;
      document.querySelectorAll('#g-colors .sw').forEach(x => x.classList.toggle('sel', x.dataset.c === hex));
      refresh3D(); toast('Jarvis: color ' + c.value);
    } else if (c.action === 'collar' && /mandarin|cuban|spread/.test(c.value || '')) {
      state.collar = c.value;
      document.querySelectorAll('#g-collar .chip').forEach(x => x.classList.toggle('sel', x.dataset.c === c.value));
      refresh3D(); toast('Jarvis: collar ' + c.value);
    } else if (c.action === 'looser' || c.action === 'slimmer') {
      const i = SIZE_ORDER.indexOf(state.size);
      const n = c.action === 'looser' ? Math.min(SIZE_ORDER.length - 1, (i < 0 ? 1 : i) + 1) : Math.max(0, (i < 0 ? 1 : i) - 1);
      state.size = SIZE_ORDER[n]; syncSize(); refresh3D(); toast('Jarvis: size ' + state.size);
    } else if (c.action === 'view' && /front|side|back/.test(c.value || '')) {
      view(c.value, null); toast('Jarvis: ' + c.value + ' view');
    } else if (c.action === 'spin') {
      if (!state.spinning) toggleSpin(null); toast('Jarvis: auto-rotate on');
    }
  } catch (err) { console.warn('[BV] jarvis cmd failed', err); }
});
document.addEventListener('DOMContentLoaded', init);
return { init, toggleCamera, snap, analyze, manualMode, buildAvatar, view, toggleSpin, color, skin, assistant, saveProfile, wipe, addToBag, downloadAvatar };
})();
