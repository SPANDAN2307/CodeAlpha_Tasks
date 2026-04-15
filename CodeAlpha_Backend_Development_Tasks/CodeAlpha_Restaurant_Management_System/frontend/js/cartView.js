// ═══════════════════════════════════════
// CART MANAGER
// ═══════════════════════════════════════

const Cart = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateBadge();
  },

  add(menuItem) {
    const existing = this.items.find(i => i.id === menuItem.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: menuItem.id,
        name: menuItem.name,
        price: Number(menuItem.price),
        isVeg: menuItem.isVeg,
        quantity: 1,
      });
    }
    this.save();
    Utils.showToast(`${menuItem.name} added to cart`, 'success');
  },

  remove(itemId) {
    this.items = this.items.filter(i => i.id !== itemId);
    this.save();
  },

  updateQty(itemId, delta) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.remove(itemId);
    } else {
      this.save();
    }
  },

  getQty(itemId) {
    const item = this.items.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  },

  getTotal() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  getItemCount() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  },

  clear() {
    this.items = [];
    this.save();
  },

  updateBadge() {
    const count = this.getItemCount();
    const badge = document.getElementById('cart-badge');
    const badgeMobile = document.getElementById('cart-badge-mobile');

    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
    if (badgeMobile) {
      badgeMobile.textContent = count;
      badgeMobile.classList.toggle('hidden', count === 0);
    }
  },
};

// ── Cart View Renderer ──
const CartView = {
  render() {
    const main = document.getElementById('main-content');

    if (Cart.items.length === 0) {
      main.innerHTML = `
        <div class="cart-view">
          <div class="cart-header">
            <h2><i class="fa-solid fa-cart-shopping" style="color: var(--primary); margin-right: 8px;"></i>Your Cart</h2>
          </div>
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any delicious dishes yet. Browse our menu and add your favourites!</p>
            <button class="checkout-btn" style="max-width: 250px; margin-top: 20px;" onclick="App.navigate('menu')">
              <i class="fa-solid fa-utensils"></i>&nbsp; Browse Menu
            </button>
          </div>
        </div>
      `;
      return;
    }

    const itemsHtml = Cart.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <div class="cart-item-name">
            ${Utils.vegBadge(item.isVeg)}
            ${item.name}
          </div>
          <div class="cart-item-price">${Utils.formatPrice(item.price)} × ${item.quantity}</div>
        </div>
        <div class="cart-qty-controls">
          <button class="cart-qty-btn" onclick="CartView.changeQty(${item.id}, -1)">−</button>
          <span class="cart-qty-value">${item.quantity}</span>
          <button class="cart-qty-btn" onclick="CartView.changeQty(${item.id}, 1)">+</button>
        </div>
        <div class="cart-item-total">${Utils.formatPrice(item.price * item.quantity)}</div>
        <button class="cart-item-remove" onclick="CartView.removeItem(${item.id})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    const subtotal = Cart.getTotal();
    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    main.innerHTML = `
      <div class="cart-view">
        <div class="cart-header">
          <h2><i class="fa-solid fa-cart-shopping" style="color: var(--primary); margin-right: 8px;"></i>Your Cart</h2>
          <button class="clear-cart-btn" onclick="CartView.clearAll()">
            <i class="fa-solid fa-trash-can"></i> Clear Cart
          </button>
        </div>

        <div class="cart-items">
          ${itemsHtml}
        </div>

        <div class="cart-summary">
          <h3>Bill Details</h3>
          <div class="cart-summary-row">
            <span>Item Total</span>
            <span>${Utils.formatPrice(subtotal)}</span>
          </div>
          <div class="cart-summary-row">
            <span>GST (5%)</span>
            <span>${Utils.formatPrice(gst)}</span>
          </div>
          <div class="cart-summary-row total">
            <span>To Pay</span>
            <span>${Utils.formatPrice(total)}</span>
          </div>
        </div>

        <div class="checkout-form">
          <h3><i class="fa-solid fa-clipboard-list" style="color: var(--primary); margin-right: 8px;"></i>Place Order</h3>
          <div class="form-group">
            <label for="customer-name">Your Name</label>
            <input type="text" id="customer-name" class="form-input" placeholder="Enter your name">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="order-type">Order Type</label>
              <select id="order-type" class="form-select">
                <option value="dine_in">Dine In</option>
                <option value="takeaway">Takeaway</option>
              </select>
            </div>
            <div class="form-group" id="table-select-group">
              <label for="table-select">Table</label>
              <select id="table-select" class="form-select">
                <option value="">Loading tables...</option>
              </select>
            </div>
          </div>
          <button class="checkout-btn" id="place-order-btn" onclick="CartView.placeOrder()">
            <i class="fa-solid fa-check"></i>&nbsp; Place Order — ${Utils.formatPrice(total)}
          </button>
        </div>
      </div>
    `;

    // Load tables
    this.loadTables();

    // Toggle table select based on order type
    document.getElementById('order-type').addEventListener('change', (e) => {
      document.getElementById('table-select-group').style.display =
        e.target.value === 'takeaway' ? 'none' : 'block';
    });
  },

  async loadTables() {
    try {
      const tables = await Api.getTables();
      const select = document.getElementById('table-select');
      if (!select) return;
      select.innerHTML = '<option value="">Auto-assign</option>' +
        tables.map(t => `<option value="${t.id}">${t.tableNumber} (${t.capacity} seats)</option>`).join('');
    } catch (e) {
      console.error('Failed to load tables:', e);
    }
  },

  changeQty(itemId, delta) {
    Cart.updateQty(itemId, delta);
    this.render();
  },

  removeItem(itemId) {
    Cart.remove(itemId);
    this.render();
    Utils.showToast('Item removed from cart', 'info');
  },

  clearAll() {
    Cart.clear();
    this.render();
    Utils.showToast('Cart cleared', 'info');
  },

  async placeOrder() {
    const customerName = document.getElementById('customer-name')?.value?.trim();
    const orderType = document.getElementById('order-type')?.value;
    const tableId = document.getElementById('table-select')?.value;

    if (!customerName) {
      Utils.showToast('Please enter your name', 'error');
      return;
    }

    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Placing Order...';

    try {
      const orderData = {
        customerName,
        type: orderType,
        tableId: orderType === 'dine_in' && tableId ? Number(tableId) : null,
        items: Cart.items.map(i => ({
          menuItemId: i.id,
          quantity: i.quantity,
        })),
      };

      const order = await Api.placeOrder(orderData);
      Cart.clear();
      Utils.showToast(`Order #${order.id} placed successfully! 🎉`, 'success', 5000);
      App.navigate('orders');
    } catch (error) {
      Utils.showToast(error.message || 'Failed to place order', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>&nbsp; Place Order';
    }
  },
};
