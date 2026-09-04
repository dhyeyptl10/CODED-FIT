/* ===== NOVA STREET — Cart, Drawer & Order System ===== */

const CART_KEY = "NOVA_CART"; // shared across all pages

/* ── Get / Save Cart ── */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderDrawerCart();
}

/* ── Add to Cart ── */
function addToCart(productId, size, qty = 1) {
  const cart = getCart();
  const p = getProductById(productId);
  if (!p) return;

  const existing = cart.find(item => item.id === productId && item.size === size && !item.customData);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: productId,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      images: p.images,
      funnel: p.funnel,
      fabric: p.fabric,
      color: p.color,
      size: size || 'M',
      qty
    });
  }
  saveCart(cart);
  showToast(`⚡ ${p.name} (Size: ${size || 'M'}) added to bag!`);
  setTimeout(openCartDrawer, 500);
}

/* ── Remove from Cart ── */
function removeFromCartIndex(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function removeFromCart(productId, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === productId && item.size === size));
  saveCart(cart);
}

/* ── Update Qty ── */
function updateQty(productId, size, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId && i.size === size);
  if (item) {
    if (qty <= 0) {
      removeFromCart(productId, size);
    } else {
      item.qty = qty;
      saveCart(cart);
    }
  }
}

/* ── Cart Count ── */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

/* ── Toast (centralized) ── */
function showToast(message) {
  // Remove any existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 450);
  }, 3200);
}

/* ── Open / Close Drawer ── */
function openCartDrawer() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer)  drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  renderDrawerCart();
}

function closeCartDrawer() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer)  drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

/* ── Render Drawer Cart Items ── */
function renderDrawerCart() {
  const drawerItems   = document.getElementById('drawer-cart-items');
  const drawerSummary = document.getElementById('drawer-cart-summary');
  if (!drawerItems || !drawerSummary) return;

  const cart = getCart();

  if (cart.length === 0) {
    drawerItems.innerHTML = `
      <div style="text-align:center;padding:48px 20px;">
        <div style="font-size:48px;opacity:0.3;margin-bottom:16px;">🛍️</div>
        <div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#6B6560;margin-bottom:12px;">YOUR BAG IS EMPTY</div>
        <a href="shop.html" onclick="closeCartDrawer()" style="
          display:inline-block;background:#C9A84C;color:#0A0A0A;
          padding:10px 24px;border-radius:30px;font-size:11px;font-weight:800;
          letter-spacing:1.5px;text-transform:uppercase;
        ">SHOP COLLECTION →</a>
      </div>`;
    drawerSummary.innerHTML = '';
    return;
  }

  let subtotal = 0;
  drawerItems.innerHTML = cart.map((item, index) => {
    const p = item.customData || getProductById(item.id) || item;
    const img = p.images ? p.images[0] : (p.img || '');
    const name = p.name || item.name || 'Custom Garment';
    const price = p.price || item.price || 0;
    const lineTotal = price * (item.qty || 1);
    subtotal += lineTotal;
    const isBespoke = (p.funnel === 'custom-made') || Boolean(item.customData);

    return `
      <div style="display:flex;gap:14px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <img src="${img}" alt="${name}" style="width:70px;height:88px;object-fit:cover;border-radius:10px;background:#1A1A1A;flex-shrink:0;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:9px;font-weight:800;letter-spacing:1.5px;color:${isBespoke ? '#B85C38' : '#C9A84C'};margin-bottom:4px;text-transform:uppercase;">
            ${isBespoke ? '✂️ BESPOKE' : '⚡ READY TO SHIP'}
          </div>
          <div style="font-size:12px;font-weight:700;color:#F0EDE6;margin-bottom:4px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
          <div style="font-size:11px;color:#6B6560;margin-bottom:8px;">Size: ${item.size} · Qty: ${item.qty || 1}</div>
          <div style="display:flex;align-items:center;gap:10px;">
            <button onclick="updateQty(${item.id || "'"+index+"'"}, '${item.size}', ${(item.qty||1)-1})" style="width:26px;height:26px;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:#1A1A1A;color:#F0EDE6;cursor:pointer;font-size:14px;font-family:inherit;">−</button>
            <span style="font-size:13px;font-weight:700;color:#F0EDE6;">${item.qty || 1}</span>
            <button onclick="updateQty(${item.id || "'"+index+"'"}, '${item.size}', ${(item.qty||1)+1})" style="width:26px;height:26px;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:#1A1A1A;color:#F0EDE6;cursor:pointer;font-size:14px;font-family:inherit;">+</button>
            <span onclick="removeFromCartIndex(${index})" style="font-size:10px;color:#6B6560;cursor:pointer;margin-left:4px;font-weight:700;text-transform:uppercase;letter-spacing:1px;" onmouseenter="this.style.color='#EF4444'" onmouseleave="this.style.color='#6B6560'">Remove</span>
          </div>
        </div>
        <div style="font-size:14px;font-weight:800;color:#C9A84C;font-family:'Cinzel',serif;white-space:nowrap;">₹${lineTotal.toLocaleString('en-IN')}</div>
      </div>`;
  }).join('');

  const freeShipAt = 2999;
  const shipping = subtotal >= freeShipAt ? 0 : 199;
  const total = subtotal + shipping;
  const progress = Math.min(100, Math.round((subtotal / freeShipAt) * 100));

  drawerSummary.innerHTML = `
    <div style="margin-bottom:16px;">
      <div style="font-size:10px;font-weight:700;color:${subtotal >= freeShipAt ? '#10B981' : '#8A8580'};letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">
        ${subtotal >= freeShipAt ? '🎉 FREE SHIPPING UNLOCKED!' : `Add ₹${(freeShipAt - subtotal).toLocaleString('en-IN')} more for free shipping`}
      </div>
      <div style="background:#1C1C1C;border-radius:4px;height:3px;overflow:hidden;">
        <div style="width:${progress}%;height:100%;background:linear-gradient(to right,#C9A84C,#10B981);border-radius:4px;transition:width 0.5s ease;"></div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:12px;color:#8A8580;margin-bottom:8px;"><span>Subtotal</span><span style="color:#F0EDE6;">₹${subtotal.toLocaleString('en-IN')}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px;color:#8A8580;margin-bottom:14px;"><span>Shipping</span><span style="color:${shipping === 0 ? '#10B981' : '#F0EDE6'};">${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;margin-bottom:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">
      <span style="font-family:'Cinzel',serif;color:#F0EDE6;">TOTAL</span>
      <span style="color:#C9A84C;font-family:'Cinzel',serif;">₹${total.toLocaleString('en-IN')}</span>
    </div>
    <a href="cart.html" style="
      display:block;width:100%;background:#C9A84C;color:#0A0A0A;
      border:none;padding:16px;border-radius:14px;
      font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
      text-align:center;font-family:inherit;transition:all 0.2s ease;
    " onmouseenter="this.style.background='#E8C96A'" onmouseleave="this.style.background='#C9A84C'">
      CHECKOUT →
    </a>
  `;
}

/* ── Auto-init on page load ── */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderDrawerCart();
  });
}
