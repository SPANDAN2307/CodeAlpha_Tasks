// ═══════════════════════════════════════
// RESERVATION VIEW
// ═══════════════════════════════════════

const ReservationView = {
  tables: [],
  selectedTable: null,

  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="reservation-view">
        <h2><i class="fa-solid fa-calendar-check" style="color: var(--primary); margin-right: 8px;"></i>Table Reservations</h2>
        
        <div class="reservation-form-card">
          <h3><i class="fa-solid fa-plus-circle"></i> Book a Table</h3>
          <div class="form-group">
            <label for="res-name">Your Name *</label>
            <input type="text" id="res-name" class="form-input" placeholder="Enter your full name">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="res-phone">Phone Number</label>
              <input type="tel" id="res-phone" class="form-input" placeholder="+91 XXXXX XXXXX">
            </div>
            <div class="form-group">
              <label for="res-party">Party Size *</label>
              <select id="res-party" class="form-select">
                ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}">${n} ${n === 1 ? 'Guest' : 'Guests'}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="res-date">Date & Time *</label>
              <input type="datetime-local" id="res-date" class="form-input">
            </div>
            <div class="form-group">
              <label for="res-duration">Duration (minutes)</label>
              <select id="res-duration" class="form-select">
                <option value="60">60 min</option>
                <option value="90" selected>90 min</option>
                <option value="120">120 min</option>
              </select>
            </div>
          </div>
          
          <label style="font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px;">Select a Table (Optional)</label>
          <div class="table-cards" id="table-cards-container">
            <p style="color: var(--text-tertiary); font-size: 13px;">Loading tables...</p>
          </div>
          
          <button class="checkout-btn" onclick="ReservationView.makeReservation()">
            <i class="fa-solid fa-calendar-check"></i>&nbsp; Reserve Table
          </button>
        </div>

        <div class="reservation-list" id="reservation-list">
          <h3><i class="fa-solid fa-clock-rotate-left" style="color: var(--text-tertiary); margin-right: 8px;"></i>Recent Reservations</h3>
          <div id="reservations-container">
            <div class="page-loader" style="height: 200px;">
              <div class="loader-spinner"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Set default datetime to now + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const dtInput = document.getElementById('res-date');
    if (dtInput) {
      dtInput.value = now.toISOString().slice(0, 16);
    }

    this.loadTables();
    this.loadReservations();
  },

  async loadTables() {
    try {
      this.tables = await Api.getTables();
      const container = document.getElementById('table-cards-container');
      if (!container) return;

      container.innerHTML = this.tables.map(t => `
        <div class="table-card ${this.selectedTable === t.id ? 'selected' : ''}" 
             onclick="ReservationView.selectTable(${t.id})">
          <div class="table-number">${t.tableNumber}</div>
          <div class="table-capacity"><i class="fa-solid fa-chair" style="margin-right: 4px;"></i>${t.capacity} seats</div>
        </div>
      `).join('');
    } catch (e) {
      console.error('Failed to load tables:', e);
    }
  },

  async loadReservations() {
    try {
      const reservations = await Api.getReservations();
      const container = document.getElementById('reservations-container');
      if (!container) return;

      if (reservations.length === 0) {
        container.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 24px;">No reservations yet</p>';
        return;
      }

      container.innerHTML = reservations.map(r => `
        <div class="reservation-card">
          <div class="reservation-info">
            <h4>${r.customerName}</h4>
            <div class="reservation-details">
              <i class="fa-regular fa-calendar"></i> ${Utils.formatDate(r.reservationTime)}
              &nbsp;·&nbsp;
              <i class="fa-solid fa-users"></i> ${r.partySize} guests
              &nbsp;·&nbsp;
              Table ${r.DiningTable ? r.DiningTable.tableNumber : 'N/A'}
            </div>
          </div>
          <span class="reservation-status">${r.status}</span>
        </div>
      `).join('');
    } catch (e) {
      console.error('Failed to load reservations:', e);
    }
  },

  selectTable(tableId) {
    this.selectedTable = this.selectedTable === tableId ? null : tableId;
    this.loadTables();
  },

  async makeReservation() {
    const name = document.getElementById('res-name')?.value?.trim();
    const phone = document.getElementById('res-phone')?.value?.trim();
    const partySize = Number(document.getElementById('res-party')?.value);
    const datetime = document.getElementById('res-date')?.value;
    const duration = Number(document.getElementById('res-duration')?.value);

    if (!name) {
      Utils.showToast('Please enter your name', 'error');
      return;
    }
    if (!datetime) {
      Utils.showToast('Please select date and time', 'error');
      return;
    }

    try {
      const data = {
        customerName: name,
        customerPhone: phone,
        partySize,
        reservationTime: new Date(datetime).toISOString(),
        durationMinutes: duration,
      };

      if (this.selectedTable) {
        data.tableId = this.selectedTable;
      }

      await Api.createReservation(data);
      Utils.showToast('Table reserved successfully! 🎉', 'success', 5000);
      this.selectedTable = null;
      this.render();
    } catch (error) {
      Utils.showToast(error.message || 'Failed to reserve table', 'error');
    }
  },
};
