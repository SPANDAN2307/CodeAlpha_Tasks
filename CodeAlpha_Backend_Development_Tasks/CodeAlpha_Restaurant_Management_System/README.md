# 🍽️ Spice Route — Restaurant Management System

A full-stack **Restaurant Management System** built with a **Swiggy-inspired** light-themed UI. Features a comprehensive admin panel, dish ratings, multi-category Indian cuisine menu, order processing, table reservations, and real-time inventory management.

> **CodeAlpha Backend Development — Task 3**

---

## ✨ Features

### 🛒 Customer Features
- **Browse Menu** — Beautiful food card grid with dish images, ratings, veg/non-veg indicators
- **Category Filtering** — 6 categories: Starters, Main Course, Biryani, Breads, Desserts, Beverages
- **Search** — Real-time search across all dishes
- **Veg/Non-Veg Filter** — Quick dietary filtering
- **Star Ratings** — Rate dishes 1-5 stars with written reviews
- **Cart System** — Add/remove items with quantity controls, persistent cart (localStorage)
- **Place Orders** — Dine-in or takeaway with table selection
- **Table Reservations** — Book tables with date/time and party size

### 🔐 Admin Panel
- **API Key Authentication** — Secure admin access
- **Dashboard Stats** — Total dishes, today's orders, revenue, low-stock alerts
- **Menu CRUD** — Add, edit, delete dishes with image upload
- **Order Management** — View and update order statuses
- **Inventory Tracking** — Monitor and update stock levels
- **Daily Sales Reports** — Revenue metrics and analytics

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript   |
| Backend    | Express.js 5.x                    |
| Database   | SQLite via Sequelize ORM          |
| Uploads    | Multer (dish image uploads)       |
| Fonts      | Google Fonts (Poppins + Inter)    |
| Icons      | Font Awesome 6.5                  |

---

## 📁 Project Architecture

```
CodeAlpha_Restaurant_Management_System/
├── frontend/                 # Client-Side SPA
│   ├── index.html            # Main HTML entry point
│   ├── css/
│   │   └── styles.css        # Complete Swiggy-inspired stylesheet
│   └── js/
│       ├── utils.js           # Utility functions & helpers
│       ├── api.js             # API client (fetch wrapper)
│       ├── cartView.js        # Cart manager & view
│       ├── menuView.js        # Menu grid & food cards
│       ├── orderView.js       # Order display
│       ├── reservationView.js # Table booking
│       ├── adminView.js       # Admin dashboard
│       └── app.js             # SPA router & controller
│
├── src/                      # Server-Side
│   ├── server.js             # Entry point
│   ├── app.js                # Express app setup
│   ├── seed.js               # Database seeder (21 dishes)
│   ├── config/
│   │   └── db.js             # Sequelize + SQLite config
│   ├── middleware/
│   │   └── adminAuth.js      # Admin API key middleware
│   ├── models/
│   │   ├── index.js          # Model registry & associations
│   │   ├── menuItem.js       # Menu item model
│   │   ├── order.js          # Order model
│   │   ├── orderItem.js      # Order line item model
│   │   ├── table.js          # Dining table model
│   │   ├── reservation.js    # Reservation model
│   │   ├── inventoryItem.js  # Inventory model
│   │   └── rating.js         # Rating/review model
│   ├── routes/
│   │   ├── menuRoutes.js     # Menu CRUD + image upload
│   │   ├── orderRoutes.js    # Order placement & status
│   │   ├── tableRoutes.js    # Table availability
│   │   ├── reservationRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── reportRoutes.js   # Daily sales & stock alerts
│   │   └── ratingRoutes.js   # Dish ratings API
│   └── services/
│       ├── orderService.js   # Order processing logic
│       └── tableService.js   # Table availability logic
│
├── public/uploads/           # Dish image uploads
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── run.bat                   # One-click setup script
└── README.md
```

---

## 🚀 Quick Start

### One-Click Setup (Windows)
```batch
run.bat
```

### Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Start the server (auto-seeds database)
npm run dev

# 3. Open in browser
# → http://localhost:4000
```

---

## 🔑 Environment Variables

| Variable       | Default             | Description              |
|----------------|---------------------|--------------------------|
| `PORT`         | `4000`              | Server port              |
| `DATABASE_PATH`| `./restaurant.sqlite`| SQLite database file    |
| `ADMIN_API_KEY`| `changeme`          | Admin panel access key   |

---

## 📡 API Endpoints

### Menu
| Method   | Endpoint              | Description                  | Auth    |
|----------|-----------------------|------------------------------|---------|
| `GET`    | `/api/menu`           | List all items (filter: `?category=`, `?search=`) | Public  |
| `GET`    | `/api/menu/categories`| List unique categories       | Public  |
| `GET`    | `/api/menu/:id`       | Get single item with ratings | Public  |
| `POST`   | `/api/menu`           | Create item (multipart/form-data) | Admin   |
| `PUT`    | `/api/menu/:id`       | Update item                  | Admin   |
| `DELETE` | `/api/menu/:id`       | Delete item                  | Admin   |

### Orders
| Method   | Endpoint                   | Description            | Auth    |
|----------|----------------------------|------------------------|---------|
| `POST`   | `/api/orders`              | Place an order         | Public  |
| `GET`    | `/api/orders`              | List all orders        | Public  |
| `GET`    | `/api/orders/:id`          | Get order details      | Public  |
| `PATCH`  | `/api/orders/:id/status`   | Update order status    | Admin   |

### Ratings
| Method   | Endpoint                   | Description            | Auth    |
|----------|----------------------------|------------------------|---------|
| `POST`   | `/api/ratings/:menuItemId` | Submit a rating (1-5)  | Public  |
| `GET`    | `/api/ratings/:menuItemId` | Get all ratings        | Public  |

### Tables & Reservations
| Method   | Endpoint                  | Description              | Auth    |
|----------|---------------------------|--------------------------|---------|
| `GET`    | `/api/tables`             | List all tables          | Public  |
| `GET`    | `/api/tables/availability`| Check table availability | Public  |
| `POST`   | `/api/reservations`       | Create reservation       | Public  |
| `GET`    | `/api/reservations`       | List all reservations    | Public  |

### Reports
| Method   | Endpoint                  | Description              | Auth    |
|----------|---------------------------|--------------------------|---------|
| `GET`    | `/api/reports/daily-sales` | Daily sales metrics     | Admin   |
| `GET`    | `/api/reports/stock-alerts`| Low stock items         | Admin   |

### Inventory
| Method   | Endpoint              | Description              | Auth    |
|----------|-----------------------|--------------------------|---------|
| `GET`    | `/api/inventory`      | List all inventory       | Public  |
| `PATCH`  | `/api/inventory/:id`  | Update stock             | Admin   |

---

## 🎨 Design System

- **Primary Color**: `#FC8019` (Swiggy Orange)
- **Background**: `#F5F5F5` (Light Gray)
- **Cards**: White with subtle shadows
- **Font Heading**: Poppins
- **Font Body**: Inter
- **Veg Badge**: Green square with dot
- **Non-Veg Badge**: Red square with triangle

---

## 👤 Author

**Spandan** — CodeAlpha Backend Development Intern

---

## 📄 License

ISC
