// ═══════════════════════════════════════
// ORDERS VIEW
// ═══════════════════════════════════════

const OrderView = {
  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="orders-view">
        <div class="orders-header">
          <h2><i class="fa-solid fa-receipt" style="color: var(--primary); margin-right: 8px;"></i>Your Orders</h2>
        </div>
        <div class="page-loader" id="orders-loader">
          <div class="loader-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    `;

    try {
      const orders = await Api.getOrders();
      const container = main.querySelector('.orders-view');

      if (orders.length === 0) {
        container.innerHTML += `
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fa-solid fa-receipt"></i></div>
            <h3>No orders yet</h3>
            <p>When you place an order, it will appear here</p>
            <button class="checkout-btn" style="max-width: 250px; margin-top: 20px;" onclick="App.navigate('menu')">
              <i class="fa-solid fa-utensils"></i>&nbsp; Browse Menu
            </button>
          </div>
        `;
        main.querySelector('#orders-loader')?.remove();
        return;
      }

      const ordersHtml = orders.map(order => {
        const itemsList = (order.OrderItems || []).map(oi => `
          <div class="order-item-row">
            <span>${oi.MenuItem ? oi.MenuItem.name : 'Unknown'} × ${oi.quantity}</span>
            <span>${Utils.formatPrice(oi.lineTotal)}</span>
          </div>
        `).join('');

        return `
          <div class="order-card">
            <div class="order-card-header">
              <div>
                <span class="order-id">Order #${order.id}</span>
                ${order.customerName ? `<span style="color: var(--text-tertiary); font-size: 13px; margin-left: 12px;">${order.customerName}</span>` : ''}
              </div>
              <span class="order-status ${order.status}">${order.status}</span>
            </div>
            <div class="order-items-list">
              ${itemsList}
            </div>
            <div class="order-card-footer">
              <span class="order-total">Total: ${Utils.formatPrice(order.totalAmount)}</span>
              <span class="order-date">${Utils.formatDate(order.createdAt)}</span>
            </div>
          </div>
        `;
      }).join('');

      main.querySelector('#orders-loader')?.remove();
      container.querySelector('.orders-header').insertAdjacentHTML('afterend', ordersHtml);

    } catch (error) {
      main.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <h3>Failed to load orders</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  },
};
