# Restaurant Management System Backend

Express.js backend for managing menu, tables, reservations, orders, and inventory.

## Features

- Menu APIs for listing food/drink items.
- Order placement with inventory auto-deduction.
- Table availability checks for date-time windows.
- Reservation APIs with capacity-aware table allocation.
- Inventory update APIs (admin-protected).
- Optional reporting endpoints:
  - Daily sales
  - Stock alerts

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SPANDAN2307/CodeAlpha_Tasks.git
   cd CodeAlpha_Tasks/CodeAlpha_Backend_Development_Tasks/CodeAlpha_Restaurant_Management_System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   copy .env.example .env
   ```

4. **Run the application:**
   You can easily start both the Frontend UI and Backend API server together using the provided batch file (Windows):
   ```cmd
   run.bat
   ```
   
   Alternatively, to start just the backend server manually:
   ```bash
   npm run dev
   ```

The Backend server runs on `http://localhost:4000` by default. The Frontend UI (if started via `run.bat`) runs on `http://localhost:3000`.

## API Overview

- `GET /health`
- `GET /api/menu`
- `GET /api/tables`
- `GET /api/tables/availability?datetime=...&partySize=...`
- `POST /api/reservations`
- `GET /api/reservations`
- `POST /api/orders`
- `GET /api/orders/:id`
- `GET /api/inventory`
- `PATCH /api/inventory/:id` (requires `x-admin-key`)
- `GET /api/reports/daily-sales?date=YYYY-MM-DD` (requires `x-admin-key`)
- `GET /api/reports/stock-alerts?threshold=10` (requires `x-admin-key`)
