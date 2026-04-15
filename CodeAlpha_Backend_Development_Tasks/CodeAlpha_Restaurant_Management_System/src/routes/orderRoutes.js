const express = require("express");
const { Order, OrderItem, MenuItem, DiningTable } = require("../models");
const { placeOrder } = require("../services/orderService");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// POST /api/orders — place new order
router.post("/", async (req, res) => {
  try {
    const order = await placeOrder(req.body);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// GET /api/orders — list all orders
router.get("/", async (_req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: DiningTable },
        { model: OrderItem, include: [MenuItem] },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id — get single order
router.get("/:id", async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      { model: DiningTable },
      { model: OrderItem, include: [MenuItem] },
    ],
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  return res.json(order);
});

// PATCH /api/orders/:id/status — update order status (admin)
router.patch("/:id/status", adminAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const { status } = req.body;
    const validStatuses = ["pending", "preparing", "served", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    await order.update({ status });
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
