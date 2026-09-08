/**
 * CODED FIT — JARVIS Voice Assistant
 * Voice-first fashion concierge: Hindi + English + Hinglish.
 * mic → speech-to-text → intent → page action OR backend AI chat → spoken reply.
 * Honest: browser STT needs mic permission + network; nothing is recorded server-side
 * except the chat text you send to /api/ai/chat. Voice Jarvis is beta.
 */
const CODED_FIT_AI = (function () {
  'use strict';

  const state = {
    isOpen: false,
    isListening: false,
    jarvisMode: false,      // continuous conversation loop
    voiceOut: true,         // speak replies aloud
    lang: 'en-IN',          // 'en-IN' | 'hi-IN'
    recognition: null,
    synth: ('speechSynthesis' in window) ? window.speechSynthesis : null,
    history: [],
    pending: false,
  };

  /* ── CSS (orb + panel) ── */
  function injectCSS() {
    if (document.getElementById('jarvis-css')) return;
    const s = document.createElement('style');
    s.id = 'jarvis-css';
    s.textContent = `
      #jarvis-orb{position:fixed;right:22px;bottom:22px;z-index:100002;width:64px;height:64px;border-radius:50%;
        background:radial-gradient(circle at 30% 30%,#2a2d34,#0b0c0f);border:1px solid rgba(225,6,0,.6);color:#fff;
        cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;
        font-family:'JetBrains Mono',monospace;box-shadow:0 10px 32px rgba(0,0,0,.45);transition:transform .18s ease}
      #jarvis-orb:hover{transform:scale(1.06)}
      #jarvis-orb.listening{animation:cfPulseRing 1.4s ease-out infinite;border-color:#e10600}
      #jarvis-orb .orb-core{font-size:20px;line-height:1}
      #jarvis-orb .orb-label{font-size:7.5px;font-weight:800;letter-spacing:1.2px;color:#ff6b61}
      #coded-fit-ai-panel{position:fixed;right:22px;bottom:98px;z-index:100002;width:360px;max-width:calc(100vw - 32px);
        max-height:min(560px,70vh);background:#0e0f13;color:#fff;border:1px solid #2a2d34;border-radius:10px;
        display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.55)}
      #coded-fit-ai-panel.active{display:flex;animation:cfFadeUp .3s ease}
      .ai-panel-header{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid #22242b}
      .ai-panel-title{font-family:'Syne',sans-serif;font-weight:900;font-size:14px;letter-spacing:.5px}
      .ai-panel-sub{font-family:'JetBrains Mono',monospace;font-size:9px;color:#8b8d96}
      .ai-status-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;margin-right:8px;box-shadow:0 0 8px rgba(34,197,94,.8)}
      .ai-close-btn{background:none;border:1px solid #33353d;color:#fff;border-radius:4px;width:28px;height:28px;cursor:pointer}
      .ai-quick-prompts{display:flex;gap:6px;padding:10px 12px;overflow-x:auto;border-bottom:1px solid #22242b}
      .ai-quick-prompts button{flex:0 0 auto;background:#181a20;border:1px solid #2c2e36;color:#cfd1d8;font-size:10px;
        font-family:'JetBrains Mono',monospace;padding:6px 10px;border-radius:20px;cursor:pointer;white-space:nowrap}
      .ai-quick-prompts button:hover{border-color:#e10600;color:#fff}
      #ai-chat-messages{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;min-height:120px}
      .ai-msg{max-width:88%}.ai-msg-user{align-self:flex-end}.ai-msg-assistant{align-self:flex-start}
      .ai-msg-bubble{font-size:13px;line-height:1.55;padding:10px 12px;border-radius:10px}
      .ai-msg-user .ai-msg-bubble{background:#e10600;color:#fff;border-bottom-right-radius:3px}
      .ai-msg-assistant .ai-msg-bubble{background:#1a1c22;color:#e8e9ec;border-bottom-left-radius:3px}
      .ai-product-suggestions{display:flex;flex-direction:column;gap:6px;margin-top:8px}
      .ai-prod-card{display:flex;gap:8px;background:#14151a;border:1px solid #2a2d34;border-radius:6px;padding:6px;text-decoration:none;color:#fff}
      .ai-prod-card img{width:44px;height:54px;object-fit:cover;border-radius:4px}
      .ai-prod-name{font-size:11px;font-weight:700}.ai-prod-price{font-size:11px;color:#ff6b61;font-weight:800}
      #ai-chat-status{font-size:11px;color:#8b8d96;padding:0 12px 6px;font-style:italic}
      .ai-chat-input-row{display:flex;gap:6px;padding:10px 12px;border-top:1px solid #22242b;align-items:center}
      #ai-chat-input{flex:1;background:#181a20;border:1px solid #2c2e36;color:#fff;border-radius:6px;padding:10px;font-size:13px;outline:none}
      #ai-chat-input:focus{border-color:#e10600}
      .ai-icon-btn{width:38px;height:38px;border-radius:50%;border:1px solid #33353d;background:#181a20;color:#fff;cursor:pointer;
        display:flex;align-items:center;justify-content:center;flex:none}
      .ai-icon-btn:hover{border-color:#e10600}
      #ai-voice-btn.listening{background:#e10600;border-color:#e10600;animation:cfPulseRing 1.4s ease-out infinite}
      .ai-voice-on{background:#e10600 !important;border-color:#e10600 !important}
      .ai-row-toggles{display:flex;gap:6px;padding:0 12px 10px}
      .ai-toggle{flex:1;background:#14151a;border:1px solid #2c2e36;color:#aeb0b8;font-family:'JetBrains Mono',monospace;
        font-size:9px;font-weight:800;letter-spacing:.6px;padding:7px 4px;border-radius:5px;cursor:pointer;text-transform:uppercase}
      .ai-toggle.on{background:#e10600;border-color:#e10600;color:#fff}
    `;
    document.head.appendChild(s);
  }

  function init() {
    injectCSS();
    setupSpeechRecognition();
    renderAssistantWidget();
    unlockAudio();
    console.log('[JARVIS] Voice assistant online (EN/HI)');
  }

  // iOS/Safari require a user gesture before speechSynthesis works — pre-warm it
  function unlockAudio() {
    const warm = () => { try { state.synth && state.synth.getVoices(); } catch (e) {} };
    document.addEventListener('pointerdown', warm, { once: true });
  }

  /* ── Speech recognition ── */
  function setupSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    state.recognition = new SR();
    state.recognition.continuous = false;
    state.recognition.interimResults = false;
    state.recognition.maxAlternatives = 1;
    state.recognition.lang = state.lang;
    state.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript || '';
      stopListening();
      const input = document.getElementById('ai-chat-input');
      if (input) input.value = transcript;
      if (!state.isOpen) toggleWidget(true);
      sendMessage(transcript);
    };
    state.recognition.onerror = (event) => { stopListening(); if (event.error === 'not-allowed') showStatus('Mic blocked hai — browser settings me microphone allow karo.'); };
    state.recognition.onend = () => {
      const was = state.isListening;
      stopListening();
      // Jarvis mode: keep the loop alive after each turn
      if (state.jarvisMode && was) setTimeout(() => { if (state.jarvisMode && !state.pending) startListening(); }, 600);
    };
  }

  function toggleVoice() {
    if (!state.recognition) { showStatus('Is browser me voice typing nahi hai — likh ke bhejo. (Chrome/Edge best hai)'); return; }
    if (state.isListening) { state.jarvisMode = false; syncToggles(); stopListening(); }
    else startListening();
  }

  function toggleJarvisMode() {
    if (!state.recognition) { showStatus('Voice ke liye Chrome/Edge use karo.'); return; }
    state.jarvisMode = !state.jarvisMode;
    syncToggles();
    if (state.jarvisMode) { speak(state.lang === 'hi-IN' ? 'Jarvis sun raha hai. Bolo — kya karna hai?' : 'Jarvis is listening. Tell me what to do.'); startListening(); }
    else stopListening();
  }

  function toggleLang() {
    state.lang = state.lang === 'en-IN' ? 'hi-IN' : 'en-IN';
    if (state.recognition) { try { state.recognition.abort(); } catch (e) {} state.recognition.lang = state.lang; }
    syncToggles();
  }

  function toggleVoiceOut() { state.voiceOut = !state.voiceOut; if (!state.voiceOut && state.synth) state.synth.cancel(); syncToggles(); }

  function syncToggles() {
    const set = (id, on, label) => { const el = document.getElementById(id); if (el) { el.classList.toggle('on', !!on); if (label) el.textContent = label; } };
    set('ai-tg-jarvis', state.jarvisMode, state.jarvisMode ? '● JARVIS LOOP' : '○ JARVIS LOOP');
    set('ai-tg-lang', state.lang === 'hi-IN', state.lang === 'hi-IN' ? 'हिंदी' : 'ENGLISH');
    set('ai-tg-voice', state.voiceOut, state.voiceOut ? '🔊 VOICE' : '🔇 MUTED');
  }

  function startListening() {
    if (!state.recognition || state.isListening) return;
    try {
      state.recognition.lang = state.lang;
      state.recognition.start();
      state.isListening = true;
      const vb = document.getElementById('ai-voice-btn'); if (vb) vb.classList.add('listening');
      const orb = document.getElementById('jarvis-orb'); if (orb) orb.classList.add('listening');
      showStatus(state.lang === 'hi-IN' ? 'Sun raha hun… bolo (Hindi / Hinglish / English)' : 'Listening… speak (English / Hinglish / Hindi)');
    } catch (e) { /* already started */ }
  }

  function stopListening() {
    try { state.recognition && state.recognition.abort(); } catch (e) {}
    state.isListening = false;
    const vb = document.getElementById('ai-voice-btn'); if (vb) vb.classList.remove('listening');
    const orb = document.getElementById('jarvis-orb'); if (orb) orb.classList.remove('listening');
    clearStatus();
  }

  /* ── Speech synthesis (replies) ── */
  function pickVoice() {
    if (!state.synth) return null;
    const vs = state.synth.getVoices() || [];
    if (!vs.length) return null;
    const wantHi = state.lang === 'hi-IN';
    return vs.find(v => wantHi ? /^hi/i.test(v.lang) : /^en[-_]IN/i.test(v.lang))
      || vs.find(v => wantHi ? /hindi/i.test(v.name) : /india/i.test(v.name))
      || vs.find(v => wantHi ? /^hi/i.test(v.lang) : /^en/i.test(v.lang))
      || vs[0];
  }

  function speak(text) {
    if (!state.synth || !state.voiceOut) return;
    try {
      state.synth.cancel();
      const clean = String(text).replace(/https?:\/\/\S+/g, '').replace(/[*#•]/g, '').slice(0, 280);
      if (!clean.trim()) return;
      const u = new SpeechSynthesisUtterance(clean);
      const v = pickVoice(); if (v) u.voice = v;
      u.lang = (v && v.lang) || state.lang;
      u.rate = 1.0; u.pitch = 1.0;
      state.synth.speak(u);
    } catch (e) {}
  }

  /* ── Intent router: page actions first, backend chat second ── */
  function firePageCommand(cmd) {
    // Pages listen for 'jarvis-cmd' (body-visualizer, customize, shop…)
    window.dispatchEvent(new CustomEvent('jarvis-cmd', { detail: cmd }));
  }

  function handleLocalIntent(raw) {
    const t = raw.toLowerCase();
    const nav = (url, text) => ({ url, text });
    const say = (text) => ({ text });
    // Navigation (EN + HI)
    if (/(body visual|3d avatar|scan|skan|naap|measurement)/.test(t) && /(kholo|open|start|shuru|dikha|le chal)/.test(t)) return nav('body-visualizer.html', 'Body Visualizer khol raha hun.');
    if (/(men|aadmi|ladka|gents)/.test(t) && /(dikha|kholo|show|open|kapde|collection)/.test(t)) return nav('shop.html?cat=men', 'Men collection khol raha hun.');
    if (/(women|ladies|ladki|aurat)/.test(t) && /(dikha|kholo|show|open|kapde|collection)/.test(t)) return nav('shop.html?cat=women', 'Women collection khol raha hun.');
    if (/(kid|bacha|bachche|bachon)/.test(t) && /(dikha|kholo|show|open|kapde|collection)/.test(t)) return nav('shop.html?cat=kids', 'Kids collection khol raha hun.');
    if (/(oversize|loose|dheela)/.test(t) && /(dikha|kholo|show|collection)/.test(t)) return nav('shop.html?cat=oversized', 'Oversized collection khol raha hun.');
    if (/(custom|studio|silwa|stitch|bespoke|darzi)/.test(t)) return nav('customize.html', 'Custom Studio khol raha hun.');
    if (/(cart|bag|basket|tokri)/.test(t) && /(kholo|open|dikha|show)/.test(t)) return nav('cart.html', 'Shopping bag khol raha hun.');
    if (/(fit profile|profile)/.test(t) && /(kholo|open|dikha)/.test(t)) return nav('fit-profile.html', 'Fit Profile khol raha hun.');
    if (/(order|parcel|delivery|track)/.test(t)) return nav('dashboard.html', 'Orders dashboard khol raha hun — wahan live tracking milegi.');
    // On-page garment commands (visualizer / studio listen)
    const colorMap = { black: 'black', kala: 'black', white: 'white', safed: 'white', navy: 'navy', neela: 'navy', blue: 'navy', green: 'green', hara: 'green', olive: 'olive', red: 'red', lal: 'red', gold: 'gold', grey: 'grey', gray: 'grey' };
    for (const k in colorMap) {
      if (t.includes(k) && /(kar do|karo|change|switch|bana|colour|color|rang)/.test(t)) {
        firePageCommand({ action: 'color', value: colorMap[k], raw });
        return say(`Samajh gaya — ${k} laga raha hun.`);
      }
    }
    if (/mandarin/.test(t)) { firePageCommand({ action: 'collar', value: 'mandarin', raw }); return say('Mandarin collar laga raha hun.'); }
    if (/cuban/.test(t)) { firePageCommand({ action: 'collar', value: 'cuban', raw }); return say('Cuban collar laga raha hun.'); }
    if (/spread|normal collar/.test(t)) { firePageCommand({ action: 'collar', value: 'spread', raw }); return say('Spread collar laga raha hun.'); }
    if (/loose|dheela|relaxed|oversize/.test(t) && /(fit|kar|size)/.test(t)) { firePageCommand({ action: 'looser', raw }); return say('Ek step looser kar raha hun.'); }
    if (/tight|slim|fitted/.test(t) && /(fit|kar|size)/.test(t)) { firePageCommand({ action: 'slimmer', raw }); return say('Ek step slimmer kar raha hun.'); }
    if (/peeche|pichhe|back|ghoom/.test(t) && /(dikha|dikhao|view|ghooma)/.test(t)) { firePageCommand({ action: 'view', value: 'back', raw }); return say('Back view laga raha hun.'); }
    if (/(side|bagal)/.test(t) && /(dikha|view)/.test(t)) { firePageCommand({ action: 'view', value: 'side', raw }); return say('Side view laga raha hun.'); }
    if (/(samne|aage|front)/.test(t) && /(dikha|view|aao)/.test(t)) { firePageCommand({ action: 'view', value: 'front', raw }); return say('Front view laga raha hun.'); }
    if (/(ghoomao|rotate|360|ghuma)/.test(t)) { firePageCommand({ action: 'spin', raw }); return say('Auto-rotate chalu kar raha hun.'); }
    return null;
  }

  /* ── Chat ── */
  async function sendMessage(text) {
    const message = (text || document.getElementById('ai-chat-input')?.value || '').trim();
    if (!message || state.pending) return;
    const input = document.getElementById('ai-chat-input');
    if (input) input.value = '';
    if (!state.isOpen) toggleWidget(true);
    appendMessage('user', message);

    // 1. Local intents = instant, no API call
    const local = handleLocalIntent(message);
    if (local) {
      appendMessage('assistant', local.text);
      speak(local.text);
      if (local.url) { await wait(800); window.location.href = local.url; }
      if (state.jarvisMode && !state.isListening && !local.url) setTimeout(() => { if (state.jarvisMode) startListening(); }, 800);
      return;
    }

    // 2. Backend AI (real products/orders, honest fallbacks)
    state.pending = true;
    showStatus('Jarvis soch raha hai…');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: state.history }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await response.json();
      clearStatus();
      if (data.success && data.response) {
        appendMessage('assistant', data.response, data.products);
        state.history.push({ role: 'user', content: message });
        state.history.push({ role: 'assistant', content: data.response });
        speak(data.response);
      } else {
        const fb = 'Samajh nahi aaya — ek baar phir bolo, ya type karo.';
        appendMessage('assistant', fb); speak(fb);
      }
    } catch (err) {
      clearStatus();
      const fb = 'AI assistant abhi offline hai — lekin shop, 3D studio aur Body Visualizer poori tarah chal rahe hain.';
      appendMessage('assistant', fb); speak(fb);
    } finally {
      state.pending = false;
      if (state.jarvisMode && !state.isListening) setTimeout(() => { if (state.jarvisMode) startListening(); }, 800);
    }
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ── UI ── */
  function appendMessage(sender, text, products = []) {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg-${sender}`;
    let html = `<div class="ai-msg-bubble">${String(text).replace(/\n/g, '<br>')}</div>`;
    if (products && products.length > 0) {
      html += `<div class="ai-product-suggestions">${products.map(p => `
        <a href="product.html?id=${p._id || p.id}" class="ai-prod-card">
          <img src="${(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=70'}" alt="">
          <div><div class="ai-prod-name">${p.name}</div><div class="ai-prod-price">₹${Number(p.price || 0).toLocaleString('en-IN')}</div></div>
        </a>`).join('')}</div>`;
    }
    msgDiv.innerHTML = html;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  }

  function showStatus(text) {
    const el = document.getElementById('ai-chat-status');
    if (el) { el.textContent = text; el.style.display = 'block'; }
  }
  function clearStatus() {
    const el = document.getElementById('ai-chat-status');
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  }

  function toggleWidget(force) {
    state.isOpen = (typeof force === 'boolean') ? force : !state.isOpen;
    const panel = document.getElementById('coded-fit-ai-panel');
    if (panel) panel.classList.toggle('active', state.isOpen);
    if (state.isOpen) { syncToggles(); document.getElementById('ai-chat-input')?.focus(); }
    else { state.jarvisMode = false; stopListening(); syncToggles(); }
  }

  function toggleVoice() { toggleJarvisSingle(); }
  function toggleJarvisSingle() {
    if (!state.recognition) { if (!state.isOpen) toggleWidget(true); showStatus('Is browser me voice typing nahi hai — likh ke bhejo. (Chrome/Edge best hai)'); return; }
    if (state.isListening) stopListening(); else startListening();
  }

  function renderAssistantWidget() {
    if (document.getElementById('coded-fit-ai-root')) return;
    const root = document.createElement('div');
    root.id = 'coded-fit-ai-root';
    root.innerHTML = `
      <button id="jarvis-orb" onclick="CODED_FIT_AI.toggleWidget()" aria-label="Jarvis voice assistant">
        <span class="orb-core">◉</span><span class="orb-label">JARVIS</span>
      </button>
      <div id="coded-fit-ai-panel" role="dialog" aria-label="Jarvis assistant">
        <div class="ai-panel-header">
          <div><span class="ai-status-dot"></span><span class="ai-panel-title">JARVIS</span>
            <div class="ai-panel-sub">VOICE · ENGLISH · हिंदी · HINGLISH (BETA)</div></div>
          <button onclick="CODED_FIT_AI.toggleWidget()" class="ai-close-btn">✕</button>
        </div>
        <div class="ai-quick-prompts">
          <button onclick="CODED_FIT_AI.sendMessage('Men collection dikhao')">Men</button>
          <button onclick="CODED_FIT_AI.sendMessage('Kids collection kholo')">Kids</button>
          <button onclick="CODED_FIT_AI.sendMessage('Body Visualizer kholo')">Body Scan</button>
          <button onclick="CODED_FIT_AI.sendMessage('Black shirts under 2500')">Black &lt; ₹2500</button>
          <button onclick="CODED_FIT_AI.sendMessage('Mera order status kya hai?')">Track order</button>
        </div>
        <div id="ai-chat-messages">
          <div class="ai-msg ai-msg-assistant"><div class="ai-msg-bubble">Namaste! Main <b>JARVIS</b> hun — bol ke ya likh ke bolo: kapde dhoondhna, Body Visualizer kholna, color/collar badalna, ya order track karna. Mic dabao aur bolo — “Men collection dikhao”, “Isse black kar do”.</div></div>
        </div>
        <div id="ai-chat-status" style="display:none;"></div>
        <div class="ai-row-toggles">
          <button class="ai-toggle" id="ai-tg-jarvis" onclick="CODED_FIT_AI.toggleJarvisMode()">○ JARVIS LOOP</button>
          <button class="ai-toggle" id="ai-tg-lang" onclick="CODED_FIT_AI.toggleLang()">ENGLISH</button>
          <button class="ai-toggle on" id="ai-tg-voice" onclick="CODED_FIT_AI.toggleVoiceOut()">🔊 VOICE</button>
        </div>
        <div class="ai-chat-input-row">
          <button id="ai-voice-btn" class="ai-icon-btn" onclick="CODED_FIT_AI.toggleVoice()" title="Bolo (voice)">🎙</button>
          <input type="text" id="ai-chat-input" placeholder="Bolo ya likho…" onkeydown="if(event.key==='Enter')CODED_FIT_AI.sendMessage()">
          <button id="ai-send-btn" class="ai-icon-btn" onclick="CODED_FIT_AI.sendMessage()" title="Bhejo">➤</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    syncToggles();
  }

  return { init, toggleWidget, toggleVoice, toggleJarvisMode, toggleLang, toggleVoiceOut, sendMessage };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => { CODED_FIT_AI.init(); });
}
