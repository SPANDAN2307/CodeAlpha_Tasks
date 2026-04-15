// ═══════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════

const Utils = {
  // Format price in INR
  formatPrice(price) {
    return `₹${Number(price).toFixed(0)}`;
  },

  // Format date
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Show toast notification
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: 'fa-circle-check',
      error: 'fa-circle-exclamation',
      info: 'fa-circle-info',
    };

    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info}"></i>
      <span>${message}</span>
      <span class="toast-close"><i class="fa-solid fa-xmark"></i></span>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      removeToast(toast);
    });

    setTimeout(() => removeToast(toast), duration);

    function removeToast(el) {
      el.style.animation = 'toastSlideOut 0.3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }
  },

  // Star rating HTML
  renderStars(rating, size = '12px') {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.3;
    let html = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        html += `<i class="fa-solid fa-star" style="color: var(--accent-gold); font-size: ${size}"></i>`;
      } else if (i === full && hasHalf) {
        html += `<i class="fa-solid fa-star-half-stroke" style="color: var(--accent-gold); font-size: ${size}"></i>`;
      } else {
        html += `<i class="fa-regular fa-star" style="color: var(--border-medium); font-size: ${size}"></i>`;
      }
    }
    return html;
  },

  // Veg/Non-Veg badge
  vegBadge(isVeg) {
    return isVeg
      ? '<span class="veg-badge-inline"></span>'
      : '<span class="nonveg-badge-inline"></span>';
  },

  // Debounce
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // Category icons
  getCategoryIcon(category) {
    const icons = {
      'Starters': 'fa-pepper-hot',
      'Main Course': 'fa-bowl-food',
      'Biryani': 'fa-plate-wheat',
      'Breads': 'fa-bread-slice',
      'Desserts': 'fa-ice-cream',
      'Beverages': 'fa-mug-hot',
    };
    return icons[category] || 'fa-utensils';
  },

  // Food emoji fallback for no-image cards
  getCategoryEmoji(category) {
    const emojis = {
      'Starters': '🍢',
      'Main Course': '🍛',
      'Biryani': '🍚',
      'Breads': '🫓',
      'Desserts': '🍮',
      'Beverages': '🥤',
    };
    return emojis[category] || '🍽️';
  },
};
