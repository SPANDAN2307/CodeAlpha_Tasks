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

## Setup

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `copy .env.example .env`
3. Start server:
   - `npm run dev`

Server runs on `http://localhost:4000` by default.

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
