const express = require("express");
const cors = require("cors");
const path = require("path");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const tableRoutes = require("./routes/tableRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ratings", ratingRoutes);

// SPA fallback — serve index.html for all non-API routes
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use((error, _req, res, _next) => {
  return res.status(500).json({
    message: "Unexpected server error.",
    details: error.message,
  });
});

module.exports = app;
