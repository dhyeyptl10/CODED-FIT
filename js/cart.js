/* ===== CODED FIT — Atelier Cart & Drawer System ===== */

const CART_KEY = "NOVA_CART";

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
function addToCart(productId, size = 'L', qty = 1) {
  const cart = getCart();
  let p = (typeof productId === 'object') ? productId : getProductById(productId);
  if (!p) return;

  const existing = cart.find(item => item.id === p.id && item.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: p.id,
      code: p.code || 'CP-ATELIER',
      name: p.name,
      price: p.price,
      mrp: p.mrp || p.price,
      images: p.images || [p.img],
      fabric: p.fabric || 'Atelier Fabric',
      color: p.colorway || p.color || 'Charcoal',
      badge: p.badge || 'MADE-TO-MEASURE',
      size: size || 'L',
      qty
    });
  }
  saveCart(cart);
  showToast(`${p.name} added to bag.`);
  setTimeout(openCartDrawer, 400);
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
  document.querySelectorAll('#header-cart-count, #nav-cart-count, .cart-count, #drawer-cart-count').forEach(el => {
    el.textContent = count;
  });
}

/* ── Toast (Centralized) ── */
function showToast(message) {
  let toast = document.getElementById('coded-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'coded-toast';
    toast.className = 'coded-toast';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ── Open / Close Drawer ── */
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer-panel') || document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-backdrop') || document.getElementById('cart-drawer-overlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('active', 'open');
  renderDrawerCart();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer-panel') || document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-backdrop') || document.getElementById('cart-drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('active', 'open');
}

/* ── Render Drawer Cart Items ── */
function renderDrawerCart() {
  const drawerItems = document.getElementById('cart-drawer-items') || document.getElementById('drawer-cart-items');
  const subtotalEl = document.getElementById('drawer-subtotal');
  if (!drawerItems) return;

  const cart = getCart();

  if (cart.length === 0) {
    drawerItems.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#777;font-family:var(--font-mono);font-size:11px;">
        <div style="font-size:24px;margin-bottom:12px;opacity:0.3;color:#fff;">[BAG]</div>
        BAG EMPTY // CALIBRATE FIT OR ADD SILHOUETTE
      </div>`;
    if (subtotalEl) subtotalEl.innerText = '₹0';
    return;
  }

  let subtotal = 0;
  drawerItems.innerHTML = cart.map((item, index) => {
    const p = getProductById(item.id) || item;
    const img = p.images ? p.images[0] : (p.img || '');
    const name = p.name || item.name;
    const price = p.price || item.price || 0;
    const lineTotal = price * (item.qty || 1);
    subtotal += lineTotal;

    return `
      <div style="display:flex;gap:14px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <img src="${img}" alt="${name}" style="width:64px;height:78px;object-fit:cover;border-radius:2px;background:#1a1c22;flex-shrink:0;">
        <div style="flex:1;min-width:0;">
          <div style="font-family:var(--font-mono);font-size:8.5px;font-weight:800;letter-spacing:1px;color:var(--crimson);text-transform:uppercase;">
            ${p.badge || 'MADE-TO-MEASURE'}
          </div>
          <div style="font-family:var(--font-heading);font-size:12px;font-weight:800;color:#fff;margin:3px 0;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${name}
          </div>
          <div style="font-family:var(--font-mono);font-size:10px;color:#777;margin-bottom:8px;">
            Size: ${item.size || 'L'} · Qty: ${item.qty || 1}
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <button onclick="updateQty(${item.id}, '${item.size}', ${(item.qty||1)-1})" style="width:24px;height:24px;border:1px solid rgba(255,255,255,0.15);background:#18191d;color:#fff;cursor:pointer;">−</button>
            <span style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:#fff;">${item.qty || 1}</span>
            <button onclick="updateQty(${item.id}, '${item.size}', ${(item.qty||1)+1})" style="width:24px;height:24px;border:1px solid rgba(255,255,255,0.15);background:#18191d;color:#fff;cursor:pointer;">+</button>
            <span onclick="removeFromCartIndex(${index})" style="font-family:var(--font-mono);font-size:9.5px;color:#777;cursor:pointer;margin-left:6px;text-decoration:underline;">Remove</span>
          </div>
        </div>
        <div style="font-family:var(--font-mono);font-size:13px;font-weight:800;color:#fff;white-space:nowrap;">
          ₹${lineTotal.toLocaleString('en-IN')}
        </div>
      </div>`;
  }).join('');

  if (subtotalEl) subtotalEl.innerText = `₹${subtotal.toLocaleString('en-IN')}`;
}

const updateCartDrawerUI = renderDrawerCart;

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  renderDrawerCart();
}

/* Global CART API wrapper */
window.CART = {
  addItem: function(product, size = 'L', qty = 1) {
    addToCart(product, size, qty);
  },
  getItems: getCart,
  remove: removeFromCart,
  clear: clearCart
};

/* ── Auto-init on page load ── */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderDrawerCart();
  });
}
