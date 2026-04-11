# Lumina - Premium Restaurant Management System

A comprehensive full-stack application designed for fine-dining restaurants to manage their daily operations, including menu display, order processing, table reservations, and back-office inventory capabilities.

## 🌟 Project Overview

Lumina offers both a **Premium Customer-facing UI** and a **Robust Backend API**. 
The system features an elegant glassmorphism frontend built with Vanilla JavaScript and CSS, linked to a powerful Express.js and SQLite backend that automatically synchronizes inventory with orders and prevents double-booking of tables.

### 🍴 Key Features

#### Customer Frontend
- **Interactive Menu:** Browse available food, drinks, and desserts smoothly.
- **Cart & Order Placement:** Add items to cart and place orders instantly.
- **Table Booking:** Check real-time table availability based on date, time, and party size, and book a table immediately.
- **Modern UI:** Premium dark-themed, responsive design with glassmorphism effects, loading animations, and toast notifications.

#### Admin & Backend Operations
- **Inventory Management:** Real-time stock auto-deduction upon order placement.
- **Admin Security:** Protected endpoints requiring an admin key (`x-admin-key`) to update stock or view reports.
- **Financial & Stock Reports:** Generate daily sales summaries and check for low stock alerts programmatically.
- **Database:** Local SQLite database seamlessly managed via Sequelize ORM.

## 🛠️ Technology Stack

- **Frontend:** HTML5, Modern CSS (Glassmorphism UI), Vanilla JavaScript, FontAwesome Icons.
- **Backend:** Node.js, Express.js, CORS.
- **Database:** SQLite3 managed using Sequelize ORM.

## 🚀 Setup & Installation

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
   *(Ensure you review your .env file to set up your `ADMIN_KEY` for unlocking admin endpoints).*

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

## 🔌 Core API Endpoints

### Public Endpoints
- `GET /health` - Check API operational status.
- `GET /api/menu` - Fetch all available menu items.
- `GET /api/tables` - Fetch all tables in the restaurant layout.
- `GET /api/tables/availability?datetime=...&partySize=N` - Verify available tables for a slot.
- `POST /api/reservations` - Secure a table reservation.
- `GET /api/reservations` - Fetch existing reservations.
- `POST /api/orders` - Submit a new order.
- `GET /api/orders/:id` - Fetch details for a specific order.

### Admin Protected Endpoints
*(Requires passing the designated `x-admin-key` in the request header)*
- `GET /api/inventory` - Review all current inventory records.
- `PATCH /api/inventory/:id` - Modify the stock level of a specific item.
- `GET /api/reports/daily-sales?date=YYYY-MM-DD` - Generate a daily sales report.
- `GET /api/reports/stock-alerts?threshold=10` - Get alerts for items running low on stock.

---
**CodeAlpha Backend Development Tasks** - Built to demonstrate practical real-world backend applications.
