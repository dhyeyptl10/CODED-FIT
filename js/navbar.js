/* ===== CODED FIT — Master Unified Navbar & Cart Drawer Component ===== */
/* Guarantees 100% pixel-perfect consistency across EVERY page */

(function() {
  'use strict';

  function getCurrentPage() {
    const path = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    return path;
  }

  function getUser() {
    try {
      const stored = localStorage.getItem('CODED_USER');
      if (stored) return JSON.parse(stored);
      // Default demo client
      const defaultUser = { name: 'Dhyey M.', id: '#CF-8821', tier: 'ATELIER BLACK' };
      localStorage.setItem('CODED_USER', JSON.stringify(defaultUser));
      return defaultUser;
    } catch(e) {
      return { name: 'Dhyey M.', id: '#CF-8821', tier: 'ATELIER BLACK' };
    }
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('NOVA_CART')) || [];
    } catch(e) { return []; }
  }

  function getCartCount() {
    try {
      const cart = getCart();
      return cart.reduce((s, i) => s + (i.qty || 1), 0);
    } catch(e) { return 0; }
  }

  function injectMasterCSS() {
    if (document.getElementById('cf-master-nav-css')) return;
    const style = document.createElement('style');
    style.id = 'cf-master-nav-css';
    style.textContent = `
      /* Master Navbar Architecture */
      #cf-master-wrapper {
        position: relative;
        z-index: 9999;
        width: 100%;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      /* 1. TOP MARQUEE TICKER */
      .cf-top-ticker {
        background: #090a0c;
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        padding: 7px 0;
        overflow: hidden;
        white-space: nowrap;
        border-bottom: 1px solid rgba(255,255,255,0.07);
        display: flex;
        align-items: center;
      }

      .cf-top-ticker-track {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        animation: cfMarqueeScroll 35s linear infinite;
        will-change: transform;
      }

      @keyframes cfMarqueeScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .cf-top-ticker:hover .cf-top-ticker-track {
        animation-play-state: paused;
      }

      .cf-ticker-bullet {
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #e10600;
        border-radius: 50%;
        margin: 0 10px;
        vertical-align: middle;
        box-shadow: 0 0 8px rgba(225,6,0,0.6);
      }

      /* 2. MAIN HEADER */
      .cf-main-nav {
        background: #ffffff;
        border-bottom: 1px solid #e2e2e5;
        padding: 0 32px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 9998;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      }

      .cf-brand-wrap {
        display: flex;
        align-items: baseline;
        gap: 6px;
        text-decoration: none;
        color: #0a0a0c;
        flex-shrink: 0;
      }

      .cf-brand-logo {
        font-family: 'Syne', sans-serif;
        font-size: 21px;
        font-weight: 900;
        letter-spacing: -0.6px;
        color: #0a0a0c;
        line-height: 1;
      }

      .cf-brand-dot {
        color: #e10600;
      }

      .cf-atelier-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9.5px;
        font-weight: 800;
        color: #e10600;
        letter-spacing: 0.5px;
        padding: 2px 4px;
        border: 1px solid rgba(225,6,0,0.25);
        background: rgba(225,6,0,0.04);
        border-radius: 2px;
      }

      /* NAV LINKS */
      .cf-links-cluster {
        display: flex;
        align-items: center;
        gap: 2px;
        margin: 0 20px;
        overflow-x: auto;
      }

      .cf-links-cluster::-webkit-scrollbar { display: none; }

      .cf-nav-item {
        font-family: 'Space Grotesk', 'Inter', sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #2b2c30;
        text-decoration: none;
        padding: 8px 11px;
        border-radius: 3px;
        transition: color 0.15s ease, background 0.15s ease;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
      }

      .cf-nav-item:hover {
        color: #000;
        background: #f2f2f4;
      }

      .cf-nav-item.active {
        color: #000;
        font-weight: 800;
        background: #ededf0;
      }

      .cf-nav-item.crimson-cta {
        color: #e10600 !important;
        font-weight: 800;
        border: 1px solid rgba(225,6,0,0.3);
        background: rgba(225,6,0,0.05);
        margin: 0 4px;
      }

      .cf-nav-item.crimson-cta:hover {
        background: #e10600;
        color: #ffffff !important;
        border-color: #e10600;
      }

      /* ACTIONS */
      .cf-actions-cluster {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      .cf-curr-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 700;
        color: #444;
        background: #f2f2f4;
        border: 1px solid #e0e0e3;
        padding: 5px 9px;
        border-radius: 3px;
        letter-spacing: 0.5px;
        cursor: pointer;
      }

      .cf-status-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f7f7f9;
        border: 1px solid #e2e2e6;
        padding: 5px 10px;
        border-radius: 3px;
        text-decoration: none;
        color: #111;
        font-family: 'JetBrains Mono', monospace;
        font-size: 9.5px;
        font-weight: 800;
        letter-spacing: 0.8px;
        transition: border-color 0.2s;
      }

      .cf-status-pill:hover {
        border-color: #e10600;
      }

      .cf-status-pulse {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 6px rgba(34,197,94,0.6);
        animation: cfStatusPulse 1.8s ease-in-out infinite;
      }

      @keyframes cfStatusPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
      }

      .cf-icon-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: #ffffff;
        border: 1px solid #e0e0e4;
        border-radius: 3px;
        color: #222;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.15s ease;
      }

      .cf-icon-button:hover {
        border-color: #000;
        color: #000;
        background: #f9f9fa;
      }

      .cf-icon-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #e10600;
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 8.5px;
        font-weight: 800;
        min-width: 16px;
        height: 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 3px;
        box-shadow: 0 2px 4px rgba(225,6,0,0.3);
      }

      .cf-admin-btn {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        color: #000;
        background: #fff;
        border: 1px solid #111;
        padding: 6px 10px;
        border-radius: 3px;
        text-decoration: none;
        transition: all 0.15s ease;
      }

      .cf-admin-btn:hover {
        background: #000;
        color: #fff;
      }

      /* 3. SUBBAR (ENCRYPTED TELEMETRY) */
      .cf-subbar {
        background: #f7f7f9;
        border-bottom: 1px solid #e5e5e9;
        padding: 5px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: 'JetBrains Mono', monospace;
        font-size: 8.5px;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        color: #63636b;
      }

      .cf-subbar-left, .cf-subbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cf-subbar-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #e10600;
      }

      .cf-subbar-sep {
        color: #ccc;
      }

      /* 4. SLIDE-OVER CART DRAWER */
      .cf-cart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
        z-index: 100000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .cf-cart-overlay.open {
        opacity: 1;
        pointer-events: all;
      }

      .cf-cart-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: 440px;
        max-width: 90vw;
        height: 100vh;
        background: #0d0e12;
        color: #fff;
        z-index: 100001;
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        box-shadow: -10px 0 40px rgba(0,0,0,0.5);
      }

      .cf-cart-drawer.open {
        transform: translateX(0);
      }

      .cf-cart-header {
        padding: 22px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .cf-cart-title {
        font-family: 'Syne', sans-serif;
        font-size: 17px;
        font-weight: 900;
        letter-spacing: -0.3px;
        color: #fff;
      }

      .cf-cart-sub {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8.5px;
        color: rgba(255,255,255,0.4);
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-top: 2px;
      }

      .cf-cart-close {
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        border-radius: 3px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.2s;
      }

      .cf-cart-close:hover {
        background: #e10600;
        border-color: #e10600;
      }

      .cf-cart-items-wrap {
        flex: 1;
        overflow-y: auto;
        padding: 16px 24px;
      }

      .cf-cart-empty {
        padding: 60px 20px;
        text-align: center;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: rgba(255,255,255,0.4);
        line-height: 1.8;
      }

      .cf-cart-item {
        display: flex;
        gap: 14px;
        padding: 16px 0;
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }

      .cf-cart-img {
        width: 72px;
        height: 88px;
        object-fit: cover;
        background: #1a1c22;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .cf-cart-item-info {
        flex: 1;
        min-width: 0;
      }

      .cf-cart-item-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8px;
        font-weight: 800;
        color: #e10600;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .cf-cart-item-name {
        font-family: 'Syne', sans-serif;
        font-size: 13px;
        font-weight: 800;
        color: #fff;
        margin: 3px 0 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cf-cart-item-meta {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        color: rgba(255,255,255,0.45);
        margin-bottom: 10px;
      }

      .cf-cart-qty-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cf-qty-btn {
        width: 24px;
        height: 24px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        transition: all 0.15s;
      }

      .cf-qty-btn:hover {
        background: #e10600;
        border-color: #e10600;
      }

      .cf-qty-val {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 800;
        color: #fff;
        min-width: 20px;
        text-align: center;
      }

      .cf-item-remove {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8.5px;
        color: rgba(255,255,255,0.4);
        text-decoration: underline;
        cursor: pointer;
        margin-left: 6px;
      }

      .cf-item-remove:hover {
        color: #e10600;
      }

      .cf-item-price {
        font-family: 'Syne', sans-serif;
        font-size: 15px;
        font-weight: 900;
        color: #fff;
        text-align: right;
        flex-shrink: 0;
      }

      .cf-cart-footer {
        padding: 20px 24px 24px;
        border-top: 1px solid rgba(255,255,255,0.08);
        background: #090a0d;
      }

      .cf-cart-subtotal-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 14px;
      }

      .cf-cart-subtotal-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1px;
        color: rgba(255,255,255,0.5);
        text-transform: uppercase;
      }

      .cf-cart-subtotal-val {
        font-family: 'Syne', sans-serif;
        font-size: 22px;
        font-weight: 900;
        color: #fff;
      }

      .cf-cart-checkout-btn {
        display: block;
        width: 100%;
        padding: 15px;
        background: #e10600;
        color: #ffffff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        text-align: center;
        text-decoration: none;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.2s;
        box-sizing: border-box;
      }

      .cf-cart-checkout-btn:hover {
        background: #c00500;
      }

      /* TOAST NOTIFICATION */
      .cf-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #0e1014;
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.8px;
        padding: 12px 24px;
        border-left: 3px solid #e10600;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        border-radius: 2px;
        z-index: 999999;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
        white-space: nowrap;
      }

      .cf-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  function purgeLegacyHeaders() {
    const legacySelectors = [
      '.site-header',
      '.top-ticker',
      '.top-black-ticker',
      '.top-telemetry-banner',
      '.studio-top-telemetry',
      '.studio-site-header',
      '.dash-nav-header',
      '.sub-meta-bar'
    ];
    legacySelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        // Only remove if outside our master wrapper
        if (!el.closest('#cf-master-wrapper')) {
          el.remove();
        }
      });
    });
  }

  function renderMasterNav() {
    purgeLegacyHeaders();

    const existingWrapper = document.getElementById('cf-master-wrapper');
    if (existingWrapper) existingWrapper.remove();

    const page = getCurrentPage();
    const user = getUser();
    const cartCount = getCartCount();

    const navLinks = [
      { label: 'MEN',           href: 'shop.html?cat=men' },
      { label: 'WOMEN',         href: 'shop.html?cat=women' },
      { label: 'NEW DROPS',     href: 'shop.html?cat=new' },
      { label: 'OVERSIZED',     href: 'shop.html?cat=oversized' },
      { label: 'SHIRTS',        href: 'shop.html?cat=shirts' },
      { label: 'TROUSERS',      href: 'shop.html?cat=trousers' },
      { label: '3D CUSTOM STUDIO', href: 'customize.html', crimson: true },
      { label: 'AI FIT PROFILE',   href: 'fit-profile.html' },
      { label: 'CONCIERGE',        href: 'concierge.html' }
    ];

    const linksHTML = navLinks.map(link => {
      const isCurrent = page === link.href.split('?')[0];
      const cls = [
        'cf-nav-item',
        isCurrent ? 'active' : '',
        link.crimson ? 'crimson-cta' : ''
      ].filter(Boolean).join(' ');

      return `<a href="${link.href}" class="${cls}">${link.label}</a>`;
    }).join('');

    const wrapper = document.createElement('div');
    wrapper.id = 'cf-master-wrapper';
    wrapper.innerHTML = `
      <!-- TOP TICKER -->
      <div class="cf-top-ticker">
        <div class="cf-top-ticker-track">
          <span class="cf-ticker-bullet"></span>
          <span>LIVE TELEMETRY &nbsp;|&nbsp; FREE DELIVERY ON PREPAID ORDERS &nbsp;//&nbsp; FIRST GARMENT TRIAL AVAILABLE &nbsp;//&nbsp; AI FIT CALIBRATION ACTIVE &nbsp;//&nbsp; PROTOTYPE DEMO: BLR ATELIER &nbsp;|&nbsp; LAB 04 &nbsp;|&nbsp; LAT 12.9716° N, 77.5946° E</span>
          <span class="cf-ticker-bullet"></span>
          <span>BENGALURU LAB ARCHETYPE 09 &nbsp;//&nbsp; 00 DEADSTOCK GENERATIVE LASER CUTTING &nbsp;//&nbsp; SAVILE ROW HANDCRAFT STANDARD</span>
          <span class="cf-ticker-bullet"></span>
          <span>LIVE TELEMETRY &nbsp;|&nbsp; FREE DELIVERY ON PREPAID ORDERS &nbsp;//&nbsp; FIRST GARMENT TRIAL AVAILABLE &nbsp;//&nbsp; AI FIT CALIBRATION ACTIVE &nbsp;//&nbsp; PROTOTYPE DEMO: BLR ATELIER</span>
        </div>
      </div>

      <!-- MAIN STICKY HEADER -->
      <header class="cf-main-nav">
        <!-- LOGO -->
        <a href="index.html" class="cf-brand-wrap" title="CODED FIT Atelier">
          <span class="cf-brand-logo">CODED FIT<span class="cf-brand-dot">.</span></span>
          <span class="cf-atelier-badge">[BLR-ATELIER]</span>
        </a>

        <!-- LINKS -->
        <nav class="cf-links-cluster">
          ${linksHTML}
        </nav>

        <!-- ACTIONS -->
        <div class="cf-actions-cluster">
          <span class="cf-curr-badge" title="Currency: Indian Rupee">&#8377; INR</span>

          <a href="dashboard.html" class="cf-status-pill" title="Client Profile & Active Telemetry">
            <span class="cf-status-pulse"></span>
            <span>AI ACTIVE #CF-8821</span>
          </a>

          <a href="shop.html" class="cf-icon-button" title="Archived Wishlist">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="cf-icon-badge">4</span>
          </a>

          <a href="dashboard.html" class="cf-icon-button" title="Atelier Dashboard">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </a>

          <button class="cf-icon-button" onclick="window.CF_openCartDrawer()" title="Shopping Bag">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="cf-icon-badge" id="cf-cart-badge-count">${cartCount || 0}</span>
          </button>

          <a href="admin.html" class="cf-admin-btn" title="Atelier Admin Control Panel">ADMIN</a>
        </div>
      </header>

      <!-- SUBBAR -->
      <div class="cf-subbar">
        <div class="cf-subbar-left">
          <span class="cf-subbar-dot"></span>
          <span>ENCRYPTED TRANSMISSION</span>
          <span class="cf-subbar-sep">//</span>
          <span>PROTOCOL: ATELIER AUTOMATION RUNTIME #CF-8921</span>
          <span class="cf-subbar-sep">//</span>
          <span>CLIENT ID: #CF-8821 &bull; DHYEY M.</span>
          <span class="cf-subbar-sep">//</span>
          <span>TIER: ATELIER BLACK</span>
        </div>
        <div class="cf-subbar-right">
          <span>ZERO-DEFECT CNC LASER &bull; 0.05MM TOLERANCE</span>
          <span class="cf-subbar-sep">//</span>
          <span style="color:#e10600;">100% DOORSTEP FIT GUARANTEED</span>
        </div>
      </div>
    `;

    document.body.insertBefore(wrapper, document.body.firstChild);
  }

  /* Cart Drawer Injection */
  function injectCartDrawer() {
    if (document.getElementById('cf-cart-overlay')) return;

    const drawerHTML = `
      <div class="cf-cart-overlay" id="cf-cart-overlay" onclick="window.CF_closeCartDrawer()"></div>
      <aside class="cf-cart-drawer" id="cf-cart-drawer">
        <div class="cf-cart-header">
          <div>
            <div class="cf-cart-title">YOUR ATELIER BAG</div>
            <div class="cf-cart-sub">CALIBRATED FABRICATION QUEUE</div>
          </div>
          <button class="cf-cart-close" onclick="window.CF_closeCartDrawer()">&times;</button>
        </div>

        <div class="cf-cart-items-wrap" id="cf-cart-items-container">
          <!-- Populated by JS -->
        </div>

        <div class="cf-cart-footer">
          <div class="cf-cart-subtotal-row">
            <span class="cf-cart-subtotal-label">SUB-TOTAL:</span>
            <span class="cf-cart-subtotal-val" id="cf-cart-subtotal">&#8377;0</span>
          </div>
          <a href="cart.html" class="cf-cart-checkout-btn">PROCEED TO CHECKOUT &rarr;</a>
        </div>
      </aside>
      <div class="cf-toast" id="cf-global-toast"></div>
    `;

    const div = document.createElement('div');
    div.innerHTML = drawerHTML;
    document.body.appendChild(div);
  }

  function renderDrawerItems() {
    const container = document.getElementById('cf-cart-items-container');
    const subtotalEl = document.getElementById('cf-cart-subtotal');
    const badgeCountEl = document.getElementById('cf-cart-badge-count');
    if (!container) return;

    const cart = getCart();
    const count = getCartCount();
    if (badgeCountEl) badgeCountEl.textContent = count;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cf-cart-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.3;margin-bottom:12px;">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <div>YOUR BAG IS CURRENTLY EMPTY</div>
          <div style="font-size:9.5px;color:rgba(255,255,255,0.3);margin-top:4px;">CALIBRATE A SILHOUETTE OR ADD PIECES</div>
          <div style="margin-top:16px;">
            <a href="shop.html" style="color:#e10600;text-decoration:underline;font-size:10px;">EXPLORE DROPS &rarr;</a>
          </div>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map((item, idx) => {
      const price = item.price || 0;
      const qty = item.qty || 1;
      const lineTotal = price * qty;
      subtotal += lineTotal;
      const img = (item.images && item.images[0]) || item.img || 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=200&q=80';

      return `
        <div class="cf-cart-item">
          <img class="cf-cart-img" src="${img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=200&q=80'">
          <div class="cf-cart-item-info">
            <div class="cf-cart-item-badge">${item.badge || 'BESPOKE TAILORED'}</div>
            <div class="cf-cart-item-name">${item.name}</div>
            <div class="cf-cart-item-meta">SIZE: ${item.size || 'L'} &bull; ${item.color || 'OBSIDIAN'}</div>
            <div class="cf-cart-qty-row">
              <button class="cf-qty-btn" onclick="window.CF_updateItemQty(${idx}, -1)">-</button>
              <span class="cf-qty-val">${qty}</span>
              <button class="cf-qty-btn" onclick="window.CF_updateItemQty(${idx}, 1)">+</button>
              <span class="cf-item-remove" onclick="window.CF_removeItem(${idx})">REMOVE</span>
            </div>
          </div>
          <div class="cf-item-price">&#8377;${lineTotal.toLocaleString('en-IN')}</div>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN');
  }

  /* Global Control Helpers */
  window.CF_openCartDrawer = function() {
    const overlay = document.getElementById('cf-cart-overlay');
    const drawer = document.getElementById('cf-cart-drawer');
    if (overlay && drawer) {
      renderDrawerItems();
      overlay.classList.add('open');
      drawer.classList.add('open');
    }
  };

  window.CF_closeCartDrawer = function() {
    const overlay = document.getElementById('cf-cart-overlay');
    const drawer = document.getElementById('cf-cart-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('open');
      drawer.classList.remove('open');
    }
  };

  window.CF_updateItemQty = function(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    const newQty = (cart[index].qty || 1) + delta;
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
    localStorage.setItem('NOVA_CART', JSON.stringify(cart));
    renderDrawerItems();
    if (typeof updateCartBadge === 'function') updateCartBadge();
  };

  window.CF_removeItem = function(index) {
    const cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem('NOVA_CART', JSON.stringify(cart));
    renderDrawerItems();
    if (typeof updateCartBadge === 'function') updateCartBadge();
    window.CF_showToast('ITEM REMOVED FROM BAG');
  };

  window.CF_showToast = function(msg) {
    let t = document.getElementById('cf-global-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'cf-global-toast';
      t.className = 'cf-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  };

  // Backwards compatibility bindings
  window.openCartDrawer = window.CF_openCartDrawer;
  window.closeCartDrawer = window.CF_closeCartDrawer;
  window.showToast = window.CF_showToast;
  window.updateCartDrawerUI = renderDrawerItems;

  /* Initialize */
  function init() {
    injectMasterCSS();
    renderMasterNav();
    injectCartDrawer();
    renderDrawerItems();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run after full window load to purge any late-rendered legacy headers
  window.addEventListener('load', () => {
    purgeLegacyHeaders();
  });

})();
