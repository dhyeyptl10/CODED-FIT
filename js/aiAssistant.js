/**
 * CODED FIT — AI FASHION ASSISTANT & VOICE SHOPPING ENGINE
 * Multilingual (English, Hindi, Hinglish) with Web Speech STT/TTS and Backend Tool Calling
 */

const CODED_FIT_AI = (function () {
  'use strict';

  const state = {
    isOpen: false,
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis || null,
    history: []
  };

  function init() {
    setupSpeechRecognition();
    renderAssistantWidget();
    console.log('[CODED FIT AI] Assistant & Voice Engine Initialized');
  }

  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      state.recognition = new SpeechRecognition();
      state.recognition.continuous = false;
      state.recognition.interimResults = false;
      state.recognition.lang = 'en-IN'; // Supports English, Hindi, Hinglish accents

      state.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('ai-chat-input');
        if (input) {
          input.value = transcript;
        }
        stopListening();
        sendMessage(transcript);
      };

      state.recognition.onerror = (event) => {
        console.warn('[Speech Recognition Error]:', event.error);
        stopListening();
      };

      state.recognition.onend = () => {
        stopListening();
      };
    }
  }

  function toggleVoice() {
    if (!state.recognition) {
      alert('Voice recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    if (!state.recognition) return;
    try {
      state.recognition.start();
      state.isListening = true;
      const voiceBtn = document.getElementById('ai-voice-btn');
      if (voiceBtn) voiceBtn.classList.add('listening');
      showStatus('Listening for your voice (English, Hindi, or Hinglish)...');
    } catch (e) {
      console.warn('[Speech Start Error]:', e);
    }
  }

  function stopListening() {
    if (state.recognition && state.isListening) {
      state.recognition.stop();
    }
    state.isListening = false;
    const voiceBtn = document.getElementById('ai-voice-btn');
    if (voiceBtn) voiceBtn.classList.remove('listening');
    clearStatus();
  }

  function speakText(text) {
    if (!state.synth) return;
    // Clean text of technical tags or URLs
    const clean = text.replace(/https?:\/\/\S+/g, '').replace(/•/g, ',').slice(0, 200);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    state.synth.speak(utterance);
  }

  async function sendMessage(text) {
    const message = text || document.getElementById('ai-chat-input')?.value;
    if (!message || !message.trim()) return;

    const input = document.getElementById('ai-chat-input');
    if (input) input.value = '';

    appendMessage('user', message);
    showStatus('Analyzing your request with CODED FIT AI...');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: state.history
        })
      });

      const data = await response.json();
      clearStatus();

      if (data.success && data.response) {
        appendMessage('assistant', data.response, data.products);
        state.history.push({ role: 'user', content: message });
        state.history.push({ role: 'assistant', content: data.response });

        // Optional speech synthesis
        speakText(data.response);
      } else {
        appendMessage('assistant', 'Something went wrong. Please try again.');
      }
    } catch (err) {
      clearStatus();
      appendMessage('assistant', 'AI assistant is temporarily offline. The store and 3D customizer remain fully functional.');
    }
  }

  function appendMessage(sender, text, products = []) {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg-${sender}`;

    let html = `<div class="ai-msg-bubble">${text.replace(/\n/g, '<br>')}</div>`;

    if (products && products.length > 0) {
      html += `
        <div class="ai-product-suggestions">
          ${products.map(p => `
            <a href="product.html?id=${p._id || p.id}" class="ai-prod-card">
              <img src="${p.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=70'}" alt="${p.name}">
              <div class="ai-prod-info">
                <div class="ai-prod-name">${p.name}</div>
                <div class="ai-prod-price">₹${p.price.toLocaleString('en-IN')}</div>
              </div>
            </a>
          `).join('')}
        </div>
      `;
    }

    msgDiv.innerHTML = html;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  }

  function showStatus(text) {
    const statusEl = document.getElementById('ai-chat-status');
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.style.display = 'block';
    }
  }

  function clearStatus() {
    const statusEl = document.getElementById('ai-chat-status');
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.style.display = 'none';
    }
  }

  function toggleWidget() {
    state.isOpen = !state.isOpen;
    const panel = document.getElementById('coded-fit-ai-panel');
    if (panel) {
      panel.classList.toggle('active', state.isOpen);
    }
    if (state.isOpen) {
      document.getElementById('ai-chat-input')?.focus();
    }
  }

  function renderAssistantWidget() {
    if (document.getElementById('coded-fit-ai-root')) return;

    const root = document.createElement('div');
    root.id = 'coded-fit-ai-root';
    root.innerHTML = `
      <!-- Floating Trigger Button -->
      <button id="coded-fit-ai-trigger" onclick="CODED_FIT_AI.toggleWidget()" aria-label="Open AI Fashion Assistant">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>AI STYLIST</span>
      </button>

      <!-- Assistant Drawer Panel -->
      <div id="coded-fit-ai-panel">
        <div class="ai-panel-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="ai-status-dot"></span>
            <div>
              <div class="ai-panel-title">CODED FIT AI</div>
              <div class="ai-panel-sub">English · Hindi · Hinglish</div>
            </div>
          </div>
          <button onclick="CODED_FIT_AI.toggleWidget()" class="ai-close-btn" aria-label="Close Assistant">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="6"></line>
            </svg>
          </button>
        </div>

        <div class="ai-quick-prompts">
          <button onclick="CODED_FIT_AI.sendMessage('Show me black shirts under 2500')">Black shirts under 2500</button>
          <button onclick="CODED_FIT_AI.sendMessage('Summer ke liye best fabric kaunsa hai?')">Summer fabrics</button>
          <button onclick="CODED_FIT_AI.sendMessage('Recommend an outfit for my body shape')">Fit recommendation</button>
        </div>

        <div id="ai-chat-messages">
          <div class="ai-msg ai-msg-assistant">
            <div class="ai-msg-bubble">
              Welcome to CODED FIT. I can help you find products, understand bespoke tailoring, recommend sizes for your Fit Profile, or check order tracking. Ask me in English, Hindi, or Hinglish.
            </div>
          </div>
        </div>

        <div id="ai-chat-status" style="display:none;"></div>

        <div class="ai-chat-input-row">
          <button id="ai-voice-btn" onclick="CODED_FIT_AI.toggleVoice()" title="Voice shopping (Speak in Hindi or English)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>
          <input type="text" id="ai-chat-input" placeholder="Ask in English, Hindi, or Hinglish..." onkeydown="if(event.key==='Enter')CODED_FIT_AI.sendMessage()">
          <button id="ai-send-btn" onclick="CODED_FIT_AI.sendMessage()" title="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
  }

  return {
    init,
    toggleWidget,
    toggleVoice,
    sendMessage
  };
})();

// Auto-init assistant when DOM loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    CODED_FIT_AI.init();
  });
}
