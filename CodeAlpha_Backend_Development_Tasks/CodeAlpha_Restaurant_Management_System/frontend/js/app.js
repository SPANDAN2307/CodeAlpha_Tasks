import * as api from './api.js';

const app = {
    state: {
        currentView: 'menu',
        cart: [],
        cartTotal: 0,
        menuData: []
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderView(this.state.currentView);
    },

    cacheDOM() {
        this.container = document.getElementById('app-container');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.cartCount = document.getElementById('cart-count');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalBody = document.getElementById('modal-body');
        this.toastContainer = document.getElementById('toast-container');
        
        document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    },

    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                
                this.navLinks.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                this.renderView(view);
            });
        });
    },

    async renderView(view) {
        this.state.currentView = view;
        this.container.innerHTML = `
            <div class="loader">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;

        try {
            switch(view) {
                case 'menu':
                    await this.renderMenu();
                    break;
                case 'reservations':
                    this.renderReservations();
                    break;
                case 'cart':
                    this.renderCart();
                    break;
                case 'admin':
                    await this.renderAdmin();
                    break;
            }
        } catch (err) {
            this.container.innerHTML = `
                <div class="glass-panel" style="text-align:center;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:3rem;color:var(--accent);margin-bottom:1rem;"></i>
                    <h2>Connection Error</h2>
                    <p>${err.message}</p>
                </div>
            `;
        }
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'}"></i>
            <span>${message}</span>
        `;
        
        this.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    },

    openModal(html) {
        this.modalBody.innerHTML = html;
        this.modalOverlay.classList.remove('hidden');
    },

    closeModal() {
        this.modalOverlay.classList.add('hidden');
    },

    addToCart(item) {
        const existing = this.state.cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.state.cart.push({ ...item, quantity: 1 });
        }
        this.updateCartCount();
        this.showToast(`Added ${item.name} to order`);
    },

    updateCartCount() {
        const count = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = count;
    },

    // --- Views --- //

    async renderMenu() {
        const data = await api.getMenu();
        this.state.menuData = data;
        
        let html = `
            <div class="view-header">
                <div>
                    <h2>Our Menu</h2>
                    <p>Discover our exquisite culinary offerings</p>
                </div>
            </div>
            <div class="menu-grid">
        `;

        data.forEach(item => {
            const isAvailable = item.InventoryItem && item.InventoryItem.quantity > 0;
            html += `
                <div class="menu-item glass-panel">
                    <div class="header" style="display:flex; justify-content:space-between;">
                        <h3>${item.name}</h3>
                        <span class="badge ${item.category}">${item.category}</span>
                    </div>
                    <div class="price">₹${Number(item.price).toFixed(2)}</div>
                    <p>${item.description || 'A delicious treat.'}</p>
                    <div class="footer">
                        ${isAvailable 
                            ? `<button class="btn btn-primary add-to-cart" data-id="${item.id}"><i class="fa-solid fa-plus"></i> Add</button>`
                            : `<span class="badge empty">Sold Out</span>`
                        }
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        this.container.innerHTML = html;

        // Bind add buttons
        this.container.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const itemData = this.state.menuData.find(i => i.id === id);
                if (itemData) this.addToCart(itemData);
            });
        });
    },

    renderReservations() {
        this.container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Reserve a Table</h2>
                    <p>Book your perfect dining experience</p>
                </div>
            </div>
            <div class="glass-panel" style="max-width:600px; margin:0 auto;">
                <form id="check-table-form">
                    <div class="form-group">
                        <label>Date & Time</label>
                        <input type="datetime-local" id="res-datetime" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Party Size</label>
                        <input type="number" id="res-partysize" min="1" max="20" value="2" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Check Availability</button>
                </form>
                <div id="availability-result" style="margin-top:2rem;"></div>
            </div>
        `;

        document.getElementById('check-table-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const datetime = document.getElementById('res-datetime').value;
            const size = document.getElementById('res-partysize').value;
            
            const resultDiv = document.getElementById('availability-result');
            resultDiv.innerHTML = `<div class="spinner"></div>`;
            
            try {
                const avail = await api.checkAvailability(new Date(datetime).toISOString(), size);
                if (avail.available) {
                    resultDiv.innerHTML = `
                        <div style="background:rgba(16,185,129,0.1); padding:1rem; border-radius:8px; border:1px solid var(--success); margin-bottom:1rem;">
                            <i class="fa-solid fa-check-circle" style="color:var(--success);"></i> Table available!
                        </div>
                        <form id="book-form">
                            <div class="form-group">
                                <label>Your Name</label>
                                <input type="text" id="res-name" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Contact Info</label>
                                <input type="text" id="res-contact" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Confirm Booking</button>
                        </form>
                    `;

                    document.getElementById('book-form').addEventListener('submit', async (e2) => {
                        e2.preventDefault();
                        const btn = e2.submitter;
                        btn.disabled = true;
                        btn.innerHTML = 'Booking...';

                        try {
                            await api.createReservation({
                                customerName: document.getElementById('res-name').value,
                                contactInfo: document.getElementById('res-contact').value,
                                partySize: parseInt(size),
                                reservationTime: new Date(datetime).toISOString()
                            });
                            this.showToast('Reservation confirmed!');
                            this.renderReservations();
                        } catch (err) {
                            this.showToast(err.message, 'error');
                            btn.disabled = false;
                            btn.innerHTML = 'Confirm Booking';
                        }
                    });

                } else {
                    resultDiv.innerHTML = `
                        <div style="background:rgba(244,63,94,0.1); padding:1rem; border-radius:8px; border:1px solid var(--accent);">
                            <i class="fa-solid fa-times-circle" style="color:var(--accent);"></i> Sorry, no tables match your party size at this time.
                        </div>
                    `;
                }
            } catch (err) {
                resultDiv.innerHTML = `<p style="color:var(--accent)">${err.message}</p>`;
            }
        });
    },

    renderCart() {
        if (this.state.cart.length === 0) {
            this.container.innerHTML = `
                <div class="glass-panel" style="text-align:center; padding:4rem;">
                    <i class="fa-solid fa-basket-shopping" style="font-size:4rem; color:var(--text-muted); margin-bottom:1rem;"></i>
                    <h2>Your Order is Empty</h2>
                    <p style="color:var(--text-muted); margin-bottom:2rem;">Add some delicious items from our menu.</p>
                    <button class="btn btn-primary" onclick="document.querySelector('[data-view=menu]').click()">Browse Menu</button>
                </div>
            `;
            return;
        }

        let total = 0;
        let html = `
            <div class="view-header">
                <h2>Your Order</h2>
            </div>
            <div class="glass-panel">
        `;

        this.state.cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            html += `
                <div class="cart-item">
                    <div>
                        <h4 style="margin-bottom:0.25rem;">${item.name}</h4>
                        <span style="color:var(--text-muted); font-size:0.9rem;">₹${Number(item.price).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn dec" data-idx="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn inc" data-idx="${index}">+</button>
                        <span style="width: 80px; text-align:right; font-weight:600;">₹${subtotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
        });

        html += `
                <div class="cart-total">
                    Total: <span style="color:var(--primary)">₹${total.toFixed(2)}</span>
                </div>
                <div style="margin-top:2rem; padding-top:2rem; border-top:1px solid var(--glass-border);">
                    <h3>Dine-in Details</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">Submit this order direct to the kitchen.</p>
                    <form id="submit-order-form">
                        <div class="form-group">
                            <label>Table ID (ask your server)</label>
                            <input type="number" id="order-table" class="form-control" required style="max-width:200px;">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit to Kitchen</button>
                    </form>
                </div>
            </div>
        `;

        this.container.innerHTML = html;

        // Bind quantites
        this.container.querySelectorAll('.dec').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.dataset.idx;
                if (this.state.cart[idx].quantity > 1) {
                    this.state.cart[idx].quantity--;
                } else {
                    this.state.cart.splice(idx, 1);
                }
                this.updateCartCount();
                this.renderCart();
            });
        });
        this.container.querySelectorAll('.inc').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.dataset.idx;
                this.state.cart[idx].quantity++;
                this.updateCartCount();
                this.renderCart();
            });
        });

        // Submit form
        document.getElementById('submit-order-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const tableId = document.getElementById('order-table').value;
            const btn = e.submitter;
            btn.disabled = true;
            btn.innerHTML = 'Sending...';

            const items = this.state.cart.map(i => ({
                menuItemId: i.id,
                quantity: i.quantity
            }));

            try {
                await api.createOrder({ tableId: parseInt(tableId), items });
                this.state.cart = [];
                this.updateCartCount();
                this.showToast('Order Sent Successfully!');
                this.renderCart();
            } catch (err) {
                this.showToast(err.message, 'error');
                btn.disabled = false;
                btn.innerHTML = 'Submit to Kitchen';
            }
        });
    },

    async renderAdmin() {
        if (!localStorage.getItem('lumina_admin_key')) {
            this.container.innerHTML = `
                <div class="glass-panel" style="max-width:400px; margin: 4rem auto;">
                    <h2 style="margin-bottom:1.5rem; text-align:center;">Admin Access</h2>
                    <form id="admin-login">
                        <div class="form-group">
                            <label>Secret Key</label>
                            <input type="password" id="admin-key" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Enter Dashboard</button>
                    </form>
                </div>
            `;
            
            document.getElementById('admin-login').addEventListener('submit', (e) => {
                e.preventDefault();
                api.setAdminKey(document.getElementById('admin-key').value);
                this.renderAdmin();
            });
            return;
        }

        try {
            // Test auth by fetching inventory
            // Test auth by fetching inventory and menu
            const inventory = await api.getInventory();
            const menus = await api.getMenu();
            
            // Build Dashboard
            this.container.innerHTML = `
                <div class="view-header">
                    <div>
                        <h2>Admin Dashboard</h2>
                        <p>Manage inventory operations and menu architecture</p>
                    </div>
                    <button id="admin-logout" class="btn btn-outline"><i class="fa-solid fa-power-off"></i> Logout</button>
                </div>
                
                <div class="glass-panel" style="margin-bottom: 2rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3>Menu Management</h3>
                        <button id="add-menu-btn" class="btn btn-primary btn-sm"><i class="fa-solid fa-plus"></i> Add Item</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${menus.map(menu => `
                                <tr>
                                    <td><strong>${menu.name}</strong><br><small style="color:var(--text-muted)">${menu.description}</small></td>
                                    <td><span class="badge ${menu.category}">${menu.category}</span></td>
                                    <td>₹${Number(menu.price).toFixed(2)}</td>
                                    <td>
                                        <button class="btn btn-outline btn-sm edit-menu" data-id="${menu.id}" style="padding:0.3rem 0.6rem; font-size:0.8rem; margin-right: 0.25rem;"><i class="fa-solid fa-pen"></i></button>
                                        <button class="btn btn-outline btn-sm delete-menu" data-id="${menu.id}" style="padding:0.3rem 0.6rem; font-size:0.8rem; border-color:var(--accent); color:var(--accent);"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="glass-panel">
                    <h3 style="margin-bottom:1rem;">Current Inventory Stack</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventory.map(inv => `
                                <tr>
                                    <td>#${inv.menuItemId}</td>
                                    <td>${inv.MenuItem ? inv.MenuItem.name : 'Unknown Item'}</td>
                                    <td><span class="badge ${inv.quantity < 10 ? 'empty' : 'food'}">${inv.quantity} units</span></td>
                                    <td>
                                        <button class="btn btn-outline btn-sm update-stock" data-id="${inv.id}" data-qty="${inv.quantity}" style="padding:0.3rem 0.6rem; font-size:0.8rem;">Update</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;

            document.getElementById('admin-logout').addEventListener('click', () => {
                api.clearAdminKey();
                this.renderAdmin();
            });

            // Bind Menu Actions
            document.getElementById('add-menu-btn').addEventListener('click', () => {
                this.openModal(`
                    <h3 style="margin-bottom:1rem;">Add New Menu Item</h3>
                    <form id="add-menu-form">
                        <div class="form-group"><label>Name</label><input type="text" id="m-name" class="form-control" required></div>
                        <div class="form-group"><label>Description</label><input type="text" id="m-desc" class="form-control" required></div>
                        <div style="display:flex; gap:1rem;">
                            <div class="form-group" style="flex:1;"><label>Price (₹)</label><input type="number" step="0.01" id="m-price" class="form-control" required></div>
                            <div class="form-group" style="flex:1;"><label>Category</label>
                                <select id="m-cat" class="form-control" required style="background:var(--glass-bg); color:var(--text); border:1px solid var(--glass-border); padding: 0.75rem; border-radius: 8px;">
                                    <option value="Main">Main</option>
                                    <option value="Side">Side</option>
                                    <option value="Beverage">Beverage</option>
                                    <option value="Dessert">Dessert</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group"><label>Initial Stock Count</label><input type="number" id="m-stock" class="form-control" value="0" required></div>
                        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Create Item</button>
                    </form>
                `);
                document.getElementById('add-menu-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    try {
                        await api.addMenuItem({
                            name: document.getElementById('m-name').value,
                            description: document.getElementById('m-desc').value,
                            price: parseFloat(document.getElementById('m-price').value),
                            category: document.getElementById('m-cat').value,
                            initialStock: parseInt(document.getElementById('m-stock').value)
                        });
                        this.closeModal();
                        this.showToast('Menu item added successfully');
                        this.renderAdmin();
                    } catch (err) { this.showToast(err.message, 'error'); }
                });
            });

            this.container.querySelectorAll('.edit-menu').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.dataset.id);
                    const item = menus.find(m => m.id === id);
                    if(!item) return;
                    this.openModal(`
                        <h3 style="margin-bottom:1rem;">Edit Menu Item</h3>
                        <form id="edit-menu-form">
                            <div class="form-group"><label>Name</label><input type="text" id="m-name" class="form-control" value="${item.name}" required></div>
                            <div class="form-group"><label>Description</label><input type="text" id="m-desc" class="form-control" value="${item.description}" required></div>
                            <div style="display:flex; gap:1rem;">
                                <div class="form-group" style="flex:1;"><label>Price (₹)</label><input type="number" step="0.01" id="m-price" class="form-control" value="${item.price}" required></div>
                                <div class="form-group" style="flex:1;"><label>Category</label>
                                    <select id="m-cat" class="form-control" required style="background:var(--glass-bg); color:var(--text); border:1px solid var(--glass-border); padding: 0.75rem; border-radius: 8px;">
                                        <option value="Main" ${item.category==='Main'?'selected':''}>Main</option>
                                        <option value="Side" ${item.category==='Side'?'selected':''}>Side</option>
                                        <option value="Beverage" ${item.category==='Beverage'?'selected':''}>Beverage</option>
                                        <option value="Dessert" ${item.category==='Dessert'?'selected':''}>Dessert</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Save Changes</button>
                        </form>
                    `);
                    document.getElementById('edit-menu-form').addEventListener('submit', async (e2) => {
                        e2.preventDefault();
                        try {
                            await api.updateMenuItem(id, {
                                name: document.getElementById('m-name').value,
                                description: document.getElementById('m-desc').value,
                                price: parseFloat(document.getElementById('m-price').value),
                                category: document.getElementById('m-cat').value
                            });
                            this.closeModal();
                            this.showToast('Menu item updated');
                            this.renderAdmin();
                        } catch (err) { this.showToast(err.message, 'error'); }
                    });
                });
            });

            this.container.querySelectorAll('.delete-menu').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    if(confirm("Are you sure? This will permanently delete the item and its inventory tracking.")) {
                        try {
                            await api.deleteMenuItem(id);
                            this.showToast('Menu item deleted');
                            this.renderAdmin();
                        } catch (err) { this.showToast(err.message, 'error'); }
                    }
                });
            });

            // Bind Inventory Actions
            this.container.querySelectorAll('.update-stock').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const oldQty = e.currentTarget.dataset.qty;
                    this.openModal(`
                        <h3 style="margin-bottom:1rem;">Update Stock Level</h3>
                        <form id="update-stock-form">
                            <div class="form-group">
                                <label>New Quantity</label>
                                <input type="number" id="new-qty" value="${oldQty}" min="0" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Save Changes</button>
                        </form>
                    `);

                    document.getElementById('update-stock-form').addEventListener('submit', async (e2) => {
                        e2.preventDefault();
                        const newQty = document.getElementById('new-qty').value;
                        try {
                            await api.updateInventory(id, parseInt(newQty));
                            this.closeModal();
                            this.showToast('Stock updated');
                            this.renderAdmin(); // refresh
                        } catch (err) {
                            this.showToast(err.message, 'error');
                        }
                    });
                });
            });

        } catch (err) {
            this.showToast("Admin Authentication Failed", "error");
            api.clearAdminKey();
            this.renderAdmin(); // Re-render login
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
