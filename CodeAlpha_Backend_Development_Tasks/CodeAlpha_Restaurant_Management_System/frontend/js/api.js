// ═══════════════════════════════════════
// API CLIENT
// ═══════════════════════════════════════

const API_BASE = '/api';

const Api = {
  // Get admin key from localStorage
  getAdminKey() {
    return localStorage.getItem('adminKey') || '';
  },

  setAdminKey(key) {
    localStorage.setItem('adminKey', key);
  },

  clearAdminKey() {
    localStorage.removeItem('adminKey');
  },

  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {},
      ...options,
    };

    // Add admin key if available
    const adminKey = this.getAdminKey();
    if (adminKey) {
      config.headers['x-admin-key'] = adminKey;
    }

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (!(config.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 204) return null;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // ── Menu ──
  async getMenu(category = '', search = '') {
    let query = '';
    const params = [];
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length) query = '?' + params.join('&');
    return this.request(`/menu${query}`);
  },

  async getCategories() {
    return this.request('/menu/categories');
  },

  async getMenuItem(id) {
    return this.request(`/menu/${id}`);
  },

  async createMenuItem(formData) {
    return this.request('/menu', {
      method: 'POST',
      body: formData,
    });
  },

  async updateMenuItem(id, formData) {
    return this.request(`/menu/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  async deleteMenuItem(id) {
    return this.request(`/menu/${id}`, {
      method: 'DELETE',
    });
  },

  // ── Orders ──
  async placeOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getOrders() {
    return this.request('/orders');
  },

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // ── Reservations ──
  async createReservation(data) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getReservations() {
    return this.request('/reservations');
  },

  // ── Tables ──
  async getTables() {
    return this.request('/tables');
  },

  async checkAvailability(datetime, partySize) {
    return this.request(`/tables/availability?datetime=${encodeURIComponent(datetime)}&partySize=${partySize}`);
  },

  // ── Ratings ──
  async submitRating(menuItemId, data) {
    return this.request(`/ratings/${menuItemId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getRatings(menuItemId) {
    return this.request(`/ratings/${menuItemId}`);
  },

  // ── Reports ──
  async getDailySales(date) {
    return this.request(`/reports/daily-sales?date=${date || new Date().toISOString().slice(0, 10)}`);
  },

  async getStockAlerts() {
    return this.request('/reports/stock-alerts');
  },

  // ── Inventory ──
  async getInventory() {
    return this.request('/inventory');
  },

  async updateInventory(id, data) {
    return this.request(`/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
