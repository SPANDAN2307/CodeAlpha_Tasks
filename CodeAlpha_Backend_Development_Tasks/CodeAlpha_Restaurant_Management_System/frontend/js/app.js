// ═══════════════════════════════════════
// APP — SPA Router & Controller
// ═══════════════════════════════════════

const App = {
  currentView: 'menu',

  init() {
    // Initialize cart badge
    Cart.updateBadge();

    // Navigation click handlers
    this.setupNavigation();

    // Search bar
    this.setupSearch();

    // Modal close
    this.setupModal();

    // Header scroll effect
    this.setupScrollEffect();

    // Mobile menu
    this.setupMobileMenu();

    // Load default view
    this.navigate('menu');
  },

  setupNavigation() {
    // Desktop nav links
    document.querySelectorAll('.nav-link[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        this.navigate(view);
      });
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        this.navigate(view);
        this.closeMobileMenu();
      });
    });

    // Logo click goes to menu
    document.getElementById('logo')?.addEventListener('click', () => {
      this.navigate('menu');
    });
  },

  setupSearch() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');

    if (input) {
      const debouncedSearch = Utils.debounce((query) => {
        if (this.currentView !== 'menu') {
          this.navigate('menu');
        }
        MenuView.searchMenu(query);
      }, 400);

      input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearBtn?.classList.toggle('hidden', !query);
        if (query) {
          debouncedSearch(query);
        } else {
          if (this.currentView === 'menu') {
            MenuView.renderMenu();
          }
        }
      });

      clearBtn?.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.add('hidden');
        if (this.currentView === 'menu') {
          MenuView.renderMenu();
        }
      });
    }
  },

  setupModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');

    closeBtn?.addEventListener('click', () => {
      overlay?.classList.add('hidden');
    });

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay?.classList.contains('hidden')) {
        overlay?.classList.add('hidden');
      }
    });
  },

  setupScrollEffect() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      header?.classList.toggle('scrolled', scroll > 10);
      lastScroll = scroll;
    });
  },

  setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    const closeBtn = document.getElementById('mobile-nav-close');

    btn?.addEventListener('click', () => {
      overlay?.classList.remove('hidden');
    });

    closeBtn?.addEventListener('click', () => {
      this.closeMobileMenu();
    });

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeMobileMenu();
      }
    });
  },

  closeMobileMenu() {
    document.getElementById('mobile-nav-overlay')?.classList.add('hidden');
  },

  navigate(view) {
    this.currentView = view;

    // Update active nav link
    document.querySelectorAll('.nav-link[data-view]').forEach(link => {
      link.classList.toggle('active', link.dataset.view === view);
    });
    document.querySelectorAll('.mobile-nav-link[data-view]').forEach(link => {
      link.classList.toggle('active', link.dataset.view === view);
    });

    // Clear search
    const searchInput = document.getElementById('search-input');
    if (searchInput && view !== 'menu') {
      searchInput.value = '';
      document.getElementById('search-clear')?.classList.add('hidden');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render view
    switch (view) {
      case 'menu':
        MenuView.render();
        break;
      case 'cart':
        CartView.render();
        break;
      case 'orders':
        OrderView.render();
        break;
      case 'reservations':
        ReservationView.render();
        break;
      case 'admin':
        AdminView.render();
        break;
      default:
        MenuView.render();
    }
  },
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
