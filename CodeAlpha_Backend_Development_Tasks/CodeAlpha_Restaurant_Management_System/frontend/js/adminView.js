// ═══════════════════════════════════════
// ADMIN VIEW — Dashboard & Menu Management
// ═══════════════════════════════════════

const AdminView = {
  isAuthenticated: false,
  activeTab: 'menu',
  menuItems: [],
  editingItem: null,

  render() {
    const adminKey = Api.getAdminKey();
    if (!adminKey) {
      this.renderLogin();
    } else {
      this.isAuthenticated = true;
      this.renderDashboard();
    }
  },

  renderLogin() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="admin-login">
        <div class="admin-lock-icon">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h2>Admin Access</h2>
        <p>Enter the admin key to manage your restaurant</p>
        <div class="form-group">
          <input type="password" id="admin-key-input" class="form-input" placeholder="Enter admin API key" 
                 onkeydown="if(event.key==='Enter') AdminView.login()">
        </div>
        <button class="admin-login-btn" onclick="AdminView.login()">
          <i class="fa-solid fa-right-to-bracket"></i>&nbsp; Sign In
        </button>
      </div>
    `;
    document.getElementById('admin-key-input')?.focus();
  },

  login() {
    const key = document.getElementById('admin-key-input')?.value?.trim();
    if (!key) {
      Utils.showToast('Please enter the admin key', 'error');
      return;
    }
    Api.setAdminKey(key);
    this.isAuthenticated = true;
    this.renderDashboard();
    Utils.showToast('Welcome, Admin! 🔓', 'success');
  },

  logout() {
    Api.clearAdminKey();
    this.isAuthenticated = false;
    this.renderLogin();
    Utils.showToast('Logged out', 'info');
  },

  async renderDashboard() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="admin-view">
        <div class="admin-header">
          <h2><i class="fa-solid fa-shield-halved" style="color: var(--primary); margin-right: 8px;"></i>Admin Dashboard</h2>
          <div class="admin-actions">
            <button class="admin-btn primary" onclick="AdminView.openAddDishModal()">
              <i class="fa-solid fa-plus"></i> Add Dish
            </button>
            <button class="admin-btn outline" onclick="AdminView.logout()">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>

        <div class="admin-stats" id="admin-stats">
          <div class="admin-stat-card">
            <div class="admin-stat-icon orange"><i class="fa-solid fa-utensils"></i></div>
            <div class="admin-stat-text">
              <h4>Total Dishes</h4>
              <div class="stat-value" id="stat-dishes">—</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon green"><i class="fa-solid fa-receipt"></i></div>
            <div class="admin-stat-text">
              <h4>Today's Orders</h4>
              <div class="stat-value" id="stat-orders">—</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon blue"><i class="fa-solid fa-indian-rupee-sign"></i></div>
            <div class="admin-stat-text">
              <h4>Today's Revenue</h4>
              <div class="stat-value" id="stat-revenue">—</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon red"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div class="admin-stat-text">
              <h4>Low Stock</h4>
              <div class="stat-value" id="stat-lowstock">—</div>
            </div>
          </div>
        </div>

        <div class="admin-tabs">
          <button class="admin-tab ${this.activeTab === 'menu' ? 'active' : ''}" onclick="AdminView.switchTab('menu')">
            <i class="fa-solid fa-bowl-food"></i>&nbsp; Menu Items
          </button>
          <button class="admin-tab ${this.activeTab === 'orders' ? 'active' : ''}" onclick="AdminView.switchTab('orders')">
            <i class="fa-solid fa-receipt"></i>&nbsp; Orders
          </button>
          <button class="admin-tab ${this.activeTab === 'inventory' ? 'active' : ''}" onclick="AdminView.switchTab('inventory')">
            <i class="fa-solid fa-warehouse"></i>&nbsp; Inventory
          </button>
        </div>

        <div id="admin-tab-content"></div>
      </div>
    `;

    this.loadStats();
    this.switchTab(this.activeTab);
  },

  async loadStats() {
    try {
      const [menu, sales, lowStock] = await Promise.all([
        Api.getMenu(),
        Api.getDailySales().catch(() => ({ metrics: { totalOrders: 0, totalSales: 0 } })),
        Api.getStockAlerts().catch(() => []),
      ]);

      this.menuItems = menu;

      document.getElementById('stat-dishes').textContent = menu.length;
      document.getElementById('stat-orders').textContent = sales.metrics?.totalOrders || 0;
      document.getElementById('stat-revenue').textContent = Utils.formatPrice(sales.metrics?.totalSales || 0);
      document.getElementById('stat-lowstock').textContent = lowStock.length || 0;
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => {
      t.classList.toggle('active', t.textContent.toLowerCase().includes(tab));
    });

    if (tab === 'menu') this.renderMenuTab();
    else if (tab === 'orders') this.renderOrdersTab();
    else if (tab === 'inventory') this.renderInventoryTab();
  },

  async renderMenuTab() {
    const container = document.getElementById('admin-tab-content');
    if (!container) return;

    try {
      if (!this.menuItems.length) {
        this.menuItems = await Api.getMenu();
      }

      container.innerHTML = `
        <div class="admin-menu-list">
          ${this.menuItems.map(item => `
            <div class="admin-menu-item">
              <div class="admin-menu-item-img">
                ${item.imageUrl
                  ? `<img src="${item.imageUrl}" alt="${item.name}">`
                  : `<div class="placeholder-sm">${Utils.getCategoryEmoji(item.category)}</div>`
                }
              </div>
              <div class="admin-menu-item-info">
                <div class="admin-menu-item-name">
                  ${Utils.vegBadge(item.isVeg)}
                  ${item.name}
                </div>
                <div class="admin-menu-item-meta">
                  <span>${item.category}</span>
                  <span>${Utils.formatPrice(item.price)}</span>
                  <span>⭐ ${item.rating} (${item.ratingCount})</span>
                  <span>Stock: ${item.InventoryItem ? item.InventoryItem.quantityInStock : '?'}</span>
                </div>
              </div>
              <div class="admin-menu-item-actions">
                <button class="admin-action-btn edit" onclick="AdminView.openEditDishModal(${item.id})" title="Edit">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="admin-action-btn delete" onclick="AdminView.deleteDish(${item.id})" title="Delete">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (error) {
      container.innerHTML = `<p style="color: var(--accent-red); padding: 20px;">Error: ${error.message}</p>`;
      if (error.message.includes('Unauthorized')) {
        this.logout();
      }
    }
  },

  async renderOrdersTab() {
    const container = document.getElementById('admin-tab-content');
    if (!container) return;

    try {
      const orders = await Api.getOrders();

      if (orders.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-tertiary);">No orders found</p>';
        return;
      }

      container.innerHTML = `
        <div class="admin-menu-list">
          ${orders.map(order => `
            <div class="admin-order-item">
              <div class="admin-order-info">
                <div class="admin-order-id">
                  Order #${order.id}
                  ${order.customerName ? ` — ${order.customerName}` : ''}
                </div>
                <div class="admin-order-details">
                  ${(order.OrderItems || []).map(oi => `${oi.MenuItem?.name || '?'} ×${oi.quantity}`).join(', ')}
                  &nbsp;·&nbsp; ${Utils.formatPrice(order.totalAmount)}
                  &nbsp;·&nbsp; ${Utils.formatDate(order.createdAt)}
                </div>
              </div>
              <select class="form-select" style="width: auto; min-width: 140px;" 
                      onchange="AdminView.updateOrderStatus(${order.id}, this.value)">
                ${['pending', 'preparing', 'served', 'completed', 'cancelled'].map(s =>
                  `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
                ).join('')}
              </select>
            </div>
          `).join('')}
        </div>
      `;
    } catch (error) {
      container.innerHTML = `<p style="color: var(--accent-red); padding: 20px;">Error: ${error.message}</p>`;
    }
  },

  async renderInventoryTab() {
    const container = document.getElementById('admin-tab-content');
    if (!container) return;

    try {
      const inventory = await Api.getInventory();

      container.innerHTML = `
        <div class="admin-menu-list">
          ${inventory.map(item => {
            const isLow = item.quantityInStock <= item.reorderLevel;
            return `
              <div class="admin-menu-item" style="${isLow ? 'background: #FFF3E0;' : ''}">
                <div class="admin-menu-item-info">
                  <div class="admin-menu-item-name">
                    ${item.MenuItem ? item.MenuItem.name : `Inventory #${item.id}`}
                    ${isLow ? '<span style="color: var(--accent-red); font-size: 12px; font-weight: 600; margin-left: 8px;">⚠ LOW STOCK</span>' : ''}
                  </div>
                  <div class="admin-menu-item-meta">
                    <span>In Stock: <strong>${item.quantityInStock}</strong></span>
                    <span>Reorder Level: ${item.reorderLevel}</span>
                    <span>Unit: ${item.unit}</span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="number" class="form-input" style="width: 80px; padding: 8px;" 
                         value="${item.quantityInStock}" id="inv-qty-${item.id}" min="0">
                  <button class="admin-btn primary" style="padding: 8px 16px; font-size: 13px;" 
                          onclick="AdminView.updateStock(${item.id})">
                    Update
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } catch (error) {
      container.innerHTML = `<p style="color: var(--accent-red); padding: 20px;">Error: ${error.message}</p>`;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      await Api.updateOrderStatus(orderId, status);
      Utils.showToast(`Order #${orderId} → ${status}`, 'success');
    } catch (error) {
      Utils.showToast(error.message, 'error');
      this.renderOrdersTab();
    }
  },

  async updateStock(inventoryId) {
    const qty = Number(document.getElementById(`inv-qty-${inventoryId}`)?.value);
    try {
      await Api.updateInventory(inventoryId, { quantityInStock: qty });
      Utils.showToast('Stock updated!', 'success');
      this.loadStats();
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  },

  // ── Add / Edit Dish Modal ──
  openAddDishModal() {
    this.editingItem = null;
    this.renderDishForm();
  },

  async openEditDishModal(itemId) {
    try {
      const item = await Api.getMenuItem(itemId);
      this.editingItem = item;
      this.renderDishForm();
    } catch (error) {
      Utils.showToast('Failed to load dish details', 'error');
    }
  },

  renderDishForm() {
    const item = this.editingItem;
    const isEdit = !!item;

    const modal = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
      <div class="dish-form-modal">
        <h3>${isEdit ? 'Edit Dish' : 'Add New Dish'}</h3>
        <form id="dish-form" onsubmit="event.preventDefault(); AdminView.saveDish();">
          <div class="image-upload" onclick="document.getElementById('dish-image-input').click()">
            ${item?.imageUrl 
              ? `<img src="${item.imageUrl}" alt="Dish" id="dish-image-preview">`
              : `<i class="fa-solid fa-cloud-arrow-up"></i><span>Click to upload dish image</span>`
            }
            <input type="file" id="dish-image-input" accept="image/*" onchange="AdminView.previewImage(event)">
          </div>

          <div class="form-group">
            <label>Dish Name *</label>
            <input type="text" id="dish-name" class="form-input" placeholder="e.g. Butter Chicken" 
                   value="${item?.name || ''}" required>
          </div>

          <div class="form-group">
            <label>Description</label>
            <input type="text" id="dish-desc" class="form-input" placeholder="Short description of the dish" 
                   value="${item?.description || ''}">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price (₹) *</label>
              <input type="number" id="dish-price" class="form-input" placeholder="350" 
                     value="${item?.price || ''}" min="1" required>
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select id="dish-category" class="form-select">
                ${['Starters', 'Main Course', 'Biryani', 'Breads', 'Desserts', 'Beverages'].map(c =>
                  `<option value="${c}" ${item?.category === c ? 'selected' : ''}>${c}</option>`
                ).join('')}
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prep Time (min)</label>
              <input type="number" id="dish-preptime" class="form-input" placeholder="30" 
                     value="${item?.preparationTime || 30}" min="1">
            </div>
            <div class="form-group">
              <label>Initial Stock</label>
              <input type="number" id="dish-stock" class="form-input" placeholder="40" 
                     value="${isEdit ? '' : '40'}" min="0" ${isEdit ? 'disabled' : ''}>
            </div>
          </div>

          <div class="form-row" style="margin-bottom: 20px;">
            <div class="toggle-group">
              <label class="toggle-switch">
                <input type="checkbox" id="dish-veg" ${item?.isVeg !== false ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">Vegetarian</span>
            </div>
            ${isEdit ? `
              <div class="toggle-group">
                <label class="toggle-switch">
                  <input type="checkbox" id="dish-available" ${item?.isAvailable !== false ? 'checked' : ''}>
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">Available</span>
              </div>
            ` : ''}
          </div>

          <button type="submit" class="checkout-btn">
            <i class="fa-solid ${isEdit ? 'fa-save' : 'fa-plus'}"></i>&nbsp; 
            ${isEdit ? 'Save Changes' : 'Add Dish'}
          </button>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
  },

  previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const upload = document.querySelector('.image-upload');
      upload.innerHTML = `
        <img src="${e.target.result}" alt="Preview" id="dish-image-preview">
        <input type="file" id="dish-image-input" accept="image/*" onchange="AdminView.previewImage(event)">
      `;
    };
    reader.readAsDataURL(file);
  },

  async saveDish() {
    const isEdit = !!this.editingItem;
    const formData = new FormData();

    formData.append('name', document.getElementById('dish-name').value.trim());
    formData.append('description', document.getElementById('dish-desc').value.trim());
    formData.append('price', document.getElementById('dish-price').value);
    formData.append('category', document.getElementById('dish-category').value);
    formData.append('preparationTime', document.getElementById('dish-preptime').value);
    formData.append('isVeg', document.getElementById('dish-veg').checked);

    if (!isEdit) {
      formData.append('initialStock', document.getElementById('dish-stock').value || 40);
    } else {
      const availableEl = document.getElementById('dish-available');
      if (availableEl) formData.append('isAvailable', availableEl.checked);
    }

    const imageInput = document.getElementById('dish-image-input');
    if (imageInput?.files?.[0]) {
      formData.append('image', imageInput.files[0]);
    }

    try {
      if (isEdit) {
        await Api.updateMenuItem(this.editingItem.id, formData);
        Utils.showToast('Dish updated successfully! ✅', 'success');
      } else {
        await Api.createMenuItem(formData);
        Utils.showToast('New dish added! 🍽️', 'success');
      }

      document.getElementById('modal-overlay').classList.add('hidden');
      this.menuItems = [];
      this.loadStats();
      this.renderMenuTab();
    } catch (error) {
      Utils.showToast(error.message || 'Failed to save dish', 'error');
    }
  },

  async deleteDish(itemId) {
    const item = this.menuItems.find(i => i.id === itemId);
    if (!confirm(`Delete "${item?.name || 'this dish'}"? This action cannot be undone.`)) return;

    try {
      await Api.deleteMenuItem(itemId);
      Utils.showToast('Dish deleted', 'info');
      this.menuItems = this.menuItems.filter(i => i.id !== itemId);
      this.loadStats();
      this.renderMenuTab();
    } catch (error) {
      Utils.showToast(error.message || 'Failed to delete dish', 'error');
    }
  },
};
