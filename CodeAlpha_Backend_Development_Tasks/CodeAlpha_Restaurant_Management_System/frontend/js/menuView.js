// ═══════════════════════════════════════
// MENU VIEW — Swiggy-Style Food Grid
// ═══════════════════════════════════════

const MenuView = {
  menuItems: [],
  categories: [],
  activeCategory: '',
  vegFilter: 'all', // 'all', 'veg', 'nonveg'

  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-loader" id="menu-loader">
        <div class="loader-spinner"></div>
        <p>Loading delicious dishes...</p>
      </div>
    `;

    try {
      const [items, categories] = await Promise.all([
        Api.getMenu(),
        Api.getCategories(),
      ]);

      this.menuItems = items;
      this.categories = categories;
      this.activeCategory = '';
      this.renderMenu();
    } catch (error) {
      main.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <h3>Failed to load menu</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  },

  renderMenu() {
    const main = document.getElementById('main-content');

    // Filter items
    let filtered = [...this.menuItems];
    if (this.activeCategory) {
      filtered = filtered.filter(i => i.category === this.activeCategory);
    }
    if (this.vegFilter === 'veg') {
      filtered = filtered.filter(i => i.isVeg);
    } else if (this.vegFilter === 'nonveg') {
      filtered = filtered.filter(i => !i.isVeg);
    }

    // Count per category
    const categoryCounts = {};
    this.menuItems.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    // Hero
    const heroHtml = `
      <div class="hero-banner">
        <div class="hero-content">
          <div class="hero-badge"><i class="fa-solid fa-fire"></i> TRENDING NOW</div>
          <h2 class="hero-title">Discover Authentic Indian Flavours</h2>
          <p class="hero-subtitle">From royal biryanis to creamy curries — handcrafted with love and the finest spices</p>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value">${this.menuItems.length}+</div>
              <div class="hero-stat-label">Dishes</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">${this.categories.length}</div>
              <div class="hero-stat-label">Categories</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">4.7★</div>
              <div class="hero-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Categories
    const categoriesHtml = `
      <div class="categories-section">
        <div class="categories-header">
          <h3 class="categories-title">What's on your mind?</h3>
        </div>
        <div class="categories-scroll">
          <button class="category-pill ${!this.activeCategory ? 'active' : ''}" onclick="MenuView.filterCategory('')">
            <i class="fa-solid fa-border-all"></i>
            All
            <span class="category-count">${this.menuItems.length}</span>
          </button>
          ${this.categories.map(cat => `
            <button class="category-pill ${this.activeCategory === cat ? 'active' : ''}" onclick="MenuView.filterCategory('${cat}')">
              <i class="fa-solid ${Utils.getCategoryIcon(cat)}"></i>
              ${cat}
              <span class="category-count">${categoryCounts[cat] || 0}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Veg/Non-Veg filter
    const filterHtml = `
      <div class="filter-bar">
        <button class="filter-chip ${this.vegFilter === 'veg' ? 'active' : ''}" onclick="MenuView.filterVeg('veg')">
          <span class="veg-icon"></span> Pure Veg
        </button>
        <button class="filter-chip nonveg ${this.vegFilter === 'nonveg' ? 'active' : ''}" onclick="MenuView.filterVeg('nonveg')">
          <span class="nonveg-icon"></span> Non-Veg
        </button>
        <span class="results-count">${filtered.length} dishes found</span>
      </div>
    `;

    // Food cards
    let foodGridHtml = '';
    if (filtered.length === 0) {
      foodGridHtml = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-utensils"></i></div>
          <h3>No dishes found</h3>
          <p>Try changing the filters or search for something else</p>
        </div>
      `;
    } else {
      // Group by category
      const grouped = {};
      filtered.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });

      foodGridHtml = Object.entries(grouped).map(([category, items]) => `
        <div class="menu-section-title">
          <i class="fa-solid ${Utils.getCategoryIcon(category)}" style="color: var(--primary)"></i>
          ${category}
          <span style="font-weight: 400; font-size: 14px; color: var(--text-tertiary)">(${items.length})</span>
          <span class="section-line"></span>
        </div>
        <div class="menu-grid">
          ${items.map((item, idx) => this.renderFoodCard(item, idx)).join('')}
        </div>
      `).join('');
    }

    main.innerHTML = heroHtml + categoriesHtml + filterHtml + foodGridHtml;
  },

  renderFoodCard(item, idx) {
    const cartQty = Cart.getQty(item.id);
    const stock = item.InventoryItem ? item.InventoryItem.quantityInStock : 0;
    const isAvailable = item.isAvailable && stock > 0;

    const imageHtml = item.imageUrl
      ? `<img src="${item.imageUrl}" alt="${item.name}" loading="lazy">`
      : `<div class="placeholder-icon">${Utils.getCategoryEmoji(item.category)}</div>`;

    const cartBtnHtml = !isAvailable
      ? `<button class="add-to-cart-btn" disabled style="opacity:0.5;cursor:not-allowed;">Unavailable</button>`
      : cartQty > 0
        ? `<div class="cart-qty-controls">
            <button class="cart-qty-btn" onclick="event.stopPropagation(); MenuView.updateCart(${item.id}, -1)">−</button>
            <span class="cart-qty-value">${cartQty}</span>
            <button class="cart-qty-btn" onclick="event.stopPropagation(); MenuView.updateCart(${item.id}, 1)">+</button>
          </div>`
        : `<button class="add-to-cart-btn" onclick="event.stopPropagation(); MenuView.addToCart(${item.id})">
            <i class="fa-solid fa-plus"></i> ADD
          </button>`;

    return `
      <div class="food-card" style="animation-delay: ${idx * 0.05}s" onclick="MenuView.openRatingModal(${item.id})">
        <div class="food-card-image">
          ${imageHtml}
          <div class="food-card-badge">
            ${item.isVeg ? '<span class="veg-icon"></span>' : '<span class="nonveg-icon"></span>'}
          </div>
          ${item.rating > 0 ? `
            <div class="food-card-rating">
              <i class="fa-solid fa-star"></i> ${item.rating}
              <span style="font-weight:400; opacity:0.8">(${item.ratingCount})</span>
            </div>
          ` : ''}
          <div class="food-card-time">
            <i class="fa-regular fa-clock"></i> ${item.preparationTime} min
          </div>
        </div>
        <div class="food-card-body">
          <h3 class="food-card-name">${item.name}</h3>
          <p class="food-card-desc">${item.description || ''}</p>
          <div class="food-card-footer">
            <div class="food-card-price">${Utils.formatPrice(item.price)}</div>
            ${cartBtnHtml}
          </div>
        </div>
      </div>
    `;
  },

  filterCategory(category) {
    this.activeCategory = category;
    this.renderMenu();
  },

  filterVeg(type) {
    this.vegFilter = this.vegFilter === type ? 'all' : type;
    this.renderMenu();
  },

  addToCart(itemId) {
    const item = this.menuItems.find(i => i.id === itemId);
    if (item) {
      Cart.add(item);
      this.renderMenu();
    }
  },

  updateCart(itemId, delta) {
    Cart.updateQty(itemId, delta);
    this.renderMenu();
  },

  searchMenu(query) {
    if (!query) {
      this.renderMenu();
      return;
    }

    const q = query.toLowerCase();
    const filtered = this.menuItems.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.description && i.description.toLowerCase().includes(q)) ||
      (i.category && i.category.toLowerCase().includes(q))
    );

    const main = document.getElementById('main-content');
    if (filtered.length === 0) {
      main.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <h3>No results for "${query}"</h3>
          <p>Try searching for something else or browse our categories</p>
        </div>
      `;
    } else {
      main.innerHTML = `
        <div class="filter-bar">
          <span class="results-count">Found ${filtered.length} result${filtered.length > 1 ? 's' : ''} for "${query}"</span>
        </div>
        <div class="menu-grid">
          ${filtered.map((item, idx) => this.renderFoodCard(item, idx)).join('')}
        </div>
      `;
    }
  },

  async openRatingModal(itemId) {
    const item = this.menuItems.find(i => i.id === itemId);
    if (!item) return;

    let ratings = [];
    try {
      ratings = await Api.getRatings(itemId);
    } catch (e) {
      // ignore
    }

    const modal = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');

    const reviewsHtml = ratings.length > 0
      ? `<div class="reviews-list">
          <h4 style="margin-bottom: 10px;">Recent Reviews</h4>
          ${ratings.slice(0, 5).map(r => `
            <div class="review-item">
              <div class="review-header">
                <span class="review-name">${r.customerName}</span>
                <span class="review-stars">${Utils.renderStars(r.score)}</span>
              </div>
              ${r.review ? `<p class="review-text">${r.review}</p>` : ''}
            </div>
          `).join('')}
        </div>`
      : '';

    body.innerHTML = `
      <div class="rating-modal">
        <h3>Rate This Dish</h3>
        <p class="rating-dish-name">${item.name} — ${Utils.formatPrice(item.price)}</p>
        <div class="star-rating-input" id="star-input">
          ${[1,2,3,4,5].map(n => `
            <span class="star" data-score="${n}" onclick="MenuView.selectStar(${n})">
              <i class="fa-solid fa-star"></i>
            </span>
          `).join('')}
        </div>
        <div class="form-group">
          <input type="text" id="rating-name" class="form-input" placeholder="Your name (optional)">
        </div>
        <textarea id="rating-review" placeholder="Write your review (optional)..."></textarea>
        <button class="rating-submit-btn" onclick="MenuView.submitRating(${itemId})">
          <i class="fa-solid fa-paper-plane"></i>&nbsp; Submit Rating
        </button>
        ${reviewsHtml}
      </div>
    `;

    this.selectedScore = 0;
    modal.classList.remove('hidden');
  },

  selectedScore: 0,

  selectStar(score) {
    this.selectedScore = score;
    document.querySelectorAll('#star-input .star').forEach((el, idx) => {
      el.classList.toggle('active', idx < score);
    });
  },

  async submitRating(menuItemId) {
    if (!this.selectedScore) {
      Utils.showToast('Please select a star rating', 'error');
      return;
    }

    const name = document.getElementById('rating-name')?.value?.trim() || 'Anonymous';
    const review = document.getElementById('rating-review')?.value?.trim() || '';

    try {
      await Api.submitRating(menuItemId, {
        score: this.selectedScore,
        customerName: name,
        review,
      });

      Utils.showToast('Thank you for your rating! ⭐', 'success');
      document.getElementById('modal-overlay').classList.add('hidden');

      // Refresh menu to update rating
      const items = await Api.getMenu();
      this.menuItems = items;
      this.renderMenu();
    } catch (error) {
      Utils.showToast(error.message || 'Failed to submit rating', 'error');
    }
  },
};
